'use client';

/**
 * Utility to suppress React hydration errors in the console
 * This is useful when you have browser extensions that modify the DOM
 * before React hydration occurs (like Grammarly, LastPass, etc.)
 */
export function suppressHydrationErrors() {
  if (typeof window !== 'undefined') {
    // Store the original console.error
    const originalConsoleError = console.error;
    
    // Override console.error to filter out hydration warnings
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' && 
        (
          args[0].includes('Warning: Text content did not match') ||
          args[0].includes('Warning: Expected server HTML to contain') ||
          args[0].includes('Hydration failed because') ||
          args[0].includes('data-gr-ext-installed') ||
          args[0].includes('data-new-gr-c-s-check-loaded') ||
          args[0].includes('data-gr-ext-disabled')
        )
      ) {
        // Ignore these specific hydration errors
        return;
      }
      
      // Call the original console.error for other errors
      originalConsoleError.apply(console, args);
    };
    
    // Clean up Grammarly attributes that cause hydration issues
    const removeGrammarlyAttributes = () => {
      const elements = document.querySelectorAll(
        '[data-gr-ext-installed], [data-new-gr-c-s-check-loaded], [data-gr-ext-disabled]'
      );
      
      elements.forEach(el => {
        el.removeAttribute('data-gr-ext-installed');
        el.removeAttribute('data-new-gr-c-s-check-loaded');
        el.removeAttribute('data-gr-ext-disabled');
      });
    };
    
    // Run immediately
    removeGrammarlyAttributes();
    
    // Set up a mutation observer to catch any new Grammarly attributes
    const observer = new MutationObserver(() => {
      removeGrammarlyAttributes();
    });
    
    // Start observing the document
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: [
        'data-gr-ext-installed',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-disabled'
      ]
    });
    
    // Return a cleanup function
    return () => {
      console.error = originalConsoleError;
      observer.disconnect();
    };
  }
  
  // Return a no-op function for SSR
  return () => {};
} 