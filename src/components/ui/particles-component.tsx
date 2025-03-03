"use client";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";

type ParticlesComponentProps = {
  id: string;
  options: any;
  particlesLoaded: (container?: Container) => Promise<void>;
};

const ParticlesComponent = ({ id, options, particlesLoaded }: ParticlesComponentProps) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initEngine = async () => {
      await initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      });
      setInitialized(true);
    };

    initEngine();
  }, []);

  if (!initialized) return <div className="h-full w-full" />;

  return (
    <Particles
      id={id}
      className={cn("h-full w-full")}
      particlesLoaded={particlesLoaded}
      options={options}
    />
  );
};

export default ParticlesComponent; 