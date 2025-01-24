import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Raycaster, Vector3, Quaternion,BufferGeometry, Float32BufferAttribute } from "three";
import { useXR } from "@react-three/xr";
import { useDisk } from "../../contexts/DiskContext";

function RaycasterVisualizer() {

  const { controllers } = useXR();
  const raycaster = useRef(new Raycaster());
  const lastPosition = useRef(new Vector3());
  const lastQuaternion = useRef(new Quaternion());
  const lineRef = useRef();
  const { state, moveDisk, selectDisk, releaseDisk,toggleOrbitControl,updateDiskRef } = useDisk();
  const { scene } = useThree();
  const isBtnPressedRef = useRef(false);
  const selectedDiskRef = useRef(null); // Store the currently selected disk
  const [updateCount, setUpdateCount] = useState(0);



  useEffect(() => {
    // Define event handlers
    const handleSelectStart = (event) => {
              isBtnPressedRef.current = true; 
    };

    const handleSelectEnd = (event) => {
      console.log("Select button released:", event.target);
      isBtnPressedRef.current = false; 
      toggleOrbitControl(true);
      if(selectedDiskRef.current) releaseDisk(selectedDiskRef.current)
      selectedDiskRef.current = null; // Release the disk
      // Add your logic here for when the button is released
    };

    // Attach event listeners to controllers
    controllers.forEach((controller) => {
      controller.controller.addEventListener("selectstart", handleSelectStart);
      controller.controller.addEventListener("selectend", handleSelectEnd);
    });

    // Cleanup event listeners when component unmounts or controllers change
    return () => {
      controllers.forEach((controller) => {
        controller.controller.removeEventListener("selectstart", handleSelectStart);
        controller.controller.removeEventListener("selectend", handleSelectEnd);
      });
    };
  }, [controllers]);

  useEffect(() => {
    if (updateCount < 3) {
      const interval = setInterval(() => {
        console.log(`Execution #${updateCount + 1}`);

        // Update state.diskRefs
        state.diskRefs = scene.children.filter(child => child.isMesh);
        console.log("Updated state.diskRefs:", state.diskRefs);

        setUpdateCount(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [updateCount, scene]); // Dependencies ensure re-execution




  useEffect(() => {
    // Define geometry points for the line
    const points = new Float32Array([
      -1, 0, 2,  // Start point
      1, 2, 0,  // End point
    ]);

    // Create geometry and set the position attribute
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(points, 3));

    // Assign the geometry to the line
    if (lineRef.current) {
      lineRef.current.geometry = geometry;
    }
  }, []);
  useFrame(() => {

    if (controllers.length > 0) {
      const controller = controllers[0];

      const currentPosition = controller.controller.position;
      const currentQuaternion = controller.controller.quaternion;

      // Only update if the position or rotation has changed
      if (
        !lastPosition.current.equals(currentPosition) ||
        !lastQuaternion.current.equals(currentQuaternion)
      ) {
        const origin = new Vector3().copy(currentPosition);
        const direction = new Vector3(0, 0, -1).applyQuaternion(currentQuaternion);

        // Update the raycaster
        raycaster.current.set(origin, direction);
        const intersects = raycaster.current.intersectObjects(state.diskRefs, true);
        console.log(intersects)
        if (intersects.length > 0) {
            const intersectedDisk = intersects[0].object;
            const diskName = intersectedDisk.name || "Unnamed";
            console.log("Intersected disk:", diskName);
            const diskId = parseInt(diskName.split('-')[1], 10);
            console.log("Intersected disk ID:", diskId);
            const intersectionPoint = intersects[0].point;
            
 
            if (isBtnPressedRef.current) {
                if (selectedDiskRef.current === null) {
                    // Detect disk intersection if no disk is selected
                    const intersects = raycaster.current.intersectObjects(state.diskRefs, true);
                    if (intersects.length > 0) {
                      const intersectedDisk = intersects[0].object;
                      const diskName = intersectedDisk.name || "Unnamed";
                      const diskId = parseInt(diskName.split("-")[1], 10);
          
                      selectedDiskRef.current = diskId; // Mark the disk as selected
                      toggleOrbitControl(false);
                    }
                  } else {
                    // Move the selected disk
                    const intersects = raycaster.current.intersectObjects(state.diskRefs, true);
                    if (intersects.length > 0) {
                      const intersectionPoint = intersects[0].point;
                      const diskId = selectedDiskRef.current;
                      const newPosition = [intersectionPoint.x, intersectionPoint.y, -8];
                      moveDisk(diskId, newPosition);
                    }
                  }
                
            // console.log("Button pressed, moving disk...");
            // selectDisk(diskId);
            // const newPosition = [intersectionPoint.x, intersectionPoint.y, state.disks[diskId].position[2]];
            // moveDisk(diskId, newPosition);
          }
          }
        if (lineRef.current) {
          const endPoint = new Vector3().copy(origin).add(direction.multiplyScalar(100)); // Scale the ray length
          const points = [origin, endPoint];
          lineRef.current.geometry.setFromPoints(points);
        }

        // Cache the new position and rotation
        lastPosition.current.copy(currentPosition);
        lastQuaternion.current.copy(currentQuaternion);


      }
    }
  });

  // Render the visual line
  return (<>
     <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="red" />
    </line>

  </>
 

  );
}

export default RaycasterVisualizer;
