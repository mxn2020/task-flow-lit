// src/main.ts
import './shoelace-setup'; // Import Shoelace setup first
import './components/app-root'; // Use the app root

// Debug logging function
function debugLog(message: string) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[Main] [${timestamp}] ${message}`);
}

debugLog('🚀 Main.ts starting with app root');

// Set the theme immediately to avoid flash
const savedTheme = localStorage.getItem('task-flow-theme') || 'system';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = savedTheme === 'dark' || (savedTheme === 'system' && prefersDark);

debugLog(`🎨 Setting theme: ${savedTheme} (isDark: ${isDark})`);

document.documentElement.classList.add(isDark ? 'sl-theme-dark' : 'sl-theme-light');
document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

// Initialize app immediately
document.addEventListener('DOMContentLoaded', () => {
  debugLog('📄 DOM Content Loaded');
  
  const appContainer = document.getElementById('app');
  const loadingElement = document.querySelector('.app-loading');
  
  debugLog(`📦 App container found: ${!!appContainer}`);
  debugLog(`⏳ Loading element found: ${!!loadingElement}`);
  
  if (appContainer) {
    debugLog('🔧 Replacing loading content with app-root');
    
    // Remove the HTML loading state immediately
    if (loadingElement) {
      debugLog('✅ Removing HTML loading element immediately');
      loadingElement.remove();
    }
    
    // Replace with the app root
    appContainer.innerHTML = '<app-root></app-root>';
    
    debugLog('🎯 App root mounted successfully');
  } else {
    debugLog('❌ App container not found!');
  }
});

// Backup cleanup - shouldn't be needed with version
window.addEventListener('load', () => {
  debugLog('🌍 Window loaded - performing backup cleanup');
  
  const loading = document.querySelector('.app-loading');
  if (loading) {
    debugLog('🧹 Backup cleanup: removing any remaining loading elements');
    loading.remove();
  }
});

debugLog('✅ Main.ts setup complete with router');

