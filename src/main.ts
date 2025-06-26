// src/main.ts
import './shoelace-setup'; // Import Shoelace setup first
import './components/app-root';

// Set the theme immediately to avoid flash
const savedTheme = localStorage.getItem('task-flow-theme') || 'system';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = savedTheme === 'dark' || (savedTheme === 'system' && prefersDark);

document.documentElement.classList.add(isDark ? 'sl-theme-dark' : 'sl-theme-light');
document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    appContainer.innerHTML = '<app-root></app-root>';
  }
});

// Remove loading state
window.addEventListener('load', () => {
  const loading = document.querySelector('.app-loading');
  if (loading) {
    loading.classList.add('hidden');
  }
});

