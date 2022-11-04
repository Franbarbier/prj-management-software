import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Sidebar from '../../components/Sidebar/Sidebar';
import MainTable from '../../components/MainTable/MainTable';

import * as utils from './utils'; 
import { getMovimientosCajas } from '../../actions/movimientos'
import { getBalancesCajas } from '../../actions/reportes'
import{ cajas } from '../../GlobalFunctions';
import { useAppContext } from '../../contexts/AppContext';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete'
import CreateMovimientoCaja from '../../components/CreateMovimientoCaja/CreateMovimientoCaja'
import EditMovimientoCaja from '../../components/EditMovimientoCaja/EditMovimientoCaja';
import ExportarCSV from '../../components/ExportarCSV/ExportarCSV';
import CajaTabs from '../../components/CajaTabs/CajaTabs';
import FiltrosGlobales from '../../components/FiltrosGlobales/FiltrosGlobales';

import "./Cajas.css";

const Cajas = ({setActiveTab, user}) => {

    const [cajasData, setCajasData] = useState(cajas) 
    const[actionRow, setActionRow] = useState(false)
    const[activeSubtitulo, setActiveSubtitulo] = useState()
    const[activeCaja, setActiveCaja] = useState(0)
    const[renderModal, setRenderModal] = useState({type:'', data:{}})
    const[loading, setLoading] = useState(false)
    const {oficina} = useAppContext()

    const movimientosCajas = useSelector(state => state.movimientos_cajas.filter((movimiento)=>utils.filterCajas(movimiento, oficina)))
    const balances = useSelector(state => state.reportes.cajas)

    const dispatch = useDispatch()

    useEffect(()=>{
        setLoading(true)
        dispatch(getMovimientosCajas()).then(()=>{
            setLoading(false)
        })
    }, [])
    
    useEffect(()=>{
        dispatch(getBalancesCajas())
    }, [movimientosCajas.length])

    useEffect(()=>{
        utils.updateCajaData(movimientosCajas, cajasData, setCajasData)
    }, [movimientosCajas.length, oficina, activeCaja])

    const campos = ['Fecha', 'Importe', 'Descripcion', 'Categoria', 'ID Asoc.']

    return(
        
        <>
            {renderModal.type === 'create-movimiento-caja' &&
            <CreateMovimientoCaja tipo={activeSubtitulo} cajasData={cajasData} activeCaja={activeCaja} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'edit-movimiento-caja' &&
            <EditMovimientoCaja tipo={activeSubtitulo} cajasData={cajasData} activeCaja={activeCaja} data={renderModal.data} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'confirm-delete' &&
                <ConfirmDelete tipo="MovimientoCaja" item={actionRow} setRenderModal={setRenderModal} />
            }
           <Sidebar vista="cajas" setActiveTab={setActiveTab} user={user} />
           <div id="cajas-view" className="hasFiltrosGlobales">
               <section className="filtros-globales-container" style={{width: "87%", marginLeft: "17.5%", marginBottom: 0}}>
                    <FiltrosGlobales showFiltroPeriodo={false} />
               </section>

               <section>
                    <CajaTabs setActiveCaja={setActiveCaja} activeCaja={activeCaja} cajas={cajasData} />
               </section>

               <div className="row-botones">
                   <div className="cajas-exportar">
                        <ExportarCSV toExport="movimientos_cajas" params={{params:{oficina, caja: cajasData[activeCaja].divisa}}} />
                   </div>
               </div>

               <h5 id="resumen">Balance <span>${utils.getBalanceActiveCaja(cajasData, oficina, activeCaja, balances)}</span></h5>
               <section id="tables-cajas-cont">
                   <article id="ingresos">
                        <MainTable titulo="cajas" subtitulo="ingresos" campos={campos} contenido={movimientosCajas.filter((movimiento)=>utils.filterMovimientosByTipo(movimiento, activeCaja, cajasData, 1))} table_size='2' setActionRow={setActionRow} setActiveSubtitulo={setActiveSubtitulo} activeCaja={activeCaja} setRenderModal={setRenderModal} loading={loading} />

                   </article>
                   <article id="egresos">
                        <MainTable titulo="cajas" subtitulo="egresos" campos={campos} contenido={movimientosCajas.filter((movimiento)=>utils.filterMovimientosByTipo(movimiento, activeCaja, cajasData, 0))} table_size='2' setActionRow={setActionRow} setActiveSubtitulo={setActiveSubtitulo}  activeCaja={activeCaja} setRenderModal={setRenderModal} loading={loading} />
                   </article>
               </section>
           </div>
        </>
        
    )
}

export default Cajas;