import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppContext } from '../../contexts/AppContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainTable from '../../components/MainTable/MainTable';
import CreateCash from '../../components/CreateCash/CreateCash';
import EditCash from '../../components/EditCash/EditCash';
import Confirm from '../../components/Confirm/Confirm';
import FiltrosGlobales from '../../components/FiltrosGlobales/FiltrosGlobales';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import LiquidarTransferencias from '../../components/LiquidarTransferencias/LiquidarTransferencias';
import LiquidarOrdenRecibo from '../../components/LiquidarOrdenRecibo/LiquidarOrdenRecibo';
import "./Cash.css";

const Cash = ({setActiveTab, user}) => {

    const { loading } = useAppContext()
    const[actionRow, setActionRow] = useState(false)
    const[confirmData, setConfirmData] = useState({})
    const[renderModal, setRenderModal] = useState({type:'', data:{}})
    const cash = useSelector(state => state.ordenes.filter((orden)=>orden.tipo === 'Cash Cash'))
    const campos = ['Cliente', 'Mto. Cliente', 'Comision', 'Mto. Envio', 'Ubicacion', 'Fecha entrega', 'Estado', 'ID']

    return(
        <>
           {renderModal.type === 'confirm-delete' &&
                <ConfirmDelete tipo="Cash" item={actionRow} setRenderModal={setRenderModal} />
           }
           {renderModal.type === 'confirm' &&
                <Confirm text={confirmData.text} setRenderModal={setRenderModal} action={confirmData.action} />
           } 
           {renderModal.type === 'edit-cash' && 
                <EditCash  data={renderModal.data} setRenderModal={setRenderModal} />
           }
           {renderModal.type === 'create-cash' &&
                <CreateCash  setRenderModal={setRenderModal}  />
           } 
           {renderModal.type === 'liquidar-transferencias' &&
                <LiquidarTransferencias renderModal={renderModal} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'orden-recibo' &&
                <LiquidarOrdenRecibo renderModal={renderModal} setRenderModal={setRenderModal} />
            }
           <Sidebar vista="cash" setActiveTab={setActiveTab} user={user} />
           <div className="mainPaddingHoriz mainPaddingTop hasFiltrosGlobales">
               <section className="filtros-globales-container">
                    <FiltrosGlobales />
               </section>
               <MainTable titulo="cash" campos={campos} contenido={cash} setActionRow={setActionRow} setConfirmData={setConfirmData} setRenderModal={setRenderModal} loading={loading.ordenes} />
           </div>
        </>
    )
}

export default Cash;