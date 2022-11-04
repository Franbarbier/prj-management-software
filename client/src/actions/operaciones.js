import {FETCH_ALL_OPERACIONES, FETCH_OPERACIONES_CLIENTE, CREATE_OPERACION, DELETE_OPERACION, UPDATE_OPERACION, CREATE_ORDENES} from '../constants/actionTypes';
import * as api from '../api';

export const getOperaciones = (filtros=null) => async (dispatch) => {
    try{
        const {data} = await api.getOperaciones(filtros)
        dispatch({type: FETCH_ALL_OPERACIONES, payload:data})
    }catch(error){
        console.log(error.message)
    }
}

export const hasOrden = async (id_operacion) => {
    try{
        const data = await api.hasOrden(id_operacion)
        return data
    }catch(error){
        console.log(error.message)
    }
}

export const getClienteOperaciones = (id_cliente) => async (dispatch) => {
    try{
        const {data} = await api.getClienteOperaciones(id_cliente)
        dispatch({type: FETCH_OPERACIONES_CLIENTE, payload:data})
    }catch(error){
        console.log(error.message)
    }
}

export const createOperacion = async (operacion, dispatch) => {
    try{
        const {data} = await api.createOperacion(operacion)
        dispatch({type: CREATE_OPERACION, payload:data})
        if(data.operaciones.length>0){
            return data
        }
    }catch(error){
        console.log(error)
    }
    return false;
}

export const deleteOperacion = async (id_operacion, dispatch) => {
    try{
        const {data} = await api.deleteOperacion(id_operacion)
        dispatch({type: DELETE_OPERACION, payload:data})
    }catch(error){
        console.log(error)
    }
}

export const updateOperacion = async (operacion, dispatch) => {
    try{
        const {data} = await api.updateOperacion(operacion)
        dispatch({type: UPDATE_OPERACION, payload:data})
    }catch(error){
        console.log(error)
    }
}