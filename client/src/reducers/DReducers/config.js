export default (state=[], action) => {

    switch(action.type){

        case 'GET_CONFIG':
            return {...state, ...action.payload}
        
        case 'GET_CAMBIO_DIA':
            return {...state, cambio_dia: action.payload}
        
        case 'UPDATE_CONFIG':

        default:
            return state;
    }

}