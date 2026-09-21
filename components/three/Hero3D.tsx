"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdditiveBlending, type Points } from "three";
import {
  buildGrid,
  buildGridColors,
  updateWaveField,
} from "@/lib/waveField";

const DIM = 90;
const SEPARATION = 0.11;

function WaveField() {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => buildGrid(DIM, SEPARATION), []);
  const colors = useMemo(() => buildGridColors(DIM, SEPARATION), []);

  useFrame((state) => updateWaveField(ref.current, state.clock.elapsedTime));

  return (
    <points ref={ref} rotation={[-Math.PI / 2.6, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.95}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function HeroScene() {
  return (
    <group>
      <WaveField />
    </group>
  );
}

export function Hero3D() {
  return (
    <Canvas
      data-testid="hero-canvas"
      camera={{ position: [0, 1.1, 3], fov: 60 }}
      dpr={[1, 2]}
      className="h-full w-full"
    >
      <HeroScene />
    </Canvas>
  );
}
