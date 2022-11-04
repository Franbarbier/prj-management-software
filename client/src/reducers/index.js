import { combineReducers } from 'redux';
import clientes from './DReducers/clientes';
import proveedores from './DReducers/proveedores';
import operaciones from './DReducers/operaciones';
import cuentas from './DReducers/cuentas';
import ordenes from './DReducers/ordenes';
import movimientos from './DReducers/movimientos';
import movimientos_cajas from './DReducers/movimientos_cajas';
import globales from './DReducers/globales';
import users from './DReducers/users';
import reportes from './DReducers/reportes';
import cierre from './DReducers/cierre';
import config from './DReducers/config';

export default combineReducers({
    clientes, proveedores, operaciones, cuentas, ordenes, movimientos, movimientos_cajas, globales, users, reportes, cierre, config
})