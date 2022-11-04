import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import {oficinas} from '../../GlobalFunctions'

import './OficinaSelect.css'

const OficinaSelect = () => {
    
    const {oficina, setOficina} = useAppContext()

    return(
        <div className="oficinaSelect">
            <div className="oficinaSelect__label">Oficina: </div>
            <div>
                <select name="" id="" onChange={(e)=>setOficina(e.target.value)}>
                    {oficinas.map((ofi)=>
                        <option value={ofi} selected={ofi === oficina} key={ofi}>{ofi}</option>
                        )}
                </select>
            </div>
        </div>
    )
}

export default OficinaSelect