// Toggle Sidebar
sidebarToggle.onclick = () => {
  sidebar.classList.toggle('hidden');
  mainContent.classList.toggle('full-width');
}

// Check window size on load
window.addEventListener('load', () => {
  if (window.innerWidth <= 768) {
    sidebar.classList.add('hidden');
    mainContent.classList.add('full-width');
  }
});