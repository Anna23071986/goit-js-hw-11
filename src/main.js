import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import errorIcon from '../src/img/bi_x-octagon.svg';

const searchForm = document.querySelector('.js-search-form');
const list = document.querySelector('.gallery');

searchForm.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  searchForm.insertAdjacentHTML('afterend', '<span class="loader"></span>');

  const name = e.target.elements.search.value;
  if (name !== '') {
    getPictures(name)
      .then(data => {
        renderImages(data.hits);
      })
      .then(pictures => {
        const spanLoader = document.querySelector('.loader');
        spanLoader.remove();
      });
  }
  searchForm.reset();
}

function onFormSubmit(e) {}

function getPictures(picture) {
  const searchParams = new URLSearchParams({
    key: '42121827-736028e2edd071afefc989558',
    q: `${picture}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
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
      console.error('Error fetching pictures:', error);
      throw error;
    });
}

function imageTemplate(arr) {
  return arr
    .map(
      arr => `<li class="card-container">
            <a href="${arr.largeImageURL}"><img src="${arr.webformatURL}" alt="${arr.tags}" class="gallery-image"></a>
    
    <div class="picture-card">
        <p><span class="description">Likes</span>${arr.likes}</p>
        <p><span class="description">Views</span>${arr.views}</p>
        <p><span class="description">Comments</span>${arr.comments}</p>
        <p><span class="description">Downloads</span>${arr.downloads}</p>
    </div>
</li>`
    )
    .join('');
}

function renderImages(arr) {
  list.innerHTML = '';
  if (arr.length === 0) {
    return iziToast.show({
      title: 'Error',
      titleColor: 'rgba(255, 255, 255, 1)',
      message: `Sorry, there are no images matching your search query. Please try again!`,
      messageColor: 'rgba(255, 255, 255, 1)',
      backgroundColor: 'rgba(239, 64, 64, 1)',
      iconUrl: errorIcon,
      position: 'topRight',
    });
  }
  const markup = imageTemplate(arr);
  list.insertAdjacentHTML('beforeend', markup);
  simpleLightbox();
}

function simpleLightbox() {
  let gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  gallery.on('show.simplelightbox');
  gallery.refresh();
}
