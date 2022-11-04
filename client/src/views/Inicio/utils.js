import { formatDateYmd } from "../../GlobalFunctions"

export function filterOperacionesHoy(operacion, oficina){
    if(operacion.fecha_entrega !== formatDateYmd(new Date())){
        return false
    }
    if(oficina === ""){
        return true
    }
    return operacion.oficina === oficina
}