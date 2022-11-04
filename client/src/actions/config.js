import {GET_CONFIG, UPDATE_CONFIG, GET_CAMBIO_DIA} from '../constants/actionTypes';
import * as api from '../api';

export const getConfig = () => async (dispatch) => {
    try{
        const{data} = await api.getConfig()
        dispatch({type: GET_CONFIG, payload:data})
    }catch(error){
        console.log(error)
    }

}

export const updateConfig = (config) => async (dispatch) => {
    try{
        
        const{data} = await api.updateConfig(config)
        dispatch({type: UPDATE_CONFIG, payload:data})
        
    }catch(error){
        console.log(error)
    }
}

export const getCambioDia = () => async (dispatch) => {
    try{
        const{data} = await api.getCambioDia()
        dispatch({type: GET_CAMBIO_DIA, payload:data})
    }catch(error){
        console.log(error)
    }

}