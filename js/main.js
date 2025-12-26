import { visual } from './visualization.js';
import { initFullscreenViewer } from './fullscreen-viewer.js';
import { initFormValidation } from './form-validation.js';
import { getData } from './api.js';
import { initFilters } from './filters.js';

const showLoadError = (message) => {
  const errorContainer = document.createElement('div');
  errorContainer.classList.add('data-error');
  errorContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #ff6b6b;
    color: white;
    padding: 10px 20px;
    text-align: center;
    z-index: 10000;
    font-size: 14px;
  `;

  errorContainer.textContent = message;

  document.body.appendChild(errorContainer);

  setTimeout(() => {
    errorContainer.remove();
  }, 5000);
};

const loadAndDisplayPhotos = async () => {
  try {
    const photosData = await getData();

    const photosWithLikes = photosData.map(photo => ({
      ...photo,
      userLiked: false
    }));

    visual(photosWithLikes);
    initFilters(photosWithLikes);

  } catch (error) {
    showLoadError(error.message);
  }
};

const initApp = async () => {
  await loadAndDisplayPhotos();
  initFullscreenViewer();
  initFormValidation();
};

initApp();
