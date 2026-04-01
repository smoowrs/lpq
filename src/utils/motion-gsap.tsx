import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const withGSAP = (Tag: any) => {
  return React.forwardRef(({ 
    initial, animate, whileInView, viewport, transition, 
    whileHover, whileTap, variants, 
    className, children, ...props 
  }: any, ref: any) => {
    const localRef = useRef<any>(null);

    const setRef = (node: any) => {
      localRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    useEffect(() => {
      if (!localRef.current) return;
      const el = localRef.current;

      // 1. Handle whileInView (Scroll Reveal) with native IntersectionObserver for perfect resilience against Lazy Loading images
      if (whileInView) {
        let fromState = initial || { opacity: 0, y: 50 };
        const cleanFrom: any = {};
        
        for (let key in fromState) {
           if (typeof fromState[key] === 'number') {
               cleanFrom[key] = fromState[key];
           } else if (Array.isArray(fromState[key])) {
               cleanFrom[key] = fromState[key][0];
           }
        }

        if (cleanFrom.opacity === 0 && !cleanFrom.rotateX && !cleanFrom.rotateY) {
           cleanFrom.filter = "blur(12px)";
        }

        const cleanTo: any = { ...whileInView };
        for (let key in cleanTo) {
           if (Array.isArray(cleanTo[key])) cleanTo[key] = cleanTo[key][0];
           if (key === 'transition') delete cleanTo[key];
        }

        if (cleanFrom.filter) {
           cleanTo.filter = "blur(0px)";
        }

        const delay = transition?.delay || 0;
        const duration = transition?.duration ? Math.max(transition.duration, 1.2) : 1.2;

        if (Object.keys(cleanFrom).length > 0) {
          gsap.set(el, cleanFrom); // Set immediately to hide it before the observer ticks

          const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
               gsap.to(el, {
                 ...cleanTo,
                 duration: duration,
                 delay: delay,
                 ease: "expo.out",
                 clearProps: "filter"
               });
               
               if (viewport?.once !== false) {
                  observer.disconnect();
               }
            } else if (viewport?.once === false) {
               // Re-hide if scroll back out
               gsap.set(el, cleanFrom);
            }
          }, { 
             rootMargin: viewport?.margin || "0px 0px 50px 0px", 
             threshold: 0 
          });

          observer.observe(el);
          return () => observer.disconnect();
        }
      } 
      // 2. Handle simple infinite animations (like floating)
      else if (animate && transition?.repeat === Infinity) {
        const toState: any = { ...animate };
        if (toState.y && Array.isArray(toState.y)) {
           gsap.to(el, {
              y: toState.y[1], 
              duration: (transition.duration || 3) / 1.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
           });
        }
      }
      // 3. Immediate load animations
      else if (animate && !whileInView) {
         let fromState = initial || { opacity: 0 };
         const cleanFrom: any = {};
         for (let key in fromState) {
           if (typeof fromState[key] === 'number') cleanFrom[key] = fromState[key];
         }
         
         if (cleanFrom.opacity === 0) {
            cleanFrom.filter = "blur(15px)";
            if (cleanFrom.scale === undefined) cleanFrom.scale = 0.95;
         }

         const cleanTo: any = { ...animate };
         if (cleanTo.scale === undefined) cleanTo.scale = 1;

         const duration = transition?.duration ? Math.max(transition.duration, 1.4) : 1.4;
         const delay = transition?.delay || 0.1;
         
         if (cleanFrom.filter) {
            cleanTo.filter = "blur(0px)";
         }

         if (Object.keys(cleanFrom).length > 0) {
           gsap.fromTo(el, cleanFrom, { ...cleanTo, duration, delay, ease: "expo.out", clearProps: "filter,scale" });
         } else {
           gsap.to(el, { ...cleanTo, duration, delay, ease: "expo.out", clearProps: "filter,scale" });
         }
      }

      return () => {
         gsap.killTweensOf(el);
      };
    }, []); // Always empty array to prevent loops!

    const handleMouseEnter = (e: any) => {
      if (whileHover && whileHover.scale) {
        gsap.to(localRef.current, { scale: whileHover.scale, duration: 0.4, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
      }
      if (props.onMouseEnter) props.onMouseEnter(e);
    };
    
    const handleMouseLeave = (e: any) => {
      if (whileHover && whileHover.scale) {
        gsap.to(localRef.current, { scale: 1, duration: 0.3, ease: "back.out(1.7)", overwrite: "auto" });
      }
      if (props.onMouseLeave) props.onMouseLeave(e);
    };

    const handleMouseDown = (e: any) => {
      if (whileTap && whileTap.scale) {
         gsap.to(localRef.current, { scale: whileTap.scale, duration: 0.1, overwrite: "auto" });
      }
      if (props.onMouseDown) props.onMouseDown(e);
    };

    const handleMouseUp = (e: any) => {
      if (whileTap && whileTap.scale) {
         gsap.to(localRef.current, { scale: whileHover && whileHover.scale ? whileHover.scale : 1, duration: 0.3, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
      }
      if (props.onMouseUp) props.onMouseUp(e);
    };

    const { onLayoutAnimationComplete, layout, layoutId, ...cleanProps } = props;

    return (
      <Tag 
        ref={setRef} 
        className={className} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...cleanProps}
      >
        {children}
      </Tag>
    );
  });
};

export const motion = {
  div: withGSAP('div'),
  button: withGSAP('button'),
  img: withGSAP('img'),
  span: withGSAP('span'),
  section: withGSAP('section'),
  p: withGSAP('p'),
  h1: withGSAP('h1'),
  h2: withGSAP('h2'),
  h3: withGSAP('h3'),
  ul: withGSAP('ul'),
  li: withGSAP('li'),
};
