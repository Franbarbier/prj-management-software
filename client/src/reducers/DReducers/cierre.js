export default (state=[], action) => {
        
    const response = action.payload
    switch(action.type){

        case 'GET_EXISTENCIA':
            return {...state, ...response}

        case 'GET_CIERRE':
           
            return {...state, ...response}

        default:
            return state;
    }

}