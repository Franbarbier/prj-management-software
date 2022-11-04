import {FETCH_ALL_PROVEEDORES, CREATE_PROVEEDOR, UPDATE_PROVEEDOR} from '../constants/actionTypes';
import * as api from '../api';

export const getProveedores = () => async (dispatch) => {
    try{
        const{data} = await api.getProveedores()
        dispatch({type: FETCH_ALL_PROVEEDORES, payload:data})
    }catch(error){
        console.log(error.message)
    }
}

export const createProveedor = async (proveedor, dispatch) => {
    try{
        const{data} = await api.createProveedor(proveedor)
        dispatch({type: CREATE_PROVEEDOR, payload:data})
    }catch(error){
        console.log(error)
    }
}

export const updateProveedor = async (proveedor, dispatch) => {
    try{
        const{data} = await api.updateProveedor(proveedor)
        dispatch({type: UPDATE_PROVEEDOR, payload:data})
    }catch(error){
        console.log(error)
    }
}