import { useState } from "react";

import './FiltroFecha.css';

const FiltroFecha = ({label, param, filtros, setFiltros}) => {

    const [showFiltroFecha, setShowFiltroFecha] = useState()

    return ( 
        <div className="filtroFecha filtro" onMouseEnter={()=>setShowFiltroFecha(true)} onMouseLeave={()=>setShowFiltroFecha(false)}>

            <div>{label}</div>

            {showFiltroFecha && 
            <div className="filtroFecha__dropdown">
                <div className="filtroFecha__field">
                    <div className="filtroFecha__dateLabel">Desde:</div>
                    <div>
                        <input type="date" value={filtros[param].desde} onChange={(e)=>setFiltros({...filtros, [param]: {...filtros[param], desde: e.target.value} })} />
                    </div>
                </div>
                <div className="filtroFecha__field">
                    <div className="filtroFecha__dateLabel">Hasta:</div>
                    <div>
                        <input type="date" value={filtros[param].hasta} onChange={(e)=>setFiltros({...filtros, [param]: {...filtros[param], hasta: e.target.value} })} />
                    </div>
                </div>
            </div>
            }

        </div>
     );
}
 
export default FiltroFecha;