import {GET_ALL, COUNT_ALL, GET_BALANCES} from '../constants/actionTypes';
import * as api from '../api';

export const getAll = (filtros) => async (dispatch) => {
    try{
        const{data} = await api.getAll(filtros)

        if(filtros.params.tipo === 'count'){
            dispatch({type: COUNT_ALL, payload:data})
        }else{
            dispatch({type: GET_ALL, payload:data})
        }
    }catch(error){
        console.log(error)
    }
}

export const getBalancesCajas = () => async (dispatch) => {
    try{
        const {data} = await api.getBalancesCajas()
        dispatch({type: GET_BALANCES, payload:data})
    }catch(error){
        console.log(error)
    }
}

