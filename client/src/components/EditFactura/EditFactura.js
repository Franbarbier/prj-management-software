import React, {useState, useRef, useLayoutEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ModalContainer from '../ModalContainer/ModalContainer';
import { oficinas } from '../../GlobalFunctions'
import { editOrdenes } from '../../actions/ordenes';
import Input from '../Input/Input';
import FormLoader from '../FormLoader/FormLoader'
import FormHeader from '../FormHeader/FormHeader'
import FormEditBtns from '../FormEditBtns/FormEditBtns'

import './EditFactura.css?r=4'

const EditFactura = ({setRenderModal, data}) => {

    const [facturaData, setFacturaData] = useState(JSON.parse(JSON.stringify(data)))
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(false)
    const firstUpdate = useRef(true)
    const dispatch = useDispatch()
    const proveedores = useSelector(state => state.proveedores)
    const cuentas = useSelector(state => state?.cuentas)

    useLayoutEffect(()=>{
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        var monto_factura_usd = parseFloat((facturaData.tipo_orden.factura.monto_factura_ars / facturaData.tipo_orden.factura.cambio_nuestro)).toFixed(2)
        var orden_factura = facturaData
        orden_factura.tipo_orden.factura.monto_factura_usd = monto_factura_usd        
    },[facturaData.tipo_orden.factura.monto_factura_ars, facturaData.tipo_orden.factura.cambio_nuestro])

    
    useLayoutEffect(()=>{
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }       
        var monto_factura_ars_comision = parseInt(facturaData.tipo_orden.factura.monto_factura_ars) + parseInt(facturaData.tipo_orden.factura.monto_factura_ars) * parseFloat((facturaData.tipo_orden.factura.comision / 100))
        document.getElementById('cf-monto-factura-ars-comision').value = monto_factura_ars_comision
        var monto_factura_usd_comision = monto_factura_ars_comision / facturaData.tipo_orden.factura.cambio_nuestro
        document.getElementById('cf-monto-factura-usd-comision').value = monto_factura_usd_comision.toFixed(2)
        var orden_factura = facturaData
        orden_factura.tipo_orden.factura.monto_factura_ars_comision = monto_factura_ars_comision
        orden_factura.tipo_orden.factura.monto_factura_usd_comision = monto_factura_usd_comision
    }, [facturaData.tipo_orden.factura.comision, facturaData.tipo_orden.factura.monto_factura_ars, facturaData.tipo_orden.factura.cambio_nuestro])
   
    async function handleSubmit(){
        setLoading(true)
        const onSuccess = () => (setLoading(false), setRenderModal(''))
        await editOrdenes([facturaData], false, dispatch)
        onSuccess()
    }

    return(
            <ModalContainer tipo="edit-factura" setRenderModal={setRenderModal}>

                <div id="edit-factura" className="form-cargar" onClick={(e)=>e.stopPropagation()}>

                    <FormHeader edit={edit} setEdit={setEdit} tipo="Factura" />

                    <form action="" onSubmit={handleSubmit}>

                        <div className="data-cont operacion-vinculada">
                            <label htmlFor="">Operación vinculada:</label>
                            <div>{facturaData?.operacion?._id}</div>
                        </div>

                        <div className="multiple-data-cont" style={{justifyContent: "unset"}}>
                            <div className="data-cont" style={{marginRight: "20px"}}>
                                <label htmlFor="Monto Factura ARS">Monto Factura ARS</label>
                                <input type="number" name="Monto Facura ARS" id="" defaultValue={facturaData.tipo_orden.factura.monto_factura_ars} autoComplete="off" onChange={(e) => {var orden_factura = facturaData; orden_factura.tipo_orden.factura.monto_factura_ars = parseFloat(e.target.value); setFacturaData({...orden_factura})}}  disabled={!edit}/>
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Cambio Nuestro">Cambio Nuestro</label>
                                <input type="number" name="Cambio Nuestro" style={{width: "55px"}} defaultValue={facturaData.tipo_orden.factura.cambio_nuestro} id="" autoComplete="off" onChange={(e) => {var orden_factura = facturaData; orden_factura.tipo_orden.factura.cambio_nuestro = parseFloat(e.target.value); setFacturaData({...orden_factura})}}  disabled={!edit}/>
                            </div>
                        </div>

                        <div className="multiple-data-cont" style={{justifyContent: "unset"}}>
                            <div className="data-cont" style={{marginRight: "20px"}}>
                                <label htmlFor="Monto Factura USD">Monto Factura USD</label>
                                <input type="number" name="Monto Facura USD" defaultValue={facturaData.tipo_orden.factura.monto_factura_usd} id="cf-monto-factura-usd" autoComplete="off" onChange={(e) => {var orden_factura = facturaData; orden_factura.tipo_orden.factura.monto_factura_usd = parseFloat(e.target.value); setFacturaData({...orden_factura})}}  disabled={!edit}/>
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Comision">Comision</label>
                                <input type="number" name="Comision" style={{width: "55px"}} id="" defaultValue={facturaData.tipo_orden.factura.comision} autoComplete="off" onChange={(e) => {var orden_factura = facturaData; orden_factura.tipo_orden.factura.comision = parseFloat(e.target.value); setFacturaData({...orden_factura})}}  disabled={!edit}/>
                            </div>
                        </div>
                        <div className="data-cont">
                            <label htmlFor="proveedor-as-cliente">Tipo factura:</label>
                            <div className="radio-container">
                                {["C", "A"].map((tipo_factura)=>
                                    <>
                                        <input style={{width: "auto"}} type="radio" checked={facturaData.tipo_orden.factura.tipo_factura === tipo_factura} value={facturaData.tipo_orden.factura.tipo_factura} onChange={() => {var orden_factura = facturaData; orden_factura.tipo_orden.factura.tipo_factura = tipo_factura; setFacturaData({...orden_factura})}} disabled={!edit} />
                                        <label>{tipo_factura}</label>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="multiple-data-cont" style={{justifyContent: "unset"}}>
                            <div className="data-cont" style={{marginRight: "20px"}}>
                                <label htmlFor="Monto Factura ARS +%">Monto Factura ARS (+%)</label>
                                <input type="number" name="Monto Facura ARS +%" id="cf-monto-factura-ars-comision" defaultValue={facturaData.tipo_orden.factura.monto_factura_ars_comision} autoComplete="off" onChange={(e) => {var orden_factura = facturaData; orden_factura.tipo_orden.factura.monto_factura_ars_comision = parseInt(e.target.value); setFacturaData({...orden_factura})}}   disabled={!edit}/>
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Monto Factura USD +%">Monto Factura USD (+%)</label>
                                <input type="number" name="Monto Facura USD +%" id="cf-monto-factura-usd-comision" defaultValue={facturaData.tipo_orden.factura.monto_factura_usd_comision} autoComplete="off" onChange={(e) => {var orden_factura = facturaData; orden_factura.tipo_orden.factura.monto_factura_usd_comision = parseFloat(e.target.value); setFacturaData({...orden_factura})}}  disabled={!edit}/>
                            </div>
                        </div>
                        
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{width: "48%"}}>
                                <label htmlFor="Formas pago">Forma de Pago:</label>
                                <select name="Formas pago" id="" style={{width: "100%"}} onChange={(e) => {var orden_factura = facturaData; orden_factura.tipo_orden.factura.forma_de_pago = e.target.value; setFacturaData({...orden_factura})}}  disabled={!edit}>
                                    <option value="Deposito" selected={"Deposito" === facturaData.tipo_orden.factura.forma_de_pago}>Depósito</option>
                                    <option value="Transferencia" selected={"Transferencia" === facturaData.tipo_orden.factura.forma_de_pago}>Transferencia</option>
                                </select>
                            </div>
                        </div>

                        {facturaData.tipo_orden.factura.forma_de_pago === 'Transferencia' &&
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{maxWidth: "100%"}}>
                                <label htmlFor="Proveedor">Proveedor:</label>
                                <select name="Proveedor" value={facturaData.tipo_orden.factura.proveedor} onChange={(e) => {let copyFacturaData = {...facturaData}; copyFacturaData.tipo_orden.factura.proveedor = e.target.value; setFacturaData(copyFacturaData)}}  disabled={!edit}>
                                    <option value=""></option>
                                    {proveedores.map((proveedor)=>(
                                        <option value={proveedor._id} key={proveedor._id}>{proveedor.nombre} - ({proveedor.divisa})</option>
                                        ))}
                                    
                                </select>
                            </div>
                            <div className="data-cont" style={{width: "100%"}}>
                                <label>Cuenta de destino</label>
                                <select onChange={(e) => {let copyFacturaData = {...facturaData}; copyFacturaData.tipo_orden.factura.cuenta_destino = e.target.value; setFacturaData(copyFacturaData)}} value={facturaData.tipo_orden.factura.cuenta_destino} disabled={!edit}>
                                    <option value=""></option>
                                    {cuentas.filter(cuenta => cuenta?.proveedor?._id === facturaData.tipo_orden.factura.proveedor).map((cuenta)=>
                                        <option value={cuenta._id} key={cuenta._id}>{cuenta.nombre}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        }

                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{width: "100%"}}>
                                <label>Oficina</label>
                                <select onChange={(e)=>setFacturaData({...facturaData, oficina: e.target.value})} disabled={!edit}>
                                    {oficinas.map((oficina)=>
                                        <option value={oficina} selected={facturaData.oficina === oficina} key={oficina}>{oficina}</option>
                                    )}
                                </select>
                            </div>
                            <div className="data-cont" style={{width: "100%", height: "52px"}}>
                                <label>Fecha de Entrega</label>
                                <Input type="date" value={facturaData.fecha_entrega} onChange={(value)=>setFacturaData({...facturaData, fecha_entrega: value})}  disabled={!edit}/>
                            </div>
                        </div>

                        <div className="data-cont" style={{width: "100%", maxWidth: "100%"}}>
                            <label htmlFor="notas">Notas</label>
                            <textarea name="notas" id="" cols="30" rows="10" defaultValue={facturaData.nota} onChange={(e)=>setFacturaData({...facturaData, nota:e.target.value})} disabled={!edit}></textarea>
                        </div>

                        <FormEditBtns handleSubmit={handleSubmit} setRenderModal={setRenderModal} edit={edit} tipo="Factura" />

                    </form>
                    { loading && 
                    <FormLoader />
                    }
                </div>
  
            </ModalContainer>
    )
}

export default EditFactura

