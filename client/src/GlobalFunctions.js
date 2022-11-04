export const getIdentifier = () => {
    return Math.floor(Math.random() * (100000000 - 1000000) + 1000000);
}

export const capitalize = (string) => {

    return string.charAt(0).toUpperCase() + string.slice(1)

}

export const formatDate = (date) =>{

    if (date != null ) {
        var fecha = date;
        var nueva = fecha.split("T")[0];
        var format = nueva.split("-");
        var ultima = format[2]+'-'+format[1] +'-'+format[0]
        return ultima;
    }
}

export const formatDateYmd = (date) =>{
    
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export const formatDate3 = (date) =>{
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month].join('/');
}

export const estados = {
    operaciones: ['Pendiente', 'Foto', 'Comprobante', 'Confirmado'],
    ordenes: ['Pendiente', 'Entregada'],
    movimientos_proveedor: ['Enviado', 'Acreditado'],
}

export const tipos = {
    operaciones: ['Bajada', 'Subida', 'Cambio', 'Crypto'],
    ordenes: ['Recibo', 'Moto', 'Retira', 'Depósito', 'Factura', 'Cash Cash', 'Crypto', 'Transferencia'],
    clientes: ['Boca en Boca', 'Foro', 'Bauti'],
}

export const pagination = {
    ROWS_PER_PAGE: 20,
    PAGINATIONS: 10,
    PAGINATIONS_BEFORE_CLICK: 4,
    get_pages: (rows_length, clicked_tab=1) =>{

        var pagination_pages = []

        if (rows_length == 0){
            rows_length = 1
        } 
        
        var num_of_pages = Math.ceil(rows_length / pagination.ROWS_PER_PAGE)
        
        // Si la pestaña cliqueada esta cerca del final, agregamos paginacion al principio
        var add_to_front = pagination.PAGINATIONS - pagination.PAGINATIONS_BEFORE_CLICK - 1 - (num_of_pages - clicked_tab)
        if(add_to_front < 0 ){
            add_to_front = 0
        }

        var start_point = clicked_tab - pagination.PAGINATIONS_BEFORE_CLICK - add_to_front
        if(start_point<=0){
            start_point = 1
        }

        for(let i=0; i<pagination.PAGINATIONS; i++){
            var pag = i + start_point
            if(pag<= num_of_pages){
                pagination_pages.push(pag)
            }
        }
        
        return pagination_pages;
        
    }
}

export const periodos = {
    periodos: [
        {periodo: "1", label: "1 día"},
        {periodo: "30", label: "30 días"},
        {periodo: "90", label: "90 días"},
        {periodo: "todo", label: "Todo el período"},
        // {periodo: "custom", label: "Seleccionar período"}
    ],
    get_rango_from_periodo: (periodo)=>{

        var from = new Date();
        var to = new Date();

        if(periodo.periodo !== 'todo' && periodo.periodo !== 'custom'){
            var from = from.setDate(from.getDate() - parseInt(periodo.periodo));
        }
        
        if(periodo.periodo === 'todo'){
            var from = from.setDate(from.getDate() - 1000000);
        }

        to = to.setDate(to.getDate() + 2);

        from = formatDateYmd(from)
        to = formatDateYmd(to)

        return{from, to}
    },
    default: ()=>{
        var defalt_periodo_index = 2
        var periodo = periodos.periodos[defalt_periodo_index]
        var rango = periodos.get_rango_from_periodo(periodo)

        return {periodo, rango}
    }

}

export const operacionDefaults = {
    Bajada: {
        cuenta_origen: "Payoneer",
        fee_plataforma: 2,
        tipo_recibe: "Proveedor",
        estado: estados.operaciones[0],
    },
    Subida: {
        cuenta_origen: "Payoneer",
        fee_plataforma: 2,
        tipo_envia: "Proveedor",
        tipo_recibe: "Proveedor",
        estado: estados.operaciones[0]
    },
    Crypto: {
        estado: estados.operaciones[0]
    },
    Cambio: {
        // tipo_cambio: "Compra",
        estado: estados.operaciones[0]
    }
}

