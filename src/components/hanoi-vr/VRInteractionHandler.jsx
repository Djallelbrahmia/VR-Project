import { useController } from "@react-three/xr";
import { Raycaster, Vector3 } from "three";
import { useDisk } from "../../contexts/DiskContext";

function VRInteractionHandler() {
  const { state, selectDisk, releaseDisk } = useDisk();
  const controller = useController("right"); // Use "left" or "right" as needed
  const raycaster = new Raycaster();

  const handleSelectStart = () => {
    if (!controller) return;

    // Update raycaster's direction
    const direction = new Vector3(0, 0, -1);
    direction.applyQuaternion(controller.rotation); // Use controller's rotation quaternion
    raycaster.set(controller.position, direction);

    // Detect intersections
    const intersects = raycaster.intersectObjects(controller.scene.children);
    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object.name.startsWith("disk")) {
        const id = parseInt(object.name.split("-")[1], 10);
        selectDisk(id); // Select the intersected disk
      }
    }
  };

  const handleSelectEnd = () => {
    if (state.selectedDisk !== null && controller) {
      releaseDisk(state.selectedDisk, controller.position); // Release disk
    }
  };

  return (
    <>
      {/* Add the interaction handlers for the controller */}
      <group>
        <mesh
          onPointerDown={handleSelectStart}
          onPointerUp={handleSelectEnd}
        >
          {/* You can add a visual representation for the controller here if needed */}
        </mesh>
      </group>
    </>
  );
}

export default VRInteractionHandler;
