import { createContext, useContext, useState } from "react";

const CharacterAnimationContext=createContext({})
export const CharacterAnimationProvider=(props)=>{
    const [animations,setAnimations]=useState([]);
    const [animationIndex,setAnimationIndex]=useState(0);
    return <>
    <CharacterAnimationContext.Provider value={{animations,setAnimations,animationIndex,setAnimationIndex}}>
        {props.children}
    </CharacterAnimationContext.Provider>
     </>;
}
export const useCharacterAnimations= ()=>{
    return useContext(CharacterAnimationContext)
}