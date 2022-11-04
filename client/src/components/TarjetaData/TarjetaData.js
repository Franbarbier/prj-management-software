import React from 'react';
import {  formatInt } from '../../GlobalFunctions';
import FormLoader from '../FormLoader/FormLoader';

import "./TarjetaData.css";

const TarjetaData = ({tarjetaData, loading=null}) => {

    return(
        
        <>
            <div className="tarjeta-data">
                <div className="dt-header">

                </div>
                <div>
                    {tarjetaData.map((dato, i)=>(
                    <div className="dt-dato" key={i}>
                        <div className="preWrap">
                            <strong className="data-numero">
                                {dato.prefijo != '' && <span>{dato.prefijo} &nbsp;</span> }
                                <span>{dato.numero !== "NaN" ? formatInt(dato.numero) : ""}</span>
                                <span>{dato.sufijo}</span>
                            </strong>
                        </div>
                        <p  className="data-descr">{dato.descr}</p>
                    </div>
                    ))}
                </div>
                {loading &&
                    <FormLoader/>
                }
            </div>
        </>
        
    )
}

export default TarjetaData;