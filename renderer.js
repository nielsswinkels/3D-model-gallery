const urlParams = new URLSearchParams(window.location.search);
const modelsPath = urlParams.get('modelsPath');

let modelFiles = window.modelAPI.getModels(modelsPath);
console.log("Models path from main process:", modelsPath);
let currentIndex = 0;

const viewer = document.getElementById('viewer'); // assuming you have a container div

function loadModel(index) {
  if (!modelFiles[index]) return;
  const modelUrl = `file://${modelFiles[index]}`;

  // Clear and load main viewer
  viewer.innerHTML = '';
  const modelViewer = document.createElement('model-viewer');
  modelViewer.setAttribute('src', modelUrl);
  modelViewer.setAttribute('alt', '3D model');
  modelViewer.setAttribute('auto-rotate', '');
  modelViewer.setAttribute('camera-controls', '');
  modelViewer.style.width = '100%';
  modelViewer.style.height = '100%';

  viewer.appendChild(modelViewer);

  // Update thumbnails active state
  updateActiveThumbnail();
}



// Navigation
function nextModel() {
  currentIndex = (currentIndex + 1) % modelFiles.length;
  loadModel(currentIndex);
}

function prevModel() {
  currentIndex = (currentIndex - 1 + modelFiles.length) % modelFiles.length;
  loadModel(currentIndex);
}

// Event listeners
document.getElementById('next').addEventListener('click', nextModel);
document.getElementById('prev').addEventListener('click', prevModel);


window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextModel();
  if (e.key === 'ArrowLeft') prevModel();
});

// Load first model on start
if (modelFiles.length > 0) {
  renderThumbnails();
  loadModel(currentIndex);
} else {
  viewer.textContent = 'No .glb or .gltf files found in models folder.';
}



function renderThumbnails() {
  const thumbnailsContainer = document.getElementById('thumbnails');
  thumbnailsContainer.innerHTML = '';
  modelFiles.forEach((modelPath, index) => {
    const thumb = document.createElement('model-viewer');
    thumb.classList.add('thumb');
    thumb.setAttribute('src', modelPath);
    thumb.setAttribute('camera-controls', '');
    thumb.setAttribute('disable-zoom', '');
    thumb.setAttribute('interaction-prompt', 'none');
    thumb.addEventListener('click', () => {
      currentIndex = index;
      loadModel(currentIndex);
      updateActiveThumbnail();
    });
    thumbnailsContainer.appendChild(thumb);


    /*const thumb = document.createElement('div');
    thumb.classList.add('thumb');
    if (index === currentIndex) thumb.classList.add('active');
    
    // Optional: show model filename as tooltip
    thumb.title = modelPath.split(/[\\/]/).pop();

    // You could add a thumbnail preview image if you generate one, but for now just use filename as text or background color
    thumb.textContent = thumb.title;

    thumb.addEventListener('click', () => {
      currentIndex = index;
      loadModel(currentIndex);
      updateActiveThumbnail();
    });

    thumbnailsContainer.appendChild(thumb);*/
  });
}

function updateActiveThumbnail() {
  const thumbnailsContainer = document.getElementById('thumbnails');
  Array.from(thumbnailsContainer.children).forEach((child, idx) => {
    child.classList.toggle('active', idx === currentIndex);
  });
}
