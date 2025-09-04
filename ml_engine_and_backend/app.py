from fastapi import FastAPI, UploadFile, File
import tensorflow as tf
import numpy as np
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware

origins = ["http://localhost:3000"]



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model("mnist_model_hidden_layers.keras")

def preprocess_mnist(pil_img: Image.Image) -> np.ndarray:
    # 1) grayscale
    img = pil_img.convert("L")
    arr = np.array(img, dtype=np.float32) / 255.0

    # 2) auto-invert if background is white (MNIST is white digit on black)
    if arr.mean() > 0.5:
        arr = 1.0 - arr

    # 3) gentle binarize (keep the hole in “9”)
    arr = (arr > 0.2).astype(np.float32)

    # 4) crop tight to the digit
    coords = np.argwhere(arr > 0)
    if coords.size == 0:
        canvas = np.zeros((28, 28), dtype=np.float32)
        return canvas.reshape(1, 784)
    (y0, x0), (y1, x1) = coords.min(0), coords.max(0) + 1
    arr = arr[y0:y1, x0:x1]

    # 5) resize longest side to 20px, keep aspect
    h, w = arr.shape
    scale = 20.0 / max(h, w)
    new_h, new_w = max(1, int(round(h * scale))), max(1, int(round(w * scale)))
    arr_img = Image.fromarray((arr * 255).astype(np.uint8)).resize((new_w, new_h), Image.BILINEAR)

    # 6) paste centered on 28x28 canvas
    canvas = Image.new("L", (28, 28), color=0)
    left, top = (28 - new_w) // 2, (28 - new_h) // 2
    canvas.paste(arr_img, (left, top))
    arr = np.array(canvas, dtype=np.float32) / 255.0

    # 7) quick center-of-mass shift to match MNIST’s centering
    pts = np.argwhere(arr > 0)
    cy, cx = pts.mean(0)
    arr = np.roll(arr, int(round(14 - cy)), axis=0)
    arr = np.roll(arr, int(round(14 - cx)), axis=1)

    return arr.reshape(1, 784).astype(np.float32)

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    pil_img = Image.open(file.file)
    x = preprocess_mnist(pil_img)
    probs = model.predict(x, verbose=0)[0]
    return {"predicted_digit": int(np.argmax(probs)), "probs": probs.tolist()}
