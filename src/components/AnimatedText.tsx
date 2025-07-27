"use client";

import React from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

type AnimatedTextProps = {
  text: string;
  className?: string;
};

export default function AnimatedText({ text, className }: AnimatedTextProps) {
  // This hook detects when the component is in view
  const { ref, inView } = useInView({
    triggerOnce: true, // The animation will only play once
    threshold: 0.1,    // Trigger when 10% of the element is visible
  });

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, index) => (
        <span key={index} className="inline-block">
          {word.split("").map((char, charIndex) => (
            <span
              key={charIndex}
              className={cn(
                "inline-block opacity-0",
                inView && "motion-safe:animate-fade-in-up"
              )}
              style={{
                animationDelay: `${(index * 0.05) + (charIndex * 0.01)}s`,
                animationFillMode: 'forwards'
              }}
            >
              {char}
            </span>
          ))}
          {/* Add a space after each word */}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </p>
  );
}