import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { useAppContext } from '../../contexts/AppContext';
import { estados } from '../../GlobalFunctions';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainTable from '../../components/MainTable/MainTable';
import EditOrden from '../../components/EditOrden/EditOrden';
import CreateOrdenCont from '../../components/CreateOrden/CreateOrdenCont';
import LiquidarTransferencias from '../../components/LiquidarTransferencias/LiquidarTransferencias';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import FiltrosGlobales from '../../components/FiltrosGlobales/FiltrosGlobales';
import LiquidarOrdenRecibo from '../../components/LiquidarOrdenRecibo/LiquidarOrdenRecibo';


import "./Ordenes.css";

const Ordenes = ({setActiveTab, user}) => {

    const { loading } = useAppContext()
    const[actionRow, setActionRow] = useState(false)
    const[renderModal, setRenderModal] = useState({type:'', data:{}})
    const ordenes = useSelector(state => state.ordenes)
    
    const campos = ['Cliente', 'Entrega', 'Mto. USD', 'Mto. ARS', 'Fecha entrega', 'Estado', 'ID']

    const bulkActions = [
        {
            text: "Liquidar con proveedor", 
            action: (bulk, setBulk)=>{
                let data = {transferencias: bulk, setBulk}
                setRenderModal({type: 'liquidar-transferencias', data})
            },
            shouldBeShown: (bulk) => {
                for(let orden of bulk){
                    if(orden.tipo !== "Transferencia" || orden.estado === estados.ordenes[1]){
                        return false
                    }
                }
                return true
            }
        }
    ]


    return(
        
        <>
            {renderModal.type === 'confirm-delete' &&
                <ConfirmDelete tipo="Orden" item={actionRow} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'create-orden' &&
                <CreateOrdenCont data={renderModal.data} hayOpereta={false} setRenderModal={setRenderModal} />
            }

            {renderModal.type === 'edit-orden' &&
                <EditOrden orden={renderModal.data} setRenderModal={setRenderModal} hayOpereta={true}  />
            }
            {renderModal.type === 'liquidar-transferencias' &&
                <LiquidarTransferencias renderModal={renderModal} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'orden-recibo' &&
                <LiquidarOrdenRecibo renderModal={renderModal} setRenderModal={setRenderModal} />
            }

           <Sidebar vista="ordenes" setActiveTab={setActiveTab} user={user} />
           <div className="mainPaddingHoriz mainPaddingTop hasFiltrosGlobales">
                <section className="filtros-globales-container">
                    <FiltrosGlobales />
               </section>
               <MainTable titulo="ordenes" campos={campos} contenido={ordenes} setActionRow={setActionRow} setRenderModal={setRenderModal} loading={loading.ordenes} bulkActions={bulkActions} />
           </div>

        </>
        
    )
}

export default Ordenes;