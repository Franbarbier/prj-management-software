import { CREATE_PROVEEDOR, FETCH_ALL_PROVEEDORES, UPDATE_PROVEEDOR } from "../../constants/actionTypes";

export default (state=[], action) => {

    switch(action.type){

        case CREATE_PROVEEDOR:
            return [action.payload.newProveedor, ...state];
        
        case FETCH_ALL_PROVEEDORES:
            return action.payload;

        case UPDATE_PROVEEDOR:
            const updateProveedor = action.payload
            for(let p in state){
                let prov = state[p]
                if(prov._id === updateProveedor._id){
                    state[p] = updateProveedor
                }
            }

            return state

        default:
            return state;
    }

}