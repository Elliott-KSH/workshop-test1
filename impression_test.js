// Teachable Machine model setup
const URL = "https://teachablemachine.withgoogle.com/models/7n-JgGN_j/";
let model, maxPredictions;

const imageUpload = document.getElementById('image-upload');
const uploadButton = document.getElementById('upload-button');
const startTestButton = document.getElementById('start-test-button');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const labelContainer = document.getElementById('label-container');
const resultArea = document.getElementById('result-area');
const shareResultsButton = document.getElementById('share-results-button');

let lastPrediction = [];

// Load the image model
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (error) {
        console.error("Failed to load model:", error);
        // Display an error to the user
    }
}

// Predict function for uploaded image
async function predict() {
    if (!model || !window.uploadedImage) {
        console.error("Model not loaded or image not uploaded.");
        return;
    }

    startTestButton.disabled = true;
    startTestButton.textContent = "분석 중...";

    const prediction = await model.predict(window.uploadedImage);
    lastPrediction = prediction; // Store for sharing

    labelContainer.innerHTML = ''; // Clear previous results
    prediction.forEach(item => {
        const percentage = (item.probability * 100).toFixed(2);
        const resultBar = document.createElement('div');
        resultBar.className = 'result-bar';
        resultBar.innerHTML = `
            <div class="class-name">${item.className}</div>
            <div class="bar-container">
                <div class="bar" style="width: ${percentage}%;"></div>
            </div>
            <div class="percentage">${percentage}%</div>
        `;
        labelContainer.appendChild(resultBar);
    });

    resultArea.style.display = 'block';
    startTestButton.textContent = "다시 분석하기";
    startTestButton.disabled = false;
}

// Event listener for the custom upload button
uploadButton.addEventListener('click', () => imageUpload.click());

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
                imagePreviewContainer.style.display = 'block';
                startTestButton.disabled = false;
                resultArea.style.display = 'none'; // Hide old results
                uploadButton.textContent = "다른 사진 선택";
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Event listener for start test button
startTestButton.addEventListener('click', predict);

// Event listener for share results button
shareResultsButton.addEventListener('click', () => {
    if (lastPrediction.length === 0) return;

    let shareText = '✨ AI 인상 테스트 결과 ✨\n\n';
    lastPrediction.forEach(item => {
        const percentage = (item.probability * 100).toFixed(0);
        shareText += `${item.className}: ${percentage}%\n`;
    });
    shareText += `\n여러분도 한번 해보세요! -> ${window.location.href}`;

    navigator.clipboard.writeText(shareText).then(() => {
        const originalText = shareResultsButton.textContent;
        shareResultsButton.textContent = '복사됨!';
        setTimeout(() => {
            shareResultsButton.textContent = originalText;
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});

// Initialize model on page load
loadModel();