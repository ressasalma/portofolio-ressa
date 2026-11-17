'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const AnimatedContent = ({
  children,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  blur = 0,
  rotate = 0,
  threshold = 0.1,
  delay = 0,
  trigger = 'scroll',
  once = true,
  className = '',
  style,
  ...props
}) => {
  const ref = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const ctx = gsap.context(() => {
      const horizontal = direction === 'horizontal';
      const axis = horizontal ? 'x' : 'y';
      const sign = reverse ? -1 : 1;

      gsap.set(el, { visibility: 'visible' });

      if (reduce) return;

      const from = {
        [axis]: distance * sign,
        scale,
        opacity: animateOpacity ? initialOpacity : 1
      };
      const to = {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease
      };

      if (blur > 0) {
        from.filter = `blur(${blur}px)`;
        to.filter = 'blur(0px)';
      }
      if (rotate) {
        from.rotation = rotate * sign;
        to.rotation = 0;
      }

      const tl = gsap.timeline({ paused: true });
      tl.fromTo(el, from, to, Math.max(delay, 0));

      if (trigger === 'mount') {
        tl.play();
        return;
      }

      const start = `top ${(1 - threshold) * 100}%`;

      ScrollTrigger.create({
        trigger: el,
        start,
        once,
        onEnter: () => tl.play(),
        onLeaveBack: once ? undefined : () => tl.reverse()
      });
    }, el);

    return () => ctx.revert();
  }, [distance, direction, reverse, duration, ease, initialOpacity, animateOpacity, scale, blur, rotate, threshold, delay, trigger, once]);

  return (
    <div ref={ref} className={className} style={{ visibility: 'hidden', ...style }} {...props}>
      {children}
    </div>
  );
};

export default AnimatedContent;
