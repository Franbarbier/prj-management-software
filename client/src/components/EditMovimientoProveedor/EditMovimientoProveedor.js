import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { updateMovimientoProveedor } from '../../actions/movimientos'
import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader'
import FormHeader from '../FormHeader/FormHeader'
import FormEditBtns from '../FormEditBtns/FormEditBtns'
import './EditMovimientoProveedor.css'

const EditMovimientoProveedor = ({activeProveedor, setRenderModal, data}) => {

    const [edit, setEdit] = useState(false)
    const [movimientoProveedorData, setMovimientoProveedorData] = useState({...data})
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    var cuentas = useSelector(state => state.cuentas)
    var cuentas_del_proveedor = []
    if(activeProveedor!==null){
        cuentas_del_proveedor = cuentas.filter(cuenta => cuenta.proveedor._id == activeProveedor._id)
    }
    
    async function handleSubmit(){
        if(movimientoProveedorData.importe != '' && movimientoProveedorData.importe != undefined){
            setLoading(true)
            const onSuccess = () => (setLoading(false), setRenderModal(''))
            await updateMovimientoProveedor(movimientoProveedorData, dispatch)
            onSuccess()
        }else{
            alert('El campo "Importe" no puede estar vacío.')
        }
    }


    

    return(
            <ModalContainer tipo="create-movimiento-proveedor" setRenderModal={setRenderModal}>
                
                <div id="create-movimiento-proveedor" className="form-cargar" onClick={(e)=>e.stopPropagation()}>

                    <FormHeader edit={edit} setEdit={setEdit} tipo="Movimiento Proveedor" />

                    <form action=""  onSubmit={handleSubmit}>

                    <div className="multiple-data-cont">
                        <div className="data-cont">
                            <label htmlFor="importe">Importe</label>
                            <input type="number" name="importe" id="cmp-importe" defaultValue={movimientoProveedorData.importe} autoComplete="off" onChange={(e) => setMovimientoProveedorData({...movimientoProveedorData, importe: e.target.value, proveedor: activeProveedor._id})}  disabled={!edit}/>
                        </div>

                        { movimientoProveedorData.importe > -1 && 
                        <div className="data-cont">
                            <label htmlFor="origen">Origen</label>
                            <input type="text" name="origen" id="cmp-origen" defaultValue={movimientoProveedorData.origen} autoComplete="off" onChange={(e) => setMovimientoProveedorData({...movimientoProveedorData, origen: e.target.value})}  disabled={!edit}/>
                        </div>
                        }

                    </div>

                    { movimientoProveedorData.importe > -1 && 
                    <div className="multiple-data-cont">
                        

                            <div className="data-cont">
                                <label htmlFor="Cuneta Destino">Cuenta Destino</label>
                                <select name="cuenta-destino" id="cmp-cuenta-destino" style={{}} onChange={(e)=>setMovimientoProveedorData({...movimientoProveedorData, cuenta_destino: e.target.value})} disabled={!edit}>
                                {cuentas_del_proveedor.map((cuenta)=>(
                                    <option value={cuenta._id} selected={movimientoProveedorData.cuenta_destino && cuenta._id === movimientoProveedorData.cuenta_destino._id} key={cuenta._id}>{cuenta.nombre}</option>
                                ))}
                                </select>
                            </div>
                            <div className="data-cont">
                                <label htmlFor="comision">Comision</label>
                                <input type="number" name="comision" autoComplete="off" id="cmp-comision" defaultValue={movimientoProveedorData.comision} onChange={(e)=>setMovimientoProveedorData({...movimientoProveedorData, comision: e.target.value})}  disabled={!edit}/>
                            </div>

                    </div>
                    }

                    <div className="data-cont" style={{width: "100%", maxWidth: "100%"}}>
                        <label htmlFor="notas">Notas</label>
                        <textarea name="notas" id="" cols="30" rows="10" onChange={(e)=>setMovimientoProveedorData({...movimientoProveedorData, nota:e.target.value})} disabled={!edit}></textarea>
                    </div>

                    <FormEditBtns handleSubmit={handleSubmit} setRenderModal={setRenderModal} edit={edit} tipo="Movimiento Proveedor" />

                    </form>

                    {loading &&
                    <FormLoader />
                    }

                </div>


            </ModalContainer>
    )
}

export default EditMovimientoProveedor