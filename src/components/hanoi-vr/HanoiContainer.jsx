import { DefaultXRControllers, VRCanvas, XR, XRController } from '@react-three/xr';
import HanoiModel from "./HanoiModel";
import { useEffect, useRef } from 'react';
import { DiskProvider } from '../../contexts/DiskContext';
import RaycasterVisualizer from './RayCasterVisualizer';
import Background from './background';

function HanoiContainerVR() {

  return (
    <VRCanvas resize={{ scroll: false, debounce: { scroll: 50, resize: 50 } }} >
    <XR>
    <DefaultXRControllers/>
    <ambientLight intensity={0.5} />
    <directionalLight position={[5, 10, 5]} intensity={1} />
    <Background/>

    <DiskProvider>

        <RaycasterVisualizer />


          <HanoiModel />
    </DiskProvider>

      </XR>
    </VRCanvas>
  );
}

export default HanoiContainerVR;
