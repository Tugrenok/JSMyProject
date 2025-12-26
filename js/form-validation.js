import './vendor/pristine/pristine.js';
import { initImageScale, resetScale } from './image-scale.js';
import './vendor/nouislider/nouislider.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';

const form = document.querySelector('.img-upload__form');
const hashtagsInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');
const fileInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const submitButton = document.querySelector('.img-upload__submit');
const previewImage = document.querySelector('.img-upload__preview img');
const effectsList = document.querySelector('.effects__list');
const effectLevel = document.querySelector('.img-upload__effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');

let isSubmitBlocked = false;
let currentEffect = 'none';
let slider = null;
let pristine = null;

const effects = {
  none: { min: 0, max: 100, step: 1, filter: '', unit: '' },
  chrome: { filter: 'grayscale', min: 0, max: 1, step: 0.1, unit: '' },
  sepia: { filter: 'sepia', min: 0, max: 1, step: 0.1, unit: '' },
  marvin: { filter: 'invert', min: 0, max: 100, step: 1, unit: '%' },
  phobos: { filter: 'blur', min: 0, max: 3, step: 0.1, unit: 'px' },
  heat: { filter: 'brightness', min: 1, max: 3, step: 0.1, unit: '' }
};

const initEffectSlider = () => {
  if (!effectLevelSlider) return;
  effectLevel.classList.add('hidden');
  slider = noUiSlider.create(effectLevelSlider, {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
    connect: 'lower',
    format: {
      to: (value) => parseFloat(value).toFixed(1),
      from: (value) => parseFloat(value)
    }
  });
  slider.on('update', (values) => {
    const normalizedValue = parseFloat(values[0]);

    effectLevelValue.value = normalizedValue;
    applyEffect(normalizedValue);
  });
};

const applyEffect = (value) => {
  if (!previewImage || currentEffect === 'none') {
    previewImage.style.filter = 'none';
    return;
  }

  const effect = effects[currentEffect];
  let filterValue;

  switch (currentEffect) {
    case 'chrome':
    case 'sepia':
      filterValue = value;
      break;
    case 'marvin':
      filterValue = `${value}%`;
      break;
    case 'phobos':
      filterValue = `${value}px`;
      break;
    case 'heat':
      filterValue = value;
      break;
    default:
      filterValue = '';
  }

  if (filterValue !== '' && currentEffect !== 'none') {
    previewImage.style.filter = `${effect.filter}(${filterValue})`;
  } else {
    previewImage.style.filter = 'none';
  }
};

const updateSliderForEffect = (effectName) => {
  if (!slider) return;

  if (effectName === 'none') {
    effectLevel.classList.add('hidden');
    previewImage.style.filter = 'none';
    effectLevelValue.value = '';
  } else {
    effectLevel.classList.remove('hidden');
    const effect = effects[effectName];

    slider.updateOptions({
      range: {
        min: effect.min,
        max: effect.max
      },
      step: effect.step,
      start: effect.max
    });

    slider.set(effect.max);
    effectLevelValue.value = effect.max;

    applyEffect(effect.max);
  }
};

const resetEffects = () => {
  currentEffect = 'none';
  if (previewImage) previewImage.style.filter = 'none';
  effectLevel.classList.add('hidden');
  effectLevelValue.value = '';
  const originalEffect = effectsList?.querySelector('#effect-none');
  if (originalEffect) {
    originalEffect.checked = true;
  }
  if (slider) {
    slider.set(1);
  }
};


