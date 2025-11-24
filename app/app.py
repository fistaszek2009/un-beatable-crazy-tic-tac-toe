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
    T.Resize((112,112)),
    T.ToTensor()
])

@app.route("/")
def main():
    return render_template('index.html', board=game.board, title="Main")

@app.route("/move", methods=["POST"])
def move():
    if game.gameRunning:
        data = request.get_json()
        is_player_turn = bool(data.get("player"))

        if is_player_turn and game.currentSign==1:
            #pobieranie dla obrazka i ustalnie signu
            pos = int(data.get("pos"))
            game.insert(pos)
        else:
            (x,y),_ = game.minmax(game.currentSign == 1,0,game.board)
            game.insert(x*3+y)

        win = game.checkWin(game.board)
        anyEmpty = any(cell == 0 for row in game.board for cell in row)

        if win == 0 and anyEmpty:
                game.currentSign = -game.currentSign
        else:
            game.gameRunning = False

        game.print()

    return jsonify({
        "board": game.board,
        "win": game.checkWin(game.board),
        "anyEmpty": any(cell == 0 for row in game.board for cell in row)
    }
)

@app.route("/predict", methods=["GET","POST"])
def predict():
    file = request.files["file"]
    img = Image.open(io.BytesIO(file.read()))
    img = transform(img).unsqueeze(0)

    with torch.no_grad():
        out = model(img)
        label = out.argmax(dim=1).item()

    #return jsonify({"prediction": "X" if label == 0 else "O"})
    render_template('index.html', board=game.board, title="prediction",pred=label)

@app.route('/reset')
def reset():
    game.print()
    game.reset()
    return redirect(url_for('main'))

# "/tutorial"

if __name__=="__main__":
    app.run(debug=True)
