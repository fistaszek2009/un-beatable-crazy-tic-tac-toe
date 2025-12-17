from flask import Flask, render_template, request, jsonify, redirect, url_for
from app.tictactoe import TicTacToe
from model.cnn import XOClassifier
import torch
import torchvision.transforms as T
from PIL import Image
import io

app = Flask(__name__)
game = TicTacToe()

model = XOClassifier()
model.load_state_dict(torch.load("model/weights.pth", map_location="cpu"))
model.eval()

transform = T.Compose([
    T.Grayscale(),
    T.Resize((64,64)),
    T.ToTensor()
])

@app.route("/")
def main():
    return render_template('index.html', board=game.board, title="Unbeatable crazy tic-tac-toe")

@app.route("/move-bot", methods=["POST"])
def move():
    if not game.gameRunning:
        return jsonify(error="Game finished"), 400

    (x,y), _ = game.minmax(game.currentSign == -1, 0, game.board)
    game.insert(x*3+y)

    return jsonify({
        "board": game.board,
        "win": game.checkWin(game.board),
        "anyEmpty": any(cell == 0 for row in game.board for cell in row)
    })

# import random
# from PIL import Image

# def random_mark(sign):
#     folder = "ai_marks/X" if sign == 1 else "ai_marks/O"
#     file = random.choice(os.listdir(folder))
#     return Image.open(os.path.join(folder, file))

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

    return jsonify({
        "board": game.board,
        "win": game.checkWin(game.board),
        "anyEmpty": any(cell == 0 for row in game.board for cell in row)
    })

@app.route('/reset')
def reset():
    game.print()
    game.reset()
    return render_template("reset.html",title="Unbeatable crazy tic-tac-toe")

if __name__=="__main__":
    app.run(debug=True)
    # TODO changing serving server

