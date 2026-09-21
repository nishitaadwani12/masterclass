"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { applyRotation } from "@/lib/rotation";

function WireGlobe() {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => applyRotation(ref.current, delta));

  return (
    <group ref={ref}>
      {/* Outer violet wireframe sphere */}
      <mesh>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial color="#7c5cff" wireframe />
      </mesh>
      {/* Soft inner glow */}
      <mesh scale={0.98}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial color="#4c3bd8" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return <WireGlobe />;
}

export function Hero3D() {
  return (
    <Canvas
      data-testid="hero-canvas"
      camera={{ position: [0, 0, 4.6], fov: 50 }}
      dpr={[1, 2]}
      className="h-full w-full"
    >
      <HeroScene />
    </Canvas>
  );
}
