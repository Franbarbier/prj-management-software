export default (state=[], action) => {

    switch(action.type){

        case 'CREATE_MOVIMIENTO_PROVEEDOR':
            const lastCreatedMovimiento = action.payload
            return [lastCreatedMovimiento, ...state]
        
        case 'UPDATE_MOVIMIENTO_PROVEEDOR':
            const updatedMovimiento = action.payload
            for(let mov in state){
                let movi = state[mov]
                if(movi._id === updatedMovimiento._id){
                    state[mov] = updatedMovimiento
                }
            }
            return state
            
        case 'FETCH_ALL_MOVIMIENTOS':
            return action.payload;

        case 'DELETE_MOVIMIENTO_PROVEEDOR':
            var id_deleted = action.payload.id
            return state.filter((movimiento)=> movimiento._id != id_deleted);
        
        default:
            return state;
    }

}