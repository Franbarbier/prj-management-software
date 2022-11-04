import {FAV, EDITROW} from '../constants/actionTypes';
import * as api from '../api';

export const favRow = (row) => async (dispatch) => {
    try{
        const{data} = await api.favRow(row)
        dispatch({type: FAV, payload:data})
    }catch(error){
        console.log(error.message)
    }
}

export const changeEstado = (estado_data) => async (dispatch) => {

    try{
        const{data} = await api.changeEstado(estado_data)
        dispatch({type: FAV, payload:data})
    }catch(error){
        console.log(error.message)
    }

}
