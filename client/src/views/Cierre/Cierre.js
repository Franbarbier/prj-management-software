import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import { useAppContext } from '../../contexts/AppContext';
import {getCierreTable, getExistencia,getCierre} from '../../actions/cierre'
import { hasCategoria, periodos } from '../../GlobalFunctions';
import MainTable from '../../components/MainTable/MainTable';
import Sidebar from '../../components/Sidebar/Sidebar';
import FiltrosGlobales from '../../components/FiltrosGlobales/FiltrosGlobales';

import './Cierre.css'




const Cierre = ({setActiveTab, user}) => {
    
    const {periodo} = useAppContext()
    const[loading, setLoading] = useState({existencia: false, cierre_prj: false, liquido: false})
    const existencia = useSelector(state => state.cierre.existencia)
    const cierrePrj = useSelector(state => state.cierre.cierre_prj)
    const config = useSelector(state => state.config)

    const dispatch = useDispatch()

    useEffect(()=>{
        setLoading({...loading, existencia: true, cierre_prj: true})
        dispatch(getExistencia({params:{periodo}})).then(()=>{
            setLoading({...loading, existencia: false})
        })
        dispatch(getCierre({params:{periodo}})).then(()=>{
            setLoading({...loading, cierre_prj: false})
        })
    }, [periodo])


    function filterMovimientos(mov){
        if(!mov.tipo.includes("movimiento_caja")){
            return true
        }else{
            if(config.categorias_in_cierre?.cierre_prj){

                let tipo;
                mov.tipo.includes("egreso") ? tipo = "egreso" : tipo = "ingreso"

                if(hasCategoria(config.categorias_in_cierre.cierre_prj, {categoria: mov.categoria, tipo})){
                    return true
                }

            }else{
                return false
            }
        }
    }

    const campos = {
        cierre_prj: ['Desc.', 'Debe', 'Haber'],
        existencia: ['Desc.', 'USD', 'ARS', 'EUR'],
        liquido: ['EUR'],
    }

    return(
            <>
                <Sidebar vista="cierre" setActiveTab={setActiveTab} user={user} />
                <div id="cierre-view">

                    <div className="mainPaddingHoriz mainPaddingTop">
                        
                        <div className="cierre-periodos">
                            <FiltrosGlobales />
                        </div>

                        <div className="cierre-cols">
                            <div className="cc-col">
                                <MainTable titulo="cierre PRJ" contenido={cierrePrj != undefined ? cierrePrj.filter(filterMovimientos) : []} campos={campos.cierre_prj} loading={loading.cierre_prj} />
                            </div>
                            <div className="cc-col">
                                <MainTable titulo="existencia" contenido={existencia != undefined ? existencia : []} campos={campos.existencia} loading={loading.existencia} />
                            </div>
                        </div>
                        {/* <div className="cc-col">
                            <MainTable titulo="liquido" contenido={fake_rows} campos={campos.liquido} loading={loading.liquido}  />
                        </div> */}
                    </div>

                </div>
            </>
    )
}

export default Cierre
