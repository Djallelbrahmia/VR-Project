import { useRef, useEffect } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";

function RaycasterVisualizer() {
  const lineRef = useRef();

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

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="red" />
    </line>
  );
}

export default RaycasterVisualizer;