export const provincias = [{"nombre_completo":"Provincia de Misiones","fuente":"IGN","iso_id":"AR-N","nombre":"Misiones","id":"54","categoria":"Provincia","iso_nombre":"Misiones","centroide":{"lat":-26.8753965086829,"lon":-54.6516966230371}},{"nombre_completo":"Provincia de San Luis","fuente":"IGN","iso_id":"AR-D","nombre":"San Luis","id":"74","categoria":"Provincia","iso_nombre":"San Luis","centroide":{"lat":-33.7577257449137,"lon":-66.0281298195836}},{"nombre_completo":"Provincia de San Juan","fuente":"IGN","iso_id":"AR-J","nombre":"San Juan","id":"70","categoria":"Provincia","iso_nombre":"San Juan","centroide":{"lat":-30.8653679979618,"lon":-68.8894908486844}},{"nombre_completo":"Provincia de Entre Ríos","fuente":"IGN","iso_id":"AR-E","nombre":"Entre Ríos","id":"30","categoria":"Provincia","iso_nombre":"Entre Ríos","centroide":{"lat":-32.0588735436448,"lon":-59.2014475514635}},{"nombre_completo":"Provincia de Santa Cruz","fuente":"IGN","iso_id":"AR-Z","nombre":"Santa Cruz","id":"78","categoria":"Provincia","iso_nombre":"Santa Cruz","centroide":{"lat":-48.8154851827063,"lon":-69.9557621671973}},{"nombre_completo":"Provincia de Río Negro","fuente":"IGN","iso_id":"AR-R","nombre":"Río Negro","id":"62","categoria":"Provincia","iso_nombre":"Río Negro","centroide":{"lat":-40.4057957178801,"lon":-67.229329893694}},{"nombre_completo":"Provincia del Chubut","fuente":"IGN","iso_id":"AR-U","nombre":"Chubut","id":"26","categoria":"Provincia","iso_nombre":"Chubut","centroide":{"lat":-43.7886233529878,"lon":-68.5267593943345}},{"nombre_completo":"Provincia de Córdoba","fuente":"IGN","iso_id":"AR-X","nombre":"Córdoba","id":"14","categoria":"Provincia","iso_nombre":"Córdoba","centroide":{"lat":-32.142932663607,"lon":-63.8017532741662}},{"nombre_completo":"Provincia de Mendoza","fuente":"IGN","iso_id":"AR-M","nombre":"Mendoza","id":"50","categoria":"Provincia","iso_nombre":"Mendoza","centroide":{"lat":-34.6298873058957,"lon":-68.5831228183798}},{"nombre_completo":"Provincia de La Rioja","fuente":"IGN","iso_id":"AR-F","nombre":"La Rioja","id":"46","categoria":"Provincia","iso_nombre":"La Rioja","centroide":{"lat":-29.685776298315,"lon":-67.1817359694432}},{"nombre_completo":"Provincia de Catamarca","fuente":"IGN","iso_id":"AR-K","nombre":"Catamarca","id":"10","categoria":"Provincia","iso_nombre":"Catamarca","centroide":{"lat":-27.3358332810217,"lon":-66.9476824299928}},{"nombre_completo":"Provincia de La Pampa","fuente":"IGN","iso_id":"AR-L","nombre":"La Pampa","id":"42","categoria":"Provincia","iso_nombre":"La Pampa","centroide":{"lat":-37.1315537735949,"lon":-65.4466546606951}},{"nombre_completo":"Provincia de Santiago del Estero","fuente":"IGN","iso_id":"AR-G","nombre":"Santiago del Estero","id":"86","categoria":"Provincia","iso_nombre":"Santiago del Estero","centroide":{"lat":-27.7824116550944,"lon":-63.2523866568588}},{"nombre_completo":"Provincia de Corrientes","fuente":"IGN","iso_id":"AR-W","nombre":"Corrientes","id":"18","categoria":"Provincia","iso_nombre":"Corrientes","centroide":{"lat":-28.7743047046407,"lon":-57.8012191977913}},{"nombre_completo":"Provincia de Santa Fe","fuente":"IGN","iso_id":"AR-S","nombre":"Santa Fe","id":"82","categoria":"Provincia","iso_nombre":"Santa Fe","centroide":{"lat":-30.7069271588117,"lon":-60.9498369430241}},{"nombre_completo":"Provincia de Tucumán","fuente":"IGN","iso_id":"AR-T","nombre":"Tucumán","id":"90","categoria":"Provincia","iso_nombre":"Tucumán","centroide":{"lat":-26.9478001830786,"lon":-65.3647579441481}},{"nombre_completo":"Provincia del Neuquén","fuente":"IGN","iso_id":"AR-Q","nombre":"Neuquén","id":"58","categoria":"Provincia","iso_nombre":"Neuquén","centroide":{"lat":-38.6417575824599,"lon":-70.1185705180601}},{"nombre_completo":"Provincia de Salta","fuente":"IGN","iso_id":"AR-A","nombre":"Salta","id":"66","categoria":"Provincia","iso_nombre":"Salta","centroide":{"lat":-24.2991344492002,"lon":-64.8144629600627}},{"nombre_completo":"Provincia del Chaco","fuente":"IGN","iso_id":"AR-H","nombre":"Chaco","id":"22","categoria":"Provincia","iso_nombre":"Chaco","centroide":{"lat":-26.3864309061226,"lon":-60.7658307438603}},{"nombre_completo":"Provincia de Formosa","fuente":"IGN","iso_id":"AR-P","nombre":"Formosa","id":"34","categoria":"Provincia","iso_nombre":"Formosa","centroide":{"lat":-24.894972594871,"lon":-59.9324405800872}},{"nombre_completo":"Provincia de Jujuy","fuente":"IGN","iso_id":"AR-Y","nombre":"Jujuy","id":"38","categoria":"Provincia","iso_nombre":"Jujuy","centroide":{"lat":-23.3200784211351,"lon":-65.7642522180337}},{"nombre_completo":"Ciudad Autónoma de Buenos Aires","fuente":"IGN","iso_id":"AR-C","nombre":"Ciudad Autónoma de Buenos Aires","id":"02","categoria":"Ciudad Autónoma","iso_nombre":"Ciudad Autónoma de Buenos Aires","centroide":{"lat":-34.6144934119689,"lon":-58.4458563545429}},{"nombre_completo":"Provincia de Buenos Aires","fuente":"IGN","iso_id":"AR-B","nombre":"Buenos Aires","id":"06","categoria":"Provincia","iso_nombre":"Buenos Aires","centroide":{"lat":-36.6769415180527,"lon":-60.5588319815719}},{"nombre_completo":"Provincia de Tierra del Fuego, Antártida e Islas del Atlántico Sur","fuente":"IGN","iso_id":"AR-V","nombre":"Tierra del Fuego, Antártida e Islas del Atlántico Sur","id":"94","categoria":"Provincia","iso_nombre":"Tierra del Fuego","centroide":{"lat":-82.52151781221,"lon":-50.7427486049785}}]

