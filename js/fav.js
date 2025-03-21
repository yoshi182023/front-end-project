'use strict';
// 获取收藏的电影数据
function getFavoriteMovies() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}
// 生成电影卡片
function createMovieCard(movie) {
  const movieCard = document.createElement('div');
  movieCard.className = 'movie-card';
  movieCard.dataset.id = movie.imdbID; // 绑定 IMDb ID
  movieCard.innerHTML = `
    <div class="movie-poster">
      <img src="${movie.Poster}" alt="${movie.Title}">
    </div>
    <div class="movie-info">
      <h3>${movie.Title}</h3>
      <h4>Rating: ${movie.imdbRating || 'N/A'}</h4>
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
    favList.innerHTML = '<p>No favorite movies added yet.</p>';
  } else {
    movies.forEach((movie) => {
      const movieCard = createMovieCard(movie);
      favList.appendChild(movieCard);
    });
    // 绑定移除按钮事件
    document.querySelectorAll('.remove-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const target = event.target;
        const movieID = target.dataset.id;
        if (movieID) {
          removeFavoriteMovie(movieID);
        }
      });
    });
    // 绑定点击电影卡片打开详情模态框
    document.querySelectorAll('.movie-card').forEach((card) => {
      card.addEventListener('click', (event) => {
        const target = event.currentTarget;
        const movieID = target.dataset.id;
        if (movieID) {
          showMovieDetails(movieID);
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
// 电影详情模态框
function showMovieDetails(imdbID) {
  const movies = getFavoriteMovies();
  const movie = movies.find((m) => m.imdbID === imdbID);
  if (!movie) return;
  // 创建模态框
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-overlay');
  modalContainer.innerHTML = `
    <div class="modal">
      <span class="close-btn">&times;</span>
      <h2>${movie.Title} (${movie.Year})</h2>
      <img src="${movie.Poster}" alt="${movie.Title}">
      <p><strong>IMDB Rating:</strong> ${movie.imdbRating || 'N/A'}</p>
      <button class="trailer-btn">Watch Trailer</button>
      <button class="close-btn">Close</button>
    </div>
  `;
  document.body.appendChild(modalContainer);
  // 关闭模态框
  modalContainer.querySelector('.close-btn').addEventListener('click', () => {
    modalContainer.remove();
  });
  //   modalContainer
  //     .querySelector('.trailer-btn')!
  //     .addEventListener('click', () => {
  //       loadTrailer(imdbID, modalContainer);
  //     });
  // }
  // 加载预告片
  // const loadTrailer = async (
  //   imdbID: string,
  //   modalContainer: HTMLElement,
  // ): Promise<void> => {
  //   const TMDB_API_KEY = 'ad4c3c9eb50374bcf4ca0e3426d2c976';
  //   const searchUrl = `https://api.themoviedb.org/3/movie/${imdbID}/videos?api_key=${TMDB_API_KEY}`;
  //   const searchData = await fetchData(searchUrl);
  //   console.log(searchData);
  // 显示预告片
  //   const trailerContainer = document.createElement('div');
  //   trailerContainer.classList.add('trailer-container');
  //   trailerContainer.innerHTML = `
  //   <iframe
  //                               className="embed-responsive-item"
  //                               src={"videoUrl"}
  //                               title="videos"
  //                             ></iframe>
  //   `;
  //   modalContainer.appendChild(trailerContainer);
  // };
  // 页面加载完成后渲染收藏列表
  document.addEventListener('DOMContentLoaded', renderFavoriteMovies);
}
