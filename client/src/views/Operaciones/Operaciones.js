import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppContext } from '../../contexts/AppContext';
import FiltrosGlobales from '../../components/FiltrosGlobales/FiltrosGlobales';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainTable from '../../components/MainTable/MainTable';
import CreateOperacion from '../../components/CreateOperacion/CreateOperacion';
import EditBajada from '../../components/EditBajada/EditBajada';
import EditSubida from '../../components/EditSubida/EditSubida';
import EditCrypto from '../../components/EditCrypto/EditCrypto';
import EditCambio from '../../components/EditCambio/EditCambio';
import LiquidarTransferencias from '../../components/LiquidarTransferencias/LiquidarTransferencias';

import "./Operaciones.css";
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

const Operaciones = ({setActiveTab, user}) => {

    const { loading } = useAppContext()
    const[actionRow, setActionRow] = useState(false)
    const[renderModal, setRenderModal] = useState({type:'', data:{}})
    const operaciones = useSelector(state => state.operaciones)
    const estado = useSelector(state => state)
    const campos = ['Fecha', 'Cliente', 'Tipo', 'Monto', 'Estado', 'Recibe', 'ID']

    useEffect(()=>{
         console.log('STATE: ', estado)
    })

    return(
        
        <>
           {renderModal.type === 'create-operacion' && 
                <CreateOperacion setRenderModal={setRenderModal} />
           }
           {renderModal.type === 'edit-bajada' && 
                <EditBajada data={renderModal.data} setRenderModal={setRenderModal} />
           }
           {renderModal.type === 'edit-subida' && 
                <EditSubida data={renderModal.data} setRenderModal={setRenderModal} />
           }
           {renderModal.type === 'edit-crypto' && 
                <EditCrypto data={renderModal.data} setRenderModal={setRenderModal} />
           }
           {renderModal.type === 'edit-cambio' && 
                <EditCambio data={renderModal.data} setRenderModal={setRenderModal} />
           }
           {renderModal.type === 'confirm-delete' &&
                <ConfirmDelete tipo="Operacion" item={actionRow} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'liquidar-transferencias' &&
                <LiquidarTransferencias renderModal={renderModal} setRenderModal={setRenderModal} />
            }

           <Sidebar vista="operaciones" setActiveTab={setActiveTab} user={user} />
           <div className="mainPaddingHoriz mainPaddingTop hasFiltrosGlobales">
               <section className="filtros-globales-container">
                    <FiltrosGlobales />
               </section>

               <MainTable titulo="operaciones" campos={campos} setRenderModal={setRenderModal} contenido={operaciones} setActionRow={setActionRow} loading={loading.operaciones} />
           </div>
        </>
   
    )
}

export default Operaciones;