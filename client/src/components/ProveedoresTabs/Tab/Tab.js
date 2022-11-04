import React from 'react';

import './Tab.css';

const Tab = ({nombre, setRenderModal, full_data, setActiveTab, activeTab}) => {

    function handleEditProveedor(e){
        e.stopPropagation()
        setRenderModal({type: 'edit-proveedor', data: full_data}) 
    }    


    return(
            <>
                <li onClick={()=>setActiveTab(full_data)} className={activeTab!=null &&activeTab._id == full_data._id && 'tab-active'}> 
                    {nombre} 
                    <img src="imgs/edit.svg" alt="editar proveedor" className="e-p" onClick={(e)=> handleEditProveedor(e)} />
                </li>
            </>
    )
}

export default Tab;