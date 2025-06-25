"use client";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";
import * as THREE from "three";

export default function HeroCamera({children,isMobile}:{
    children: React.ReactNode;
    isMobile: boolean;
}) {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state,delta)=>{
        if(!groupRef.current) return;
        if(!isMobile){
            easing.dampE(groupRef.current.rotation,[state.pointer.y/2,-state.pointer.x/5,0],0.25,delta)
        }else{
            easing.damp3(state.camera.position,[0,0,20],0.25,delta)
        }
    })
    
    return (
        <group ref={groupRef} scale={isMobile ? 0.5 : 1}>
            {children}
        </group>
    )
};
