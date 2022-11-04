import React, {useState, useEffect} from 'react';
import {periodos} from '../../GlobalFunctions';
import './PeriodoSelect.css'

const PeriodoSelect = ({action, fecha=""}) => {
    
    const[showFiltroFecha, setShowFiltroFecha] = useState(false)

    return ( 

        <div id="periodo" onMouseEnter={()=>setShowFiltroFecha(true)} onMouseLeave={()=>setShowFiltroFecha(false)}>

            <div className="active-periodo periodo-tab">{fecha.periodo.label}</div>

            {showFiltroFecha && 
            <div id="periodo-options">
                
                <div id="periodo-options-container">
                    {periodos.periodos.map((periodo, i)=>( 
                        periodo !== fecha.periodo &&
                        <div className="periodo-tab" onClick={()=>action(periodo)} key={i}>{periodo.label}</div>
                        ))}
                </div>
                
            </div>
            }

        </div>

     );
}
 
export default PeriodoSelect;