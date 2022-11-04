export const getMontoAEntregar = (operacionData) =>{
    return operacionData.monto_llega - operacionData.comision_prj_cantidad
}

export const getComisionProveedor = (operacionData) =>{
    return (operacionData.comision_proveedor_cantidad * 100) / operacionData.monto_llega
}

export const getComisionProveedorCantidad = (operacionData) =>{
    return (operacionData.comision_proveedor / 100) * operacionData.monto_llega
}

export const getComisionPrj = (operacionData) => {
    return (operacionData.comision_prj_cantidad * 100) / operacionData.monto_llega
}

export const getComisionPrjCantidad = (operacionData) =>{
    return (operacionData.comision_prj / 100) * operacionData.monto_llega
}

export const getMontoEnviado = (operacionData) => {
    return operacionData.fee_plataforma === undefined ? operacionData.monto_llega : parseFloat(operacionData.monto_llega) + (operacionData.monto_llega * (operacionData?.fee_plataforma / 100))
}

function shouldCreateOrdenRecibo(operacionData){
    return (operacionData.tipo_operacion === "Cambio" || operacionData.tipo_operacion === "Crypto" || operacionData.tipo_operacion === "Subida")  
}

export function getOrdenRecibo(operacionData){

    if(shouldCreateOrdenRecibo(operacionData)){
        const orden_recibo = [
            {
                ars: 0,
                cambio_operacion: operacionData.cambio_cliente,
                fecha_entrega: operacionData.fecha_entrega,
                id: 1,
                oficina: operacionData.oficina,
                tipo: "Recibo",
                tipo_orden: null,
                usd: 0,
                recibo: true
            }
        ]
        
        if (operacionData.tipo_cambio == "Venta") {
            orden_recibo[0].usd = operacionData.monto_enviado * 1
        }else if (operacionData.tipo_cambio == "Compra" ) {
            orden_recibo[0].ars = operacionData.monto_enviado * 1
        }else if(operacionData.operacion_crypto == "Compra"){
            let crypto = {
                wallet : '',
                comision : '',
                usdt_a_enviar : operacionData.monto_enviado * 1
            }
            orden_recibo[0].tipo_orden = {'crypto' : crypto};
            orden_recibo[0].tipo = "Recibo Crypto";
        }else if(operacionData.operacion_crypto == "Venta"){
            orden_recibo[0].usd = operacionData.monto_enviado * 1
        }else if(operacionData.tipo_operacion == "Subida"){
            orden_recibo[0].usd = operacionData.monto_enviado * 1
        }

        return orden_recibo;
    
    }else{
        return false
    }
}
