import {FETCH_ALL_CUENTAS, CREATE, UPDATE, DELETE, LIKE} from '../constants/actionTypes';
import * as api from '../api';

export const getCuentas = () => async (dispatch) => {

    try{
        const{data} = await api.getCuentas()
        dispatch({type: FETCH_ALL_CUENTAS, payload:data})
    }catch(error){
        console.log(error.message)
    }

}

export const createCuenta = (cuenta) => async (dispatch) => {

    try{
        const{data} = await api.createCuenta(cuenta)
        dispatch({type: CREATE, payload:data})
    }catch(error){
        console.log(error)
    }

}