import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { useAppContext } from '../../contexts/AppContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainTable from '../../components/MainTable/MainTable';
import CreateCliente from '../../components/CreateCliente/CreateCliente';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import EditCliente from '../../components/EditCliente/EditCliente';

import "./Clientes.css";

const Clientes = ({setActiveTab, user}) => {

    const { loading } = useAppContext()
    const[actionRow, setActionRow] = useState(false)
    const[renderModal, setRenderModal] = useState({type:'', data:{}})
    var clientes = useSelector(state => state.clientes)

    const campos = [ 'Fecha', 'Nombre', 'Telefono', 'Origen', 'Localidad', 'ID', 'Saldo']

    return(
        
        <>
            {renderModal.type === 'confirm-delete' &&
                <ConfirmDelete tipo="Cliente" item={actionRow} setRenderModal={setRenderModal} />
            }
            
           {renderModal.type === 'edit-cliente' && 
                <EditCliente data={renderModal.data} setRenderModal={setRenderModal} />
            }
            {renderModal.type === 'create-cliente' &&
                <CreateCliente setRenderModal={setRenderModal}  />
            }
           <Sidebar vista="clientes" setActiveTab={setActiveTab} user={user} />
           <div className="mainPaddingHoriz mainPaddingTop">
                <MainTable titulo="clientes" campos={campos} setActionRow={setActionRow} contenido={clientes} setRenderModal={setRenderModal} loading={loading.clientes} />
           </div>
        </>
        
    )
}

export default Clientes;