import {formatDateYmd, formatDate3} from '../../GlobalFunctions' 

const FILTERABLE_BY_OFICINA = ['operaciones', 'ordenes', 'cambios', 'facturas', 'cash']

export const getCustomInformation = (titulo, contenido, activePage, pagination, filtros, ordenes) => {

    let virtualContenido, tipo_modal_create, rows_length;
    virtualContenido = [...contenido];

    if(titulo === 'operaciones' || titulo === 'operaciones de hoy'){

        tipo_modal_create = 'create-operacion'

        if(filtros.tipo !== ''){
            virtualContenido = virtualContenido.filter(operacion => operacion.tipo_operacion === filtros.tipo)
        }

        if(filtros.buscar !== ''){
            virtualContenido = virtualContenido.filter((operacion)=>filterOperacionByBuscar(operacion, filtros))
        }
        
        if(filtros.estado !== ''){
            virtualContenido = virtualContenido.filter(operacion => operacion.estado === filtros.estado)
        }
        
        if(filtros.fecha.fecha_desde !== ''){
            virtualContenido = virtualContenido.filter(operacion => operacion.fecha_creado >= filtros.fecha.fecha_desde)
        }
        
        if(filtros.fecha.fecha_hasta !== ''){
            virtualContenido = virtualContenido.filter(operacion => operacion.fecha_creado <= filtros.fecha.fecha_hasta)
        }
        
        if(filtros.fecha_entrega.desde !== ''){
            virtualContenido = virtualContenido.filter(operacion => operacion.fecha_entrega >= filtros.fecha_entrega.desde)
        }
        
        if(filtros.fecha_entrega.hasta !== ''){
            virtualContenido = virtualContenido.filter(operacion => operacion.fecha_entrega <= filtros.fecha_entrega.hasta)
        }
        // Este .filer filtra todas las ordenes que no se corresponden a las operaciones mostrandose
        virtualContenido.map((row_data) => row_data.ordenes = ordenes.filter(orden => orden.operacion?._id === row_data?._id));

        
    }else if(titulo=='operaciones entrega hoy'){
        tipo_modal_create = 'create-operacion'

    }else if(titulo=='clientes'){

        tipo_modal_create = 'create-cliente'
        
        if(filtros.buscar !== ''){
            virtualContenido = virtualContenido.filter((cliente)=>filterClienteByBuscar(cliente, filtros))
        }

        if(filtros.tipo !== ''){
            virtualContenido = virtualContenido.filter(cliente => cliente.origen === filtros.tipo)
        }

        if(filtros.fecha.fecha_desde !== ''){
            virtualContenido = virtualContenido.filter(cliente => cliente.fecha_creado >= filtros.fecha.fecha_desde)
        }
        
        if(filtros.fecha.fecha_hasta !== ''){
            virtualContenido = virtualContenido.filter(cliente => cliente.fecha_creado <= filtros.fecha.fecha_hasta)
        }

    }else if(titulo === 'ordenes'){

        tipo_modal_create = 'create-orden'
        
        if(filtros.tipo !== ''){
            virtualContenido = virtualContenido.filter(orden => orden.tipo === filtros.tipo)
        }

        if(filtros.estado !== ''){
            virtualContenido = virtualContenido.filter(orden => orden.estado === filtros.estado)
        }
        
        if(filtros.buscar !== ''){
            virtualContenido = virtualContenido.filter((orden)=>filterOrdenByBuscar(orden, filtros))
        }

        if(filtros.fecha.fecha_desde !== ''){
            virtualContenido = virtualContenido.filter(orden => orden.fecha_creado >= filtros.fecha.fecha_desde)
        }
        
        if(filtros.fecha.fecha_hasta !== ''){
            virtualContenido = virtualContenido.filter(orden => orden.fecha_creado <= filtros.fecha.fecha_hasta)
        }

        if(filtros.fecha_entrega.desde !== ''){
            virtualContenido = virtualContenido.filter(orden => orden.fecha_entrega >= filtros.fecha_entrega.desde)
        }
        
        if(filtros.fecha_entrega.hasta !== ''){
            virtualContenido = virtualContenido.filter(orden => orden.fecha_entrega <= filtros.fecha_entrega.hasta)
        }

        
    }else if(titulo === 'ordenes de hoy'){
        tipo_modal_create = 'create-orden'
        
        const today = new Date()
        const tomorrow = new Date(today)
        const yesterday = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        yesterday.setDate(yesterday.getDate() - 1)

        contenido = contenido.filter(orden => orden.fecha_entrega < formatDateYmd(tomorrow))
        contenido = contenido.filter(orden => orden.estado === "Pendiente")
        
        virtualContenido = virtualContenido.filter(orden => orden.fecha_entrega < formatDateYmd(tomorrow))
        virtualContenido = virtualContenido.filter(orden => orden.estado === "Pendiente")
        
    }else if(titulo === 'calendario de pagos'){

        var virtualContenidoHoy ='';
        var virtualContenidoManana ='';
        var virtualContenidoPasado ='';
        const today = new Date()
        const tomorrow = new Date(today)
        const pasado = new Date(today)
        const trasPasado = new Date(today)
        const yesterday = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        pasado.setDate(pasado.getDate() + 2)
        trasPasado.setDate(trasPasado.getDate() + 3)
        yesterday.setDate(yesterday.getDate() - 1)


        virtualContenidoHoy = virtualContenido.filter(operacion =>  operacion.fecha_entrega  == formatDateYmd(today))
        virtualContenidoManana = virtualContenido.filter(operacion =>  operacion.fecha_entrega == formatDateYmd(tomorrow))
        virtualContenidoPasado = virtualContenido.filter(operacion =>  operacion.fecha_entrega == formatDateYmd(pasado))
        
         var usdHoy = 0;
        for (const key in virtualContenidoHoy) {
            if (Object.hasOwnProperty.call(virtualContenidoHoy, key)) {
                const element = virtualContenidoHoy[key];
                console.log(element)

                // if(element.tipo_operacion == "Bajada" || element.tipo_operacion == "Cambio" ) {
                    if (element.monto_a_entregar) {
                       usdHoy += element.monto_a_entregar;
                    }
                // }
            }
        }

        var usdManana = 0;
        for (const key in virtualContenidoManana) {
            if (Object.hasOwnProperty.call(virtualContenidoManana, key)) {
                const element = virtualContenidoManana[key];
               
                // if(element.tipo_operacion == "Bajada" || element.tipo_operacion == "Cambio" ) {
                    if (element.monto_a_entregar) {
                       usdManana += element.monto_a_entregar;
                    // }
                }
            }
        }

        var usdPasado = 0;
        for (const key in virtualContenidoPasado) {
            if (Object.hasOwnProperty.call(virtualContenidoPasado, key)) {
                const element = virtualContenidoPasado[key];
                // if(element.tipo_operacion == "Bajada" || element.tipo_operacion == "Cambio" ) {
                    if (element.monto_a_entregar) {
                       usdPasado += element.monto_a_entregar;
                    }
                // }
            }
        }
  
        var row_data = []
        virtualContenido = row_data = [
            {
                'Fecha': formatDate3(today),
                'Monto': usdHoy,

            },{
                'Fecha': formatDate3(tomorrow),
                'Monto': usdManana,

            },{
                'Fecha': formatDate3(pasado),
                'Monto': usdPasado,

            }
        ]


        
        
    }else if(titulo === 'operaciones sin órdenes'){

                
        var listaOrdenes = virtualContenido[0];
        virtualContenido = virtualContenido[1]
               
        var OperConOrd = [];
        var listaOpId = [];
                
        // desestimamos las que son tipo recibo
        for (let index = 0; index < listaOrdenes.length; index++) {   
            if( listaOrdenes[index].recibo == true){
                listaOrdenes.splice(index, 1)
            }
           
            if (typeof listaOrdenes[index] === 'object') {
                if (listaOrdenes[index].recibo != true) {
                    OperConOrd.push(listaOrdenes[index].operacion._id)
                }
            }
        }
    
        virtualContenido = virtualContenido.filter( ( el ) => !OperConOrd.includes( el._id ) );


    }else if(titulo === 'proveedores'){
        tipo_modal_create = 'create-movimiento-proveedor'
    }else if(titulo === 'cajas'){

        tipo_modal_create = 'create-movimiento-caja'

    }else if(titulo === 'facturas'){
        tipo_modal_create = 'create-factura'

        if(filtros.estado !== ''){
            virtualContenido = virtualContenido.filter(factura => factura.estado === filtros.estado)
        }
        
        if(filtros.buscar !== ''){
            virtualContenido = virtualContenido.filter((orden)=>filterOrdenByBuscar(orden, filtros))
        }

        if(filtros.fecha.fecha_desde !== ''){
            virtualContenido = virtualContenido.filter(factura => factura.fecha_creado >= filtros.fecha.fecha_desde)
        }
        
        if(filtros.fecha.fecha_hasta !== ''){
            virtualContenido = virtualContenido.filter(factura => factura.fecha_creado <= filtros.fecha.fecha_hasta)
        }

    }else if(titulo === 'cambios'){
        tipo_modal_create = 'create-cambio'

        
        virtualContenido = contenido;
        
        if(filtros.buscar !== ''){
            virtualContenido = virtualContenido.filter((cambio)=>filterOperacionByBuscar(cambio, filtros))
        }
        
        if(filtros.estado !== ''){
            virtualContenido = virtualContenido.filter(cambio => cambio.estado === filtros.estado)
        }

        if(filtros.fecha.fecha_desde !== ''){
            virtualContenido = virtualContenido.filter(cambio => cambio.fecha_creado >= filtros.fecha.fecha_desde)
        }
        
        if(filtros.fecha.fecha_hasta !== ''){
            virtualContenido = virtualContenido.filter(cambio => cambio.fecha_creado <= filtros.fecha.fecha_hasta)
        }

    }else if(titulo === 'cash'){
        tipo_modal_create = 'create-cash'

        if(filtros.estado !== ''){
            virtualContenido = virtualContenido.filter(cash => cash.estado === filtros.estado)
        }
        
        if(filtros.buscar !== ''){
            virtualContenido = virtualContenido.filter((cash)=>filterOrdenByBuscar(cash, filtros))
        }

        if(filtros.fecha.fecha_desde !== ''){
            virtualContenido = virtualContenido.filter(cash => cash.fecha_creado >= filtros.fecha.fecha_desde)
        }
        
        if(filtros.fecha.fecha_hasta !== ''){
            virtualContenido = virtualContenido.filter(cash => cash.fecha_creado <= filtros.fecha.fecha_hasta)
        }
    }else if(titulo === 'existencia'){

        virtualContenido = contenido

    }else if(titulo === "ordenes cliente"){
        console.log(virtualContenido)
    }

    if(FILTERABLE_BY_OFICINA.includes(titulo)){
        if(filtros.oficina !== ''){
            virtualContenido = virtualContenido.filter(operacion => operacion.oficina === filtros.oficina)
        }
    }

    if(filtros.hide_ordenes_recibo){
        virtualContenido = virtualContenido.filter(orden => orden.recibo !== true)
    }

    rows_length = virtualContenido.length
    virtualContenido = virtualContenido.slice((activePage * pagination.ROWS_PER_PAGE) - pagination.ROWS_PER_PAGE)

    return [virtualContenido, tipo_modal_create, rows_length]

} 

