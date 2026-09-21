"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import type { Mesh } from "three";
import { spin } from "@/lib/three";

function Knot() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => spin(ref.current, delta));

  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} scale={1.5}>
        <icosahedronGeometry args={[1.3, 12]} />
        <MeshDistortMaterial
          color="#7c5cff"
          emissive="#4c3bd8"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.6}
          distort={0.35}
          speed={1.6}
        />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} color="#f4d488" />
      <pointLight position={[-5, -3, -2]} intensity={2} color="#7c5cff" />
      <Knot />
      <Environment preset="city" />
    </>
  );
}

export function Hero3D() {
  return (
    <Canvas
      data-testid="hero-canvas"
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      className="h-full w-full"
    >
      <HeroScene />
    </Canvas>
  );
}
