import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ModalContainer from '../ModalContainer/ModalContainer';
import { getClienteNombre } from '../MainTable/MainRow/utils';
import { oficinas } from '../../GlobalFunctions'
import { editOrdenes } from '../../actions/ordenes';
import Input from '../Input/Input';
import FormLoader from '../FormLoader/FormLoader'
import FormHeader from '../FormHeader/FormHeader'
import FormEditBtns from '../FormEditBtns/FormEditBtns'
import './EditCash.css'

const CreateCash = ({setRenderModal, data}) => {

    const [cashData, setCashData] = useState({...data, cuenta_destino: data?.tipo_orden?.cash?.cuenta_destino, proveedor: data?.tipo_orden?.cash?.proveedor})
    const cuentas = useSelector(state => state?.cuentas)
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(false)
    const operaciones = useSelector(state => state.operaciones)
    const proveedores = useSelector(state => state.proveedores)

    const dispatch = useDispatch()

    function getMontoClienteMinusComision(){
        return (cashData.tipo_orden.cash.monto_cliente - (cashData.tipo_orden.cash.monto_cliente * (cashData.tipo_orden.cash.comision/100))).toFixed(2)
    }

    useEffect(()=>{
        setCashData({...cashData, tipo_orden: {...cashData.tipo_orden, cash:{...cashData.tipo_orden.cash, monto_envio: getMontoClienteMinusComision()}}})
    }, [cashData.tipo_orden.cash.comision])
   
    async function handleSubmit(){
        setLoading(true)
        const onSuccess = () => (setLoading(false), setRenderModal(''))
        await editOrdenes([cashData], false, dispatch)
        onSuccess()
    }

    console.log('CASHDATA: ', cashData)

    return(
            <ModalContainer tipo="edit-cash" setRenderModal={setRenderModal}>
                <div id="edit-cash" className="form-cargar" onClick={(e)=>e.stopPropagation()}>
                    <FormHeader edit={edit} setEdit={setEdit} tipo="Cash" />
                    <form action="" onSubmit={handleSubmit}>
                        <div className="data-cont operacion-vinculada">
                            <label htmlFor="">Operación vinculada:</label>
                            <div>{cashData?.operacion?._id}</div>
                        </div>
                        <div className="data-cont" style={{maxWidth: "100%"}}>
                            <label htmlFor="Operacion vinculada">Operacion vinculada:</label>
                            <select name="Operacion vinculada" id="" onChange={(e) => setCashData({...cashData, operacion: JSON.parse(e.target.value)})}  disabled>
                                <option value=""></option>
                                {operaciones.map((operacion)=>(
                                    <option value={operacion._id} selected={data.operacion?._id === operacion?._id} key={operacion._id}>{getClienteNombre(operacion) + ' - ' + operacion?._id}</option>
                                ))}
                                
                            </select>
                        </div>
                        <div className="multiple-data-cont" style={{justifyContent: "unset"}}>
                            <div className="data-cont" style={{marginRight: "20px"}}>
                                <label htmlFor="Monto Cliente">Monto Cliente</label>
                                <input type="number" name="Monto Cliente" value={cashData.tipo_orden.cash.monto_cliente} onChange={(e) => setCashData({...cashData, tipo_orden: {...cashData.tipo_orden, cash:{...cashData.tipo_orden.cash, monto_cliente: parseFloat(e.target.value)}}})} id="es-monto-cliente" autoComplete="off" disabled  disabled={!edit}/>
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Comision">Comision (%)</label>
                                <input type="number" name="Comision" style={{width: "55px"}} id="es-comision" autoComplete="off" value={cashData.tipo_orden.cash.comision} onChange={(e) => setCashData({...cashData, tipo_orden: {...cashData.tipo_orden, cash:{...cashData.tipo_orden.cash, comision: parseFloat(e.target.value)}}}) }  disabled={!edit}/>
                            </div>
                        </div>
                        <div className="multiple-data-cont" style={{justifyContent: "unset"}}>
                            <div className="data-cont" style={{marginRight: "20px"}}>
                                <label htmlFor="Monto Envío">Monto Envío</label>
                                <input type="number" name="Monto Envío" id="es-monto-envio" autoComplete="off" value={cashData.tipo_orden.cash.monto_envio} onChange={(e) => setCashData({...cashData, tipo_orden: {...cashData.tipo_orden, cash:{...cashData.tipo_orden.cash, monto_envio: parseFloat(e.target.value)}}}) }  disabled={!edit}/>
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Ubicación">Ubicación</label>
                                <input type="text" name="Ubicacion" id="es-ubicacion" defaultValue={cashData.localidad} autoComplete="off" onChange={(e) => setCashData({...cashData, localidad: e.target.value})}  disabled={!edit}/>
                            </div>
                        </div>
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{width: "100%"}}>
                                <label htmlFor="Proveedor">Proveedor:</label>
                                <select name="Proveedor" value={cashData?.tipo_orden?.cash?.proveedor} onChange={(e) => {let copyCashData = {...cashData}; copyCashData.tipo_orden.cash.proveedor = e.target.value; setCashData(copyCashData)}} disabled={!edit} >
                                    <option value=""></option>
                                    {proveedores.map((proveedor)=>(
                                        <option value={proveedor?._id} key={proveedor._id}>{proveedor.nombre} - ({proveedor.divisa})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="data-cont" style={{width: "100%"}} >
                                <label>Cuenta de destino</label>
                                <select onChange={(e) => {let copyCashData = {...cashData}; copyCashData.tipo_orden.cash.cuenta_destino = e.target.value; setCashData(copyCashData)}} value={cashData?.tipo_orden?.cash?.cuenta_destino} disabled={!edit}>
                                    <option value=""></option>
                                    {cuentas.filter(cuenta => cuenta?.proveedor?._id == cashData?.tipo_orden?.cash?.proveedor).map((cuenta)=>
                                        <option value={cuenta?._id} key={cuenta._id}>{cuenta.nombre}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{width: "100%"}}>
                                <label>Oficina</label>
                                <select onChange={(e)=>setCashData({...cashData, oficina: e.target.value})} disabled={!edit}>
                                    {oficinas.map((oficina)=>
                                    <option value={oficina} selected={cashData.oficina === oficina} key={oficina}>{oficina}</option>
                                    )}
                                </select>
                            </div>
                            <div className="data-cont" style={{width: "100%", height: "52px"}}>
                                <label>Fecha de Entrega</label>
                                <Input type="date" value={cashData.fecha_entrega} onChange={(value)=>setCashData({...cashData, fecha_entrega: value})}  disabled={!edit}/>
                            </div>              
                        </div>
                        <div className="data-cont" style={{width: "100%", maxWidth: "100%"}}>
                            <label htmlFor="notas">Notas</label>
                            <textarea name="notas" id="" cols="30" rows="10" defaultValue={cashData.nota} onChange={(e)=>setCashData({...cashData, nota:e.target.value})} disabled={!edit}></textarea>
                        </div>
                        <FormEditBtns handleSubmit={handleSubmit} setRenderModal={setRenderModal} edit={edit} tipo="Cash" />
                    </form>
                    { loading && 
                    <FormLoader />
                    }
                </div>
            </ModalContainer>
    )
}

export default CreateCash

