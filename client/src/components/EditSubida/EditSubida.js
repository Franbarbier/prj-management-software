import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as utils from '../CreateOperacion/utils/index'
import { oficinas, tipos } from '../../GlobalFunctions';
import { updateOperacion } from '../../actions/operaciones'
import Input from '../Input/Input';
import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader';
import FormHeader from '../FormHeader/FormHeader';
import FormEditBtns from '../FormEditBtns/FormEditBtns';
import { ComoRecibeSelect } from '../CreateOperacion/CreateOperacion';

const EditSubida = ({data, setRenderModal}) => {

    const [operacionData, setOperacionData] = useState({...data})
    const [loading, setLoading] = useState(false)  
    const [edit, setEdit] = useState(false)  
    const proveedores = useSelector(state => state?.proveedores)
    const cuentas = useSelector(state => state?.cuentas)
    const clientes = useSelector(state => state?.clientes)

    const [hadCliente, setHadCliente] = useState(false)

    const dispatch = useDispatch()

    const refs = {
        cliente: useRef(),
        cliente_borrador: useRef()
    }

    function changeCliente(value, type){
        if(type === "existente"){
            setOperacionData({...operacionData, cliente: value, cliente_borrador: ""})
        }else{
            setOperacionData({...operacionData, cliente_borrador: value, cliente: ""})
        }
    }

    useEffect(()=>{
        if(operacionData.cliente){
            setHadCliente(true)
        }
    }, [])

    useEffect(()=>{
        if(operacionData.tipo_envia === "Proveedor"){
            setOperacionData({...operacionData, fee_plataforma: 0})
        }
    }, [operacionData.tipo_envia])

    useEffect(()=>{
        let monto_llega = operacionData.monto_enviado - (operacionData.monto_enviado * (operacionData?.fee_plataforma / 100))
        setOperacionData({...operacionData, monto_llega})
    }, [operacionData.monto_enviado, operacionData.fee_plataforma])

    useEffect(()=>{
        setOperacionData({...operacionData, comision_proveedor: proveedores.filter((p) => p._id === operacionData.proveedor)[0]?.fee})
    }, [operacionData.proveedor])

    useEffect(()=>{
            setOperacionData({...operacionData, comision_proveedor_cantidad: utils.getComisionProveedorCantidad(operacionData), monto_a_entregar: utils.getMontoAEntregar(operacionData)})
    }, [operacionData.comision_proveedor])

    useEffect(()=>{
            setOperacionData({...operacionData, comision_proveedor: utils.getComisionProveedor(operacionData), monto_a_entregar: utils.getMontoAEntregar(operacionData)})
    }, [operacionData.comision_proveedor_cantidad])

    useEffect(()=>{
            setOperacionData({...operacionData, comision_prj_cantidad: utils.getComisionPrjCantidad(operacionData), monto_a_entregar: utils.getMontoAEntregar(operacionData)})
    }, [operacionData.comision_prj])

    useEffect(()=>{
            setOperacionData({...operacionData, comision_prj: utils.getComisionPrj(operacionData), monto_a_entregar: utils.getMontoAEntregar(operacionData)})
    }, [operacionData.comision_prj_cantidad])

    async function handleSubmit(){
        setLoading(true)
        const onSuccess = () => (setLoading(false), setRenderModal(''))
        await updateOperacion(operacionData, dispatch)
        onSuccess()
    }
    
    return ( 

        <ModalContainer>

        <div className="form-cargar width500" onClick={(e)=>e.stopPropagation()}>

        <FormHeader edit={edit} setEdit={setEdit} tipo="Subida" />

        <form>

        <div>

            <div className="multiple-data-cont">
                {hadCliente ?
                <div className="data-cont">
                    <Input type="text" value={operacionData.cliente.nombre} disabled  disabled={true}/>
                </div>
                :
                <>
                    <div className="data-cont" style={{width: "100%"}}>
                        <label>Cliente</label>
                        <select ref={refs.cliente} value={operacionData?.cliente} onChange={(e)=>changeCliente(e.target.value, "existente")} disabled={!edit}>
                            <option value=""></option>
                            {clientes.map((cliente)=>(
                                <option value={cliente._id} key={cliente._id}>{cliente.nombre}</option>
                                ))}
                        </select>
                    </div>
                    <div className="data-cont">
                        <label>Cliente Borrador</label>
                        <input type="text" ref={refs.cliente_borrador} value={operacionData?.cliente_borrador} onChange={(e)=>changeCliente(e.target.value, "borrador")}  disabled={!edit}/>
                    </div>
                </>
                }
            </div>

            <div className="data-cont" style={{width: "100%"}}>
                <label>Corroborar</label>
                <input type="checkbox" checked={operacionData?.corroborar} onClick={()=>setOperacionData({...operacionData, corroborar: !operacionData.corroborar})}  disabled={!edit}/>
            </div>

            <div className="data-cont">
                <label>Envia:</label>
                <div className="radio-container">
                    <input type="radio" value="Cliente" checked={operacionData.tipo_envia === "Cliente"} onClick={(e)=>setOperacionData({...operacionData, tipo_envia: e.target.value, proveedor: null, cuenta_destino: null, comision_proveedor: 0, comision_proveedor: 0})}  disabled={!edit}/>
                    <label htmlFor="Cliente">Cliente</label>
                    <input type="radio" value="Proveedor" checked={operacionData.tipo_envia === "Proveedor"} onClick={(e)=>setOperacionData({...operacionData, tipo_envia: e.target.value, cliente_recibe: null})}  disabled={!edit}/>
                    <label htmlFor="Proveedor">Proveedor</label>
                </div>
            </div>           

            <div className="data-cont">
                <label>Monto que llega</label>
                <Input type="number" value={operacionData.monto_llega} onChange={(value) => setOperacionData({...operacionData, monto_llega: value})}  disabled={!edit}/>
            </div>

            <div className="data-cont">
                <label>Monto Enviado</label>
                <Input type="number" value={operacionData.monto_enviado} onChange={(value)=>setOperacionData({...operacionData, monto_enviado: value})}  disabled={!edit}/>
            </div>

            {operacionData.tipo_envia === "Cliente" && 
            <div className="multiple-data-cont">
                <div className="data-cont">
                    <label htmlFor="cuenta-origen">Cuenta de origen</label>
                    <Input type="text" value={operacionData.cuenta_origen} onChange={(value) => setOperacionData({...operacionData, cuenta_origen: value})}  disabled={!edit}/>
                </div>
                <div className="data-cont">
                    <label htmlFor="fee">Fee plataforma</label>
                    <Input type="number" value={operacionData.fee_plataforma} onChange={(value) => setOperacionData({...operacionData, fee_plataforma: value})} style={{width: "30%"}}  disabled={!edit}/>
                </div>
            </div>
            }

            {operacionData.tipo_envia === "Proveedor" &&
            <div className="multiple-data-cont">
                <div className="data-cont" style={{width: "100%"}} >
                    <label>Proveedor</label>
                    <select onChange={(e)=>setOperacionData({...operacionData, proveedor: e.target.value})} disabled={!edit}>
                        <option value=""></option>
                        {proveedores.map((proveedor)=>
                            <option value={proveedor._id} key={proveedor._id}>{proveedor.nombre} - ({proveedor.divisa})</option>
                        )}
                    </select>
                </div>
                <div className="data-cont" style={{width: "100%"}} >
                    <label>Cuenta de destino</label>
                    <select onChange={(e)=>setOperacionData({...operacionData, cuenta_destino: e.target.value})} disabled={!edit}>
                        <option value=""></option>
                        {cuentas.filter(cuenta => cuenta?.proveedor?._id == operacionData.proveedor).map((cuenta)=>
                            <option value={cuenta._id} key={cuenta._id}>{cuenta.nombre}</option>
                        )}
                    </select>
                </div>
            </div>
            }

            <div className="multiple-data-cont">
                {operacionData.tipo_envia === "Proveedor" &&
                <div className="multiple-data-cont" style={{width: "48%"}}>
                    <div className="data-cont">
                        <label>Com prov(%)</label>
                        <Input type="number" value={operacionData.comision_proveedor} onChange={(value)=>setOperacionData({...operacionData, comision_proveedor: value})}  disabled={!edit}/>
                    </div>
                    <div className="data-cont">
                        <label>Com prov</label>
                        <Input type="number" value={operacionData.comision_proveedor_cantidad} onChange={(value)=>setOperacionData({...operacionData, comision_proveedor_cantidad: value})}  disabled={!edit}/>
                    </div>
                </div>
                }

                <div className="multiple-data-cont" style={{width: "48%"}}>
                    <div className="data-cont">
                        <label>Com PRJ(%)</label>
                        <Input type="number" value={operacionData.comision_prj} onChange={(value)=>setOperacionData({...operacionData, comision_prj: value})}  disabled={!edit}/>
                    </div>
                    <div className="data-cont">
                        <label>Com PRJ</label>
                        <Input type="number" value={operacionData.comision_prj_cantidad} onChange={(value)=>setOperacionData({...operacionData, comision_prj_cantidad: value})}  disabled={!edit}/>
                    </div>
                </div>
            </div>

            <div className="data-cont">
                <label>Monto a entregar</label>
                <Input type="number" value={operacionData.monto_a_entregar} onChange={(value)=>setOperacionData({...operacionData, monto_a_entregar: value})}  disabled={!edit}/>
            </div>

            <div className="multiple-data-cont">
                <div className="data-cont" style={{width: "100%"}}>
                    <label>Oficina</label>
                    <select onChange={(e)=>setOperacionData({...operacionData, oficina: e.target.value})} disabled={!edit}>
                        {oficinas.map((oficina)=>
                        <option value={oficina} selected={operacionData.oficina === oficina} key={oficina}>{oficina}</option>
                        )}
                    </select>
                </div>
                <div className="data-cont" style={{width: "100%", height: "52px"}}>
                    <label>Fecha de Entrega</label>
                    <Input type="date" value={operacionData.fecha_entrega} onChange={(value)=>setOperacionData({...operacionData, fecha_entrega: value})}  disabled={!edit}/>
                </div>
            </div>

           <ComoRecibeSelect operacionData={operacionData} setOperacionData={setOperacionData} edit={edit} />

            <div className="data-cont" style={{width: "100%", maxWidth: "100%"}}>
                <label>Notas</label>
                <textarea cols="30" rows="10" value={operacionData.nota} onChange={(e)=>setOperacionData({...operacionData, nota:e.target.value})} disabled={!edit}></textarea>
            </div>

            <FormEditBtns handleSubmit={handleSubmit} setRenderModal={setRenderModal} edit={edit} tipo="Subida" />

        </div>

        </form>
        
        { loading && 
            <FormLoader />
        }

        </div>

        </ModalContainer>

     );
}
 
export default EditSubida;