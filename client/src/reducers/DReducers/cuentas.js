import { assesRedirect } from "../../GlobalFunctions";

export default (state=[], action) => {

    assesRedirect(action)

    switch(action.type){

        case 'CREATE':
            return [action.payload, ...state];

        case 'FETCH_ALL_CUENTAS':
            return action.payload;

        default:
            return state;
    }

}