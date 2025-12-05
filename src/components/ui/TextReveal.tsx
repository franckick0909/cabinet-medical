"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  type?: "lines" | "words" | "chars";
  mask?: boolean;
}

export default function TextReveal({ children, className, delay = 0, type = "lines", mask = true }: TextRevealProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const text = textRef.current;
    if (!text) return;

    // Split text
    const split = new SplitType(text, { 
        types: type,
        // If masking, we might want to ensure lines are wrapped properly if using lines type
        // But SplitType default usually works. We'll handle the animation part.
    });
    
    // If mask is true, we need to wrap the elements (lines/words) in a parent with overflow: hidden
    // SplitType doesn't do this by default for 'lines' in a way that preserves the line as the wrapper.
    // It creates .line elements. We can animate the .line inner content if we wrap it, 
    // OR simpler: just set overflow-hidden on the split elements if possible, but that cuts off descenders.
    // Standard approach: Wrap content in a div with overflow-hidden.
    
    if (mask && (type === "lines" || type === "words")) {
        // Wrap each split element in a container with overflow hidden
        const elements = split[type];
        elements?.forEach(el => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.display = 'inline-block'; // or block depending on context
            if (type === 'lines') {
                wrapper.style.display = 'block';
                // Fix for descenders being cut off
                wrapper.style.paddingBottom = '0.2em';
                wrapper.style.marginBottom = '-0.2em';
            }
            
            el.parentNode?.insertBefore(wrapper, el);
            wrapper.appendChild(el);
        });
    }

    // Animation
    gsap.fromTo(
      split[type] || text,
      { 
        y: mask ? "100%" : 50, 
        opacity: mask ? 1 : 0, // If masked, we don't necessarily need opacity fade, but can keep it
        rotateX: mask ? 0 : -20
      },
      {
        y: "0%",
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: "power4.out",
        delay: delay,
        scrollTrigger: {
          trigger: text,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
        split.revert();
    }
  }, { scope: textRef });

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
