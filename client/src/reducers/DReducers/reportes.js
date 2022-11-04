export default (state={counts:{}}, action) => {

    let res = action.payload
    switch(action.type){
        case 'COUNT_ALL':
            return {...state, counts: res};

        case 'GET_BALANCES':
            return {...state, cajas: res.data.balances};

        default:
            return state;
    }

}