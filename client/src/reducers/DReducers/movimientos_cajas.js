export default (state=[], action) => {

    switch(action.type){

        case 'FETCH_ALL_MOVIMIENTOS_CAJAS':
            
            return action.payload;
        
        case 'CREATE_MOVIMIENTO_CAJA':

            const lastCreatedMovimientoCaja = action.payload.newMovimientoCaja

            return [lastCreatedMovimientoCaja, ...state];
        
        case 'DELETE_MOVIMIENTO_CAJA':
            var id_deleted = action.payload.id
            return state.filter((movimiento)=> movimiento._id != id_deleted);;
        
        case 'UPDATE_MOVIMIENTO_CAJA':
            const updatedMovimiento = action.payload
            let new_state = state
            for(let mov in new_state){
                let movi = new_state[mov]
                if(movi._id === updatedMovimiento._id){
                    new_state[mov] = updatedMovimiento
                }
            }

            return new_state

        default:
            return state;
    }

}