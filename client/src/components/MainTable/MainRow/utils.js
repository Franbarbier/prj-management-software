import { formatDate,formatDate3, formatInt, getRealSaldoOrden, divisaRecibeFunc } from '../../../GlobalFunctions';


export const getCustomInformation = (tipo, row_data) => {

    let tipo_modal_edit;
    let campo_to_dbvalue;

    if(tipo=='operaciones' || tipo === 'operaciones de hoy'){
        if(row_data.tipo_operacion === 'Bajada'){
            tipo_modal_edit = 'edit-bajada'
        }else if(row_data.tipo_operacion === 'Subida'){
            tipo_modal_edit = 'edit-subida'
        }else if(row_data.tipo_operacion === 'Crypto'){
            tipo_modal_edit = 'edit-crypto'
        }else if(row_data.tipo_operacion === 'Cambio'){
            tipo_modal_edit = 'edit-cambio'
        }
        
        // Que ponemos en el campo de "Recibe" en la tabla de operaciones
        var entregas = 0
        var recibe = ''

        for (let index = 0; index < row_data.ordenes.length; index++) {
            const element = row_data.ordenes[index];
            if (element.recibo == false) {
                entregas = entregas + 1;
            }
        }
        if (entregas == 0) {
            recibe = row_data.como_recibe
           
        }else if (entregas == 1) {
            for (let index = 0; index < row_data.ordenes.length; index++) {
                const element = row_data.ordenes[index];
                if (element.recibo == false) {
                    recibe = element.tipo
                }
            }

        }else if (entregas > 1) {
            recibe = 'Varios'

        }



    
        campo_to_dbvalue = {"Cliente":{"Valor":getClienteNombre(row_data), "Tipo": `bold ${isClienteBorrador(row_data) ? "nombre_borrador" : ""} ${row_data?.proveedor_as_cliente ? "cliente_is_proveedor" : ""}`}, "Tipo": {"Valor":row_data.tipo_operacion, "Tipo":""}, "Monto": {"Valor": formatInt(row_data.monto_enviado), "Tipo": `bold ${getMontoEnviadoDivisa(row_data)}`}, "Fecha": {"Valor":row_data.fecha_creado?.substring(0,10), "Tipo":""}, "Estado": {"Valor":row_data.estado, "Tipo": row_data.estado?.toLowerCase()}, "ID": {"Valor":row_data._id, "Tipo": "id"}, "Recibe": {"Valor":recibe, "Tipo": ""}}
    
    }else if(tipo == 'operaciones entrega hoy'){
        
        campo_to_dbvalue = {
            "Cliente":{
                "Valor": getClienteNombre(row_data),
                "Tipo":  `bold ${isClienteBorrador(row_data) ? "nombre_borrador" : ""}`
            },
            "Tipo":{
                "Valor": row_data.tipo_operacion,
                "Tipo":""
            },
            "Entrega":{
                "Valor": formatInt(row_data.monto_a_entregar),
                "Tipo": divisaRecibeFunc(row_data)
            },
            "Estado": {
                "Valor":row_data.estado,
                "Tipo": row_data.estado.toLowerCase()
            }
        }
    }else if(tipo == 'clientes'){
        tipo_modal_edit = 'edit-cliente'

        campo_to_dbvalue = {"Nombre":{"Valor":row_data.nombre, "Tipo": "bold"}, "Telefono": {"Valor":row_data.telefono, "Tipo":""}, "Origen": {"Valor": row_data.origen, "Tipo":""}, "Localidad": {"Valor":row_data.localidad, "Tipo":""}, "Fecha": {"Valor":row_data.fecha_creado?.substring(0,10), "Tipo": ""}, "ID": {"Valor":row_data._id, "Tipo": ""}, "Saldo": {"Valor":"-", "Tipo": ""}}
        
    }else if(tipo == 'ordenes'){
    tipo_modal_edit = 'edit-orden'

    var mto_usd = row_data.usd
    var mto_ars = row_data.ars
  
    campo_to_dbvalue = {
            "Cliente":{
                "Valor":  getClienteNombre(row_data.operacion) ,
                "Tipo":  `bold ${isClienteBorrador(row_data.operacion) ? "nombre_borrador" : ""}`,
            },
            "Entrega":{
                "Valor":row_data.tipo,
                "Tipo":""
            },
            "Mto. USD":{
                "Valor": formatInt(mto_usd),
                "Tipo":"usd"
            },
            "Mto. ARS":{
                "Valor":formatInt(mto_ars),
                "Tipo":"ars"
            },
    
            "Fecha entrega":{
                "Valor": row_data.fecha_entrega ? formatDate(row_data.fecha_entrega) : '',
                "Tipo": ""
            },
            "Estado":{
                "Valor": row_data.estado,
                "Tipo": row_data.tipo
            },
            "ID":{
                "Valor": row_data._id,
                "Tipo": ""
            }
        }


    }else if(tipo=='proveedores'){

        tipo_modal_edit = 'edit-movimiento-proveedor'

        campo_to_dbvalue = {
            "Fecha":{
                "Valor":row_data.fecha_creado !== undefined ? row_data.fecha_creado?.substring(0,10) : null,
                "Tipo": ""
            },
            "Ingreso":{
                "Valor":row_data.importe > 0 ? formatInt(row_data.importe.toFixed(2))  : "",
                "Tipo": `bold ${row_data.proveedor.divisa.toLowerCase()}`
            },
            "Egreso":{
                "Valor":row_data.importe < 0 ? formatInt(row_data.importe.toFixed(2))  : "",
                "Tipo": `bold egreso ${row_data.proveedor.divisa.toLowerCase()}`
            },
            "Origen":{
                "Valor":row_data.origen,
                "Tipo": ""
            },
            "Cuenta destino":{
                "Valor":row_data.cuenta_destino !== undefined ? row_data?.cuenta_destino?.nombre : null,
                "Tipo": ""
            },
            "Comision":{
                "Valor":row_data.comision,
                "Tipo": ""
            },
            "Importe comision":{
                "Valor": formatInt( parseFloat(row_data.importe * (row_data.comision / 100)).toFixed(2) ),
                "Tipo": row_data?.proveedor?.divisa?.toLowerCase()
            },
            "Estado":{
                "Valor":row_data.estado,
                "Tipo": row_data.estado.toLowerCase()
            },
            "ID Asoc.":{
                "Valor": row_data?.operacion ? row_data?.operacion?._id : row_data?.orden ? row_data?.orden?._id : "",
                "Tipo": ""
            },
            "ID":{
                "Valor": row_data._id,
                "Tipo": ""
            },
        }


    }else if(tipo == 'cajas'){

        tipo_modal_edit = 'edit-movimiento-caja'

        campo_to_dbvalue = {
            "Fecha":{
                "Valor":row_data.fecha_creado?.substring(0,10),
                "Tipo": ""
            },
            "Importe":{
                "Valor": formatInt(row_data.importe),
                "Tipo": row_data.tipo === 0 ? "bold egreso" : "bold"
            },
            "Descripcion":{
                "Valor":row_data.descripcion,
                "Tipo": ""
            },
            "Categoria":{
                "Valor":row_data.categoria,
                "Tipo": ""
            },
            "ID Asoc.":{
                "Valor": row_data?.operacion ? row_data?.operacion?._id : row_data?.orden ? row_data?.orden?._id : "",
                "Tipo": ""
            }
        }
        

    }else if(tipo == 'ordenes de hoy'){

    tipo_modal_edit = 'edit-orden'

    campo_to_dbvalue = {
            "Cliente":{
                "Valor": getClienteNombre(row_data.operacion),
                "Tipo":  `bold ${isClienteBorrador(row_data.operacion) ? "nombre_borrador" : ""}`,
            },
            "Entrega":{
                "Valor": row_data.tipo,
                "Tipo":""
            },
            "Mto. USD":{
                "Valor": formatInt(row_data.usd),
                "Tipo":"usd"
            },
            "Mto. ARS":{
                "Valor": formatInt(row_data.ars),
                "Tipo": "ars"
            },
            "Localidad":{
                "Valor": row_data.localidad,
                 "Tipo": ""
            },
            "Fecha Entrega":{
                "Valor": row_data.fecha_entrega ? formatDate(row_data.fecha_entrega) : '',
                 "Tipo": ""
            },
            "Estado":{
                "Valor": row_data.estado,
                "Tipo": ""
            }
        }

    }else if(tipo == 'calendario de pagos'){

        campo_to_dbvalue = {
                "Fecha":{
                    "Valor": row_data.Fecha,
                    "Tipo": "bold"
                    },
                "Monto":{
                    "Valor": row_data.Monto,
                    "Tipo":"usd"
                }
        }
   
    
    }else if(tipo == 'operaciones sin órdenes'){
        
        tipo_modal_edit = 'agregar-orden'

        campo_to_dbvalue = {
            "Cliente":{
                "Valor":getClienteNombre(row_data),
                "Tipo": `bold ${isClienteBorrador(row_data) ? "nombre_borrador" : ""}`
                },
            "Tipo": {
                    "Valor":row_data.tipo_operacion,
                    "Tipo":""
                },
            "Entrega": {
                "Valor":formatInt(row_data.monto_a_entregar),
                "Tipo": divisaRecibeFunc(row_data)
                },
            "Estado": {
                "Valor":row_data.estado,
                "Tipo": row_data.estado.toLowerCase()
            }
        }
        
    }else if(tipo == 'facturas'){

        tipo_modal_edit = 'edit-factura'
        campo_to_dbvalue = {
            "Cliente":{
                "Valor": getClienteNombre(row_data.operacion),
                "Tipo": `bold ${isClienteBorrador(row_data.operacion) ? "nombre_borrador" : ""}`
            },
            // "Mto. Operacion":{
            //     "Valor": row_data.operacion !== undefined ? formatInt(row_data.operacion.monto_enviado) : '',
            //     "Tipo":"usd"
            // },
            // "Envio Efvo.":{
            //     "Valor": formatInt(row_data.operacion?.monto_a_entregar),
            //     "Tipo":"usd"
            // },
            "Mto. Fra. USD":{
                "Valor": row_data.tipo_orden !== undefined ? row_data.tipo_orden.factura !== undefined ? formatInt(row_data.tipo_orden.factura.monto_factura_usd) : '' : '',
                "Tipo":"usd"
            },
            "Fra. USD (+%)":{
                "Valor": row_data.tipo_orden !== undefined ? row_data.tipo_orden.factura !== undefined ? row_data.tipo_orden.factura.monto_factura_usd_comision !== undefined ? formatInt(row_data.tipo_orden.factura.monto_factura_usd_comision?.toFixed(2)) : '' : '' : '',
                "Tipo":"usd"
            },
            "Comision":{
                "Valor": row_data.tipo_orden !== undefined ? row_data.tipo_orden.factura !== undefined ? formatInt(row_data.tipo_orden.factura.comision) : '' : '',
                 "Tipo": "usd"
            },
            "Cambio Nuestro":{
                "Valor": row_data.tipo_orden !== undefined ? row_data.tipo_orden.factura !== undefined ? formatInt(row_data.tipo_orden.factura.cambio_nuestro ) : '' : '',
                 "Tipo": "ars"
            },
            "Mto. Fra. ARS":{
                "Valor":row_data.tipo_orden !== undefined ? row_data.tipo_orden.factura !== undefined ? formatInt(row_data.tipo_orden.factura.monto_factura_ars ) : '' : '',
                "Tipo": "ars"
            },
            "Fra. ARS (+%)":{
                "Valor": row_data.tipo_orden !== undefined ? row_data.tipo_orden.factura !== undefined ? formatInt( Math.floor(row_data.tipo_orden.factura.monto_factura_ars_comision) ) : '' : '',
                "Tipo": "ars"
            },
            "Estado":{
                "Valor": row_data.estado ? row_data.estado : '',
                "Tipo": row_data.tipo
            }
        }


    }else if(tipo == 'cambios'){
        tipo_modal_edit = 'edit-cambio'

        var divisa_recibo = "usd"
        var divisa_entrego = "ars"
        if (row_data.tipo_cambio == 'Compra') {
            var divisa_recibo = "ars"
            var divisa_entrego = "usd"
        }

        campo_to_dbvalue = {
            "Fecha":{
                "Valor": formatDate3(row_data.fecha_creado),
                "Tipo": ""
            },
            "Nombre":{
                "Valor": getClienteNombre(row_data),
                "Tipo":`bold ${isClienteBorrador(row_data) ? "nombre_borrador" : ""}`
            },
            "Cambio nuestro":{
                "Valor":  formatInt(row_data.cambio_prj),
                "Tipo":"ars"
            },
            "Cambio cliente":{
                "Valor": formatInt(row_data.cambio_cliente),
                "Tipo":"ars"
            },
            "Spread":{
                "Valor": row_data.spread,
                "Tipo": "ars"
            },
            "Recibido":{
                "Valor": formatInt(row_data.monto_enviado),
                 "Tipo": divisa_recibo
            },
            "A entregar":{
                "Valor": formatInt(row_data.monto_a_entregar),
                 "Tipo": divisa_entrego
            },
            "Ganancia":{
                "Valor": formatInt( ( row_data.spread / row_data.cambio_cliente ).toFixed(2)),
                "Tipo": "usd"
            },
            "ID":{
                "Valor": row_data._id,
                "Tipo": ""
            },
        }
       

    }else if(tipo == 'cash'){

        tipo_modal_edit = 'edit-cash'
    
        campo_to_dbvalue = {
                "Cliente":{
                    "Valor": getClienteNombre(row_data.operacion),
                    "Tipo": `bold ${isClienteBorrador(row_data.operacion) ? "cliente_borrador" : ""}`
                },
                "Mto. Cliente":{
                    "Valor":row_data.tipo_orden && row_data.tipo_orden.cash && formatInt(row_data.tipo_orden.cash.monto_cliente),
                    "Tipo":row_data.usd !== 0 ? "usd" : "ars"
                },
                "Comision":{
                    "Valor": row_data.tipo_orden && row_data.tipo_orden.cash && row_data.tipo_orden.cash.comision,
                    "Tipo":""
                },
                "Mto. Envio":{
                    "Valor": row_data.tipo_orden && row_data.tipo_orden.cash && formatInt(row_data.tipo_orden.cash.monto_envio),
                    "Tipo":row_data.usd !== 0 ? "usd" : "ars"
                },
                "Ubicacion":{
                    "Valor": row_data.localidad,
                     "Tipo": ""
                },
                "Fecha entrega":{
                    "Valor": row_data.fecha_entrega ? formatDate(row_data.fecha_entrega) : '',
                    "Tipo": ""
                },
                "Estado":{
                    "Valor": row_data.estado,
                    "Tipo": row_data.tipo
                },
                "ID":{
                    "Valor": row_data._id,
                    "Tipo": ""
                }
            }
    
    
    
        }else if(tipo === 'existencia' || tipo === 'liquido'){
            campo_to_dbvalue = {
                "Desc.":{
                    "Valor": row_data.categoria,
                    "Tipo": ""
                },
                "USD":{
                    "Valor": formatInt(row_data.usd),
                    "Tipo": "usd"
                },
                "ARS":{
                    "Valor": formatInt(row_data.ars),
                    "Tipo": "ars"
                },
                "EUR":{
                    "Valor": formatInt(row_data.eur),
                    "Tipo": "eur"
                }
            } 
        }else if (tipo ==='cierre PRJ'){

            campo_to_dbvalue = {
                "Desc.":{
                    "Valor": row_data.categoria,
                    "Tipo": ""
                },
                "Debe":{
                    "Valor": formatInt(row_data.debe),
                    "Tipo": "usd"
                },
                "Haber":{
                    "Valor": formatInt(row_data.haber),
                    "Tipo": "usd"
                }
            } 

        }else if (tipo ==='depositos'){

            tipo_modal_edit = 'edit-orden'

            campo_to_dbvalue = {
                "Cliente":{
                    "Valor": getClienteNombre(row_data.operacion),
                    "Tipo": `bold ${isClienteBorrador(row_data.operacion) ? "nombre_borrador" : ""}`
                },
                "Mto. USD":{
                    "Valor": formatInt(row_data.usd),
                    "Tipo":"usd"
                },
                "Mto. ARS":{
                    "Valor": formatInt(row_data.ars),
                    "Tipo":"ars"
                },
                "Banco":{
                    "Valor": row_data.banco,
                     "Tipo": ""
                },
                "Estado":{
                    "Valor": row_data.estado,
                    "Tipo": row_data.tipo
                },
                "Fecha Entrega":{
                    "Valor": row_data.fecha_entrega ? formatDate(row_data.fecha_entrega) : '',
                    "Tipo": ""
                },
                "ID":{
                    "Valor": row_data._id,
                    "Tipo": ""
                },
            }

        }else if(tipo === "ordenes cliente"){
          
            campo_to_dbvalue= {
                "Fecha":{
                    "Valor": row_data.fecha_creado?.substring(0,10),
                    "Tipo": ""
                },
                "ID Orden":{
                    "Valor": row_data._id,
                    "Tipo": "id",
                },
                "Importe":{
                    "Valor": getRealSaldoOrden(row_data)?.toFixed(2),
                    "Tipo": "usd",
                },

            }
        }
    
        return [campo_to_dbvalue, tipo_modal_edit]

}

