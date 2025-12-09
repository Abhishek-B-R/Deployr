"use client";
import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Model from "./model";
import { Suspense } from "react";
import CanvasLoader from "./CanvasLoader";
// import { Leva, useControls } from "leva";
import { useMediaQuery } from "react-responsive";
import HeroCamera from "./HeroCamera";
import { Maximize, Minus, X } from "lucide-react";

export default function ModelRender() {
  // const x = useControls({
  //     "scale": {
  //         value: 0.08,
  //         min: 0,
  //         max: 20
  //     },
  //     "positionX": {
  //         value: 2.5,
  //         min: -20,
  //         max: 20
  //     },
  //     "positionY": {
  //         value: 2.5,
  //         min: -20,
  //         max: 20
  //     },
  //     "positionZ": {
  //         value: 2.5,
  //         min: -20,
  //         max: 20
  //     },
  //     "rotationX": {
  //         value: 2.5,
  //         min: -20,
  //         max: 20
  //     },
  //     "rotationY": {
  //         value: 2.5,
  //         min: -20,
  //         max: 20
  //     },
  //     "rotationZ": {
  //         value: 2.5,
  //         min: -20,
  //         max: 20
  //     }
  // })
  const isMobile = useMediaQuery({ maxWidth: 800 });

  return (
    <div className="relative w-full h-full">
      <div className="bg-neo-bg border-4 border-neo-black shadow-neo-lg h-[420px] sm:h-[520px] md:h-[600px] flex flex-col">
        <div className="h-10 border-b-4 border-neo-black bg-white flex items-center justify-between px-3 select-none">
          <div />

          <div className="font-mono font-bold text-sm tracking-tighter bg-neo-yellow text-black px-2 border-x-2 border-black">
            ENGINEER-MODEL.exe
          </div>

          <div className="flex gap-1">
            <div className="w-1 h-4 bg-black"></div>
            <div className="w-1 h-4 bg-black"></div>
            <div className="w-1 h-4 bg-black"></div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-grid-pattern overflow-hidden">
          {/* Background Grid CSS would go in globals, simulating here with inline style or class */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          {/* <Leva/> */}
          <Canvas className="w-full h-full overflow-hidden">
            <Suspense fallback={<CanvasLoader />}>
              <PerspectiveCamera makeDefault position={[0, 0, 30]} />
              <HeroCamera isMobile={isMobile}>
                <Model
                  scale={isMobile ? 1.4 : 1.9}
                  position={[isMobile ? 0 : -5, isMobile ? -2 : -5, isMobile ? 0 : 0]}
                  rotation={[0.25, 1.5, 0]}
                />
              </HeroCamera>
              <ambientLight intensity={1} />
              <directionalLight position={[10, 10, 10]} intensity={0.5} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
