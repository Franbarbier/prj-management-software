import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import { getClienteNombre } from '../MainTable/MainRow/utils'; 
import { divisaRecibeFunc } from '../../GlobalFunctions';
import ModalContainer from '../ModalContainer/ModalContainer';
import IdSelector from '../IdSelector/IdSelector';
import CreateOrden from './CreateOrden';

const CreateOrdenCont = ({ setRenderModal, hayOpereta, data}) => {

    const [divisaRecibe, setDivisaRecibe] =  useState('USD')

    const [hayOrden, setHayOrden] = useState(false)
    const [opereta, setOpereta] = useState()
    const [fecha_entrega, SetFecha_entrega] = useState()
    const [recibeProv, SetRecibeProv] = useState(false)
    const [datosOperacion , setDatosOperacion] = useState({
        fecha_creado: '',
        monto_a_entregar : '',
        como_recibe : '',
    })
   
    const operaciones = useSelector(state => state.operaciones)
    const entregasDefault = useSelector(state => state.ordenes.filter((ordens)=>ordens.operacion?._id == datosOperacion?._id ))
    
    useEffect(()=>{
       if (data) {
           setOpereta(data)
           setDatosOperacion({...data})

        }
    }, [])
    
    useEffect(()=>{
        if (datosOperacion.fecha_entrega) {
            SetFecha_entrega(datosOperacion.fecha_entrega.slice(0, 10))
        }else{
            SetFecha_entrega('')
        }

        setDivisaRecibe( divisaRecibeFunc(datosOperacion) )

        console.log(datosOperacion)
        if (datosOperacion.proveedor_as_cliente) {
            SetRecibeProv(true)
        }else{
            SetRecibeProv(false)

        }

    }, [datosOperacion])
        
    useEffect(()=>{
        console.log(recibeProv)
    }, [recibeProv])


    function handleChangeOperacion(operacion){
        setOpereta(operacion)
        setDatosOperacion({...operacion})
    }

 
    return(
            <>
              <ModalContainer tipo="create-orden" setRenderModal={setRenderModal}> 
                    <div id="create-orden" class="form-cargar" onClick={(e)=>e.stopPropagation()}> 
                        <div>
                            <>
                            <div className="multiple-data-cont" style={{width: "100%"}} id="cont-operacion-existente">
                                <div className="data-cont" style={{"width" : "45%"}}>
                                    <label htmlFor="operacion">Operación</label>
                                    {data ? 
                                    <input defaultValue={getClienteNombre(data) + " - " + data._id} disabled />
                                    :
                                    <IdSelector entities={operaciones} onChange={(value) => handleChangeOperacion(value)}  />
                                    }
                                </div>
                                <div className="data-cont" style={{"width" : "45%"}}>
                                    <label htmlFor="operacion">Tipo operación</label>
                                    <input defaultValue={datosOperacion.tipo_operacion} disabled />
                                </div>
                            </div>
                            <div className="multiple-data-cont" style={{width: "100%"}}>
                                <div className="data-cont" style={{"width" : "45%"}}>
                                    <label htmlFor="operacion"> {!recibeProv ? 'Cliente' : 'Proveedor'}</label>
                                    {!recibeProv ? 
                                        <input defaultValue={ datosOperacion.cliente ? datosOperacion.cliente.nombre : datosOperacion.cliente_borrador } disabled />
                                     : 
                                        <input defaultValue={ datosOperacion.proveedor_as_cliente.nombre } disabled />
                                     }
                                </div>
                                <div className="data-cont" style={{"width" : "45%"}}>
                                    <label htmlFor="operacion">Fecha</label>
                                    <input defaultValue={datosOperacion.fecha_creado} disabled />
                                </div>
                            </div>
                            
                            <div className="multiple-data-cont datos-orden" style={{width: "100%"}}>
                                <div className="data-cont">
                                    <label htmlFor="recibe">Tiene que recibir</label>
                                    <div className="tiene-que-recibir">
                                        <div className="recibe-usd">{divisaRecibe}</div>
                                        <input id="recibe" defaultValue={datosOperacion.monto_a_entregar} disabled type="number" />
                                    </div>
                                </div>
                                <div className="data-cont" style={{"width" : "45%"}}>
                                    <label htmlFor="operacion">Cómo quería recibir</label>
                                    <input defaultValue={datosOperacion.como_recibe} disabled />
                                </div>
                            </div>
                            <div className="multiple-data-cont datos-orden" style={{width: "100%"}}>
                                <div className="data-cont"  style={{"width" : "45%"}}>
                                    <label htmlFor="recibe">Fecha que quería recibir:</label>
                                    <input style={{'max-height': "1.2em"}} type="date" defaultValue={fecha_entrega} disabled/>
                                </div>
                                <div className="data-cont" style={{"width" : "45%"}}>
                                    <label htmlFor="operacion">Oficina</label>
                                    <input defaultValue={datosOperacion.oficina} disabled />
                                </div>
                            </div>
                            </>
                        </div>
                        <CreateOrden cambioPRJ={datosOperacion.cambio_prj} recibeProv={recibeProv} divisaRecibe={divisaRecibe} create={true} edit={true} cliente={opereta?.cliente} monto_a_entregar={hayOpereta ? data.monto_a_entregar : datosOperacion.monto_a_entregar} setRenderModal={setRenderModal} datosOperacion={datosOperacion} setHayOrden={setHayOrden} hayOrden={hayOrden} enOpereta={false} entregasDefault={entregasDefault} />
                    </div>
                </ModalContainer>
            </>
    )
}

export default CreateOrdenCont;
