import {GET_EXISTENCIA, GET_CIERRE_TABLE,GET_CIERRE} from '../constants/actionTypes';
import * as api from '../api';

export const getExistencia = (filtros=null) => async (dispatch) => {
    try{
        const{data} = await api.getExistencia(filtros)
        dispatch({type: GET_EXISTENCIA, payload:data})
    }catch(error){
        console.log(error)
    }

}

export const getCierreTable = (filtros=null) => async (dispatch) => {
    try{
        const{data} = await api.getCierreTable(filtros)
        dispatch({type: GET_CIERRE_TABLE, payload:data})
    }catch(error){
        console.log(error)
    }

}

export const getCierre = (filtros=null) => async (dispatch) => {
    try{
        const{data} = await api.getCierre(filtros)
        dispatch({type: GET_CIERRE, payload:data})
    }catch(error){
        console.log(error)
    }

}


