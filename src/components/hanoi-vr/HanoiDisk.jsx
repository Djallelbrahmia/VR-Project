import { useEffect, useRef, useState } from "react";
import { useDisk } from "../../contexts/DiskContext";
import { useController, useXR } from "@react-three/xr";
import { Quaternion, Raycaster, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

function HanoiDisk ({id, position, size, color}){
   
    const { state, moveDisk, selectDisk, releaseDisk,toggleOrbitControl,updateDiskRef } = useDisk();
    const diskRef = useRef();
    useEffect(() => {
      if (diskRef.current) {
        updateDiskRef(id,diskRef)
      }
    }, [diskRef]);

  
    const handlePointerDown = (event) => {
        if (state.selectedDisk !== null && state.selectedDisk !== id) {
            // Ignore interaction if another disk is already selected.
            return;
          }
        selectDisk(id); // Mark this disk as selected.
        toggleOrbitControl(false);
        event.stopPropagation();
      };
    
      const handlePointerMove = (event) => {
        if (state.selectedDisk !== id) return; // Ignore interaction for non-selected disks.

        const newPosition = [event.point.x,event.point.y, position[2]];
        moveDisk(id,newPosition);
      };

      const handlePointerUp = (event) => {
        if (state.selectedDisk !== id) return; // Ignore interaction for non-selected disks.
        selectDisk(null); // Clear the selected disk state.
    
        event.stopPropagation();
        toggleOrbitControl(true);
        releaseDisk(id);
    };
    
    
      return (
        
        <mesh
          name={`disk-${id}`}
          ref={diskRef}
          position={position}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp} z

        >
          <cylinderGeometry args={[size, size, 0.2, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
}
export default HanoiDisk;