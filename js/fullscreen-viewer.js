const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialCaption = bigPicture.querySelector('.social__caption');
const socialComments = bigPicture.querySelector('.social__comments');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const authorAvatar = bigPicture.querySelector('.social__header .social__picture');

let commentsToShow = [];
let commentsShown = 0;
const COMMENTS_PER_PORTION = 5;

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentElement.appendChild(img);
  commentElement.appendChild(text);
  return commentElement;
};

const renderComments = () => {
  const commentsPortion = commentsToShow.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);

  if (commentsPortion.length === 0) {
    commentsLoader.classList.add('hidden');
    return;
  }

  const fragment = document.createDocumentFragment();

  commentsPortion.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  socialComments.appendChild(fragment);
  commentsShown += commentsPortion.length;

  if (commentCountElement) {
    const shown = Math.min(commentsShown, commentsToShow.length);
    commentCountElement.innerHTML = `${shown} из <span class="comments-count">${commentsToShow.length}</span> комментариев`;
  }

  if (commentsShown >= commentsToShow.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const loadMoreComments = () => {
  renderComments();
};

const openFullscreen = (photoData) => {
  currentPhotoData = photoData;
  commentsToShow = [...photoData.comments];
  commentsShown = 0;

  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;

  authorAvatar.src = 'img/avatar-1.svg';
  authorAvatar.alt = 'Автор фотографии';
  socialCaption.textContent = photoData.description;

  socialComments.innerHTML = '';

  commentCountElement.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderComments();

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeFullscreen = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  currentPhotoData = null;
  commentsToShow = [];
  commentsShown = 0;
};

closeButton.addEventListener('click', () => {
  closeFullscreen();
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeFullscreen();
  }
});

commentsLoader.addEventListener('click', () => {
  loadMoreComments();
});

const initFullscreenViewer = () => {
  document.querySelector('.pictures').addEventListener('click', (evt) => {
    const thumbnail = evt.target.closest('.picture');

    if (thumbnail) {
      evt.preventDefault();
      const photoData = thumbnail.photoData;

      if (photoData) {
        openFullscreen(photoData);
      }
    }
  });
};

export { initFullscreenViewer };
