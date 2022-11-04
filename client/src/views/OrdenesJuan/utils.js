export function filterOrdenes(orden, oficina){
    if(oficina !== ""){
        return orden?.oficina === oficina
    }
    return true
}

export function filterOperaciones(operacion, oficina){
    if(operacion.estado !== "Confirmado"){
        return false
    }
    if(oficina !== ""){
        return operacion?.oficina === oficina
    }
    return true
}