// src/main.ts
import './shoelace-setup'; // Import Shoelace setup first
import './components/app-root';

// Debug logging function
function debugLog(message: string) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[Main] [${timestamp}] ${message}`);
}

debugLog('🚀 Main.ts starting');

// Set the theme immediately to avoid flash
const savedTheme = localStorage.getItem('task-flow-theme') || 'system';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = savedTheme === 'dark' || (savedTheme === 'system' && prefersDark);

debugLog(`🎨 Setting theme: ${savedTheme} (isDark: ${isDark})`);

document.documentElement.classList.add(isDark ? 'sl-theme-dark' : 'sl-theme-light');
document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  debugLog('📄 DOM Content Loaded');
  
  const appContainer = document.getElementById('app');
  const loadingElement = document.querySelector('.app-loading');
  
  debugLog(`📦 App container found: ${!!appContainer}`);
  debugLog(`⏳ Loading element found: ${!!loadingElement}`);
  
  if (appContainer) {
    debugLog('🔧 Replacing loading content with app-root');
    appContainer.innerHTML = '<app-root></app-root>';
    
    // Remove loading state immediately after app-root is added
    if (loadingElement) {
      debugLog('✅ Removing loading element');
      loadingElement.remove();
    }
  } else {
    debugLog('❌ App container not found!');
  }
});

// Backup: Remove loading state on window load as well
window.addEventListener('load', () => {
  debugLog('🌍 Window loaded');
  
  const loading = document.querySelector('.app-loading');
  if (loading) {
    debugLog('🧹 Cleaning up any remaining loading elements');
    loading.classList.add('hidden');
    
    // Force remove after a short delay
    setTimeout(() => {
      if (loading.parentNode) {
        loading.remove();
        debugLog('🗑️ Force removed loading element');
      }
    }, 100);
  }
});

// Additional safety check - remove loading after a maximum timeout
setTimeout(() => {
  const loading = document.querySelector('.app-loading');
  if (loading) {
    debugLog('⚠️ Emergency cleanup: removing loading element after timeout');
    loading.remove();
  }
}, 3000); // 3 seconds max

debugLog('✅ Main.ts setup complete');

