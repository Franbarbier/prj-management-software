import {FETCH_ALL_MOVIMIENTOS, FETCH_ALL_MOVIMIENTOS_CAJAS,  CREATE_MOVIMIENTO_PROVEEDOR, DELETE_MOVIMIENTO_PROVEEDOR, DELETE_MOVIMIENTO_CAJA, CREATE_MOVIMIENTO_CAJA, UPDATE_MOVIMIENTO_PROVEEDOR, UPDATE_MOVIMIENTO_CAJA} from '../constants/actionTypes';
import * as api from '../api';

export const getMovimientos = () => async (dispatch) => {
    try{
        const{data} = await api.getMovimientos()
        dispatch({type: FETCH_ALL_MOVIMIENTOS, payload:data})
    }catch(error){
        console.log(error.message)
    }
}

export const createMovimientoProveedor = async (movimientoProveedor, dispatch) => {
    try{
        const {data} = await api.createMovimientoProveedor(movimientoProveedor)
        dispatch({type: CREATE_MOVIMIENTO_PROVEEDOR, payload:data})
        return data
    }catch(error){
        console.log(error)
    }
}

export const deleteMovimientoProveedor = async (id_movimiento_proveedor, dispatch) => {    
    try{
        const{data} = await api.deleteMovimientoProveedor(id_movimiento_proveedor)
        dispatch({type: DELETE_MOVIMIENTO_PROVEEDOR, payload:data})
    }catch(error){
        console.log(error)
    }
}

export const deleteMovimientoCaja = async (id_movimiento_caja, dispatch) => {
    try{
        const{data} = await api.deleteMovimientoCaja(id_movimiento_caja)
        dispatch({type: DELETE_MOVIMIENTO_CAJA, payload:data})
    }catch(error){
        console.log(error)
    }
}

export const createMovimientoCaja = async (movimientoCaja, dispatch) => {
    try{
        const{data} = await api.createMovimientoCaja(movimientoCaja)
        dispatch({type: CREATE_MOVIMIENTO_CAJA, payload:data})
        if(data.newMovimientoCaja){
            return true
        }
    }catch(error){
        console.log(error)
    }
    return false
    
}

export const getMovimientosCajas = () => async (dispatch) => {
    try{
        const{data} = await api.getMovimientosCajas()
        dispatch({type: FETCH_ALL_MOVIMIENTOS_CAJAS, payload:data})
    }catch(error){
        console.log(error.message)
    }
}

export const updateMovimientoProveedor = async (mov_proov, dispatch) => {
    try{
        const{data} = await api.updateMovimientoProveedor(mov_proov)
        dispatch({type: UPDATE_MOVIMIENTO_PROVEEDOR, payload:data})
        
    }catch(error){
        console.log(error)
    }
}

export const updateMovimientoCaja = async (mov_caja, dispatch) => {
    try{
        
        const{data} = await api.updateMovimientoCaja(mov_caja)
        dispatch({type: UPDATE_MOVIMIENTO_CAJA, payload:data})
        
    }catch(error){
        console.log(error)
    }
}