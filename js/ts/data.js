import { displayMovieList, displayActorList } from './main';
const TMDB_API_KEY = 'ad4c3c9eb50374bcf4ca0e3426d2c976';
const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`;
// const urlVideo = `https://api.themoviedb.org/3/movie/157336/videos?api_key=${TMDB_API_KEY}`;
// const searchAPI = (searchTerm: string) =>
//   `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return { status: response.status, data };
}
async function loadMovies(searchTerm) {
  // 是一个异步函数，用于从OMDb API加载电影数据。
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`; // 构建 API 请求 URL
  const res = await fetch(`${URL}`); // 发送请求
  const data = await res.json();
  if (data.Response === 'True') displayMovieList(data.Search); // 如果响应成功，显示电影列表
}
async function loadPeople(searchTerm) {
  // 是一个异步函数，用于从OMDb API加载电影数据。
  const URL = `https://api.themoviedb.org/3/search/person?query=${searchTerm}&include_adult=false&language=en-US&page=1`; // 构建 API 请求 URL
  const res = await fetch(`${URL}`, options); // 发送请求
  const data = await res.json();
  if (data.Response === 'True') displayActorList(data.Search); // 如果响应成功，显示电影列表
}
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZDRjM2M5ZWI1MDM3NGJjZjRjYTBlMzQyNmQyYzk3NiIsIm5iZiI6MTc0MTY0OTE0My41MTIsInN1YiI6IjY3Y2Y3NGY3MTM5OTBhMDU4YjYwNmYyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hy17naFAmqiretzIYpZocnmDlqVI7Rlyul5XIc1zKsk',
  },
};
export { fetchData, loadMovies, url, loadPeople };