export const shouldHaveFiltroTipo = (titulo) => { 
    return (titulo !== 'facturas' && titulo !== 'cash' && titulo !== 'cambios')
}

export const shouldHavePagination = (titulo) => {
    return (titulo !== 'existencia' && titulo !== 'cierre PRJ' && titulo !== 'liquido' && titulo !== 'calendario de pagos')
}

export const shouldHaveFiltros = (titulo) => {
    return (titulo === 'operaciones' || titulo === 'ordenes' || titulo === 'clientes' || titulo === 'facturas' || titulo === 'cash' || titulo === 'cambios')
}  

export const shouldHaveFiltroEstado = (titulo) => {
    return (titulo !== 'clientes')
}

export const shouldHaveFiltroOrdenRecibo = (titulo) => {
    return titulo === "ordenes"
}

export const shouldHaveCreateButton = (titulo) => {
    return (titulo !== 'cierre PRJ' && titulo !== 'existencia' && titulo !== 'liquido' && titulo !== 'calendario de pagos' && titulo !== 'depositos' && titulo !== 'ordenes cliente')
}

export const shouldHaveFiltroOficina = (titulo) => {
    return (titulo === 'operaciones' || titulo === 'ordenes')
}

export const shouldHaveFiltroFechaEntrega = (titulo) => {
    return (titulo === 'operaciones' || titulo === 'ordenes')
}

function filterOperacionByBuscar(operacion, filtros){
    if(operacion._id.includes(filtros.buscar)) return true
    if(operacion?.cliente === undefined){
        if(operacion?.cliente_borrador?.toLowerCase().includes(filtros.buscar.toLowerCase())) return true
        return false
    }
    if(operacion.cliente?.nombre.toLowerCase().includes(filtros.buscar.toLowerCase())) return true
}

function filterClienteByBuscar(cliente, filtros){
    if(cliente._id.includes(filtros.buscar)) return true
    if(cliente?.nombre?.toLowerCase().includes(filtros.buscar.toLowerCase())) return true
    return false
}

function filterOrdenByBuscar(orden, filtros){
    if(orden._id.includes(filtros.buscar)) return true
    if(orden.operacion._id.includes(filtros.buscar))return true
    if(orden?.operacion?.cliente === undefined){
        if(orden?.operacion?.cliente_borrador?.toLowerCase().includes(filtros.buscar.toLowerCase())) return true
        return false
    }
    if(orden?.operacion?.cliente?.nombre?.toLowerCase().includes(filtros.buscar.toLowerCase())) return true
}

