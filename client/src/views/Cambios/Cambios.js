import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Sidebar from '../../components/Sidebar/Sidebar';
import MainTable from '../../components/MainTable/MainTable';
import CreateOperacion from '../../components/CreateOperacion/CreateOperacion'
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete'
import EditCambio from '../../components/EditCambio/EditCambio'
import FiltrosGlobales from '../../components/FiltrosGlobales/FiltrosGlobales';

import "./Cambios.css";

const Cambios = ({setActiveTab, user}) => {

    const[actionRow, setActionRow] = useState(false)
    const[renderModal, setRenderModal] = useState({type:'', data:{}})
    const[confirmData, setConfirmData] = useState({})
    const [loading, setLoading] = useState(false)
    const cambios = useSelector(state=>state.operaciones.filter((operacion)=>operacion.tipo_operacion === "Cambio"))

    const campos = ['Fecha', 'Nombre', 'Cambio nuestro', 'Cambio cliente', 'Spread', 'Recibido', 'A entregar', 'Ganancia', 'ID']

    return(
        
        <>
            {renderModal.type === 'create-cambio' &&
                <CreateOperacion setRenderModal={setRenderModal} tipo_operacion="Cambio" />
            }
            {renderModal.type === 'confirm-delete' &&
                <ConfirmDelete tipo="Cambio" item={actionRow} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'edit-cambio' && 
                <EditCambio data={renderModal.data} setRenderModal={setRenderModal} />
            }
           <Sidebar vista="cambios" setActiveTab={setActiveTab} user={user} />
           <div id="cambios-view">
               <section id="cambios-table-cont" className="mainPaddingHoriz mainPaddingTop hasFiltrosGlobales">
                    <section className="filtros-globales-container">
                            <FiltrosGlobales />
                    </section>
                    <MainTable titulo="cambios" campos={campos} contenido={cambios} setActionRow={setActionRow} setConfirmData={setConfirmData} setRenderModal={setRenderModal} loading={loading} />
               </section>
           </div>
        </>
        
    )
}

export default Cambios;