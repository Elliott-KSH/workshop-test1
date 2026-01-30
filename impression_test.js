// Teachable Machine model setup
const URL = "https://teachablemachine.withgoogle.com/models/7n-JgGN_j/";
let model, maxPredictions;

const imageUpload = document.getElementById('image-upload');
const startTestButton = document.getElementById('start-test-button');
const imagePreview = document.getElementById('image-preview');
const labelContainer = document.getElementById('label-container');

// Load the image model
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Create div for each class
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

// Predict function for uploaded image
async function predict() {
    if (!model || !window.uploadedImage) {
        console.error("Model not loaded or image not uploaded.");
        return;
    }

    // Create a canvas from the image to use for prediction
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.uploadedImage.width;
    canvas.height = window.uploadedImage.height;
    ctx.drawImage(window.uploadedImage, 0, 0, canvas.width, canvas.height);

    const prediction = await model.predict(canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

// Event listener for image upload
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                window.uploadedImage = img; // Store image globally for prediction
                imagePreview.innerHTML = '';
                imagePreview.appendChild(img);
                imagePreview.style.display = 'block';
                startTestButton.disabled = false; // Enable button once image is loaded
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'none';
        startTestButton.disabled = true;
        labelContainer.innerHTML = ''; // Clear previous results
    }
});

// Event listener for start test button
startTestButton.addEventListener('click', predict);

// Initialize model on page load
loadModel();