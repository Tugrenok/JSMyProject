const scaleControl = document.querySelector('.scale__control--value');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const previewImage = document.querySelector('.img-upload__preview img');

const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

let currentScale = DEFAULT_SCALE;

const updateScale = (value) => {
  currentScale = value;
  scaleControl.value = `${value}%`;
  previewImage.style.transform = `scale(${value / 100})`;
};

const onSmallerButtonClick = () => {
  const newScale = Math.max(currentScale - SCALE_STEP, MIN_SCALE);
  updateScale(newScale);
};

const onBiggerButtonClick = () => {
  const newScale = Math.min(currentScale + SCALE_STEP, MAX_SCALE);
  updateScale(newScale);
};

const resetScale = () => {
  updateScale(DEFAULT_SCALE);
};

const initImageScale = () => {
  smallerButton.addEventListener('click', onSmallerButtonClick);
  biggerButton.addEventListener('click', onBiggerButtonClick);
  resetScale();
};

export { initImageScale, resetScale };
