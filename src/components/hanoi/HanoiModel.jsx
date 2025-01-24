import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import HanoiDisk from "./HanoiDisk";
import { useDisk } from "../../contexts/DiskContext";

function HanoiModel(){
    const {state} =useDisk()
    
    return (<>   
       {state.orbitControl && <OrbitControls/>}
        <ambientLight/>
        <HanoiTower/>
        
        {state?.disks.map((disk) => (
        <HanoiDisk
          key={disk.id}
          {...disk}
        />
      ))}
      </> ) 
}
export default HanoiModel;


function HanoiTower(){
    return (  
    <group>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[6, 0.5, 2]} />
          <meshStandardMaterial color="brown" />
        </mesh>
  
        <mesh position={[-2, 1.25, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 2.5, 32]} />
          <meshStandardMaterial color="gray" />
        </mesh>
  
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 2.5, 32]} />
          <meshStandardMaterial color="gray" />
        </mesh>
  
        <mesh position={[2, 1.25, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 2.5, 32]} />
          <meshStandardMaterial color="gray" />
        </mesh>
    </group>)
}