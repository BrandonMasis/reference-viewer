const customUploadLabel = document.getElementById('custom-upload-label');
const folderInput = document.getElementById('folder-input');
const timerInput = document.getElementById('timer-input');
const startButton = document.getElementById('start-button');
const nextButton = document.getElementById('next-button');
const previousButton = document.getElementById('previous-button');
const endButton = document.getElementById('end-button');
const imageElement = document.getElementById('image');
const countdownElement = document.getElementById('countdown');
const completionMessage = document.getElementById('completion-message');

let images = [];
let currentIndex = -1;
let timerInterval;

folderInput.addEventListener('change', handleFolderSelection);
startButton.addEventListener('click', startSlideshow);
nextButton.addEventListener('click', showNextImage);
previousButton.addEventListener('click', showPreviousImage);
endButton.addEventListener('click', endSession);

function toggleUploadLabelVisibility(show) {
  customUploadLabel.style.display = show ? 'block' : 'none';
}

function handleFolderSelection(event) {
  const files = event.target.files;

  if (files.length > 0) {
    const folderName = files[0].webkitRelativePath.split('/')[0];
    const numImages = files.length;
    customUploadLabel.textContent = `Folder: ${folderName} (${numImages} images)`;

    images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        images.push(imageUrl);
      }
    }

    shuffleImages();
    toggleUploadLabelVisibility(true);
  }
}

function shuffleImages() {
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }
}

function startSlideshow() {
  const timerMinutes = parseInt(timerInput.value, 10);
  if (isNaN(timerMinutes) || timerMinutes <= 0 || images.length === 0) return;

  currentIndex = 0;
  clearInterval(timerInterval);
  showImage();
  startTimer(timerMinutes * 60);
  showImageSection();
  showButtons();
  hideEndButton();
  hideUploadAndTimer();
  completionMessage.style.display = 'none';
  toggleUploadLabelVisibility(false);
  showEndButton();
}

function showImage() {
  imageElement.src = images[currentIndex];
}

function showNextImage() {
  if (currentIndex < images.length - 1) {
    currentIndex++;
    showImage();
    startTimer(timerInput.value * 60);
    updateButtonsVisibility();
    hideEndButton();
    completionMessage.style.display = 'none';
  }
}

function showPreviousImage() {
  if (currentIndex > 0) {
    currentIndex--;
    showImage();
    startTimer(timerInput.value * 60);
    updateButtonsVisibility();
    hideEndButton();
    completionMessage.style.display = 'none';
  }
}
function updateButtonsVisibility() {
  if (currentIndex >= images.length - 1) {
    hideNextButton();
    showEndButton();
  } else {
    showNextButton();
    hideEndButton();
  }

  if (currentIndex === 0) {
    hidePreviousButton();
  } else {
    showPreviousButton();
  }
}

function startTimer(totalSeconds) {
  let remainingSeconds = totalSeconds;

  clearInterval(timerInterval);
  updateCountdown(remainingSeconds);

  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateCountdown(remainingSeconds);

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      if (currentIndex === images.length - 1) {
        showCompletionMessage();
        hideButtons();
        // showEndButton(); // Remove this line
      } else {
        showNextImage();
      }
    }
  }, 1000);
}

function updateCountdown(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsToShow = seconds % 60;
  const countdownText = `<i class="fas fa-clock"></i> ${minutes} min ${secondsToShow} sec`;
  countdownElement.innerHTML = countdownText;
}

function showImageSection() {
  imageElement.style.display = 'block';
  countdownElement.style.display = 'block';
}

function hideImageSection() {
  imageElement.style.display = 'none';
  countdownElement.style.display = 'none';
}

function hideUploadAndTimer() {
  folderInput.style.display = 'none';
  timerInput.style.display = 'none';
  startButton.style.display = 'none';
}

function showButtons() {
  nextButton.style.display = 'block';
  previousButton.style.display = 'block';
}

function hideButtons() {
  nextButton.style.display = 'none';
  previousButton.style.display = 'none';
}

function showEndButton() {
  endButton.style.display = 'block';
}

function hideEndButton() {
  endButton.style.display = 'none';
}

function showCompletionMessage() {
  completionMessage.style.display = 'block';
}

function hideCompletionMessage() {
  completionMessage.style.display = 'none';
}

function endSession() {
  currentIndex = -1;
  clearInterval(timerInterval);
  hideImageSection();
  hideButtons();
  hideEndButton();
  hideCompletionMessage();
  showUploadAndTimer();
  toggleUploadLabelVisibility(true); // Show the custom upload label
  shuffleImages();
}

function showUploadAndTimer() {
  folderInput.style.display = 'block';
  timerInput.style.display = 'block';
  startButton.style.display = 'block';
}

function hideImageSection() {
  imageElement.style.display = 'none';
  countdownElement.style.display = 'none';
}

hideImageSection();
showUploadAndTimer();
toggleUploadLabelVisibility(true); // Show the custom upload label