export const shouldStayClicked = (tipo) => {
    return (tipo !== "existencia" && tipo !== "cierre PRJ" && tipo !== "liquido" && tipo !== "calendario de pagos")
}

export const shouldExpandView = (tipo) => {
    return (tipo !== 'cajas' && tipo !== 'operaciones sin órdenes' && tipo !== 'operaciones entrega hoy'  && tipo !== 'calendario de pagos' && tipo !== 'ordenes de hoy' && tipo !== 'existencia' && tipo !== 'cierre PRJ' && tipo !== 'liquido' && tipo !== 'calendario de pagos')
}

export const shouldHaveNote = (row_data) =>{
    let note = '', note_img = 'note'
    if(row_data?.nota !== undefined){
        if(row_data?.nota?.length>0){
            note = 'has-note'
            note_img = note
        }
    }
    return [note, note_img]
}

export const shouldBeFaved = (row_data) => {
    let fav = '', fav_img = 'fav'
    if(row_data.fav_status == 1){
        fav = 'faved'
        fav_img = fav
    }
    return [fav, fav_img]
}

export const shouldHaveActions = (tipo) => {
    return (tipo !== 'cierre PRJ' && tipo !== 'existencia' && tipo !== 'liquido' && tipo !== 'calendario de pagos' && tipo !== 'ordenes cliente')
}

export const shouldHaveBulkSelect = (tipo) => {
    return (tipo === 'ordenes de hoy' || tipo === 'ordenes')
}

export function isClienteBorrador(operacion){
    return operacion?.cliente === null && !operacion?.proveedor_as_cliente
}

export function getClienteNombre(operacion){
    
    if (!operacion?.proveedor_as_cliente) {
        
        if(isClienteBorrador(operacion)){
                return operacion?.cliente_borrador
        }else if(operacion?.proveedor_as_cliente){
            return operacion?.proveedor_as_cliente?.nombre
        }
        return operacion?.cliente?.nombre
    }else{
        return operacion?.proveedor_as_cliente.nombre
    }
}

function getMontoEnviadoDivisa(operacion){
    if(operacion.tipo_operacion === "Cambio" && operacion?.tipo_cambio === "Compra"){
        return "ars"
    }
    return "usd"
}
