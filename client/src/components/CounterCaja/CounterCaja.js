import React from 'react';
import { formatInt } from '../../GlobalFunctions';


import "./CounterCaja.css";

const CounterCaja = ({nombre, divisa = "$", monto = 0}) => {

    return(
        
        <>
            <div className="counter-caja">
                <h5>{nombre}</h5><p><span>{divisa}</span><span>{formatInt(monto)}</span></p>
            </div>
        </>
        
    )
}

export default CounterCaja;