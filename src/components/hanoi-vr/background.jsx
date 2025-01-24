import { useGLTF } from "@react-three/drei";

function Background() {
  const { scene } = useGLTF("/models/model.gltf");

  // Create an array of tree positions
  const treePositions = [
    { x: -10, y: 0, z: -20 },
    { x: 0, y: 0, z: -15 },
    { x: 10, y: 0, z: -20 },
    { x: -5, y: 0, z: -10 },
    { x: 5, y: 0, z: -10 },
  ];

  return (
    <>
      {treePositions.map((pos, index) => (
        <primitive
          key={index}
          object={scene.clone()} // Clone the tree for each position
          position={[pos.x, pos.y, pos.z]}
          scale={[1, 1, 1]} // Adjust scale if needed
        />
      ))}
    </>
  );
}

export default Background;
