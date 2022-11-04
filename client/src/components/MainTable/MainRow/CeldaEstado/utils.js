import { estados, formatDateYmd, getNombreYIdOrd } from "../../../../GlobalFunctions";
import {getClienteNombre} from '../../MainRow/utils';
import * as api from '../../../../api';

export function determineSelectOptionsByTipo(tipo, content){
    if(tipo=='operaciones' || tipo === 'operaciones sin órdenes' || tipo === 'operaciones de hoy' || tipo === 'operaciones entrega hoy'){
        return estados.operaciones
    }else if(tipo=='ordenes' || tipo === 'ordenes de hoy'){
        return estados.ordenes 
    }else if(tipo=='proveedores'){
        return estados.movimientos_proveedor
    }else if(tipo === 'facturas'){
        return estados.ordenes
    }else if(tipo === 'cash'){
        return estados.ordenes
    }else if(tipo === 'depositos'){
        return estados.ordenes
    }
}

export function determineRowTypeByTipo(tipo){
    if(tipo === "operaciones" || tipo === "cambios" || tipo === "operaciones de hoy" || tipo === "operaciones entrega hoy" || tipo === "operaciones sin órdenes"){
        return "operacion"
    }else if(tipo === "ordenes" || tipo === "depositos" || tipo === "facturas" || tipo === "cash"){
        return "orden"
    }
}

export function operacionConfirmada(value){
    return value === estados.operaciones[estados.operaciones.length - 1]
}

export function createObjectOrdenRecibo(row_data){

    const ordenRecibo = {
        ars: 0,
        cambio_operacion: row_data.cambio_cliente,
        fecha_entrega: row_data.fecha_entrega,
        id: 1,
        oficina: row_data.oficina,
        tipo: "Recibo",
        tipo_orden: null,
        usd: 0,
        recibo: true,
        operacion : row_data._id,
    }

    if (row_data.tipo_cambio === "Venta") {
        ordenRecibo.usd = row_data.monto_enviado * 1
    }else if (row_data.tipo_cambio === "Compra" ) {
        ordenRecibo.ars = row_data.monto_enviado * 1
    }else if(row_data.operacion_crypto === "Compra"){
        let crypto = {
            wallet : '',
            comision : '',
            usdt_a_enviar : row_data.monto_enviado * 1
        }
        ordenRecibo.tipo_orden = {crypto};
        ordenRecibo.tipo = "Recibo Crypto";
    }else if(row_data.operacion_crypto === "Venta" || row_data.tipo_operacion === "Subida" || row_data.tipo_operacion === "Bajada"){
        ordenRecibo.usd = row_data.monto_enviado * 1
    }
    if (row_data.tipo_operacion == "Bajada") {
        ordenRecibo.estado = "Entregada"
    }


    return ordenRecibo

}

export async function operacionHasOrdenRecibo(idOperacion){
    try{
        const response = await api.findOrdenesWithFilters({operacion: idOperacion, recibo: true})
        return response.data.ordenes.length > 0
    }catch(error){
        console.log(error)
    }
}

export function shouldCreateSubida(operacion){
    return (operacion.tipo_operacion === 'Bajada' || operacion.tipo_operacion === 'Crypto') && operacion.tipo_recibe === "Cliente"
}

export function createObjectSubida(operacion){
    return {cliente: operacion.cliente_recibe, tipo_envia: operacion.tipo_recibe, comision_prj_cantidad: 0, monto_llega: operacion.monto_llega, monto_a_entregar: operacion.monto_llega, tipo_operacion: 'Subida', estado:'Pendiente', oficina: operacion.oficina, corroborar: true}
}

export function shouldCreateTransferenciaProveedor(row_data){
    return row_data.recibe_transferencia
}

export function createObjectTransferenciaProveedor(operacion){
    
}

