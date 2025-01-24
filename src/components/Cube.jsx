import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Cube(){
    const cuberef=useRef()
    useFrame((state,delta)=>{
        cuberef.current.rotation.x+=0.05
    });
    return (<>   
        <OrbitControls/>
        <ambientLight/>
        <mesh ref={cuberef}>
            <boxGeometry/>
            <meshStandardMaterial color={'mediumpurple'}/>
        </mesh>
        </> ) 
}
export default Cube;