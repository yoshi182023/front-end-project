'use strict';
const TMDB_API_KEY = 'ad4c3c9eb50374bcf4ca0e3426d2c976';
const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`;
const urlVideo = `https://api.themoviedb.org/3/movie/157336/videos?api_key=${TMDB_API_KEY}`;
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return { status: response.status, data };
}
function createFlipCardHome(data) {
  // 这个 div 是卡片的最外层容器，负责提供基本的 CSS 样式，如 宽度、边框、圆角 和 透视效果
  const flipCard = document.createElement('div');
  flipCard.className = 'flip-card';
  // flip-card-inner控制卡片的 翻转动画并且 确保前后面翻转时能保持 3D 立体感
  // flip-card-front 作为卡片的正面，默认可见。
  // flip-card-img-container 是一个 div，用于包裹 img，确保图片不会受 flip-card-front 透明背景的影响。
  flipCard.innerHTML = `

   <div class="flip-card-inner">
      <div class="flip-card-front">
        <div class="flip-card-img-container">
          <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title || data.name}">
        </div>
        <div class="flip-card-content">
          <h3>${data.title || data.name}</h3>
          <p>${data.overview}</p>
        </div>
      </div>
    </div>
  `;
  return flipCard;
}
async function renderHome() {
  const root = document.getElementById('root');
  const loadScreen = document.createElement('div');
  loadScreen.className = 'loadscreen';
  const loader = document.createElement('div');
  loader.className = 'loader';
  loadScreen.appendChild(loader);
  if (root === null) {
    throw new Error('Root element not found');
  }
  root.appendChild(loadScreen);
  try {
    const response = await fetchData(url);
    if (response.status === 200) {
      const data = response.data;
      root.removeChild(loadScreen);
      const containerFluid2 = document.createElement('div');
      containerFluid2.className = 'container-fluid2';
      containerFluid2.innerHTML = `
        <p>Welcome!</p>
        <h3>Look out for millions of the best, popular and trending movies, TV shows and people.</h3>
        <h2>Explore Now</h2>
      `;
      root.appendChild(containerFluid2);
      const containerFluid3 = document.createElement('div');
      containerFluid3.className = 'container-fluid3';
      containerFluid3.innerHTML = `<h2>What's trending today 🔥</h2>`;
      root.appendChild(containerFluid3);
      const containerFluid = document.createElement('div');
      containerFluid.className = 'container-fluid';
      const row1 = document.createElement('div');
      row1.className = 'row1';
      data.results.forEach((res) => {
        const flipCard = createFlipCardHome(res);
        row1.appendChild(flipCard);
      });
      containerFluid.appendChild(row1);
      root.appendChild(containerFluid);
    } else {
      root.removeChild(loadScreen);
      const errorMessage = document.createElement('h2');
      errorMessage.textContent = 'Something Went Wrong';
      root.appendChild(errorMessage);
    }
  } catch (error) {
    root.removeChild(loadScreen);
    const errorMessage = document.createElement('h2');
    errorMessage.textContent = 'Something Went Wrong';
    root.appendChild(errorMessage);
  }
}
// Initialize the renderHome function when the DOM is loaded
document.addEventListener('DOMContentLoaded', renderHome);
