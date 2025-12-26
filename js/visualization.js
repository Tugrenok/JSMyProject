const createThumbnailElement = (photoData) => {
  const template = document.querySelector('#picture').content.querySelector('.picture');
  const thumbnailElement = template.cloneNode(true);

  const image = thumbnailElement.querySelector('.picture__img');
  const comments = thumbnailElement.querySelector('.picture__comments');
  const likes = thumbnailElement.querySelector('.picture__likes');

  image.src = photoData.url;
  image.alt = photoData.description;
  comments.textContent = photoData.comments.length;
  likes.textContent = photoData.likes;

  thumbnailElement.photoData = photoData;

  thumbnailElement.dataset.photoId = photoData.id;

  return thumbnailElement;
};

const visual = (photosData) => {
  const container = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();

  const existingPictures = container.querySelectorAll('.picture');
  existingPictures.forEach(picture => picture.remove());

  photosData.forEach((photoData) => {
    if (photoData.userLiked === undefined) {
      photoData.userLiked = false;
    }

    const thumbnailElement = createThumbnailElement(photoData);
    fragment.appendChild(thumbnailElement);
  });

  container.appendChild(fragment);
};

export { visual };
