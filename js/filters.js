import { visual } from './visualization.js';

let currentPhotos = [];
let timeoutId = null;

const filterFunctions = {
  default: (photos) => {
    if (!Array.isArray(photos)) {
      return [];
    }
    return photos.sort((a, b) => a.id - b.id);
  },

  random: (photos) => {
    if (!Array.isArray(photos)) {
      return [];
    }

    const shuffled = [...photos]
      .sort(() => Math.random() - 0.5);

    return shuffled.slice(0, 10);
  },

  discussed: (photos) => {
    if (!Array.isArray(photos)) {
      return [];
    }
    return [...photos].sort((a, b) => b.comments.length - a.comments.length);
  }
};

const applyFilter = (filterType) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    if (!Array.isArray(currentPhotos) || currentPhotos.length === 0) {
      return;
    }

    const filteredPhotos = filterFunctions[filterType](currentPhotos);
    visual(filteredPhotos);
  }, 500);
};

const activateFilterButton = (button) => {
  document.querySelectorAll('.img-filters__button').forEach(btn => {
    btn.classList.remove('img-filters__button--active');
  });

  if (button) {
    button.classList.add('img-filters__button--active');
  }
};

const initFilters = (photosData) => {
  const filtersContainer = document.querySelector('.img-filters');
  const filterButtons = document.querySelectorAll('.img-filters__button');

  if (!Array.isArray(photosData) || photosData.length === 0) {
    return;
  }

  currentPhotos = photosData;

  if (photosData.length > 0) {
    filtersContainer.classList.remove('img-filters--inactive');

    const sortedPhotos = photosData.sort((a, b) => a.id - b.id);
    visual(sortedPhotos);
  }

  const defaultButton = document.querySelector('#filter-default');
  if (defaultButton) {
    defaultButton.classList.add('img-filters__button--active');
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', (evt) => {
      const filterType = evt.target.id.replace('filter-', '');

      filterButtons.forEach(btn => {
        btn.classList.remove('img-filters__button--active');
      });
      evt.target.classList.add('img-filters__button--active');

      applyFilter(filterType);
    });
  });
};

export { initFilters };
