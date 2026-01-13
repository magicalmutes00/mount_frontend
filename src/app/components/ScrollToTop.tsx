import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page when the route changes.
 * This component should be placed inside BrowserRouter to work properly.
 * 
 * Features:
 * - Triggers on pathname changes (route navigation)
 * - Uses smooth scrolling with accessibility respect
 * - No external dependencies required
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check if user prefers reduced motion for accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Scroll to top with smooth behavior (unless user prefers reduced motion)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }, [pathname]); // Trigger when pathname changes

  // This component doesn't render anything
  return null;
};