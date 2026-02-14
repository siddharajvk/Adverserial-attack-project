from flask import Flask, render_template, request, jsonify # type: ignore
import tensorflow as tf # type: ignore
import numpy as np # type: ignore
from PIL import Image # type: ignore
import base64
import io

app = Flask(__name__)

# Load model
model = tf.keras.models.load_model("basic_cnn_mnist.h5")

# Preprocess function
def preprocess(img):
    img = img.convert("RGB")
    img = img.resize((32, 32))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img


@app.route("/")
def home():
    return render_template("index.html")


# Upload Image Prediction
@app.route("/predict_upload", methods=["POST"])
def predict_upload():
    file = request.files["file"]
    img = Image.open(file)

    img = preprocess(img)

    prediction = model.predict(img)
    digit = int(np.argmax(prediction))

    return jsonify({"prediction": digit})


# Drawing Canvas Prediction
@app.route("/predict_draw", methods=["POST"])
def predict_draw():
    data = request.json["image"]

    # Decode base64 image
    encoded = data.split(",")[1]
    decoded = base64.b64decode(encoded)

    img = Image.open(io.BytesIO(decoded))

    img = preprocess(img)

    prediction = model.predict(img)
    digit = int(np.argmax(prediction))

    return jsonify({"prediction": digit})


if __name__ == "__main__":
    app.run(debug=True)
