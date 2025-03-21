'use strict';
document.addEventListener('DOMContentLoaded', () => {
  console.log('JavaScript Loaded');
  const selectElement = document.getElementById('search-type');
  if (selectElement) {
    console.log('Select element found:', selectElement);
    let currentSearchType = selectElement.value;
    console.log('Initial value of search-type:', currentSearchType);
    selectElement.addEventListener('change', () => {
      console.log('Dropdown changed!');
      currentSearchType = selectElement.value;
      console.log('Selected search type:', currentSearchType);
    });
  } else {
    console.log("Dropdown element with id 'search-type' not found!");
  }
});
