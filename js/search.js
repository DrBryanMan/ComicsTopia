
// Toggle Search Modal
const searchButton = document.getElementById('searchButton');
const searchModal = document.getElementById('searchModal');
const closeModal = document.getElementById('closeModal');

searchButton.addEventListener('click', () => {
  searchModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
  searchModal.classList.remove('active');
});

// Close Modal when clicking outside
searchModal.addEventListener('click', (e) => {
  if (e.target === searchModal) {
    searchModal.classList.remove('active');
  }
});