const blockSubmitButton = () => {
  isSubmitBlocked = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  isSubmitBlocked = false;
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const onEffectChange = (evt) => {
  if (evt.target.name === 'effect') {
    currentEffect = evt.target.value;
    updateSliderForEffect(currentEffect);
  }
};

// В функции validateHashtags заменить:
const validateHashtags = (value) => {
  if (value === '') return true;
  const rawTags = value.trim().split(/\s+/).filter(tag => tag !== '');

  if (rawTags.length > 5) return false;

  for (let i = 0; i < rawTags.length; i++) {
    const tag = rawTags[i];

    if (!tag.startsWith('#')) return false;

    if (tag === '#') return false;

    if (tag.length > 20) return false;

    const content = tag.slice(1);
    if (!/^[a-zа-яё0-9]+$/i.test(content)) return false;

    const lowerTag = tag.toLowerCase();
    for (let j = 0; j < i; j++) {
      if (rawTags[j].toLowerCase() === lowerTag) return false;
    }
  }

  return true;
};

const validateDescription = (value) => {
  return value.length <= 140;
};

const initPristine = () => {
  if (typeof window.Pristine === 'undefined' || !form) return null;

  const pristineInstance = new window.Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'pristine-error'
  });

  if (hashtagsInput) {
    pristineInstance.addValidator(hashtagsInput, validateHashtags, 'Неправильный формат хэш-тегов');
  }

  if (descriptionInput) {
    pristineInstance.addValidator(descriptionInput, validateDescription, 'Длина комментария не может составлять больше 140 символов');
  }

  return pristineInstance;
};

const resetForm = () => {
  if (form) form.reset();
  if (pristine) pristine.reset();
  resetScale();
  resetEffects();
  if (fileInput) fileInput.value = '';

  const scaleControl = document.querySelector('.scale__control--value');
  if (scaleControl) {
    scaleControl.value = '100%';
  }
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  if (pristine && !pristine.validate()) return;
  if (isSubmitBlocked) return;

  blockSubmitButton();

  try {
    const formData = new FormData(form);

    formData.append('scale', document.querySelector('.scale__control--value').value);
    formData.append('effect', currentEffect);

    await sendData(formData);
    showSuccessMessage();
    closeForm();
    resetForm();
  } catch (error) {
    showErrorMessage();
  } finally {
    unblockSubmitButton();
  }
};

const openForm = () => {
  if (!overlay) return;
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeForm = () => {
  if (!overlay) return;
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onFileInputChange = (evt) => {
  const file = evt.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите изображение');
    evt.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    if (previewImage) {
      previewImage.src = e.target.result;
    }
    const effectPreviews = document.querySelectorAll('.effects__preview');
    effectPreviews.forEach(preview => {
      preview.style.backgroundImage = `url(${e.target.result})`;
    });
    resetScale();
    resetEffects();
    openForm();
  };
  reader.onerror = function() {
    alert('Не удалось загрузить фотографию');
    evt.target.value = '';
  };
  reader.readAsDataURL(file);
};

const onInputKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

const onDocumentKeydown = (evt) => {
  const isHashtagsFocused = hashtagsInput && document.activeElement === hashtagsInput;
  const isDescriptionFocused = descriptionInput && document.activeElement === descriptionInput;

  if (overlay && !overlay.classList.contains('hidden') && !isHashtagsFocused && !isDescriptionFocused) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeForm();
      resetForm();
    }
  }
};

const onCancelClick = () => {
  closeForm();
  resetForm();
};

const initFormValidation = () => {

  if (!overlay) {
    return;
  }

  initImageScale();
  initEffectSlider();
  resetEffects();
  pristine = initPristine();

  if (fileInput) {
    fileInput.addEventListener('change', onFileInputChange);
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', onCancelClick);
  }

  if (form) {
    form.addEventListener('submit', onFormSubmit);
  }

  document.addEventListener('keydown', onDocumentKeydown);

  if (effectsList) {
    effectsList.addEventListener('change', onEffectChange);
  }

  if (hashtagsInput) {
    hashtagsInput.addEventListener('keydown', onInputKeydown);
  }

  if (descriptionInput) {
    descriptionInput.addEventListener('keydown', onInputKeydown);
  }

};

export { initFormValidation, resetForm, closeForm };
