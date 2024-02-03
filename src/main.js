import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import errorIcon from '../src/img/bi_x-octagon.svg';

const searchForm = document.querySelector('.js-search-form');
const list = document.querySelector('.gallery');

searchForm.addEventListener('submit', handleSubmit);

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function handleSubmit(e) {
  e.preventDefault();

  const value = e.target.elements.search.value;
  const hasLoader = document.querySelector('.loader');

  if (value !== '' && !hasLoader) {
    list.innerHTML = '';

    searchForm.insertAdjacentHTML('afterend', '<span class="loader"></span>');

    getPictures(value).then(data => {
      setTimeout(() => {
        const spanLoader = document.querySelector('.loader');
        if (spanLoader) {
          spanLoader.remove();
        }
        renderImages(data.hits);
      }, 500);
    });
  }
  searchForm.reset();
}

function getPictures(value) {
  const searchParams = new URLSearchParams({
    key: '42121827-736028e2edd071afefc989558',
    q: `${value}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 100,
  });
  const url = `https://pixabay.com/api/?${searchParams}`;

  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .catch(error => {
      throw error;
    });
}

function renderImages(arr) {
  if (arr.length === 0) {
    return iziToast.show({
      message: `Sorry, there are no images matching<br>your search query. Please try again!`,
      messageColor: 'rgba(255, 255, 255, 1)',
      backgroundColor: 'rgba(239, 64, 64, 1)',
      iconUrl: errorIcon,
      position: 'topRight',
    });
  }
  const markup = imageTemplate(arr);
  list.insertAdjacentHTML('beforeend', markup);
  gallery.on('show.simplelightbox');
  gallery.refresh();
}

function imageTemplate(arr) {
  return arr
    .map(
      arr =>
        `<li class="gallery-item">
            <div class="image-container">
                <a href="${arr.largeImageURL}"><img src="${arr.webformatURL}" alt="${arr.tags}" class="gallery-image"></a>
            </div>
            <div class="gallery-card">
                <p><span class="description">Likes</span>${arr.likes}</p>
                <p><span class="description">Views</span>${arr.views}</p>
                <p><span class="description">Comments</span>${arr.comments}</p>
                <p><span class="description">Downloads</span>${arr.downloads}</p>
            </div>
        </li>`
    )
    .join('');
}
