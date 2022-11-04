import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppContext } from '../../contexts/AppContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainTable from '../../components/MainTable/MainTable';
import EditOrden from '../../components/EditOrden/EditOrden';
import FiltrosGlobales from '../../components/FiltrosGlobales/FiltrosGlobales';
import { estados } from '../../GlobalFunctions';

const Depositos = ({setActiveTab, user}) => {

    const { loading } = useAppContext()
    const[actionRow, setActionRow] = useState(false)
    const[renderModal, setRenderModal] = useState({type:'', data:{}})
    const[confirmData, setConfirmData] = useState({})
    const depositos = useSelector(state => state.ordenes).filter((orden)=> (orden.tipo === 'Depósito' && orden.estado === "Pendiente" && orden?.operacion?.estado === estados.operaciones[estados.operaciones.length-1]))
    const campos = ['Cliente', 'Mto. USD', 'Mto. ARS', 'Banco', 'Estado', 'Fecha Entrega', 'ID'] 
    
    return ( 

        <>
           <Sidebar vista="depositos" setActiveTab={setActiveTab} user={user} />
           {renderModal.type === 'edit-orden' &&
                <EditOrden orden={renderModal.data} setRenderModal={setRenderModal} hayOpereta={true}  />
            }
           <div className="mainPaddingHoriz mainPaddingTop hasFiltrosGlobales">
               <section className="filtros-globales-container">
                    <FiltrosGlobales />
               </section>
               <MainTable titulo="depositos" campos={campos} contenido={depositos} setActionRow={setActionRow} setConfirmData={setConfirmData} setRenderModal={setRenderModal} loading={loading.ordenes} />
           </div>
        </>

     );
}
 
export default Depositos;