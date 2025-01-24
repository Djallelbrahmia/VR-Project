import { OrbitControls } from "@react-three/drei";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import { useRef, useState } from "react";
import Model from "./model";

function XrOverlayHit(){
    const cuberef=useRef()
    const [models,setModels]=useState([])
    const {isPresenting}=useXR();
    useHitTest((hitMatrix,hit) => {
        hitMatrix.decompose(cuberef.current.position, cuberef.current.rotation, cuberef.current.scale);
        cuberef.current.rotation.x=-Math.PI/2
      })
    const placeCube=(e)=>{
        let position=e.intersection.object.position.clone();
        let id=Date.now();
        setModels([...models,{position,id}])
    }
    return (<>   
        <OrbitControls/>
        <ambientLight/>
        {isPresenting && models.map(({ position, id }) => (
            <Model key={id} position={position} />
            ))}
        {isPresenting &&  <Interactive onSelect={placeCube}>
            <mesh ref={cuberef}  position={[0, 0, -2]}  rotation-x={Math.PI/2}>
                <ringGeometry args={[0.1,0.25,32]}/>
                <meshStandardMaterial color={'white'}/>
            </mesh>
        </Interactive>}
        {!isPresenting && <Model/>}

        </> ) 
}
export default XrOverlayHit;