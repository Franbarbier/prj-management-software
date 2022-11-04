import { assesRedirect } from "../../GlobalFunctions";

export default (state=[], action) => {

    assesRedirect(action)

    switch(action.type){

        case 'CREATE_OPERACION':
            return [...action.payload.operaciones, ...state];
        
        case 'FETCH_ALL_OPERACIONES':
            return action.payload;
        
        case 'DELETE_OPERACION':
            var id_deleted = action.payload.id
            return state.filter((operacion)=> operacion._id != id_deleted);

        case 'UPDATE_OPERACION':
            const updateOperacion = action.payload
            for(let p in state){
                let prov = state[p]
                if(prov._id === updateOperacion._id){
                    state[p] = updateOperacion
                }
            }

            return [...state]

        default:
            return state;
    }

}