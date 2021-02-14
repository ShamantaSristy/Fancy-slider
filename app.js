const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

// API key
const KEY = '20269107-1d5ff520ffcfed88a303cb177';


// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick='selectItem(event,"${image.webformatURL}")' src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
    toggleSpinner(true);
  })
 
}
// fetch API
const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
    toggleSpinner(false);
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);

  console.log(sliders.length);
  if (item === -1) {
    sliders.push(img);
  }
  else {
    element.classList.remove('added');
    sliders.splice(item, 1);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // create slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
// Sliding Duration 
  let slidingDuration = document.getElementById('duration').value;
  if (slidingDuration < 0) {
    slidingDuration = 1000;
    alert('Please Enter valid time or default duration will be 1 second');
  }
  const duration = slidingDuration || 1000;

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
  search.value = "";
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})
// Spinner Area
const toggleSpinner = (show) => {
  const spinner = document.getElementById('loadingTimeSpinner');
  if(show){
    spinner.classList.remove = ('d-none');
    console.log(spinner.classList.value);
  }
  else{
    spinner.classList.add = ('d-none');
    console.log(spinner.classList.value);
  }
}
// Enter Key activation
document.getElementById('search').addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    getImages(search.value);
    document.getElementById('search').value = "";
  }
})
