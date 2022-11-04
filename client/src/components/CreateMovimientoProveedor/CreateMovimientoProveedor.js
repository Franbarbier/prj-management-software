import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getCuentas } from '../../actions/cuentas'
import { createMovimientoProveedor } from '../../actions/movimientos'
import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader';
import {estados} from '../../GlobalFunctions'

import './CreateMovimientoProveedor.css?r=4'

const CreateMovimientoProveedor = ({ activeProveedor, setRenderModal}) => {

    const defaultMovimientoProveedorData = {estado: estados.movimientos_proveedor[0], proveedor:activeProveedor!=null? activeProveedor._id : null, comision: activeProveedor!=null ? activeProveedor.fee : 0}
    const [movimientoProveedorData, setMovimientoProveedorData] = useState(defaultMovimientoProveedorData)
    const cuentas = useSelector(state => state.cuentas)

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getCuentas())
    }, [])

    // Variable que se usa para activar y desactivar el loader
    const [loading, setLoading] = useState(false)

    async function handleSubmit(){
        if(movimientoProveedorData.importe != '' && movimientoProveedorData.importe != undefined){         
            setLoading(true)
            const onSuccess = () => (setLoading(false), setRenderModal(''))
            await createMovimientoProveedor(movimientoProveedorData, dispatch)
            onSuccess()
        }else{
            alert('El campo "Importe" no puede estar vacío.')
        }
    }

    useEffect(()=>{
        if(movimientoProveedorData.importe<0){
            setMovimientoProveedorData({...movimientoProveedorData, comision: 0})
        }
    }, [movimientoProveedorData.importe])

    function handleCloseModal(){
        
        setMovimientoProveedorData(defaultMovimientoProveedorData)
        setRenderModal('')
    }


    

    return(
            <ModalContainer tipo="create-movimiento-proveedor" setRenderModal={setRenderModal}>
                
                <div id="create-movimiento-proveedor" className="form-cargar" onClick={(e)=>e.stopPropagation()}>

                    <h2>Cargar Movimiento Proveedor</h2>

                    <form action=""  onSubmit={handleSubmit}>

                    <div className="multiple-data-cont">
                        <div className="data-cont">
                            <label htmlFor="importe">Importe</label>
                            <input type="number" name="importe" id="cmp-importe" autoComplete="off" onChange={(e) => setMovimientoProveedorData({...movimientoProveedorData, importe: e.target.value, proveedor: activeProveedor._id})} />
                        </div>

                        { movimientoProveedorData.importe > -1 && 
                        <div className="data-cont">
                            <label htmlFor="origen">Origen</label>
                            <input type="text" name="origen" id="cmp-origen" autoComplete="off" onChange={(e) => setMovimientoProveedorData({...movimientoProveedorData, origen: e.target.value})} />
                        </div>
                        }

                    </div>

                    { movimientoProveedorData.importe > -1 && 
                    <div className="multiple-data-cont">
                        

                            <div className="data-cont">
                                <label htmlFor="Cuneta Destino">Cuenta Destino</label>
                                <select name="cuenta-destino" id="cmp-cuenta-destino" style={{}} onChange={(e)=>setMovimientoProveedorData({...movimientoProveedorData, cuenta_destino: e.target.value})}>
                                {cuentas.filter(cuenta => cuenta?.proveedor?._id == activeProveedor?._id).map((cuenta)=>(
                                    <option value={cuenta._id} key={cuenta._id}>{cuenta.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="data-cont">
                                <label htmlFor="comision">Comision</label>
                                <input type="number" name="comision" autoComplete="off" id="cmp-comision" onChange={(e)=>setMovimientoProveedorData({...movimientoProveedorData, comision: e.target.value})} />
                            </div>

                    </div>
                    }

                    { movimientoProveedorData.importe > -1 && 
                    <div className="data-cont">
                        <label htmlFor="estado">Estado</label>
                        <select name="estado" id="cmp-estado" onChange={(e)=>setMovimientoProveedorData({...movimientoProveedorData, estado:e.target.value})}>
                            {estados.movimientos_proveedor.slice(0, estados.movimientos_proveedor.length - 1).map((estado)=> 
                                <option value={estado} key={estado}>{estado}</option>
                            )}
                        </select>
                    </div>
                    }

                    <div className="data-cont" style={{width: "100%", maxWidth: "100%"}}>
                        <label htmlFor="notas">Notas</label>
                        <textarea name="notas" id="" cols="30" rows="10" onChange={(e)=>setMovimientoProveedorData({...movimientoProveedorData, nota:e.target.value})}></textarea>
                    </div>

                    <div className="cont-btns">
                        <div className="btn-cancelar" onClick={()=>handleCloseModal()}>Cancelar</div>
                        <div className="btn-create" id="btn-crear-proveedor" onClick={handleSubmit}>Crear Movimiento</div>
                    </div>


                    </form>

                    { loading && 
                    <FormLoader />
                    }


                </div>


            </ModalContainer>
    )
}

export default CreateMovimientoProveedor