"use client";

import { motion, Transition } from "framer-motion";
import React, { useMemo } from "react";

interface SpinningTextProps {
  text: string;
  duration?: number;
  reverse?: boolean;
  radius?: number;
  transition?: Transition;
  className?: string;
  fontSize?: string;
  color?: string;
}

export const SpinningText: React.FC<SpinningTextProps> = ({
  text,
  duration = 10,
  reverse = false,
  radius = 50,
  transition,
  className = "",
  fontSize = "text-base",
  color = "text-foreground",
}) => {
  const letters = useMemo(() => {
    return text.split("").filter((char) => char !== " ");
  }, [text]);

  const defaultTransition: Transition = {
    duration,
    ease: "linear",
    repeat: Infinity,
    ...transition,
  };

  const containerVariants = {
    animate: {
      rotate: reverse ? -360 : 360,
      transition: defaultTransition,
    },
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <motion.div
        className="relative"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
        }}
        variants={containerVariants}
        animate="animate"
      >
        {letters.map((letter, index) => {
          const angle = (360 / letters.length) * index;
          const radian = (angle * Math.PI) / 180;
          // Position sur le cercle (coordonnées par rapport au centre du conteneur)
          // Arrondir à 3 décimales pour éviter les différences d'hydratation
          const x = Math.round(Math.cos(radian) * radius * 1000) / 1000;
          const y = Math.round(Math.sin(radian) * radius * 1000) / 1000;
          // Rotation pour que chaque lettre soit orientée vers l'extérieur du cercle
          const textRotation = Math.round((angle + 90) * 1000) / 1000;

          return (
            <span
              key={`${letter}-${index}`}
              className={`absolute ${fontSize} ${color} font-medium select-none whitespace-nowrap`}
              style={{
                left: `${Math.round((radius + x) * 1000) / 1000}px`,
                top: `${Math.round((radius + y) * 1000) / 1000}px`,
                transform: `translate(-50%, -50%) rotate(${textRotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              {letter}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
};
