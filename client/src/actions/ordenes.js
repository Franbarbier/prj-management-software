import {FETCH_ALL_ORDENES, CREATE_ORDENES, UPDATE_ORDENES, DELETE_ORDEN, SET_LISTAS} from '../constants/actionTypes';
import * as api from '../api';

export const getOrdenes = (filtros=null) => async (dispatch) => {
    try{
        const{data} = await api.getOrdenes(filtros)
        if(filtros === null){
            dispatch( {type: FETCH_ALL_ORDENES, payload:data})
        }else{
            dispatch( {type: FETCH_ALL_ORDENES, payload:data})
        }
    }catch(error){
        console.log(error.message)
    }
}

export const createOrdenSolo = async (orden, dispatch) => {
    try{
        console.log(orden)
  
        const{data} = await api.createOrdenSolo(orden)
        dispatch({type: CREATE_ORDENES, payload:data})
        console.log(data)

        if(data.length>0){
            return true
        }
    }catch(error){
        console.log(error)
    }
    return false
}

export const editOrdenes = async (ordenes, deletedOnes=false, dispatch) => {
    try{
        const{data} = await api.editOrdenes(ordenes)
        dispatch({type: UPDATE_ORDENES, payload:data})
    }catch(error){
        console.log(error)
    }
}

export const createFactura = async (factura, dispatch) => {
    try{
        const{data} = await api.createFactura(factura)
        dispatch({type: CREATE_ORDENES, payload:data})
    }catch(error){
        console.log(error)
    }
}

export const deleteOrden = async (id_orden, dispatch) => {
    try{
        const{data} = await api.deleteOrden(id_orden)
        dispatch({type: DELETE_ORDEN, payload:data})
    }catch(error){
        console.log(error)
    }
}

export const createCash = async (cash, dispatch) => {
    try{
        const{data} = await api.createCash(cash)
        dispatch({type: CREATE_ORDENES, payload:data})
    }catch(error){
        console.log(error)
    }
}

// export const setListas = (ordenes) => async (dispatch) => {
//     try{
//         const{data} = await api.setListas(ordenes)
//         dispatch({type: SET_LISTAS, payload:data})
        
//     }catch(error){
//         console.log(error)
//     }
// }

export const  liquidarTransferencias = async (data) => {
    try{
        const response = await api.liquidarTransferencias(data)
        return response.data
    }catch(error){
        console.log(error)
    }
}