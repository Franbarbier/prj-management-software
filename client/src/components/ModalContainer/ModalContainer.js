import React, { useEffect } from 'react';
import './ModalContainer.css'

const ModalContainer = ({children, tipo}) => {

    useEffect(()=>{
        var window = document.getElementById('modal-container-'+tipo)
        setTimeout(() => {
            window.classList.remove('close-modal')
        }, 10);
    }, [])

    return(
            <div  id={"modal-container-"+tipo} className="close-modal modal-container">
                {children}
            </div>
    )
}

export default ModalContainer