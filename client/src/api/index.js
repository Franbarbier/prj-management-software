import axios from 'axios';

// Obtenemos el token del localStorage
const token = window.localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`
}

const ENDPOINT = 'http://localhost:5000/';

const url_users = ENDPOINT+'users'
export const login = (user) => axios.post(`${url_users}/login`, user);
export const verifyUser = async (id) => {
    var res = await fetch(`${url_users}/verify`, {method: 'GET', headers})
    .then(response => response.json())
    .then(data => data);
    
    return res
}
const url_clientes = ENDPOINT+'clientes'
export const getClientes = (filtros) => axios.get(url_clientes, {...filtros, headers});
export const createCliente = (newCliente) => axios.post(url_clientes, newCliente, {headers});
export const deleteCliente = (id) => axios.delete(`${url_clientes}/${id}`, {headers});
export const updateCliente = (cliente) => axios.patch(`${url_clientes}/`, cliente, {headers});
export const getOrdenesCliente = (id_cliente) => axios.get(`${url_clientes}/ordenes/${id_cliente}`, {headers});


const url_operaciones = ENDPOINT+'operaciones'
export const getOperaciones = (filtros) => axios.get(url_operaciones, {...filtros, headers});
export const hasOrden = async (id) => {
    var res = await fetch(`${ENDPOINT}operaciones/`+id, {method: 'GET', headers})
    .then(response => response.json())
    .then(data => data);
    
    return res
}

export const getClienteOperaciones = (id_cliente) => axios.get(`${url_operaciones}/cliente/${id_cliente}`, headers);
export const createOperacion = (newOperacion) => axios.post(url_operaciones, newOperacion, {headers});
export const deleteOperacion = (id) => axios.delete(`${url_operaciones}/${id}`, {headers});
export const updateOperacion = (operacion) => axios.patch(`${url_operaciones}/`, operacion, {headers});

const url_proveedores = ENDPOINT+'proveedores'
export const createProveedor = (newProveedor) => axios.post(url_proveedores, newProveedor, {headers});
export const getProveedores = () => axios.get(url_proveedores, {headers});
export const updateProveedor = (proveedor) => axios.patch(`${url_proveedores}/`, proveedor, {headers});

const url_cuentas = ENDPOINT+'cuentas'
export const createCuenta = (newCuenta) => axios.post(url_cuentas, newCuenta, {headers});
export const getCuentas = () => axios.get(url_cuentas, {headers});

const url_ordenes = ENDPOINT+'ordenes'
export const getOrdenes = (filtros) => axios.get(url_ordenes, {...filtros, headers});
export const createOrdenSolo = (ordenes) => axios.post(url_ordenes, ordenes, {headers});
export const editOrdenes = (ordenes) => axios.post(`${url_ordenes}/edit`, ordenes, {headers});
export const deleteOrden = (id) => axios.delete(`${url_ordenes}/${id}`, {headers});
export const liquidarTransferencias = (data) => axios.post(`${url_ordenes}/liquidarTransferencias`, data, {headers});
export const createFactura = (factura) => axios.post(`${url_ordenes}/facturas`, factura, {headers});
export const createCash = (cash) => axios.post(`${url_ordenes}/cash`, cash, {headers});
export const findOrdenesWithFilters = async (filtros) => axios.get(`${url_ordenes}/filter`, {params:{...filtros}, headers});

const url_movimientos = ENDPOINT+'movimientos'
export const getMovimientos = () => axios.get(url_movimientos, {headers});
export const createMovimientoProveedor = (newMovimientoProveedor) => axios.post(`${url_movimientos}/proveedores`, newMovimientoProveedor, {headers});
export const deleteMovimientoProveedor = (id) => axios.delete(`${url_movimientos}/proveedores/${id}`, {headers});
export const updateMovimientoProveedor = (movimientoProveedor) => axios.patch(`${url_movimientos}/proveedores`, movimientoProveedor, {headers});
export const findMovimientosProveedorWithFilters = async (filtros) => axios.get(`${url_movimientos}/proveedores/filter`, {params:{...filtros}, headers});

export const createMovimientoCaja = (newMovimientoCaja) => axios.post(`${url_movimientos}/cajas`, newMovimientoCaja, {headers});
export const getMovimientosCajas = () => axios.get(`${url_movimientos}/cajas`, {headers});
export const deleteMovimientoCaja = (id) => axios.delete(`${url_movimientos}/cajas/${id}`, {headers});
export const updateMovimientoCaja = (movimientoCaja) => axios.patch(`${url_movimientos}/cajas`, movimientoCaja, {headers});
export const exportMovimientosCajas = (filtros) => axios.get(`${url_movimientos}/cajas/export`, {...filtros, headers});
export const findMovimientosCajaWithFilters = async (filtros) => axios.get(`${url_movimientos}/cajas/filter`, {params:{...filtros}, headers});


const url_globales = ENDPOINT+'globales'
export const favRow = (row) => axios.post(`${url_globales}/favRow`, row, {headers})
export const changeEstado = (estado_data) => axios.post(`${url_globales}/changeEstado`, estado_data, {headers})

const url_reportes = ENDPOINT+'reportes'
export const getAll = (filtros) => axios.get(url_reportes, {...filtros, headers});
export const getBalancesCajas = () => axios.get(`${url_reportes}/cajas`, {headers});

const url_cierre = ENDPOINT+'cierre'
export const getCierreTable = (filtros) => axios.get(`${url_cierre}/cierreTable`, {...filtros, headers});
export const getExistencia = (filtros) => axios.get(url_cierre+'/existencia', {...filtros, headers});
export const getCierre = (filtros) => axios.get(url_cierre+'/cierre', {...filtros, headers});

const url_config = ENDPOINT+'config'
export const getConfig = () => axios.get(url_config, {headers});
export const updateConfig = (config) => axios.patch(`${url_config}/`, config, {headers});
export const setCambioDia = () => axios.post(`${url_config}/cambio_dia`, {}, {headers});
export const getCambioDia = () => axios.get(`${url_config}/cambio_dia`, {headers});
export const getHistorialCambios = async (filtros) =>  axios.get(`${url_config}/historial_cambios`, {...filtros, headers});
