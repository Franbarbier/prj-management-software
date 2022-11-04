import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {capitalize} from '../../GlobalFunctions' 


import Tab from './Tab/Tab'

import './ProveedoresTabs.css'

const Tabs = ({listItems, setActiveProveedor, activeProveedor, setRenderModal}) => {

    return(
            <>
                <ul className="tabs">
                {listItems.map((proveedor)=>(
                    <Tab key={proveedor._id} nombre={`${proveedor.nombre} - (${proveedor.divisa})`} full_data={proveedor} activeTab={activeProveedor} setActiveTab={setActiveProveedor} setRenderModal={setRenderModal} />
                )) }
                </ul>
            </>
    )
}

export default Tabs;