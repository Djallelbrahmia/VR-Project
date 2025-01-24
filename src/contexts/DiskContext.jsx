import { createContext, useContext, useReducer } from "react";

const DiskContext = createContext();

const initState = {
  disks: [
    { id: 0, position: [-2, 0.75,  -8], originalPosition: [-2, 0.75, -8], size: 1.5, color: 'red' },
    { id: 1, position: [-2, 1.0,  -8], originalPosition: [-2, 1.0, -8], size: 1.4, color: 'orange' },
    { id: 2, position: [-2, 1.25,  -8], originalPosition: [-2, 1.25, -8], size: 1.3, color: 'yellow' },
    { id: 3, position: [-2, 1.5,  -8], originalPosition: [-2, 1.5, -8], size: 1.2, color: 'green' },
    { id: 4, position: [-2, 1.75,  -8], originalPosition: [-2, 1.75, -8], size: 1.1, color: 'blue' },
    { id: 5, position: [-2, 2.0,  -8], originalPosition: [-2, 2.0, -8], size: 1.0, color: 'indigo' },
    { id: 6, position: [-2, 2.25,  -8], originalPosition: [-2, 2.25, -8], size: 0.9, color: 'violet' },
    { id: 7, position: [-2, 2.5,  -8], originalPosition: [-2, 2.5, -8], size: 0.8, color: 'pink' },
    { id: 8, position: [-2, 2.75,  -8], originalPosition: [-2, 2.75, -8], size: 0.7, color: 'brown' },
  ],
  diskRefs: {},  

  piles: { "-2": [0, 1, 2, 3, 4, 5, 6, 7, 8], "0":[], "2": [] },
  orbitControl: true,
  selectedDisk: null,
  pegs: [-2, 0, 2],
};


const findClosestPeg = (pegs, positionX) => {
  return pegs.reduce((closest, peg) => {
    const distance = Math.abs(positionX - peg);
    return distance < Math.abs(positionX - closest) ? peg : closest;
  }, pegs[0]);
};

function reducer(state, action) {
  switch (action.type) {
    case "MOVE_DISK":
      console.log(action.payload)
      return {
        ...state,
        disks: state.disks.map((disk) =>
          disk.id === action.payload.id
            ? { ...disk, position: action.payload.newPosition }
            : disk
        ),
      };
      case "SELECT_DISK": {
        const selectedDiskId = action.payload;
      
        // Helper: Find the peg containing the disk
        const findPegOfDisk = (diskId) =>
          state.pegs.find((peg) => state.piles[peg].includes(diskId));
      
        // Find the peg and check if the disk is the topmost
        const peg = findPegOfDisk(selectedDiskId);
        const isTopDisk =
          peg !== undefined && state.piles[peg][state.piles[peg].length - 1] === selectedDiskId;
      
        // Allow selection only if it's the top disk
        if (isTopDisk) {
          return { ...state, selectedDisk: selectedDiskId };
        }
      
        console.warn("Only the topmost disk on a peg can be selected.");
        return state; // Do nothing if not the top disk
      }
      
      case "RELEASE_DISK":
  const { id } = action.payload;
  const disk = state.disks.find((disk) => disk.id === id);
  const closestPeg = findClosestPeg(state.pegs, disk.position[0]);
  const distanceToClosestPeg = Math.abs(disk.position[0] - closestPeg);
  const updatedPiles = { ...state.piles };

  if (distanceToClosestPeg < 0.5) {
    // Remove disk from all piles
    Object.keys(updatedPiles).forEach((key) => {
      updatedPiles[key] = updatedPiles[key].filter((diskId) => diskId !== id);
    });

    // Get the target pile for the closest peg
    const targetPile = updatedPiles[closestPeg];

    // Ensure smaller disks are always on top
    if (targetPile.length > 0) {
      const topDiskId = targetPile[targetPile.length - 1];
      const topDisk = state.disks.find((disk) => disk.id === topDiskId);
      if (disk.size > topDisk.size) {
        // Invalid move → Reset to original position
        return {
          ...state,
          disks: state.disks.map((disk) =>
            disk.id === id ? { ...disk, position: disk.originalPosition } : disk
          ),
          selectedDisk: null,
        };
      }
    }

    // Compute new Y position for stacking
    const y_position = targetPile.length > 0
      ? state.disks.find((disk) => disk.id === targetPile[targetPile.length - 1]).position[1] + 0.25
      : 0.75; // Base height if empty

    // Add the disk to the new pile
    updatedPiles[closestPeg] = [...targetPile, id];

    // Get the peg's Z position (ensure the disk takes the peg's exact position)
    const pegZPosition = state.disks.find(d => d.id === 0)?.position[2] || -8; 

    return {
      ...state,
      piles: updatedPiles,
      disks: state.disks.map((disk) =>
        disk.id === id
          ? {
              ...disk,
              position: [closestPeg, y_position, pegZPosition], // EXACT peg position
              originalPosition: [closestPeg, y_position, pegZPosition],
            }
          : disk
      ),
      selectedDisk: null,
    };
  } else {
    // Disk not close enough to a peg → Reset position
    return {
      ...state,
      disks: state.disks.map((disk) =>
        disk.id === id ? { ...disk, position: disk.originalPosition } : disk
      ),
      selectedDisk: null,
    };
  }

      
    case "UPDATE_ORBIT_CONTROL":
      return { ...state, orbitControl: action.payload };
      case "UPDATE_DISK_REF": {
        const { id, ref } = action.payload;
        
        // Update the mesh reference for the given disk id
        return {
          ...state,
          diskRefs: {
            ...state.diskRefs,
            [id]: ref,  // Store the mesh reference
          },
        };
      }
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function DiskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const moveDisk = (id, newPosition) => dispatch({ type: "MOVE_DISK", payload: { id, newPosition } });
  const selectDisk = (id) => dispatch({ type: "SELECT_DISK", payload: id });
  const releaseDisk = (id) => dispatch({ type: "RELEASE_DISK", payload: { id } });
  const toggleOrbitControl = (enabled) => dispatch({ type: "UPDATE_ORBIT_CONTROL", payload: enabled });
  const updateDiskRef=(id,ref)=>dispatch({ type: "UPDATE_DISK_REF", payload: { id, ref } });
  return (
    <DiskContext.Provider value={{ state, moveDisk, selectDisk, releaseDisk, toggleOrbitControl, updateDiskRef}}>
      {children}
    </DiskContext.Provider>
  );
}

function useDisk() {
  const context = useContext(DiskContext);
  if (context === undefined) throw new Error("useDisk must be used within a DiskProvider");
  return context;
}

export { DiskProvider, useDisk };
