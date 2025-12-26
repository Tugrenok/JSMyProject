const successTemplate = document.querySelector('#success');
const errorTemplate = document.querySelector('#error');

const showSuccessMessage = () => {
  const successElement = successTemplate.content.cloneNode(true);
  document.body.appendChild(successElement);

  const successModal = document.querySelector('.success');
  const successButton = document.querySelector('.success__button');

  const closeSuccessModal = () => {
    successModal.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onOutsideClick);
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      closeSuccessModal();
    }
  };

  const onOutsideClick = (evt) => {
    if (!evt.target.closest('.success__inner')) {
      closeSuccessModal();
    }
  };

  successButton.addEventListener('click', closeSuccessModal);
  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onOutsideClick);
};

const showErrorMessage = () => {
  const errorElement = errorTemplate.content.cloneNode(true);
  document.body.appendChild(errorElement);

  const errorModal = document.querySelector('.error');
  const errorButton = document.querySelector('.error__button');

  const closeErrorModal = () => {
    errorModal.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onOutsideClick);
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      closeErrorModal();
    }
  };

  const onOutsideClick = (evt) => {
    if (!evt.target.closest('.error__inner')) {
      closeErrorModal();
    }
  };

  errorButton.addEventListener('click', closeErrorModal);
  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onOutsideClick);
};

export { showSuccessMessage, showErrorMessage };
