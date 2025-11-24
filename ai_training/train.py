import argparse
import os
import torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from model.cnn import XOClassifier
from PIL import Image, ImageOps
from tqdm import tqdm

device = "cuda" if torch.cuda.is_available() else "cpu"


# --- AUTOCROP (musi być globalnie dla Windowsa) -----------------------------

def autocrop_white(img: Image.Image):
    if img.mode != "L":
        img = img.convert("L")
    inv = ImageOps.invert(img)
    bbox = inv.getbbox()
    if bbox:
        return img.crop(bbox)
    return img


def autocrop_white_transform(img):
    return autocrop_white(img)


# --- GLOBALNE TRANSFORMY ----------------------------------------------------

train_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((64, 64)),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

test_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((64, 64)),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

# transforms.RandomRotation(10),
# transforms.RandomPerspective(distortion_scale=0.1, p=0.3),



# --- EVALUATION --------------------------------------------------------------

def evaluate(model, loader):
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for imgs, labels in loader:
            imgs = imgs.to(device)
            labels = labels.to(device)
            out = model(imgs)
            preds = out.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
    return correct / total if total > 0 else 0


# --- MAIN TRAINING LOOP ------------------------------------------------------

def main(args):
    # datasety
    train_ds = datasets.ImageFolder(args.data_dir, transform=train_transform)

    train_loader = DataLoader(
        train_ds,
        batch_size=args.batch_size,
        shuffle=True,
        num_workers=0   # Windows-friendly
    )

    if args.test_dir and os.path.isdir(args.test_dir):
        test_ds = datasets.ImageFolder(args.test_dir, transform=test_transform)
        test_loader = DataLoader(
            test_ds,
            batch_size=args.batch_size,
            shuffle=False,
            num_workers=0
        )
    else:
        test_loader = None

    # model
    model = XOClassifier().to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr)
    loss_fn = torch.nn.CrossEntropyLoss()

    # --- TRENING ---
    for epoch in range(args.epochs):
        model.train()
        running = 0.0

        pbar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{args.epochs}")

        for imgs, labels in pbar:
            imgs = imgs.to(device)
            labels = labels.to(device)

            out = model(imgs)
            loss = loss_fn(out, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            running += loss.item()
            pbar.set_postfix(loss=running / (pbar.n + 1))

        # eval
        train_acc = evaluate(model, train_loader)
        test_acc = evaluate(model, test_loader) if test_loader else None

        msg = f"Epoch {epoch+1} | loss={running/len(train_loader):.4f} | train_acc={train_acc:.3f}"
        if test_acc is not None:
            msg += f" | test_acc={test_acc:.3f}"
        print(msg)

    # SAVE MODEL
    os.makedirs("model", exist_ok=True)
    torch.save(model.state_dict(), "model/weights.pth")
    print("Model zapisany: model/weights.pth")

    if test_loader:
        print("Final test accuracy:", evaluate(model, test_loader))


# --- ENTRYPOINT --------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", type=str, default="ai_training/dataset")
    parser.add_argument("--test_dir", type=str, default="ai_training/testset")
    parser.add_argument("--epochs", type=int, default=20)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=1e-3)
    args = parser.parse_args()
    main(args)
