import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import errorIcon from '../src/img/bi_x-octagon.svg';
import resolveIcon from '../src/img/bi_check2-circle.svg';

const searchForm = document.querySelector('.js-search-form');
const container = document.querySelector('.js-container');

searchForm.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();

  const name = e.target.elements.search.value;
  getPictures(name).then(data => {
    renderImages(data.hits);
  });

  searchForm.reset();
}

function onFormSubmit(e) {}

function getPictures(picture) {
  const BASE_URL = 'https://pixabay.com/api';
  const searchParams = new URLSearchParams({
    key: '42121827-736028e2edd071afefc989558',
    q: `${picture}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });
  const PARAMS = `?${searchParams}`;
  const url = BASE_URL + PARAMS;

  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .catch(error => {
      console.error('Error fetching pictures:', error);
      throw error; // Переброс ошибки для обработки в блоке catch при вызове getPictures
    });
}

function imageTemplate(arr) {
  return arr
    .map(
      ({ previewURL }) => `<div class="card-container">
    <div>
        <img src="${previewURL}" alt="#" class="picture">
    </div>
    <div>
       <h4 class="picture-name"></h4>
       <p class="description"></p>
    </div>
</div>`
    )
    .join('');
}

function renderImages(arr) {
  container.innerHTML = '';
  if (arr.length === 0) {
    return iziToast.show({
      title: 'Error',
      titleColor: 'rgba(255, 255, 255, 1)',
      message: `Rejected promise in ms`,
      messageColor: 'rgba(255, 255, 255, 1)',
      backgroundColor: 'rgba(239, 64, 64, 1)',
      iconUrl: errorIcon,
      position: 'topRight',
    });
  }
  const markup = imageTemplate(arr);
  container.insertAdjacentHTML('beforeend', markup);
}
