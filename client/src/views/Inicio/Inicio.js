import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import { getAll } from '../../actions/reportes'
import { useAppContext } from '../../contexts/AppContext';
import * as utils from './utils';

import MainTable from '../../components/MainTable/MainTable';
import Sidebar from '../../components/Sidebar/Sidebar';
import Avatar from '../../components/Avatar/Avatar';
import TarjetaData from '../../components/TarjetaData/TarjetaData';
import TarjetaCajas from '../../components/TarjetaCajas/TarjetaCajas';
import CreateOperacion from '../../components/CreateOperacion/CreateOperacion';
import EditBajada from '../../components/EditBajada/EditBajada';
import EditSubida from '../../components/EditSubida/EditSubida';
import EditCrypto from '../../components/EditCrypto/EditCrypto';
import EditCambio from '../../components/EditCambio/EditCambio';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import FiltrosGlobales from '../../components/FiltrosGlobales/FiltrosGlobales';

import './Inicio.css'
import {  periodos } from '../../GlobalFunctions';


const Inicio = ({setActiveTab, user}) => {

    const { oficina } = useAppContext()
    const [avatar, setAvatar] = useState({mainText: "", secondaryText: ""})
    const[actionRow, setActionRow] = useState(false)
    const[renderModal, setRenderModal] = useState({type:'', data:{}})
    const[loading, setLoading] = useState({
        operacionesHoy: false,
        tarjetaData: false
    })

    const operaciones = useSelector(state => state.operaciones.filter((operacion)=>utils.filterOperacionesHoy(operacion, oficina)))
    const reportes = useSelector(state => state.reportes)

    const tarjetaReportes = [
        {
            titulo: '',
            prefijo: '',
            sufijo: '',
            numero: reportes.counts.clientes,
            descr: 'Nuevos clientes el último mes'
        },
        {
            titulo: '',
            prefijo: '',
            sufijo: '',
            numero: reportes.counts.operaciones,
            descr: 'Operaciones el último mes'
        },
        {
            titulo: '',
            prefijo: '',
            sufijo: '',
            numero: reportes.counts.ordenes,
            descr: 'Órdenes el último mes'
        }
    ]

    const campos = ['Cliente', 'Tipo', 'Monto', 'Estado']

    const dispatch = useDispatch()

    useEffect(()=>{
        setLoading({...loading, tarjetaData: true})
        const count_periodo = periodos.get_rango_from_periodo(periodos.periodos[1])
        dispatch(getAll({params:{tipo: 'count', count_periodo, oficina}})).then(()=>setLoading({...loading, tarjetaData: false}))
    }, [])

    useEffect(()=>{
        avatar.secondaryText === "" && setAvatar({...avatar, secondaryText: "Quedan " + operaciones.length + " operaciones pendientes"  })
    })
    
    useEffect(()=>{
        setAvatar({...avatar, mainText: `Hola ${user?.name}!`  })
    }, [user])   

    return(
        <>
            {renderModal.type === 'create-operacion' && 
                <CreateOperacion setRenderModal={setRenderModal}  />
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
            <Sidebar vista="inicio" setActiveTab={setActiveTab} />
            <div id="inicio-view">

                <div className="mainPaddingHoriz mainPaddingTop hasFiltrosGlobales">
                <section className="filtros-globales-container">
                    <FiltrosGlobales />
               </section>

                <div className="bd-two-col">
                    <div className="bd-col">
                        <Avatar avatar={avatar} />
                    </div>
                    <div className="bd-col">
                        <TarjetaCajas  />
                    </div>
                </div>

                <div className="main-two-col">
                    <div className="mt-col">
                        <MainTable titulo="operaciones de hoy" campos={campos} setRenderModal={setRenderModal} contenido={operaciones} setActionRow={setActionRow} loading={loading.operacionesHoy} />
                    </div>
                    <div className="mt-col">
                        <TarjetaData tarjetaData={tarjetaReportes} loading={loading.tarjetaData} />
                    </div>
                </div>
                </div>

            </div>
        </>
    )
}

export default Inicio