'use strict';
const TMDB_API_KEY = 'ad4c3c9eb50374bcf4ca0e3426d2c976';
// 定义 fetchPopularPeople 函数
async function fetchPopularPeople() {
  const url = `https://api.themoviedb.org/3/tv/popular?=${TMDB_API_KEY}&language=en-US`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    if (data.results) {
      renderPeople(data.results);
    } else {
      renderNoResults();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    renderError();
  }
}
// 定义 renderPeople 函数
function renderPeople(people) {
  const container = document.createElement('div');
  container.className = 'container first';
  const row = document.createElement('div');
  row.className = 'row ten-columns1';
  people.forEach((person, index) => {
    const column = document.createElement('div');
    column.className = 'column1';
    const flipCard = document.createElement('div');
    flipCard.className = 'flip-card';
    const flipCardInner = document.createElement('div');
    flipCardInner.className = 'flip-card-inner';
    const flipCardFront = document.createElement('div');
    flipCardFront.className = 'flip-card-front';
    if (person.profile_path) {
      const img = document.createElement('img');
      img.src = `https://image.tmdb.org/t/p/w200${person.profile_path}`;
      img.alt = person.name;
      img.style.borderRadius = '15px';
      flipCardFront.appendChild(img);
    }
    const flipCardBack = document.createElement('div');
    flipCardBack.className = 'flip-card-back';
    if (person.name) {
      const name = document.createElement('h3');
      name.textContent = person.name;
      flipCardBack.appendChild(name);
      flipCardBack.appendChild(document.createElement('br'));
    }
    const popularity = document.createElement('p');
    popularity.textContent = `Popularity: ${person.popularity}`;
    flipCardBack.appendChild(popularity);
    flipCardBack.appendChild(document.createElement('br'));
    const detailsLink = document.createElement('a');
    detailsLink.href = `/person/${person.id}`;
    detailsLink.className = 'btn1';
    detailsLink.textContent = 'View Details';
    flipCardBack.appendChild(detailsLink);
    flipCardInner.appendChild(flipCardFront);
    flipCardInner.appendChild(flipCardBack);
    flipCard.appendChild(flipCardInner);
    column.appendChild(flipCard);
    row.appendChild(column);
  });
  container.appendChild(row);
  document.body.appendChild(container);
}
// 定义 renderNoResults 函数
function renderNoResults() {
  const noResults = document.createElement('div');
  noResults.className = 'noresult';
  noResults.textContent = 'No Results Found!';
  document.body.appendChild(noResults);
}
// 定义 renderError 函数
function renderError() {
  const errorMessage = document.createElement('h2');
  errorMessage.textContent = 'Something Went Wrong';
  document.body.appendChild(errorMessage);
}
// 在页面加载时调用 fetchPopularPeople
window.addEventListener('load', () => {
  fetchPopularPeople();
});
