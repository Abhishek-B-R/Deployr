"use client";
import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Model from "./model";
import { Suspense } from "react";
import CanvasLoader from "./CanvasLoader";
// import { Leva, useControls } from "leva";
import { useMediaQuery } from "react-responsive";
import HeroCamera from "./HeroCamera";

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
    const isMobile = useMediaQuery({maxWidth: 800});

    return (
        <section className="min-h-screen w-full flex flex-col relative px-10">
            <div className="w-full h-full absolute inset-0">
                {/* <Leva/> */}
                <Canvas className="w-full h-full overflow-hidden" style={{ imageRendering: "pixelated" }}>
                    <Suspense fallback={<CanvasLoader/>}>
                        <PerspectiveCamera makeDefault position={[0,0,30]}/>
                        <HeroCamera isMobile={isMobile} >
                            <Model 
                                scale={isMobile?1:1.3}
                                // scale={isMobile?5:6}
                                position={[-2.5,isMobile?7:1,isMobile?3:0]} 
                                rotation={[0.25,1.5,0]} 
                            />
                        </HeroCamera>
                        <ambientLight intensity={1}/>
                        <directionalLight position={[10, 10, 10]} intensity={0.5} />
                    </Suspense>
                </Canvas>
            </div>
        </section>
    )
};
