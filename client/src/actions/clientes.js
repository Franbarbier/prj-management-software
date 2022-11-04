import {FETCH_ALL_CLIENTES, CREATE_CLIENTE, UPDATE_CLIENTE, DELETE_CLIENTE, LIKE} from '../constants/actionTypes';
import * as api from '../api';

export const getClientes = (filtros=null) => async (dispatch) => {
    try{
        const{data} = await api.getClientes(filtros)
        dispatch({type: FETCH_ALL_CLIENTES, payload:data})
        return data;
    }catch(error){
        console.log(error.message)
    }
}

export const createCliente = async (cliente, dispatch) => {
    try{
        const{data} = await api.createCliente(cliente)
        dispatch({type: CREATE_CLIENTE, payload:data})
    }catch(error){
        console.log(error)
    }
}

export const updateCliente = async (cliente, dispatch) => {
    try{
        const {data} = await api.updateCliente(cliente)
        dispatch({type: UPDATE_CLIENTE, payload:data})
    }catch(error){
        console.log(error)
    }
}

export const deleteCliente = async (id_cliente, dispatch) => {
    try{
        const{data} = await api.deleteCliente(id_cliente)
        dispatch({type: DELETE_CLIENTE, payload:data})
    }catch(error){
        console.log(error)
    }
}

