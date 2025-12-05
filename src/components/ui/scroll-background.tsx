"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function ScrollBackground() {
  const [sections, setSections] = useState<{ top: number; height: number; color: string }[]>([]);
  const { scrollY } = useScroll();

  useEffect(() => {
    const updateSections = () => {
      const elements = document.querySelectorAll("[data-bg-section]");
      if (elements.length === 0) return;

      const newSections = Array.from(elements).map((el) => {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const top = rect.top + scrollTop;
        const height = rect.height;
        const color = el.getAttribute("data-bg-color") || "#ffffff";
        return { top, height, color };
      });
      
      // Sort by top position just in case
      newSections.sort((a, b) => a.top - b.top);
      
      setSections(newSections);
    };

    // Initial update
    updateSections();

    // Update on resize
    window.addEventListener("resize", updateSections);
    
    // Update on mutation (in case content loads and shifts layout)
    const observer = new MutationObserver(updateSections);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener("resize", updateSections);
      observer.disconnect();
    };
  }, []);

  // Calculate input and output ranges for useTransform
  // We want the color to transition such that when the center of the viewport 
  // aligns with the center of a section, the background is that section's color.
  
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 1000;

  const input = sections.map(s => {
    // The point where this section's color should be fully active
    // This is when the center of the section is at the center of the viewport
    // ScrollY + viewportHeight/2 = s.top + s.height/2
    // ScrollY = s.top + s.height/2 - viewportHeight/2
    return s.top + s.height / 2 - viewportHeight / 2;
  });

  const output = sections.map(s => s.color);

  // Fallback if no sections found
  const backgroundColor = useTransform(
    scrollY, 
    input.length > 0 ? input : [0], 
    output.length > 0 ? output : ["#f8fafc"], 
    { clamp: true }
  );

  return (
    <motion.div
      className="fixed inset-0 -z-50 transition-colors"
      style={{ backgroundColor }}
    />
  );
}
