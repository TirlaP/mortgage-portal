/**
 * Content Protection Utility for preventing copy/paste/download of sensitive content
 */

export type ProtectionLevel = 'basic' | 'medium' | 'high';

/**
 * Apply content protection to the document by disabling various copy methods
 * @param {ProtectionLevel} level - Protection level: 'basic', 'medium', or 'high'
 */
export const applyContentProtection = (level: ProtectionLevel = 'medium'): void => {
  // Disable right-click context menu on protected elements
  document.addEventListener('contextmenu', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.protected-content')) {
      e.preventDefault();
      return false;
    }
    return true;
  });

  // Disable text selection (medium or high protection)
  if (level === 'medium' || level === 'high') {
    document.addEventListener('selectstart', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.protected-content')) {
        e.preventDefault();
        return false;
      }
      return true;
    });
  }

  // Disable keyboard shortcuts for copy/paste (medium or high protection)
  if (level === 'medium' || level === 'high') {
    document.addEventListener('keydown', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.protected-content')) {
        // Ctrl+C, Cmd+C, Ctrl+P, Cmd+P, etc.
        if ((e.ctrlKey || e.metaKey) && (
          e.key === 'c' || 
          e.key === 'p' || 
          e.key === 's' ||
          e.key === 'a'
        )) {
          e.preventDefault();
          return false;
        }
      }
      return true;
    });
  }

  // Advanced protection (high level only)
  if (level === 'high') {
    // Disable dragging of content
    document.addEventListener('dragstart', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.protected-content')) {
        e.preventDefault();
        return false;
      }
      return true;
    });

    // Monitor for clipboard access attempts
    document.addEventListener('copy', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.protected-content')) {
        e.preventDefault();
        return false;
      }
      return true;
    });

    // Prevent print screen attempts (limited effectiveness)
    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') {
        // Can't really prevent print screen, but can detect it
        console.log('Print screen attempted');
      }
    });
  }
};

/**
 * Add a content protection watermark with user information to deter sharing
 * @param {string} username - Username to display in watermark
 */
export const addWatermark = (username: string): void => {
  const watermark = document.createElement('div');
  watermark.className = 'watermark';
  watermark.innerHTML = `Confidential - ${username} - ${new Date().toLocaleDateString()}`;
  
  // Style the watermark
  watermark.style.position = 'fixed';
  watermark.style.top = '50%';
  watermark.style.left = '50%';
  watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
  watermark.style.fontSize = '2rem';
  watermark.style.color = 'rgba(0, 0, 0, 0.1)';
  watermark.style.pointerEvents = 'none';
  watermark.style.zIndex = '1000';
  watermark.style.whiteSpace = 'nowrap';
  
  document.body.appendChild(watermark);
};

/**
 * Remove content protection features
 */
export const removeContentProtection = (): void => {
  // Remove watermark if it exists
  const watermark = document.querySelector('.watermark');
  if (watermark) {
    watermark.remove();
  }
  
  // Note: Event listeners added via addEventListener cannot be easily removed
  // unless references to the original functions are saved
  // To properly remove protection, page reload is typically required
};