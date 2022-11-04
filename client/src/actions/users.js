import {LOGIN, VERIFY_USER} from '../constants/actionTypes';
import * as api from '../api';

export const login = (user) => async (dispatch) => {
    try{
        const{data} = await api.login(user)
        dispatch({type: LOGIN, payload:data})
    }catch(error){
        console.log(error)
    }

}

export const logout = () => {
    
    localStorage.setItem('token', "")
    localStorage.setItem('user', "")
    window.location.href = "/login"

}

