"use client";
import React, { useId, useMemo, lazy, Suspense } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

// Lazy load the heavy tsparticles components
const ParticlesComponent = lazy(() => import("./particles-component"));

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  
  const [init, setInit] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  useEffect(() => {
    // Delay initialization to improve initial page load
    const timer = setTimeout(() => {
      setInit(true);
    }, 500);

    // Set up intersection observer to only render when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(id || generatedId);
    if (element) {
      observer.observe(element);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [id, generatedId]);

  const particlesLoaded = async () => {
    controls.start({
      opacity: 1,
      transition: {
        duration: 1,
      },
    });
  };

  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => ({
    background: {
      color: {
        value: background || "#0d47a1",
      },
    },
    fullScreen: {
      enable: false,
      zIndex: 1,
    },
    fpsLimit: 30, // Reduced from 120 for better performance
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: false, // Disabled hover for better performance
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 2, // Reduced from 4
        },
      },
    },
    particles: {
      number: {
        density: {
          enable: true,
          width: 400,
          height: 400,
        },
        value: particleDensity ? Math.floor(particleDensity * 0.7) : 80, // Reduced by 30%
      },
      opacity: {
        value: {
          min: 0.1,
          max: 1,
        },
        animation: {
          enable: true,
          speed: speed || 4,
          decay: 0,
          sync: false,
          startValue: "random",
        },
      },
      size: {
        value: {
          min: minSize || 1,
          max: maxSize || 3,
        },
      },
      move: {
        enable: true,
        speed: {
          min: 0.1,
          max: 0.8, // Reduced from 1
        },
        direction: "none",
        random: false,
        straight: false,
        outModes: {
          default: "out",
        },
      },
    },
    detectRetina: false, // Disable retina detection for performance
  }), [background, minSize, maxSize, speed, particleColor, particleDensity]);

  return (
    <motion.div 
      id={id || generatedId}
      animate={controls} 
      className={cn("opacity-0", className)}
    >
      {init && isVisible && (
        <Suspense fallback={<div className="h-full w-full" />}>
          <ParticlesComponent 
            id={id || generatedId}
            options={options}
            particlesLoaded={particlesLoaded}
          />
        </Suspense>
      )}
    </motion.div>
  );
}; 