import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { oficinas, tipos } from '../../GlobalFunctions';
import { updateOperacion } from '../../actions/operaciones'
import Input from '../Input/Input';
import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader';
import FormHeader from '../FormHeader/FormHeader';
import FormEditBtns from '../FormEditBtns/FormEditBtns';
import { ComoRecibeSelect } from '../CreateOperacion/CreateOperacion';


const EditCambio = ({data, setRenderModal}) => {

    const [operacionData, setOperacionData] = useState({...data})
    const [loading, setLoading] = useState(false)  
    const [edit, setEdit] = useState(false)  
    const spread = (operacionData.cambio_prj - operacionData.cambio_cliente).toFixed(2)
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

        if(operacionData.tipo_cambio === "Compra"){
            setOperacionData({...operacionData, monto_a_entregar: (operacionData.monto_enviado / operacionData.cambio_cliente)})
        }else if(operacionData.tipo_cambio === "Venta"){
            setOperacionData({...operacionData, monto_a_entregar: (operacionData.monto_enviado * operacionData.cambio_cliente)})
        }

    }, [operacionData.monto_enviado, operacionData.cambio_cliente, operacionData.tipo_cambio])

    async function handleSubmit(){
        setLoading(true)
        const onSuccess = () => (setLoading(false), setRenderModal(''))
        await updateOperacion(operacionData, dispatch)
        onSuccess()
    }

    return ( 

        <ModalContainer>
        <div className="form-cargar width500" onClick={(e)=>e.stopPropagation()}>
        <FormHeader edit={edit} setEdit={setEdit} tipo="Cambio" />
        <form>
        <div>
            <div className="multiple-data-cont">

                {hadCliente ?
                <div className="data-cont">
                    <Input type="text" value={operacionData.cliente.nombre} disabled={!edit}/>
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
                <label>Tipo Cambio:</label>
                <div className="radio-container">
                    <input type="radio" value="Compra" checked={operacionData.tipo_cambio === "Compra"} onClick={(e)=>setOperacionData({...operacionData, tipo_cambio: e.target.value})}  disabled={!edit}/>
                    <label htmlFor="Compra">Compra</label>
                    <input type="radio" value="Venta" checked={operacionData.tipo_cambio === "Venta"} onClick={(e)=>setOperacionData({...operacionData, tipo_cambio: e.target.value})}  disabled={!edit}/>
                    <label htmlFor="Venta">Venta</label>
                </div>
            </div>

            <div className="data-cont">
                <label>Monto {operacionData.tipo_cambio === "Compra" ? "a Recibir" : "Enviado"}</label>
                <Input type="number" value={operacionData.monto_enviado} onChange={(value)=>setOperacionData({...operacionData, monto_enviado: value})}  disabled={!edit}/>
            </div>

            <div className="multiple-data-cont">
                <div className="data-cont">
                    <label>Cambio Nuestro</label>
                    {operacionData.cambio_prj}
                </div>
                <div className="data-cont">
                    <label>Cambio Cliente</label>
                    <Input type="number" value={operacionData.cambio_cliente} onChange={(value)=>setOperacionData({...operacionData, cambio_cliente: value})}  disabled={!edit}/>
                </div>
                <div className="data-cont">
                    <label>Spread</label>
                    <div>{spread ? spread : ""}</div>
                </div>
            </div>

            <div className="multiple-data-cont">
                <div className="data-cont">
                    <label>Monto a entregar</label>
                    <Input type="number" value={operacionData.monto_a_entregar} onChange={(value)=>setOperacionData({...operacionData, monto_a_entregar: value})}  disabled={!edit}/>
                </div>
                <div className="data-cont">
                    {/* <label>Ganancia</label> */}

                </div>
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

            <FormEditBtns handleSubmit={handleSubmit} setRenderModal={setRenderModal} edit={edit} tipo="Cambio" />

        </div>
        
        </form>
        { loading && 
            <FormLoader />
        }
        </div>
        </ModalContainer>
     );
}
 
export default EditCambio;