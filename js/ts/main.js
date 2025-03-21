import { loadMovies, url } from './data';
// const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`;
// const urlVideo = `https://api.themoviedb.org/3/movie/157336/videos?api_key=${TMDB_API_KEY}`;
// const searchAPI = (searchTerm: string) =>
//   `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return { status: response.status, data };
}
// 从 API 加载电影数据
// async function loadPeople(searchTerm: string): Promise<void> {
//   // 是一个异步函数，用于从OMDb API加载电影数据。
//   const URL = `https://api.themoviedb.org/3/search/person?query=${searchTerm}&include_adult=false&language=en-US&page=1`; // 构建 API 请求 URL
//   const res = await fetch(`${URL}`, options); // 发送请求
//   const data = await res.json();
//   if (data.Response === 'True') console.log(data.Search); // 如果响应成功，显示电影列表
// }
// 获取 DOM 元素 ：获取搜索输入框的 DOM 元素。
const $movieSearchBox = document.getElementById('movie-search-box'); // 搜索输入框
const $searchList = document.getElementById('search-list'); // 搜索结果列表
const resultGrid = document.getElementById('result-grid'); // 获取电影详细信息展示区域的 DOM 元素。
function displayMovieList(movies) {
  if ($searchList) {
    // 显示搜索结果的列表
    $searchList.innerHTML = ''; // 安全访问 innerHTML
    // 清空之前的搜索结果
    for (let idx = 0; idx < movies.length; idx++) {
      const $movieListItem = document.createElement('div'); // 创建一个新的 div 元素
      $movieListItem.dataset.id = movies[idx].imdbID; // 设置电影的 IMDb ID 将电影的IMDb ID存储在 data-id 属性中
      $movieListItem.classList.add('search-list-item'); // 为电影项添加CSS类
      const moviePoster =
        // 如果电影有海报，使用海报 URL；否则使用默认图片。
        movies[idx].Poster !== 'N/A'
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
    loadMovieDetails(); // 调用函数为每个电影项添加点击事件监听器
  } else {
    console.error('Search list element not found!');
  }
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
// 加载电影详细信息
function loadMovieDetails() {
  if ($searchList) {
    const searchListMovies = $searchList.querySelectorAll('.search-list-item');
    // 获取所有电影列表项
    searchListMovies.forEach((movie) => {
      // 为每个电影项添加点击事件
      movie.addEventListener('click', async () => {
        $searchList.classList.add('hide-search-list'); // 隐藏搜索结果列表
        $movieSearchBox.value = ''; // 清空搜索框
        const url = `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`; // 使用类型断言
        // 发送请求获取电影的详细信息
        const result = await fetch(url); // 根据 IMDb ID 获取电影详细信息
        const movieDetails = await result.json(); // 解析响应为 JSON
        displayMovieDetails(movieDetails); // 显示电影详细信息
      });
    });
  } else {
    console.error('Search list element not found!');
  }
}
function addToFavorites(details) {
  console.log('Adding movie:', details);
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  console.log('Initial favorites:', favorites);
  // 打印每部电影的 imdbID
  favorites.forEach((movie, index) => {
    console.log(`Favorite ${index + 1}:`, movie.imdbID);
  });
  const isAlreadyFavorite = favorites.some(
    (movie) => movie.imdbID === details.imdbID,
  );
  console.log('Is already favorite?', isAlreadyFavorite);
  favorites.push(details);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  console.log(
    'Updated favorites:',
    JSON.parse(localStorage.getItem('favorites') || '[]'),
  );
  alert(`"${details.Title}" has been added to your favorites!`);
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



       <button class="btn btn-default favorite-btn" data-title="${details.Title}" data-poster="${details.Poster}" onclick='addToFavorites(${JSON.stringify(details)})'>

            Add to Favourites
            <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                class="bi bi-heart-fill"
                fill="red"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                />
            </svg>
        </button>  </div>
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year"> Year: ${details.Year}</li>
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
  console.log('result', resultGrid);
  // 绑定按钮点击事件
  // 确保按钮存在并添加事件监听
  const favButton = resultGrid.querySelector('.favorite-btn');
  if (favButton) {
    favButton.addEventListener('click', () => {
      // 确保传递 details 参数到 addToFavorites
      addToFavorites(details);
    });
  }
  console.log('result', resultGrid);
}
// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelectorAll('.favorite-btn').forEach((button) => {
//     button.addEventListener('click', () => {
//       // const target = event.target as HTMLElement;
//       // const title = target.getAttribute('data-title')!;
//       // const poster = target.getAttribute('data-poster')!;
//       addToFavorites(details);
//       console.log('localStorage.getItem', localStorage.getItem('favorites'));
//     });
//   });
// });
// 点击页面其他区域时隐藏搜索结果列表 检查点击的目标是否是搜索输入框。如果不是，则隐藏搜索结果列表。
window.addEventListener('click', (event) => {
  const target = event.target; // 类型断言为 HTMLElement
  if (target.className !== 'form-control') {
    // 检查 event.target 是否存在
    $searchList?.classList.add('hide-search-list'); // 使用可选链
  }
});
// const searchTypeSelect = document.getElementById(
//   'search-type',
// ) as HTMLSelectElement;
// searchTypeSelect.addEventListener('change', () => {
//   const searchType = searchTypeSelect.value;
//   // 根据选择的类型更新搜索行为
//   if (searchType === 'person') {
//     // 如果选择了Person，执行演员搜索逻辑
//     loadPeople($movieSearchBox.value);
//   } else {
//     // 如果选择了Movie，执行电影搜索逻辑
//     loadMovies($movieSearchBox.value);
//   }
// });
// 新增一个 loadPeople 函数来处理演员搜索
// async function loadPeople(searchTerm: string): Promise<void> {
//   const URL = `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${searchTerm}`; // 构建演员搜索的 URL
//   const res = await fetch(`${URL}`); // 发送请求
//   const data = await res.json();
//   if (data.results) console.log(data.results); // 如果响应成功，显示演员列表
// }
function findMovies() {
  const searchTerm = $movieSearchBox.value.trim(); // 获取输入框的值并去除首尾空格
  if ($searchList) {
    if (searchTerm && searchTerm.length > 0) {
      // 如果不为空，显示搜索结果列表并调用 loadMovies 函数加载电影数据
      $searchList.classList.remove('hide-search-list');
      loadMovies(searchTerm); // 加载电影数据
      console.log('loadMovie', loadMovies(searchTerm));
      console.log('Searching movies...');
    } else {
      // 如果为空，隐藏搜索结果列表
      $searchList.classList.add('hide-search-list'); // 隐藏搜索结果列表
      console.log('Searching movies...');
    }
  }
}
// function findActors(): void {
//   const searchTerm = $movieSearchBox.value.trim(); // 获取输入框的值并去除首尾空格
//   if ($searchList) {
//     if (searchTerm && searchTerm.length > 0) {
//       // 如果不为空，显示搜索结果列表并调用 loadMovies 函数加载电影数据
//       $searchList.classList.remove('hide-search-list');
//       loadPeople(searchTerm); // 加载电影数据
//       console.log('loadMovie', loadPeople(searchTerm));
//       console.log('Searching person...');
//     } else {
//       // 如果为空，隐藏搜索结果列表
//       $searchList.classList.add('hide-search-list'); // 隐藏搜索结果列表
//       console.log('Searching person...');
//     }
//   }
// }
// document.addEventListener('DOMContentLoaded', () => {
//   const selectElement = document.getElementById('search-type');
//   if (selectElement) {
//     const searchTypeSelect = selectElement as HTMLSelectElement;
//     let currentSearchType = searchTypeSelect.value;
//     console.log('Initial value of search-type:', currentSearchType);
//     searchTypeSelect.addEventListener('change', () => {
//       currentSearchType = searchTypeSelect.value;
//       console.log('Selected search type:', currentSearchType);
//       findActors(); // 当选择变化时，重新执行搜索
//     });
//   } else {
//     console.log("Dropdown element with id 'search-type' not found!");
//   }
// });
// 渲染演员搜索结果
// function displayActorList(actors: any[]): void {
//   if (!$searchList) return;
//   $searchList.innerHTML = '';
//   actors.forEach((actor) => {
//     const actorElement = document.createElement('div');
//     actorElement.classList.add('search-result');
//     actorElement.innerHTML = `
//             <img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" alt="${actor.name}">
//             <p>${actor.name}</p>
//           `;
//     $searchList.appendChild(actorElement);
//   });
// }
console.log(findMovies());
export { fetchData, loadMovies, url, displayMovieList };
