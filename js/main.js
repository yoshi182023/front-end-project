'use strict';
const TMDB_API_KEY = 'ad4c3c9eb50374bcf4ca0e3426d2c976';
const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`;
// const urlVideo = `https://api.themoviedb.org/3/movie/157336/videos?api_key=${TMDB_API_KEY}`;
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
// 获取 DOM 元素 ：获取搜索输入框的 DOM 元素。
const $movieSearchBox = document.getElementById('movie-search-box'); // 搜索输入框
const $searchList = document.getElementById('search-list'); // 搜索结果列表
const resultGrid = document.getElementById('result-grid'); // 获取电影详细信息展示区域的 DOM 元素。
// 从 API 加载电影数据
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`; // 构建 API 请求 URL
  const res = await fetch(`${URL}`); // 发送请求
  const data = await res.json();
  if (data.Response === 'True') displayMovieList(data.Search); // 如果响应成功，显示电影列表
}
// 查找电影
function findMovies() {
  const searchTerm = $movieSearchBox.value.trim(); // 获取输入框的值并去除首尾空格
  if ($searchList) {
    if (searchTerm && searchTerm.length > 0) {
      $searchList.classList.remove('hide-search-list');
      loadMovies(searchTerm); // 加载电影数据
    } else {
      $searchList.classList.add('hide-search-list'); // 隐藏搜索结果列表
    }
  }
}
// 显示电影列表
function displayMovieList(movies) {
  if ($searchList) {
    $searchList.innerHTML = ''; // 安全访问 innerHTML
    // 清空之前的搜索结果
    for (let idx = 0; idx < movies.length; idx++) {
      const $movieListItem = document.createElement('div'); // 创建一个新的 div 元素
      $movieListItem.dataset.id = movies[idx].imdbID; // 设置电影的 IMDb ID
      $movieListItem.classList.add('search-list-item'); // 添加 CSS 类
      const moviePoster =
        // 如果电影有海报，使用海报 URL；否则使用默认图片。
        movies[idx].Poster != 'N/A'
          ? movies[idx].Poster
          : 'image_not_found.png'; // 处理电影海报 URL
      $movieListItem.innerHTML = `

        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
          <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        `; // 设置电影列表项的 HTML 内容
      $searchList.appendChild($movieListItem); // 将电影列表项添加到搜索结果列表中
    }
    loadMovieDetails(); // 加载电影详细信息
  } else {
    console.error('Search list element not found!');
  }
}
// 加载电影详细信息
function loadMovieDetails() {
  if ($searchList) {
    const searchListMovies = $searchList.querySelectorAll('.search-list-item');
    // 获取所有电影列表项
    searchListMovies.forEach((movie) => {
      movie.addEventListener('click', async () => {
        $searchList.classList.add('hide-search-list'); // 隐藏搜索结果列表
        $movieSearchBox.value = ''; // 清空搜索框
        const url = `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`; // 使用类型断言
        const result = await fetch(url); // 根据 IMDb ID 获取电影详细信息
        const movieDetails = await result.json(); // 解析响应为 JSON
        displayMovieDetails(movieDetails); // 显示电影详细信息
      });
    });
  } else {
    console.error('Search list element not found!');
  }
}
// 显示电影详细信息
function displayMovieDetails(details) {
  if (!resultGrid) {
    console.error('Result grid element not found!');
    return;
  }
  resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${details.Poster !== 'N/A' ? details.Poster : 'image_not_found.png'}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `; // 设置电影详细信息的 HTML 内容
  console.log(resultGrid);
}
// 点击页面其他区域时隐藏搜索结果列表
window.addEventListener('click', (event) => {
  const target = event.target; // 类型断言为 HTMLElement
  if (target.className !== 'form-control') {
    // 检查 event.target 是否存在
    $searchList?.classList.add('hide-search-list'); // 使用可选链
  }
});
