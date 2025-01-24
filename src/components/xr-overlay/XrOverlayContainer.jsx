import { Canvas } from "@react-three/fiber";
import { XR } from "@react-three/xr";
import { ARButton } from "@react-three/xr";
import XrOverlayHit from "./XrOverlayHit";
import { CharacterAnimationProvider } from "../../contexts/CharacterAnimations";
import Interface from "./Interface";
import { useCallback, useRef, useState } from "react";

function XrOverlayContainer(){
    const [overlayContent, setOverlayContent] = useState(null);

    let interfaceRef = useCallback((node) => {
        if (node !== null) {
            setOverlayContent(node);
        }
    });
        return (
    <>
    <CharacterAnimationProvider>
    <ARButton className="ar-button" sessionInit={
        {
            requiredFeatures: ['hit-test'],
            optionalFeatures:["dom-overlay"],
            domOverlay:{root:overlayContent}
        }
     }/>
    <Canvas>
        <XR>
            <XrOverlayHit/>
        </XR>
    </Canvas>
    <Interface ref={interfaceRef} />
    </CharacterAnimationProvider>

    </>
        
    )
}
export default XrOverlayContainer;