"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Stars } from "@react-three/drei"
import type { Group } from "three"

export default function CanvasScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        gl={{ antialias: false }}
        camera={{ position: [4, 3.5, 6], fov: 40 }}
        style={{ width: "100%", height: "100%", imageRendering: "pixelated" as any }}
      >
        <color attach="background" args={["#10061f"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.1} color="#ffe17d" />
        <Stars radius={45} depth={22} count={280} factor={4} saturation={0} fade speed={0.4} />
        <ParallaxLayers />
        <PixelLandscape />
      </Canvas>
    </div>
  )
}

function ParallaxLayers() {
  const near = useRef<Group | null>(null)
  const mid = useRef<Group | null>(null)
  const far = useRef<Group | null>(null)
  const { viewport } = useThree()

  useFrame((state) => {
    const x = state.pointer.x // -1..1
    const y = state.pointer.y
    if (near.current) near.current.position.set(x * 0.25, y * 0.15, 0)
    if (mid.current) mid.current.position.set(x * 0.15, y * 0.08, -0.2)
    if (far.current) far.current.position.set(x * 0.08, y * 0.04, -0.4)
  })

  return (
    <group position={[0, -0.2, -0.5]}>
      <group ref={far}>
        <mesh position={[-2.2, 0.2, -1.2]} scale={[2.8, 0.15, 1.4]}>
          <boxGeometry />
          <meshStandardMaterial color="#1a0f2e" />
        </mesh>
        <mesh position={[2.6, -0.1, -1.6]} scale={[1.8, 0.12, 1.1]}>
          <boxGeometry />
          <meshStandardMaterial color="#1a0f2e" />
        </mesh>
      </group>
      <group ref={mid}>
        <mesh position={[-1.6, 0.05, -0.8]} scale={[1.2, 0.4, 1.2]}>
          <boxGeometry />
          <meshStandardMaterial color="#332756" />
        </mesh>
        <mesh position={[1.4, 0.02, -1.1]} scale={[1, 0.35, 1]}>
          <boxGeometry />
          <meshStandardMaterial color="#2d1f49" />
        </mesh>
      </group>
      <group ref={near}>
        <mesh position={[0.8, -0.1, -0.4]} scale={[0.6, 0.25, 0.6]}>
          <boxGeometry />
          <meshStandardMaterial color="#50337f" />
        </mesh>
      </group>
    </group>
  )
}

// Landscape base with floating cube
function PixelLandscape() {
  const group = useRef<Group | null>(null)

  const blocks = useMemo(
    () => [
      { position: [-1.6, -0.15, -1.2] as [number, number, number], scale: [1.3, 0.6, 1.3] as [number, number, number], color: "#ff6584" },
      { position: [1.4, -0.05, -1.4] as [number, number, number], scale: [1.1, 0.5, 1.1] as [number, number, number], color: "#8fff65" },
      { position: [-0.4, 0.3, 1.8] as [number, number, number], scale: [0.8, 1.2, 0.8] as [number, number, number], color: "#98c8ff" },
      { position: [-1.9, 0.25, 1] as [number, number, number], scale: [0.6, 1.4, 0.6] as [number, number, number], color: "#ffe17d" },
      { position: [0.9, 0.15, 0.6] as [number, number, number], scale: [0.9, 0.9, 0.9] as [number, number, number], color: "#ff9a62" },
    ],
    []
  )

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18
    }
  })

  return (
    <group ref={group} position={[0, -0.3, 0]} rotation={[0.3, 0.4, 0]}>
      <mesh position={[0, -0.9, 0]} scale={[4.8, 0.3, 4.8]} receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color="#201537" />
      </mesh>
      {blocks.map((block, index) => (
        <mesh key={index} position={block.position} scale={block.scale} castShadow receiveShadow>
          <boxGeometry />
          <meshStandardMaterial color={block.color as any} />
        </mesh>
      ))}
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.7}>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial color="#ffe17d" emissive="#ff9a62" emissiveIntensity={0.45} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[2.2, 0.18, 2.2]} />
          <meshStandardMaterial color="#2d1f49" />
        </mesh>
      </Float>
      <mesh position={[1.9, 0.1, 1.6]} scale={[0.3, 1.4, 0.3]}>
        <boxGeometry />
        <meshStandardMaterial color="#8fff65" />
      </mesh>
      <mesh position={[1.9, 1.2, 1.6]} scale={[0.5, 0.3, 0.5]}>
        <boxGeometry />
        <meshStandardMaterial color="#59f6bc" />
      </mesh>
    </group>
  )
}