export function createObjectMovimientoProveedorFromOperacion(operacion, proveedor_as_cliente=false){
    return {proveedor: operacion.proveedor, cuenta_destino: operacion.cuenta_destino, operacion: operacion._id, importe: proveedor_as_cliente ? operacion.monto_enviado : operacion.monto_llega, origen: getClienteNombre(operacion) + ' ('+operacion.tipo_operacion+' '+operacion._id+')', comision: operacion.comision_proveedor, estado: 'Enviado'}
}

export async function operacionHasMovimientoProveedor(idOperacion){
    const response = await api.findMovimientosProveedorWithFilters({operacion: idOperacion})
    return response.data.movimientos.length > 0
}

export function createObjectMovimientoProveedorFromCash(orden){
    return {proveedor: orden.tipo_orden.cash.proveedor, origen: orden.tipo + '(' + orden._id + ')', estado: estados.movimientos_proveedor[0], importe: orden.tipo_orden.cash.monto_envio, orden: orden._id}
}

export async function ordenHasMovimientoProveedor(idOrden){
    const response = await api.findMovimientosProveedorWithFilters({orden: idOrden})
    return response.data.movimientos.length > 0
}
export async function ordenHasMovimientoCaja(idOrden){
    const response = await api.findMovimientosCajaWithFilters({orden: idOrden})
    return response.data.movimientos.length > 0
}

export function createMovimientoProveedorFromFactura(orden){
    return {proveedor: orden.tipo_orden.factura.proveedor, cuenta_destino: orden.tipo_orden.factura.cuenta_destino, origen: `Factura (${orden._id})`, importe: -orden.tipo_orden.factura.monto_factura_ars, estado:estados.movimientos_proveedor[0], comision: 0, orden: orden._id}
}

export async function shouldCreateMovimientoProveedorFromFactura(orden, value){
    const facturaHasMovimientoProveedor = await ordenHasMovimientoProveedor(orden._id)
    return (orden.tipo === 'Factura' && value === 'Entregada' && orden.tipo_orden.factura.forma_de_pago === 'Transferencia' && !facturaHasMovimientoProveedor)
}

export function createObjectMovCaja(orden){
    return {
        categoria: "Orden",
        descripcion: getNombreYIdOrd( orden ),
        fecha_creado: formatDateYmd(orden.fecha_entrega),
        importe: 0,
        oficina: orden.oficina,
        tipo: 0,
        orden: orden._id
    }
}

export function shouldCreateMovCajaUSD(orden, new_mov){
    
    if (orden.usd > 1) {
        new_mov.importe = orden.usd;
        new_mov.caja = "USD";
        return new_mov
    }else{
        return false
    }
}

export function shouldCreateMovCajaARS(orden, new_mov){
    if (orden.ars > 1) {
        new_mov.importe = orden.ars;
        new_mov.caja = "ARS";
        return new_mov
    }else{
        return false
    }
}

export function shouldCreateCambioFromOrden(orden){
    return orden.operacion.tipo_operacion !== "Cambio" && orden.ars > 0;
}

export function createObjectCambioFromOrden(orden, cambio_dia){
    return {
        cliente: orden?.operacion?.cliente?._id,
        tipo_operacion: 'Cambio',
        tipo_cambio: 'Compra',
        monto_enviado: ((orden.ars) / orden.cambio_operacion).toFixed(2),
        monto_a_entregar: orden.ars,
        cambio_cliente: orden.cambio_operacion,
        cambio_prj: cambio_dia,
        spread: orden.cambio_operacion - cambio_dia,
        estado: 'Pendiente',
        oficina: orden.operacion.oficina,
        corroborar: true
    }
}
export function createOrdenRecibeCliente(subida){
    return {
        ars: 0,
        cambio_operacion: 1,
        fecha_entrega: subida.fecha_creado,
        id: 1,
        oficina: subida.oficina,
        operacion: subida._id,
        tipo: "Transferencia",
        tipo_orden: null,
        usd: subida.monto_llega,
        recibe_cliente : true
    }
}