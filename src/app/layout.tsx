import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

// Suppress hydration warnings in development
const suppressHydrationWarning = process.env.NODE_ENV === 'development'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Optimize font loading
  preload: true,
  fallback: ['system-ui', 'sans-serif']
})

export const metadata: Metadata = {
  title: 'Thami Mvelase | AI & Full-Stack Developer',
  description: 'Portfolio of Thami Mvelase, an AI and Full-Stack Developer specializing in AI-powered applications and modern web development.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning={suppressHydrationWarning}>
      <head>
        {/* Preload critical assets */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Add DNS prefetching for external resources */}
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://linkedin.com" />
        
        {/* Meta tag to help with Grammarly extension issues */}
        <meta name="grammarly-disable" content="true" />
      </head>
      <body className="antialiased">
        {children}
        
        {/* Script to handle hydration errors */}
        <Script id="handle-hydration-errors" strategy="afterInteractive">
          {`
            (function() {
              // Handle Grammarly extension attributes that cause hydration issues
              function removeGrammarlyAttributes() {
                const elements = document.querySelectorAll('[data-gr-ext-installed], [data-new-gr-c-s-check-loaded], [data-gr-ext-disabled]');
                elements.forEach(el => {
                  el.removeAttribute('data-gr-ext-installed');
                  el.removeAttribute('data-new-gr-c-s-check-loaded');
                  el.removeAttribute('data-gr-ext-disabled');
                });
              }
              
              // Run immediately and set up a mutation observer
              removeGrammarlyAttributes();
              
              const observer = new MutationObserver(() => {
                removeGrammarlyAttributes();
              });
              
              observer.observe(document.body, {
                attributes: true,
                subtree: true,
                attributeFilter: ['data-gr-ext-installed', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-disabled']
              });
              
              // Suppress hydration warnings in console
              const originalConsoleError = console.error;
              console.error = function(...args) {
                if (
                  typeof args[0] === 'string' && 
                  (args[0].includes('Warning: Text content did not match') ||
                   args[0].includes('Warning: Expected server HTML to contain') ||
                   args[0].includes('Hydration failed because'))
                ) {
                  return;
                }
                return originalConsoleError.apply(console, args);
              };
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
