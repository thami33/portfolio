'use client';

import { useEffect, useState, useRef } from 'react';
import { throttle } from 'lodash';

/**
 * Smooth scrolls to a specific element by ID
 */
export function scrollToElement(elementId: string, offset: number = 0) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  
  window.scrollTo({
    top: elementPosition - offset,
    behavior: 'smooth'
  });
}

/**
 * Hook to handle section-based scrolling
 * @param sectionIds Array of section IDs in order
 * @param options Configuration options
 */
export function useSectionScroll(
  sectionIds: string[],
  options: {
    offset?: number;
    scrollThreshold?: number;
    scrollCooldown?: number;
    touchThreshold?: number;
    onlyInHero?: boolean;
  } = {}
) {
  const {
    offset = 0,
    scrollThreshold = 50,
    scrollCooldown = 1000,
    touchThreshold = 50,
    onlyInHero = true,
  } = options;
  
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollTime = useRef(0);
  const touchStartY = useRef(0);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Function to determine which section is currently in view
    const determineActiveSection = throttle(() => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (!section) continue;
        
        const sectionTop = section.offsetTop;
        if (scrollPosition >= sectionTop) {
          setActiveSection(i);
          return;
        }
      }
      
      // If we're above all sections, set the first one as active
      setActiveSection(0);
    }, 100);
    
    // Function to scroll to the next/previous section
    const scrollToNextSection = (direction: 1 | -1) => {
      // Skip if we're already scrolling
      if (isScrolling) return false;
      
      // Only apply section-based scrolling in the hero section if onlyInHero is true
      if (onlyInHero && activeSection !== 0) {
        return false;
      }
      
      // Implement cooldown to prevent rapid scrolling
      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) return false;
      lastScrollTime.current = now;
      
      // Calculate next section
      const nextSection = Math.max(0, Math.min(sectionIds.length - 1, activeSection + direction));
      
      if (nextSection !== activeSection) {
        setIsScrolling(true);
        scrollToElement(sectionIds[nextSection], offset);
        
        // Update active section
        setActiveSection(nextSection);
        
        // Reset scrolling state after animation completes
        setTimeout(() => {
          setIsScrolling(false);
        }, scrollCooldown);
        
        return true;
      }
      
      return false;
    };
    
    // Handle wheel events for section-based scrolling
    const handleWheel = (e: WheelEvent) => {
      // Skip if the scroll is too small
      if (Math.abs(e.deltaY) < scrollThreshold) return;
      
      // Only apply section-based scrolling in the hero section if onlyInHero is true
      if (onlyInHero && activeSection !== 0) {
        return;
      }
      
      // Determine scroll direction
      const direction = e.deltaY > 0 ? 1 : -1;
      
      // Try to scroll to next section
      if (scrollToNextSection(direction)) {
        // Prevent default scrolling if we handled it
        e.preventDefault();
      }
    };
    
    // Handle touch events for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      // Only apply section-based scrolling in the hero section if onlyInHero is true
      if (onlyInHero && activeSection !== 0) {
        return;
      }
      
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;
      
      // Skip if the touch movement is too small
      if (Math.abs(deltaY) < touchThreshold) return;
      
      // Determine swipe direction
      const direction = deltaY > 0 ? 1 : -1;
      
      // Try to scroll to next section
      scrollToNextSection(direction);
    };
    
    // Set up event listeners
    window.addEventListener('scroll', determineActiveSection);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Initial determination
    determineActiveSection();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', determineActiveSection);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sectionIds, activeSection, isScrolling, offset, scrollThreshold, scrollCooldown, touchThreshold, onlyInHero]);
  
  return {
    activeSection,
    scrollToSection: (index: number) => {
      if (index >= 0 && index < sectionIds.length) {
        scrollToElement(sectionIds[index], offset);
        setActiveSection(index);
      }
    }
  };
} 