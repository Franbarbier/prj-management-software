export default (state=[], action) => {

    switch(action.type){

        case 'FETCH_ALL_ORDENES':
            return action.payload;

        case 'CREATE_ORDENES':
            const lastCreatedOrdenes = action.payload
            for (let index = 0; index < lastCreatedOrdenes.length; index++) {
                const lastCreatedOrden = lastCreatedOrdenes[index];
                state = [lastCreatedOrden, ...state]
            }
            return state;
        
        case 'UPDATE_ORDENES':
            const updateOrdenes = action.payload
            for(let uO in updateOrdenes){
                let updatedOrden = updateOrdenes[uO]
                for(let o in state){
                    let orden = state[o]
                    if(orden._id === updatedOrden._id){
                        state[o] = updatedOrden
                    }
                }
            }
            return [...state]

        case 'SET_LISTAS':
            const updated = action.payload
            let copyState = {...state}
            for(let o in copyState){
                if(updated.includes(copyState[o]._id)){
                    copyState[o].lista = true 
                }
            }
            return state
            
        case 'DELETE_ORDEN':
            var id_deleted = action.payload.id
            return state.filter((orden)=> orden._id != id_deleted);

        default:
            return state;
    }

}