export const cajas = [{
    divisa: 'ARS',
    ingresos: 0,
    egresos: 0,
},
{
    divisa: 'USD',
    ingresos: 0,
    egresos: 0,
},
{
    divisa: 'EUR',
    ingresos: 0,
    egresos: 0,
}]

export const oficinas = ['Callao', 'Microcentro', 'Belgrano']

export const getImporteComision = (importe, comision) =>{
    if(isNaN(comision)) comision = 0
    return parseFloat(parseFloat(importe * (comision / 100)).toFixed(2))
}


// A esta funcion la llaman los reducers para chequear si falla la autenticación del usuario
export const assesRedirect = (action)=>{
    if(action.payload){
        if(action.payload.error === "auth failed"){
            window.location = "/login"
        }
    }
}

export const hasCategoria = (array, cat) => {

    for(let a in array){
        let cat_obj = array[a]
        
        if(cat_obj.categoria === cat.categoria && cat_obj.tipo === cat.tipo){
            return true
        }
        
    }

    return false

}

export const downloadCSV = (filename, text) => {

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
}

export const formatInt = ( int ) => {
    var pesos = parseFloat(int).toFixed(2)
    
    pesos = pesos.toString().replace('.', ",");
    var la_coma = pesos.toString().indexOf(',');
	var miles = la_coma / 3;	
	var finn = pesos;
	for (let i = 1; i < miles + 1 ; i++) {
		var finn = finn.substring(0, la_coma - (3*i) ) + '.' + finn.substring( la_coma - (3*i) )
	}

    if ( finn.charAt(0) == '.' ) {
		var finn2 = finn.substring(1)
	}
	return finn2
}

export const getCleanRowType = (tipo)=>{
    switch(tipo){
        case "operaciones":
        case "operaciones de hoy":
        case "operaciones sin órdenes":
        case "cambios":
            return "operacion"
        case "ordenes":
        case "ordenes de hoy":
        case "depositos":
        case "facturas":
        case "cash":
            return "orden"
        default:
            return "";
    }
}

export const parseNumberFields = (obj) => {
    for(let key of Object.keys(obj)){
        if(typeof obj[key] === "number"){
            obj[key] = parseFloat(obj[key].toFixed(2))
        }
    }
    return obj
}

export const copyToClipboard = (text) => {
    if (window.clipboardData && window.clipboardData.setData) {
        return window.clipboardData.setData("Text", text);
    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}


export function getRealSaldoOrden(orden) {
    var saldo_orden = 0;
    if (orden) {
        switch (orden.tipo) {
            case "Recibo Crypto":
            case "Crypto":
                saldo_orden = orden.tipo_orden.crypto.usdt_a_enviar
            break;
            case "Factura":
                saldo_orden = orden.tipo_orden.factura.monto_factura_usd || 0
            break
            case "Cash Cash":
                saldo_orden = orden.tipo_orden.cash.monto_cliente
            break
            default:
                saldo_orden = orden.usd
                break;
        }

        if (orden.ars > 0 ) {
            saldo_orden += (orden.ars / orden.operacion.cambio_prj)
        }

        if(orden.recibo){
            saldo_orden = orden?.operacion?.monto_a_entregar
        }
        console.log('Saldo orden: ', orden.recibo, ' - ', saldo_orden)
    }
    return saldo_orden;
}

export function divisaRecibeFunc(operacion){
    if (operacion.tipo_cambio == "Venta" ) {
        var divisa = "ARS"
    }else if(operacion.operacion_crypto == "Venta"){
        var divisa = "USDT"
    }else{
        var divisa = "USD"
    }
    return divisa
}

export function getNombreYIdOrd(movimiento) {
    return movimiento.operacion.cliente?.nombre + " - Ord (" + movimiento._id+")"
}
