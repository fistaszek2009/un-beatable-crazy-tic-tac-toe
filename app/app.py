from flask import Flask, render_template, request, jsonify, redirect, url_for
from app.tictactoe import TicTacToe
from model.cnn import XOClassifier
import torch
import torchvision.transforms as T
from PIL import Image, ImageOps
import random
import os
import io
import base64
from waitress import serve

app = Flask(__name__)
game = TicTacToe()
server_session_id = id(app)

model = XOClassifier()
model.load_state_dict(torch.load("model/weights.pth", map_location="cpu"))
model.eval()

class WhiteBackground:
    def __call__(self, img):
        img = img.convert("RGBA")
        white_bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        img = Image.alpha_composite(white_bg, img)
        img = img.convert("L")
        img = ImageOps.invert(img)
        fn = lambda x : 255 if x > 50 else 0
        img = img.point(fn, mode='1')
        img = img.convert("L")
        return img

transform = T.Compose([
    WhiteBackground(),
    T.Resize((64,64)),
    T.ToTensor(),
    T.Normalize((0.5,), (0.5,))
])

def random_mark(sign):
    folder = "ai_training/dataset/X" if sign == 1 else "ai_training/dataset/O"
    file = random.choice(os.listdir(folder))
    return Image.open(os.path.join(folder, file))

@app.route("/")
def main():
    win, indexes = game.checkWin(game.board)
    return render_template('index.html', board=game.board, title="(Un)beatable crazy tic-tac-toe", win = win, anyEmpty = any(cell == 0 for row in game.board for cell in row), indexes = ([] if indexes == -1 else indexes), session_id=server_session_id)

@app.route("/api/session-id")
def get_session_id():
    return jsonify({"session_id": server_session_id})

@app.route("/move-bot", methods=["POST"])
def move():
    if not game.gameRunning:
        return jsonify(error="Game finished"), 400

    (x,y), _ = game.minmax(game.currentSign == 1, 0, game.board)
    pos = x*3+y
    game.insert(pos)
    
    pil_img = random_mark(game.currentSign)
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode("ascii")
    data_url = f"data:image/png;base64,{img_b64}"

    win, indexes = game.checkWin(game.board)

    return jsonify({
        "board": game.board,
        "win": win,
        "indexes": indexes,
        "anyEmpty": any(cell == 0 for row in game.board for cell in row),
        "pos": pos,
        "image": data_url
    })

@app.route("/move-image", methods=["POST"])
def move_image():
    if not game.gameRunning:
        return jsonify(error="Game finished"), 400

    img_file = request.files["image"]
    pos = int(request.form["pos"])

    img = Image.open(img_file.stream)
    img = transform(img).unsqueeze(0)

    with torch.no_grad():
        out = model(img)
        pred = out.argmax(dim=1).item()

    sign = 1 if pred == 1 else -1  # X = 1, O = -1

    if game.board[pos//3][pos%3] != 0:
        return jsonify(error="Cell occupied"), 409

    game.currentSign = sign
    game.insert(pos)

    game.currentSign *= -1

    win, indexes = game.checkWin(game.board)
    return jsonify({
        "board": game.board,
        "win": win,
        "indexes": indexes,
        "anyEmpty": any(cell == 0 for row in game.board for cell in row)
    })

@app.route('/reset')
def reset():
    # game.print()
    game.reset()
    return render_template("reset.html",title="(Un)beatable crazy tic-tac-toe")

if __name__=="__main__":
    print("🎮 (Un)beatable crazy tic-tac-toe server starting...")
    print("📍 Server running at http://0.0.0.0:8000")
    serve(app,host="0.0.0.0", port=8000)
    # app.run(host="0.0.0.0",port=8000)