import { formatInt } from "../../GlobalFunctions"

export const updateCajaData = (movimientos, cajasData, setCajasData) => {

    let cajas = [...cajasData]
    var ingresos_egresos_por_caja = []
    for(var i = 0; i<cajas.length; i++){
        ingresos_egresos_por_caja.push({ingresos: 0, egresos: 0})
    }

    for(var m in movimientos){        
        var mov = movimientos[m]
        var index=null;
        
        if(mov.caja === 'ARS'){
            index = 0
        }else if(mov.caja === 'USD'){
            index = 1
        }else if(mov.caja === 'EUR'){
            index = 2
        }

        if(index!=null){
            
            let caja = cajas[index]
            
            if(mov.tipo === 1){
                ingresos_egresos_por_caja[index].ingresos += mov.importe
            }else if(mov.tipo === 0){
                ingresos_egresos_por_caja[index].egresos += mov.importe
            }     
            caja.ingresos = ingresos_egresos_por_caja[index].ingresos
            caja.egresos = ingresos_egresos_por_caja[index].egresos
            cajas[index] = caja
        
        }
    }

    setCajasData(cajas)

}   

export function filterCajas(movimiento, oficina){
    if(oficina===""){
        return true
    }
    return movimiento.oficina === oficina
}

export const getBalanceActiveCaja = (cajasData, oficina, activeCaja, balances) => {
    if(oficina !== "" && balances !== undefined){
        const divisa = cajasData[activeCaja]?.divisa 
        const balance = balances[oficina][divisa]?.balance
        return formatInt(balance)
    }
}

export const filterMovimientosByTipo = (movimiento, activeCaja, cajasData, tipo) => {
    return movimiento.tipo === tipo  ? movimiento.caja === cajasData[activeCaja].divisa : false 
}