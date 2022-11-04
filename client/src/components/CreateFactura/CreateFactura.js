import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useAppContext } from '../../contexts/AppContext';
import { getClienteNombre } from '../MainTable/MainRow/utils';
import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader'
import { estados, oficinas } from '../../GlobalFunctions'
import { createFactura } from '../../actions/ordenes';
import Input from '../Input/Input';
import IdSelector from '../IdSelector/IdSelector';
import './CreateFactura.css?r=4'


const CreateFactura = ({ setRenderModal}) => {

    const { oficina } = useAppContext()
    const cambio_dia = useSelector(state => state?.config?.cambio_dia)
    const [facturaData, setFacturaData] = useState({monto_factura_ars: 0, monto_factura_usd: 0, cambio_nuestro:cambio_dia, oficina, tipo_factura: "C"})
    const [loading, setLoading] = useState(false)
    const operaciones = useSelector(state => state.operaciones)
    const proveedores = useSelector(state => state.proveedores)
    const cuentas = useSelector(state => state?.cuentas)
    const ordenData = {tipo: 'Factura', cliente: facturaData?.operacion?.cliente?._id, estado:facturaData?.estado, nota:facturaData?.nota, usd: 0, operacion: facturaData?.operacion?._id, oficina: facturaData?.oficina, fecha_entrega: facturaData?.fecha_entrega}

    const dispatch = useDispatch()

    useEffect(()=>{
        var monto_factura_usd = parseFloat((facturaData.monto_factura_ars / facturaData.cambio_nuestro).toFixed(2))
        if(monto_factura_usd >0 && monto_factura_usd != Infinity){
            document.getElementById('cf-monto-factura-usd').value = monto_factura_usd.toFixed(2)
        }
        setFacturaData({...facturaData, monto_factura_usd, ars: facturaData.monto_factura_ars})
    },[facturaData.monto_factura_ars, facturaData.cambio_nuestro])

    function getMontoFacturaArsComision(){
        if(facturaData.tipo_factura==="A"){
            const montoFraArsMasIva =  parseInt(facturaData.monto_factura_ars) + parseInt(facturaData.monto_factura_ars) * .21
            return (montoFraArsMasIva * parseFloat((facturaData.comision / 100)) + montoFraArsMasIva).toFixed(2)
        }
        return parseInt(facturaData.monto_factura_ars) + parseInt(facturaData.monto_factura_ars) * parseFloat((facturaData.comision / 100))
    }
    
    useEffect(()=>{
        const monto_factura_ars_comision = getMontoFacturaArsComision()
        const monto_factura_usd_comision = (monto_factura_ars_comision / facturaData.cambio_nuestro).toFixed(2)
        setFacturaData({...facturaData, monto_factura_ars_comision, monto_factura_usd_comision})
    }, [facturaData.comision, facturaData.tipo_factura])

    useEffect(()=>{

    }, [])

    function validateForm(){
        if(facturaData.operacion?._id) return true
        alert("Asocie una operación válida.")
        return false
    }

    async function handleSubmit(){
        const canProceed = validateForm();
        if(canProceed){
            setLoading(true)
            const onSuccess = () => (setLoading(false), setRenderModal(''))
            const factura = {...ordenData, tipo_orden: {factura: facturaData}}
            await createFactura({factura}, dispatch)
            onSuccess()
        }
    }



    return(
            <ModalContainer tipo="create-factura" setRenderModal={setRenderModal}>
                <div id="create-factura" className="form-cargar" onClick={(e)=>e.stopPropagation()}>
                    <h2>Cargar Factura</h2>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="data-cont" style={{maxWidth: "100%"}}>
                            <label htmlFor="Operacion vinculada">Operacion vinculada:</label>
                            <IdSelector entities={operaciones} onChange={(value) => setFacturaData({...facturaData, operacion: value})} />
                        </div>
                        <div className="multiple-data-cont" style={{justifyContent: "unset"}}>
                            <div className="data-cont" style={{marginRight: "20px"}}>
                                <label htmlFor="Monto Factura ARS">Monto Factura ARS</label>
                                <input type="number" name="Monto Facura ARS" autoComplete="off" onChange={(e) => setFacturaData({...facturaData, monto_factura_ars: e.target.value})} />
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Cambio Nuestro">Cambio Nuestro</label>
                                <input type="number" value={facturaData.cambio_nuestro} style={{width: "55px"}} autoComplete="off" onChange={(e) => setFacturaData({...facturaData, cambio_nuestro: parseFloat(e.target.value).toFixed(2)})} />
                            </div>                                                   
                        </div>
                        <div className="multiple-data-cont" style={{justifyContent: "unset"}}>
                            <div className="data-cont" style={{marginRight: "20px"}}>
                                <label htmlFor="Monto Factura USD">Monto Factura USD</label>
                                <input type="number" name="Monto Facura USD" id="cf-monto-factura-usd" autoComplete="off" onChange={(e) => setFacturaData({...facturaData, monto_factura_usd: parseFloat(e.target.value).toFixed(2)})} />
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Comision">Comision</label>
                                <input type="number" name="Comision" style={{width: "55px"}} autoComplete="off" onChange={(e) => setFacturaData({...facturaData, comision: parseFloat(e.target.value).toFixed(2)})} />
                            </div>
                        </div>
                        <div className="data-cont">
                            <label htmlFor="proveedor-as-cliente">Tipo factura:</label>
                            <div className="radio-container">
                                {["C", "A"].map((tipo_factura)=>
                                    <>
                                        <input style={{width: "auto"}} type="radio" checked={facturaData.tipo_factura === tipo_factura} value={facturaData.tipo_factura} onChange={() => setFacturaData({...facturaData, tipo_factura})} />
                                        <label>{tipo_factura}</label>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="multiple-data-cont" style={{justifyContent: "unset"}}>
                            <div className="data-cont" style={{marginRight: "20px"}}>
                                <label htmlFor="Monto Factura ARS +%">Monto Factura ARS (+%)</label>
                                <input type="number" name="Monto Facura ARS +%" id="cf-monto-factura-ars-comision" value={facturaData.monto_factura_ars_comision} autoComplete="off" onChange={(e) => setFacturaData({...facturaData, monto_factura_ars_comision: e.target.value})} />
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Monto Factura USD +%">Monto Factura USD (+%)</label>
                                <input type="number" name="Monto Facura USD +%" id="cf-monto-factura-usd-comision" value={facturaData.monto_factura_usd_comision} autoComplete="off" onChange={(e) => setFacturaData({...facturaData, monto_factura_usd_comision: e.target.value})} />
                            </div>
                        </div>
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{width: "48%"}}>
                                <label htmlFor="Estado">Estado Factura:</label>
                                <select name="Estado" style={{width: "100%"}} onChange={(e) => setFacturaData({...facturaData, estado: e.target.value})} >
                                    <option value=""></option>
                                    {estados.ordenes.slice(0, estados.ordenes.length - 1).map((estado)=> 
                                        <option value={estado} key={estado}>{estado}</option>
                                    )}
                                </select>
                            </div>
                            <div className="data-cont" style={{width: "48%"}}>
                                <label htmlFor="Estado">Forma de Pago:</label>
                                <select name="Estado" style={{width: "100%"}} onChange={(e) => setFacturaData({...facturaData, forma_de_pago: e.target.value})} >
                                    <option value=""></option>
                                    <option value="Deposito">Depósito</option>
                                    <option value="Transferencia">Transferencia</option>
                                </select>
                            </div>
                        </div>
                        {facturaData.forma_de_pago === 'Transferencia' &&
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{maxWidth: "100%"}}>
                                <label htmlFor="Proveedor">Proveedor (ARS):</label>
                                <select name="Proveedor" onChange={(e) => setFacturaData({...facturaData, proveedor: e.target.value})} >
                                    <option value=""></option>
                                    {proveedores.filter((prov)=>prov.divisa === "ARS").map((proveedor)=>(
                                    <option value={proveedor._id} key={proveedor._id}>{proveedor.nombre} - ({proveedor.divisa})</option>
                                    ))}  
                                </select>
                            </div>
                            <div className="data-cont" style={{width: "100%"}}>
                                <label>Cuenta de destino</label>
                                <select onChange={(e)=>setFacturaData({...facturaData, cuenta_destino: e.target.value})}>
                                    <option value=""></option>
                                    {cuentas.filter(cuenta => cuenta?.proveedor?._id == facturaData.proveedor).map((cuenta)=>
                                        <option value={cuenta._id} key={cuenta._id}>{cuenta.nombre}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        }
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{width: "100%"}}>
                                <label>Oficina</label>
                                <select onChange={(e)=>setFacturaData({...facturaData, oficina: e.target.value})}>
                                    {oficinas.map((ofi)=>
                                    <option value={ofi} selected={ofi === oficina} key={ofi}>{ofi}</option>
                                    )}
                                </select>
                            </div>
                            <div className="data-cont" style={{width: "100%", height: "52px"}}>
                                <label>Fecha de Entrega</label>
                                <Input type="date" onChange={(value)=>setFacturaData({...facturaData, fecha_entrega: value})} />
                            </div>
                        </div>
                        <div className="data-cont" style={{width: "100%", maxWidth: "100%"}}>
                            <label htmlFor="notas">Notas</label>
                            <textarea name="notas" cols="30" rows="10" onChange={(e)=>setFacturaData({...facturaData, nota:e.target.value})}></textarea>
                        </div>
                        <div className="cont-btns">
                            <div className="btn-cancelar" onClick={()=>setRenderModal('')}>Cancelar</div>
                            <div className="btn-create" id="btn-crear-factura" onClick={handleSubmit}>Crear Factura</div>
                        </div>
                    </form>
                    { loading && 
                        <FormLoader />
                    }
                </div>
  
            </ModalContainer>
    )
}

export default CreateFactura

