import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useAppContext } from '../../contexts/AppContext';
import { oficinas, estados } from '../../GlobalFunctions'
import { createCash } from '../../actions/ordenes';
import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader'
import Input from '../Input/Input';
import IdSelector from '../IdSelector/IdSelector';
import './CreateCash.css'


const CreateCash = ({ setRenderModal}) => {

    const { oficina } = useAppContext();
    const defaultCashData = { monto_factura_ars: 0, monto_factura_usd: 0, cambio_nuestro:0, oficina }
    const [cashData, setCashData] = useState(defaultCashData)
    const [loading, setLoading] = useState(false)
    var proveedores = useSelector(state => state.proveedores)
    var operaciones = useSelector(state => state.operaciones)
    const cuentas = useSelector(state => state?.cuentas)
    const ordenData = {tipo: 'Cash Cash', fecha_entrega: cashData.fecha_entrega, oficina: cashData?.oficina, cliente: cashData?.operacion?.cliente?._id, localidad: cashData.localidad, estado: cashData.estado, nota:cashData.nota, operacion: cashData?.operacion?._id}
    const dispatch = useDispatch()

    useEffect(()=>{
        setCashData({...cashData, monto_cliente: cashData?.operacion?.monto_a_entregar, localidad: cashData?.operacion?.cliente?.localidad })
    }, [cashData.operacion])

    useEffect(()=>{
        setCashData({...cashData, monto_envio: (cashData.monto_cliente + (cashData.monto_cliente * (cashData.comision/100))).toFixed(2) })
    }, [cashData.comision])

    function validateForm(){
        if(cashData.operacion?._id) return true
        alert("Asocie una operación válida.")
        return false
    }
   
    async function handleSubmit(){
        const canProceed = validateForm();
        if(canProceed){
            setLoading(true)
            const onSuccess = () => (setLoading(false), setRenderModal(''))
            const cash = {...ordenData, tipo_orden: {cash: {...cashData}}}
            await createCash({cash, cliente: cashData.operacion.cliente, operacion: cashData.operacion}, dispatch)
            onSuccess()
        }
    }

    return(
            <ModalContainer tipo="create-cash" setRenderModal={setRenderModal}>

                <div id="create-cash" className="form-cargar" onClick={(e)=>e.stopPropagation()}>

                    <h2>Cargar Cash</h2>

                    <form action="" onSubmit={handleSubmit}>

                        <div className="data-cont" style={{maxWidth: "100%"}}>
                            <label htmlFor="Operacion vinculada">Operacion vinculada:</label>
                            <IdSelector entities={operaciones} onChange={(value) => setCashData({...cashData, operacion: value})} />
                        </div>

                        <div className="multiple-data-cont" style={{justifyContent: "unset"}}>

                            <div className="data-cont" style={{marginRight: "20px"}}>
                                <label htmlFor="Monto Cliente">Monto Cliente</label>
                                <input type="number" name="Monto Cliente" defaultValue={cashData.monto_cliente} id="cs-monto-cliente" autoComplete="off" disabled />
                            </div>
                            
                            <div className="data-cont">
                                <label htmlFor="Comision">Comision (%)</label>
                                <input type="number" name="Comision" style={{width: "55px"}} id="" autoComplete="off" onChange={(e) => setCashData({...cashData, comision: parseFloat(e.target.value)})} />
                            </div>

                        </div>
                        
                        <div className="multiple-data-cont" style={{justifyContent: "unset"}}>
                            <div className="data-cont" style={{marginRight: "20px"}}>
                                <label htmlFor="Monto Envío">Monto Envío</label>
                                <input type="number" name="Monto Envío" id="cs-monto-envio" autoComplete="off" defaultValue={cashData.monto_envio} onChange={(e) => setCashData({...cashData, monto_envio: e.target.value})} />
                            </div>

                            <div className="data-cont">
                                <label htmlFor="Ubicación">Ubicación</label>
                                <input type="text" name="Ubicacion" id="cs-ubicacion" defaultValue={cashData.operacion && cashData.operacion.cliente && cashData.operacion.cliente.localidad } autoComplete="off" onChange={(e) => setCashData({...cashData, localidad: e.target.value})} />
                            </div>
                        </div>
                        
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{width: "100%"}}>
                                <label htmlFor="Proveedor">Proveedor:</label>
                                <select name="Proveedor" id="" onChange={(e) => setCashData({...cashData, proveedor: e.target.value})} >
                                    <option value=""></option>
                                    {proveedores.map((proveedor)=>(
                                    <option value={proveedor._id} key={proveedor._id}>{proveedor.nombre} - ({proveedor.divisa})</option>
                                    ))}
                                    
                                </select>
                            </div>
                            <div className="data-cont" style={{width: "100%"}} >
                                <label>Cuenta de destino</label>
                                <select onChange={(e)=>setCashData({...cashData, cuenta_destino: e.target.value})}>
                                    <option value=""></option>
                                    {cuentas.filter(cuenta => cuenta?.proveedor?._id == cashData.proveedor).map((cuenta)=>
                                        <option value={cuenta._id} key={cuenta._id}>{cuenta.nombre}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                            
                        <div className="data-cont" style={{width: "100%"}}>
                            <label htmlFor="Estado">Estado Orden Cash:</label>
                            <select name="Estado" id="" style={{width: "100%"}} onChange={(e) => setCashData({...cashData, estado: e.target.value})} >
                                <option value=""></option>
                                {estados.ordenes.slice(0, estados.ordenes.length - 1).map((estado)=> 
                                    <option value={estado} key={estado}>{estado}</option>
                                )}
                            </select>
                        </div>                            
                        
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{width: "100%"}}>
                                <label>Oficina</label>
                                <select onChange={(e)=>setCashData({...cashData, oficina: e.target.value})}>
                                    {oficinas.map((ofi)=>
                                    <option value={ofi} selected={ofi === oficina} key={ofi}>{ofi}</option>
                                    )}
                                </select>
                            </div>
                            <div className="data-cont" style={{width: "100%", height: "52px"}}>
                                <label>Fecha de Entrega</label>
                                <Input type="date" onChange={(value)=>setCashData({...cashData, fecha_entrega: value})} />
                            </div>
                        </div>

                        
                        <div className="data-cont" style={{width: "100%", maxWidth: "100%"}}>
                            <label htmlFor="notas">Notas</label>
                            <textarea name="notas" id="" cols="30" rows="10" onChange={(e)=>setCashData({...cashData, nota:e.target.value})}></textarea>
                        </div>

                        <div className="cont-btns">
                            <div className="btn-cancelar" onClick={()=>setRenderModal('')}>Cancelar</div>
                            <div className="btn-create" id="btn-crear-factura" onClick={handleSubmit}>Crear Orden Cash</div>
                        </div>

                    </form>
                    

                    { loading && 
                    <FormLoader />
                    }


                </div>
  
            </ModalContainer>
    )
}

export default CreateCash

