import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader'
import './ConfirmDelete.css?r=4'
import { deleteOperacion, hasOrden } from '../../actions/operaciones';
import { deleteOrden } from '../../actions/ordenes';
import { deleteCliente } from '../../actions/clientes';
import { deleteMovimientoProveedor, deleteMovimientoCaja } from '../../actions/movimientos';

const ConfirmDelete = ({tipo, item, setRenderModal}) => {
    const [loading, setLoading] = useState(false)    
    const dispatch = useDispatch()

    var delete_text;

    if(tipo === 'Operacion'){
        delete_text = 'esta operación'
    }else if(tipo === 'Orden'){
        delete_text = 'esta orden'
    }else if(tipo === 'MovimientoProveedor'){
        delete_text = 'este movimiento'
    }else if(tipo === 'Cliente'){
        delete_text = 'este cliente'
    }else if(tipo === 'MovimientoCaja'){
        delete_text = 'este movimiento de caja'
    }else if(tipo === 'Factura'){
        delete_text = 'esta factura'
    }else if(tipo === 'Cambio'){
        delete_text = 'este cambio'
    }


    async function handleDelete(){
        setLoading(true)
        const onSuccess = ()=>(setLoading(false), setRenderModal(''))
        if(tipo === 'Operacion'){
            var checkHasOrden = await hasOrden(item._id)
            if(checkHasOrden.error === 0 && checkHasOrden.hasOrden){
                alert('No se puede eliminar una Operación con órdenes asociadas.')
                setRenderModal('')
            }else if(checkHasOrden.error === 0 && !checkHasOrden.hasOrden){
                await deleteOperacion(item._id, dispatch)
            }
        }else if(tipo === 'Orden' || tipo === 'Cash' || tipo === 'Factura'){    
            await deleteOrden(item._id, dispatch)
        }else if(tipo === 'Cliente'){    
            await deleteCliente(item._id, dispatch)
        }else if(tipo === 'MovimientoProveedor'){    
            await deleteMovimientoProveedor(item._id, dispatch)
        }else if(tipo === 'MovimientoCaja'){
            await deleteMovimientoCaja(item._id, dispatch)
        }else if(tipo === 'Cambio'){
            await deleteOperacion(item._id, dispatch)
        }
        onSuccess()
    }

    

    return(
            <ModalContainer tipo={"delete-"+tipo.toLowerCase()} setRenderModal={setRenderModal}>
                <div id="" className="form-cargar" onClick={(e)=>e.stopPropagation()}>
                    <h2>Eliminar {tipo}</h2>             
                    <div>
                        <div className="confirm-delete-texto">
                            Estás seguro que deseas eliminar {delete_text}?
                        </div>
                        <div className="confirm-delete-btns">
                            <div className="btn-cancelar" onClick={()=>setRenderModal('')}>Cancelar</div>
                            <div className="btn-create" onClick={handleDelete}>Eliminar</div>
                        </div>
                    </div>
                    { loading && 
                        <FormLoader />
                    }
                </div>

            </ModalContainer>
    )
}

export default ConfirmDelete