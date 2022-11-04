import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import { setListas } from '../../actions/ordenes'
import { useAppContext } from '../../contexts/AppContext';
import * as utils from './utils';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainTable from '../../components/MainTable/MainTable';
import TarjetaCajas from '../../components/TarjetaCajas/TarjetaCajas';
import EditOrden from '../../components/EditOrden/EditOrden';

import { formatDateYmd } from '../../GlobalFunctions';

import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import CreateOrdenCont from '../../components/CreateOrden/CreateOrdenCont';
import FiltrosGlobales from '../../components/FiltrosGlobales/FiltrosGlobales';

import "./OrdenesJuan.css";
import CreateOpeacion from '../../components/CreateOperacion/CreateOperacion';

const Ordenes = ({setActiveTab, user}) => {

    const[actionRow, setActionRow] = useState(false)
    const[renderModal, setRenderModal] = useState({type:'', data:{}})
    const { oficina, loading } = useAppContext()
    var ordenes = useSelector(state => state.ordenes.filter((orden)=>utils.filterOrdenes(orden, oficina)))
    var operaciones = useSelector(state => state.operaciones.filter((operacion)=>utils.filterOperaciones(operacion, oficina)))
    var operacionesHoy = operaciones.filter((operacion)=> operacion.fecha_entrega == formatDateYmd(new Date())) 
    
    var ordenesYoperaciones = [ordenes, operaciones]

    const camposOpSnOrd = ['Cliente', 'Tipo', 'Entrega','Estado']
    const camposPagos = [ 'Fecha', 'Monto']
    const camposOpHoy = ['Cliente', 'Tipo', 'Entrega','Estado'];
    
    
    useEffect(()=>{
        ordenesYoperaciones = [ordenes, operaciones]
    })
    
    const dispatch = useDispatch()
    const bulkActions = [
        // # Papelera 19-2-2022
        // Por ahora comentamos esta bulkl action porque vamos a hacer que la orden deposito dependa del estado de su operacion, para determinar si se puede "enviar" o no
        // {
        //     text: "Marcar lista para enviar", 
        //     action: (bulk, setBulk)=>{
        //         if(window.confirm("Estás seguro que querés marcar estas " + bulk.length + " órdenes como 'listas'?")){
        //             dispatch(setListas(bulk)).then(()=> setBulk([]))
        //         }
        //     },
        //     shouldBeShown: () => {return true}
        // }
    ]


  

    return(
        
        <>
            {renderModal.type === 'confirm-delete' &&
                <ConfirmDelete tipo="Operacion" item={actionRow} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'create-orden' &&
                <CreateOrdenCont  hayOpereta={false} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'edit-orden' &&
                <EditOrden data={renderModal.data} setRenderModal={setRenderModal}   hayOpereta={true}  />
            }
            {renderModal.type === 'agregar-orden' &&
                <CreateOrdenCont  data={renderModal.data} hayOpereta={true} editAll={false} setRenderModal={setRenderModal}  />
            }
            {renderModal.type === 'create-operacion' && 
                <CreateOpeacion setRenderModal={setRenderModal} />
            }
           <Sidebar vista="OrdenesJuan" setActiveTab={setActiveTab} user={user} />
           <div className="mainPaddingHoriz mainPaddingTop hasFiltrosGlobales">
               <section className="filtros-globales-container">
                    <FiltrosGlobales />
               </section>
               
               <div id="ordenes-view-contCol">
                   <div>
                        <MainTable titulo="operaciones entrega hoy" campos={camposOpHoy} contenido={operacionesHoy} setActionRow={setActionRow}  setRenderModal={setRenderModal} loading={loading.operaciones} bulkActions={bulkActions} />
                        <div className="no-agregar">
                            <MainTable titulo="operaciones sin órdenes" campos={camposOpSnOrd} contenido={ordenesYoperaciones} setActionRow={setActionRow}  setRenderModal={setRenderModal} loading={loading.operaciones} />
                        </div>
                   </div>
                   <div className="no-agregar">
                        <TarjetaCajas  />
                        <MainTable titulo="calendario de pagos"  campos={camposPagos} contenido={operaciones}  setActionRow={setActionRow} setRenderModal={setRenderModal}  />
                   </div>
               </div>
           </div>

        </>
        
    )
}

export default Ordenes;