'use strict';
// 读取收藏的电影数据（从 localStorage 获取）
function getFavoriteMovies() {
  const favorites = localStorage.getItem('favorites');
  console.log(favorites);
  // 如果 favorites 为空，返回空数组 []，否则解析 JSON 数据并返回。
  return favorites ? JSON.parse(favorites) : [];
}
// 生成电影卡片
function createMovieCard(movie) {
  const movieCard = document.createElement('div');
  movieCard.className = 'movie-card';
  movieCard.innerHTML = `
    <div class="movie-poster">
      <img src="${movie.Poster}" alt="${movie.Title}">
    </div>
    <div class="movie-info">
      <h3>${movie.Title}</h3>     <h4>Rating: ${movie.imdbRating}</h4>
      <p>Year: ${movie.Year}</p>
      <button class="remove-btn" data-id="${movie.imdbID}">Remove</button>
    </div>
  `;
  return movieCard;
}
// 渲染收藏的电影列表
function renderFavoriteMovies() {
  const favList = document.getElementById('fav-list');
  if (!favList) return;
  favList.innerHTML = ''; // 清空现有内容
  const movies = getFavoriteMovies();
  if (movies.length === 0) {
    favList.innerHTML = '<p> No favorite movies added yet.</p>';
  } else {
    movies.forEach((movie) => {
      const movieCard = createMovieCard(movie); // 遍历电影列表，创建并添加电影卡片
      favList.appendChild(movieCard);
    });
    // 绑定移除按钮事件
    // 获取页面上所有 class="remove-btn" 的按钮，返回一个 NodeList（类数组）
    document.querySelectorAll('.remove-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const target = event.target;
        // event.target 默认是 EventTarget 类型，无法直接访问 dataset.id
        // as HTMLButtonElement 告诉 TypeScript："我确信这个元素是一个 <button>"，这样就可以安全地访问 dataset.id。
        const movieID = target.dataset.id;
        // 从 data-id 属性中获取当前按钮对应的 电影 ID
        if (movieID) {
          removeFavoriteMovie(movieID);
        }
      });
    });
  }
}
// 移除收藏的电影
function removeFavoriteMovie(imdbID) {
  let movies = getFavoriteMovies();
  movies = movies.filter((movie) => movie.imdbID !== imdbID);
  localStorage.setItem('favorites', JSON.stringify(movies));
  renderFavoriteMovies();
}
// 页面加载完成后渲染收藏列表
document.addEventListener('DOMContentLoaded', renderFavoriteMovies);
