# <img src="Logo.png" alt="Project logo" style="height:30px; width:auto; vertical-align:middle; border-radius:2px; box-shadow:0 0 4px rgba(0,0,0,0.2);"> (Un)beatable Crazy Tic-Tac-Toe

![GitHub top language](https://img.shields.io/github/languages/top/fistaszek2009/un-beatable-crazy-tic-tac-toe?style=for-the-badge\&logo=python\&logoColor=white\&labelColor=%23336C9B\&color=%23F6BA08)
![Flask icon](https://img.shields.io/badge/-Flask-336D86?logo=flask\&logoColor=white\&style=for-the-badge)
![PyTorch icon](https://img.shields.io/badge/-PyTorch-EF5233?logo=pytorch\&logoColor=white\&style=for-the-badge)
![JavaScript icon](https://img.shields.io/badge/-JavaScript-EFD81D?logo=javascript\&logoColor=white\&style=for-the-badge)

[https://github.com/user-attachments/assets/ae1c4c46-ed88-4e57-953c-4764a97bfadc](https://github.com/user-attachments/assets/ae1c4c46-ed88-4e57-953c-4764a97bfadc)

---

Can a simple tic-tac-toe game become a *crazy coding adventure*? Absolutely. This project is a playful yet technical reinterpretation of the classic game. Instead of clicking symbols, you **draw your sign by hand**, which is then classified by a small convolutional neural network. Your opponent is an (un)beatable **minimax bot**.

One twist bends the rules: you are allowed to *lie with your hand*. Draw an **X** when it is **O**’s turn. Confuse the model. Confuse the bot. Logic trembles when perception lies.

---

## 1. Installation and setup

### Application

The application requires **Python** and **pip**.

#### Clone the repository

```console
git clone https://github.com/fistaszek2009/un-beatable-crazy-tic-tac-toe.git
cd un-beatable-crazy-tic-tac-toe
```

#### Create a virtual environment and install dependencies

Linux / macOS:

```console
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

(For Windows: `.venv\\Scripts\\activate`)

#### Run the app

```console
python -m app.app
```

When the server is running, open:
[http://localhost:8000](http://localhost:8000)

---

### Model training (optional)

The CNN model is already trained and included. Training is **not required** to play.

To train manually:

```console
python -m ai_training.train --data_dir ai_training/dataset --test_dir ai_training/testset --epochs 16 --batch_size 32
```

Or run the simplified version:

```console
python -m ai_training.train
```

> [!IMPORTANT]
> The datasets included in the repository are intentionally tiny and meant only as examples. Training on them will produce poor results. A larger, self-generated dataset is strongly recommended.
> In [ai_training/dataset_create.html](https://github.com/fistaszek2009/un-beatable-crazy-tic-tac-toe/blob/main/ai_training/dataset_create.html) directory you can find *very simple* (but helpful) tool for creating and downloading dataset samples.  

---

## 2. Project structure

```console
/un-beatable-crazy-tic-tac-toe
├── ai_training      # CNN training code, datasets, dataset generation tool
│   ├── dataset
│   │   ├── O
│   │   └── X
│   └── testset
│       ├── O
│       └── X
├── app              # Flask web app and game logic
│   ├── static
│   │   ├── fonts
│   │   ├── images
│   │   ├── scripts
│   │   └── styles
│   └── templates
└── model            # CNN model definition and trained weights
```

---

> [!NOTE]
> ## About game backgrounds
>
> The game board is displayed on digital artworks by **Polish masters of painting**.
> I wanted to promote Polish art. I believe these are wonderful works that add deeper meaning and beauty to the design of my game.
>
> Used artworks:
>
> * *Krajobraz zimowy z rzeką* — **Julian Fałat**
>  Source: Downloaded from the MUZA system, National Museum in Warsaw
>
> * *Rodzina artysty* — **Włodzimierz Tetmajer**
>  Source: Photography Studio, National Museum in Kraków
>
> * *Stare jabłonie* — **Ferdynand Ruszczyc**
>  Source: Downloaded from the MUZA system, National Museum in Warsaw
>
> * *Targ na konie w Bałcie* — **Józef Chełmoński**
>  Source: Downloaded from the MUZA system, National Museum in Warsaw
>
> * *Ziemia* — **Ferdynand Ruszczyc**
>  Source: Downloaded from the MUZA system, National Museum in Warsaw
>
> 

---
