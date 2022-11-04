import React from 'react';
import Tab from './Tab/Tab';

import './CajaTabs.css'

const CajaTabs = ({activeCaja, setActiveCaja, cajas}) => {

    return(
            <>
                <ul className="caja-tabs">
                    {cajas.map((caja, i)=>(
                        <Tab full_data={caja} index={i} activeTab={activeCaja} setActiveTab={setActiveCaja} key={caja.divisa} />
                    )) }
                </ul>
            </>
    )
}

export default CajaTabs;