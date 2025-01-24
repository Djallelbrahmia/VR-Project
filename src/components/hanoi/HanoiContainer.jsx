import { Canvas } from "@react-three/fiber";
import HanoiModel from "./HanoiModel";
import { DiskProvider } from "../../contexts/DiskContext";

function HanoiContainer(){

    return (
    <>
    
    <Canvas >
            <DiskProvider>
                <HanoiModel/>
            </DiskProvider>
    </Canvas>
    </>
        
    )
}
export default HanoiContainer;