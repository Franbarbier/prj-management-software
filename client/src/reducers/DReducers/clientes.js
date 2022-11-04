import { assesRedirect } from "../../GlobalFunctions";

export default (state=[], action) => {

    // Si falla el auth lo mandamos al login
    assesRedirect(action)
    
    switch(action.type){
        
        case 'CREATE_CLIENTE':
            return [action.payload, ...state];
            
        case 'FETCH_ALL_CLIENTES':
            return action.payload;

        case 'UPDATE_CLIENTE':
            return state.map(cliente => {
                if (cliente._id !== action.payload._id) {
                  return cliente
                }else{
                    return action.payload
                }})

        case 'DELETE_CLIENTE':
            var id_deleted = action.payload.id
            return state.filter((factura)=> factura._id != id_deleted);

        default:
            return state;
    }

}