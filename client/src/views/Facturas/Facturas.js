import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppContext } from '../../contexts/AppContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainTable from '../../components/MainTable/MainTable';
import CreateFactura from '../../components/CreateFactura/CreateFactura';
import EditFactura from '../../components/EditFactura/EditFactura';
import Confirm from '../../components/Confirm/Confirm';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import FiltrosGlobales from '../../components/FiltrosGlobales/FiltrosGlobales';
import LiquidarTransferencias from '../../components/LiquidarTransferencias/LiquidarTransferencias';
import LiquidarOrdenRecibo from '../../components/LiquidarOrdenRecibo/LiquidarOrdenRecibo';


import "./Facturas.css";

const Facturas = ({setActiveTab, user}) => {

    const { loading } = useAppContext()
    const[actionRow, setActionRow] = useState(false)
    const[confirmData, setConfirmData] = useState({})
    const[renderModal, setRenderModal] = useState({type:'', data:{}})

    const facturas = useSelector(state => state.ordenes.filter((orden)=>orden.tipo === 'Factura'))
            
    // const campos = ['Cliente', 'Mto. Operacion', 'Envio Efvo.', 'Mto. Fra. USD', 'Fra. USD (+%)', 'Comision', 'Cambio Nuestro', 'Mto. Fra. ARS', 'Fra. ARS (+%)', 'Estado']
    const campos = ['Cliente', 'Mto. Fra. USD', 'Fra. USD (+%)', 'Comision', 'Cambio Nuestro', 'Mto. Fra. ARS', 'Fra. ARS (+%)', 'Estado']

    return(
        
        <>
           {renderModal.type === 'confirm-delete' &&
                <ConfirmDelete tipo="Factura" item={actionRow} setRenderModal={setRenderModal} />
           }
           {renderModal.type === 'confirm' &&
                <Confirm text={confirmData.text} setRenderModal={setRenderModal} action={confirmData.action} />
           } 
           {renderModal.type === 'edit-factura' && 
                <EditFactura data={renderModal.data} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'create-factura' &&
                <CreateFactura setRenderModal={setRenderModal}  />
            } 
            {renderModal.type === 'liquidar-transferencias' &&
                <LiquidarTransferencias renderModal={renderModal} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'orden-recibo' &&
                <LiquidarOrdenRecibo renderModal={renderModal} setRenderModal={setRenderModal} />
            }
           <Sidebar vista="facturas" setActiveTab={setActiveTab}  user={user} />
           <div className="mainPaddingHoriz mainPaddingTop hasFiltrosGlobales">
               <section className="filtros-globales-container">
                    <FiltrosGlobales />
               </section>
               <MainTable titulo="facturas" campos={campos} contenido={facturas} setActionRow={setActionRow} setConfirmData={setConfirmData} setRenderModal={setRenderModal} loading={loading.ordenes} />
           </div>
        </>
        
    )
}

export default Facturas;