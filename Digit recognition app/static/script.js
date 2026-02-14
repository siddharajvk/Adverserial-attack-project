const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;

// Canvas Background
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw Settings
ctx.strokeStyle = "black";
ctx.lineWidth = 15;
ctx.lineCap = "round";

// Start Drawing
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);

canvas.addEventListener("mousemove", draw);

function draw(event) {
    if (!drawing) return;

    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
    ctx.lineTo(event.offsetX + 1, event.offsetY + 1);
    ctx.stroke();
}

// Clear Canvas
function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("result").innerText = "";
}

// Predict Drawing
function drawPredict() {
    const imageData = canvas.toDataURL("image/png");

    fetch("/predict_draw", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({image: imageData})
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("result").innerText =
            "Prediction: " + data.prediction;
    });
}

// Predict Upload
function uploadPredict() {
    const fileInput = document.getElementById("uploadInput");
    const file = fileInput.files[0];

    let formData = new FormData();
    formData.append("file", file);

    fetch("/predict_upload", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("result").innerText =
            "Prediction: " + data.prediction;
    });
}
