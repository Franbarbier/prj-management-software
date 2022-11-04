
import { useEffect, useState, useRef } from 'react';
import { copyToClipboard } from '../../GlobalFunctions';
import './ClickToCopy.css';

const ClickToCopy = ({children}) => {

    const timeoutRef = useRef();
    const [clicked, setClicked] = useState(false)

    function handleClick(e){
        e.stopPropagation()
        copyToClipboard(children)
        setClicked(true)
        timeoutRef.current = setTimeout(() => {
            setClicked(false)
        }, 700);        
    }

    useEffect(()=>{
        return ()=>clearTimeout(timeoutRef.current)
    },[])

    return ( 
        
        <div className={`clickToCopy ${clicked ? 'clickToCopy-clicked' : ''}`} onClick={(e)=>handleClick(e)}>
            <div>
                {children}
            </div>
        </div>

     );
}
 
export default ClickToCopy;
    
