import React, {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useAppContext } from '../../contexts/AppContext';
import { estados, oficinas, operacionDefaults, parseNumberFields, tipos, divisaRecibeFunc } from '../../GlobalFunctions';
import { getMovimientos } from '../../actions/movimientos';
import { createOperacion } from '../../actions/operaciones';
import Input from '../Input/Input';
import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader';
import CreateBajada from './CreateBajada/CreateBajada';
import CreateSubida from './CreateSubida/CreateSubida';
import CreateCrypto from './CreateCrypto/CreateCrypto';
import CreateCambio from './CreateCambio/CreateCambio';
import IdSelector from '../IdSelector/IdSelector';

import './CreateOperacion.css';

const CreateOpeacion = ({setRenderModal, tipo_operacion=null}) => {

    const { oficina } = useAppContext()
    const cambio_dia = useSelector(state => state?.config?.cambio_dia)
    const [operacionData, setOperacionData] = useState({estado: estados.operaciones[0], tipo_operacion, oficina, cambio_prj: cambio_dia})
    const [operacionCon, setOperacionCon] = useState("Cliente")
    const [loading, setLoading] = useState(false)    
    const clientes = useSelector(state => state?.clientes)
    const proveedores = useSelector(state => state?.proveedores)
    const [divisaRecibe, setDivisaRecibe] =  useState('USD')

    const dispatch = useDispatch()
    const movimientosProveedorAsCliente = useSelector(state=>state?.movimientos?.filter((mov)=>mov?.proveedor?._id === operacionData?.proveedor_as_cliente))

    useEffect(()=>{
        dispatch(getMovimientos())
    }, [])

    const refs = {
        cliente: useRef(),
        cliente_borrador: useRef()
    }

    function changeCliente(value, type){
        if(type === "existente"){
            setOperacionData({...operacionData, cliente: value, cliente_borrador: "", proveedor_as_cliente:null})
        }else{
            setOperacionData({...operacionData, cliente_borrador: value, cliente: "", proveedor_as_cliente:null})
        }
    }

    useEffect(()=>{
        if(operacionCon==="Cliente"){
            setOperacionData({...operacionData, proveedor_as_cliente: null})
        }else{
            setOperacionData({...operacionData, cliente:null, cliente_borrador: null})
        }
    }, [operacionCon])

    useEffect(()=>{
        const proveedorAsCliente = proveedores.filter((prov) => prov._id === operacionData?.proveedor_as_cliente)
        if(proveedorAsCliente.length===1){
            setOperacionData({...operacionData, tipo_cambio: proveedorAsCliente[0].divisa === "ARS" ? "Compra" : "Venta"})
        }
    }, [operacionData.proveedor_as_cliente])

    useEffect(() => {
        setDivisaRecibe( divisaRecibeFunc(operacionData) )
    }, [operacionData])

    async function handleSubmit(){
        setLoading(true)
        const onSuccess = () => (setLoading(false), setRenderModal(''))
        const res = await createOperacion(parseNumberFields(operacionData), dispatch)
        onSuccess()
    }

    function renderSubForm(){
        switch(operacionData.tipo_operacion){
            case "Bajada":
                return <CreateBajada operacionData={operacionData} setOperacionData={setOperacionData} divisaRecibe={divisaRecibe} operacionCon={operacionCon} />
            case "Subida":
                return <CreateSubida operacionData={operacionData} setOperacionData={setOperacionData} divisaRecibe={divisaRecibe} operacionCon={operacionCon} />
            case "Crypto":
                return <CreateCrypto operacionData={operacionData} setOperacionData={setOperacionData} divisaRecibe={divisaRecibe} operacionCon={operacionCon} />
            case "Cambio":
                return <CreateCambio operacionData={operacionData} setOperacionData={setOperacionData} divisaRecibe={divisaRecibe} operacionCon={operacionCon} />
            default:
                return <></>
        }
    }
    

    return ( 

        <ModalContainer tipo="create-operacion" setRenderModal={setRenderModal}>
            <div className="create-operacion" onClick={(e)=>e.stopPropagation()}>
                
                <div className="form-cargar">

                    <h2>Crear {operacionData.tipo_operacion ? operacionData.tipo_operacion : "Operacion"}</h2>

                    <form action="">
                        <div className="data-cont" style={{width: "100%"}}>
                            <label htmlFor="tipo-operacion">Tipo de operacion</label>
                            <div className="radio-container">
                                <input type="radio" checked={operacionData.tipo_operacion === 'Bajada'} name="Tipo de operacion" value="Bajada" onChange={(e) => setOperacionData({...operacionDefaults[e.target.value], tipo_operacion: e.target.value, cliente: operacionData.cliente, cliente_borrador: operacionData.cliente_borrador, corroborar: operacionData.corroborar, oficina, cambio_prj: cambio_dia})} disabled={tipo_operacion !== null} />
                                <label htmlFor="Bajada">Bajada</label>
                                <input type="radio" checked={operacionData.tipo_operacion === 'Subida'} name="Tipo de operacion" value="Subida" onChange={(e) => setOperacionData({...operacionDefaults[e.target.value], tipo_operacion: e.target.value, cliente: operacionData.cliente, cliente_borrador: operacionData.cliente_borrador, corroborar: operacionData.corroborar, oficina, cambio_prj: cambio_dia})} disabled={tipo_operacion !== null} />
                                <label htmlFor="Subida">Subida</label>
                                <input type="radio" checked={operacionData.tipo_operacion === 'Crypto'} name="Tipo de operacion" value="Crypto" onChange={(e) => setOperacionData({...operacionDefaults[e.target.value], tipo_operacion: e.target.value, cliente: operacionData.cliente, cliente_borrador: operacionData.cliente_borrador, corroborar: operacionData.corroborar, oficina, cambio_prj: cambio_dia})} disabled={tipo_operacion !== null} />
                                <label htmlFor="Crypto">Crypto</label>
                                <input type="radio" checked={operacionData.tipo_operacion === 'Cambio'} name="Tipo de operacion" value="Cambio" onChange={(e) => setOperacionData({...operacionDefaults[e.target.value], tipo_operacion: e.target.value, cliente: operacionData.cliente, cliente_borrador: operacionData.cliente_borrador, corroborar: operacionData.corroborar, oficina, cambio_prj: cambio_dia})} disabled={tipo_operacion !== null} />
                                <label htmlFor="Cambio">Cambio</label>
                            </div>
                        </div>

                        {(operacionData.tipo_operacion === "Cambio") &&
                            <div className="data-cont" style={{width: "100%"}}>
                                <label htmlFor="proveedor-as-cliente">Operación con:</label>
                                <div className="radio-container">
                                    {["Cliente", "Proveedor"].map((entity)=>
                                        <>
                                            <input type="radio" checked={operacionCon === entity} value={entity} onChange={(e) => setOperacionCon(entity)} />
                                            <label>{entity}</label>
                                        </>
                                    )}
                                </div>
                            </div>
                        }

                        {operacionCon === "Cliente" ? 
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{width: "100%"}}>
                                <label>Cliente</label>
                                <select ref={refs.cliente} value={operacionData?.cliente} onChange={(e)=>changeCliente(e.target.value, "existente")}>
                                    <option value=""></option>
                                    {clientes.map((cliente)=>(
                                        <option value={cliente._id} key={cliente._id}>{cliente.nombre}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="data-cont">
                                <label>Cliente Borrador</label>
                                <input type="text" ref={refs.cliente_borrador} value={operacionData?.cliente_borrador} onChange={(e)=>changeCliente(e.target.value, "borrador")} />
                            </div>
                        </div>
                        :
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{width: "100%"}}>
                                <label>Proveedor</label>
                                <select value={operacionData?.proveedor_as_cliente} onChange={(e)=>setOperacionData({...operacionData, proveedor_as_cliente: e.target.value})}>
                                    <option value=""></option>
                                    {proveedores.map((proveedor)=>(
                                        <option value={proveedor._id} key={proveedor._id}>{proveedor.nombre} - ({proveedor.divisa})</option>
                                    ))}
                                </select>
                            </div>
                            {operacionData.proveedor_as_cliente !== undefined &&
                            <div className="data-cont">
                                <label>Movimiento asociado</label>
                                <IdSelector entities={movimientosProveedorAsCliente} onChange={(value)=>setOperacionData({...operacionData, monto_enviado: Math.abs(value.importe)})}/>
                            </div>
                            }
                        </div>
                        }

                        <div className="data-cont" style={{width: "100%"}}>
                            <label>Corroborar</label>
                            <input type="checkbox" checked={operacionData?.corroborar} onClick={()=>setOperacionData({...operacionData, corroborar: !operacionData.corroborar})} />
                        </div>

                        {renderSubForm()}        
                        
                        {operacionData.tipo_operacion !== null &&
                        <>
                            <div className="multiple-data-cont">
                                <div className="data-cont" style={{width: "100%"}}>
                                    <label>Oficina</label>
                                    <select onChange={(e)=>setOperacionData({...operacionData, oficina: e.target.value})}>
                                        {oficinas.map((ofi)=>
                                        <option value={ofi} selected={ofi === oficina} key={ofi}>{ofi}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="data-cont" style={{width: "100%", height: "52px"}}>
                                    <label>Fecha de Entrega</label>
                                    <Input type="date" onChange={(value)=>setOperacionData({...operacionData, fecha_entrega: value})} />
                                </div>
                            </div>   
                            <div className="multiple-data-cont">
                                <ComoRecibeSelect operacionData={operacionData} setOperacionData={setOperacionData} />
                            </div>
                            <div className="data-cont" style={{width: "100%", maxWidth: "100%"}}>
                                <label>Notas</label>
                                <textarea cols="30" rows="10" onChange={(e)=>setOperacionData({...operacionData, nota:e.target.value})}></textarea>
                            </div>
                        </>
                        }     

                        <div className="cont-btns">
                            <div className="btn-cancelar" onClick={()=>setRenderModal('')}>Cancelar</div>
                            {operacionData.tipo_operacion !== null &&
                                <div className="btn-create" onClick={handleSubmit}>Crear Operación</div>
                            }
                        </div>
                    </form>
                { loading && 
                    <FormLoader />
                }
                </div>


            </div>
        </ModalContainer>
     );
}

export const ComoRecibeSelect = ({ operacionData, setOperacionData, edit=true }) => {
    return (
        <div className="data-cont" style={{width: "50%"}}>
            <label>Cómo recibe:</label>
            <select onChange={(e)=>setOperacionData({...operacionData, como_recibe: e.target.value})}  disabled={!edit}>
                <option value=""></option>
                {tipos.ordenes.map((tipo_orden)=>
                    <option value={tipo_orden} selected={operacionData.como_recibe === tipo_orden} key={tipo_orden}>
                        {tipo_orden}
                    </option>
                )}
            </select>
        </div>
    )
}
 
export default CreateOpeacion;
