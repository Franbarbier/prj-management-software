import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { exportMovimientosCajas } from '../../api';
import { downloadCSV } from '../../GlobalFunctions';

import exportIcon from '../../images/export.svg';
import "./ExportarCSV.css";

const ExportarCSV = ({toExport, params}) => {

    useEffect(()=>{
        
    }, [])

    function handleClickExport(){

        let exports = {
            "movimientos_cajas": async (params) =>{
                return await exportMovimientosCajas(params)
            }
        }

        exports[toExport](params).then((res)=>{
            downloadCSV('export.csv', res.data)
        })

    }


    return(
        <>
            <button id="export-btn" onClick={handleClickExport}><span>Exportar CSV</span><img src={exportIcon}  height="18" /></button>
        </>
    )
}

export default ExportarCSV;