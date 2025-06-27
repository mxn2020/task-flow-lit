// src/shoelace-setup.ts
// Import CSS themes via JS file to avoid TypeScript issues
import './shoelace-css.js';

// Set up icon library path for Shoelace
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

// Set the base path to the CDN for icons
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/');

// Import all commonly used Shoelace components
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';

// Set base path for icons - use CDN for better reliability
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/');

// Export for convenience
export * from '@shoelace-style/shoelace/dist/components/button/button.js';
export * from '@shoelace-style/shoelace/dist/components/icon/icon.js';
export * from '@shoelace-style/shoelace/dist/components/input/input.js';
export * from '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
export * from '@shoelace-style/shoelace/dist/components/select/select.js';
export * from '@shoelace-style/shoelace/dist/components/option/option.js';
export * from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';

