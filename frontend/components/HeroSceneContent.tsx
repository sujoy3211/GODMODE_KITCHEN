"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";

const INGREDIENT_COLORS = ["#22C57D", "#D6A253", "#E2725B", "#F3F1EA", "#22C57D", "#D6A253", "#22C57D"];

function GlassBowl() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.5, 2]} />
      <meshPhysicalMaterial
        color="#0F6B44"
        transmission={0.92}
        roughness={0.08}
        thickness={1.4}
        ior={1.35}
        clearcoat={1}
        clearcoatRoughness={0.1}
        emissive="#22C57D"
        emissiveIntensity={0.06}
      />
    </mesh>
  );
}

function OrbitingIngredients() {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(
    () =>
      INGREDIENT_COLORS.map((color, i) => {
        const angle = (i / INGREDIENT_COLORS.length) * Math.PI * 2;
        const radius = 2.6 + (i % 2) * 0.35;
        return {
          color,
          radius,
          angle,
          y: Math.sin(i * 1.7) * 0.6,
          speed: 0.06 + (i % 3) * 0.015,
          size: 0.14 + (i % 3) * 0.03,
        };
      }),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const item = items[i];
      const t = state.clock.elapsedTime * item.speed + item.angle;
      child.position.set(Math.cos(t) * item.radius, item.y + Math.sin(t * 1.3) * 0.15, Math.sin(t) * item.radius);
    });
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <mesh key={i}>
          <sphereGeometry args={[item.size, 20, 20]} />
          <meshStandardMaterial
            color={item.color}
            emissive={item.color}
            emissiveIntensity={0.4}
            roughness={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

function MouseTilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  useFrame((state) => {
    if (!ref.current) return;
    const target = {
      x: (state.pointer.y * Math.PI) / 24,
      y: (state.pointer.x * Math.PI) / 20,
    };
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, target.x, 0.04);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, target.y, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroSceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#22C57D" />
      <pointLight position={[-4, -2, -3]} intensity={20} color="#D6A253" />
      <directionalLight position={[0, 5, 5]} intensity={0.6} />

      <MouseTilt>
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
          <GlassBowl />
        </Float>
        <OrbitingIngredients />
      </MouseTilt>

      <Sparkles count={40} scale={[3.5, 3, 3.5]} size={2} speed={0.25} opacity={0.35} color="#F3F1EA" />
    </>
  );
}
