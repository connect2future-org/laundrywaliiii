import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useScrollReveal = (options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !elementRef.current) return;

    const el = elementRef.current;
    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: options.y || 24,
        scale: options.scale || 1
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: options.duration || 0.7,
        delay: options.delay || 0,
        ease: options.ease || 'power2.out'
      }
    );
  }, [options.y, options.scale, options.duration, options.delay, options.ease]);

  return elementRef;
};

