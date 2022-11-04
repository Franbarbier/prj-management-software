 import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getProveedores } from '../../actions/proveedores'
import { getMovimientos } from '../../actions/movimientos'
import { getCuentas } from '../../actions/cuentas'
import Sidebar from '../../components/Sidebar/Sidebar';
import MainTable from '../../components/MainTable/MainTable';
import ProveedoresTabs from '../../components/ProveedoresTabs/ProveedoresTabs'
import CounterCaja from '../../components/CounterCaja/CounterCaja'
import { getImporteComision } from '../../GlobalFunctions' 
import ExportarCSV from '../../components/ExportarCSV/ExportarCSV';
import CreateProveedor from '../../components/CreateProveedor/CreateProveedor';
import CreateMovimientoProveedor from '../../components/CreateMovimientoProveedor/CreateMovimientoProveedor';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import EditMovimientoProveedor from '../../components/EditMovimientoProveedor/EditMovimientoProveedor';
import EditProveedor from '../../components/EditProveedor/EditProveedor';
import "./Proveedores.css";

const Proveedores = ({setActiveTab, user}) => {

    const[activeProveedor, setActiveProveedor] = useState(null)
    const[counters, setCounters] = useState({})
    const[actionRow, setActionRow] = useState(false)
    const[renderModal, setRenderModal] = useState({type:'', data:{}})
    const[loading, setLoading] = useState(false)
    const proveedores = useSelector(state => state.proveedores)
    const cuentas = useSelector(state => state.cuentas)
    const movimientos = useSelector(state => state.movimientos)
    const dispatch = useDispatch()

    useEffect(()=>{
        setLoading(true)
        Promise.all([dispatch(getMovimientos()),dispatch(getProveedores()),dispatch(getCuentas())]).then(()=> setLoading(false))
    }, [])

    useEffect(()=>{
        if(activeProveedor === null && proveedores.length > 0){
            setActiveProveedor(proveedores[0])
        }
    })

    function movimientosReducer(prev, cur){
        if(cur.importe > 0){
            prev.ingresado += cur.importe
            prev.comisiones += getImporteComision(cur.importe, cur.comision)
        }else{
            prev.retirado += cur.importe
        }
        return prev
    }        
    
    useEffect(()=>{
        const this_proveedor_movimientos = (movimientos.length>0 && activeProveedor) ? movimientos.filter(movimiento => movimiento.proveedor != undefined && movimiento.proveedor._id == activeProveedor._id) : []
        const {ingresado, comisiones, retirado} = this_proveedor_movimientos.reduce(movimientosReducer, {ingresado:0, comisiones: 0, retirado:0})
        const balance = ((ingresado - comisiones) + retirado).toFixed(2)
        setCounters({balance, monto:ingresado, comisiones})
    }, [ movimientos, activeProveedor])
       
    const campos = ['Fecha', 'Origen', 'Cuenta destino', 'Ingreso', 'Egreso', 'Comision', 'Importe comision', 'Estado', 'ID', 'ID Asoc.']

    return(
        
        <>
            {renderModal.type === 'create-proveedor' && 
                <CreateProveedor setRenderModal={setRenderModal}  />
            }
            {renderModal.type === 'confirm-delete' &&
                <ConfirmDelete tipo="MovimientoProveedor" item={actionRow} setRenderModal={setRenderModal} />
            } 
            {renderModal.type === 'create-movimiento-proveedor' &&
                <CreateMovimientoProveedor activeProveedor={activeProveedor} setRenderModal={setRenderModal} />
            }

            {renderModal.type === 'edit-proveedor' && 
                <EditProveedor data={renderModal.data} setRenderModal={setRenderModal} currentCuentas={cuentas.filter((cuenta)=> cuenta.proveedor && cuenta.proveedor._id === renderModal.data._id )} />
            }

            {renderModal.type === 'edit-movimiento-proveedor' &&
                <EditMovimientoProveedor activeProveedor={activeProveedor} data={renderModal.data} setRenderModal={setRenderModal} />
            }
           <Sidebar vista="proveedores" setActiveTab={setActiveTab} user={user} />
           <div id="proveedores-view">
                <div className="tabs-cont">
                    <div id="add-proveedor" onClick={()=>setRenderModal({type: 'create-proveedor'})}>
                        <div>
                            <p>+</p>
                        </div>
                    </div>
                    <ProveedoresTabs listItems={proveedores} setActiveProveedor={setActiveProveedor} activeProveedor={activeProveedor} setRenderModal={setRenderModal} />
                </div>
                <div className="mainPaddingHoriz">
                    <div id="div-primer">
                        <div id="conters-cont">
                            <div>
                                <CounterCaja nombre="Balance" monto={counters.balance} />
                            </div>
                            <div>
                                <CounterCaja nombre="Monto enviado" monto={counters.monto} />
                                <hr/>
                                <CounterCaja nombre="Total comisiones" monto={counters.comisiones?.toFixed(2)} />
                            </div>
                        </div>
                        <ExportarCSV />
                    </div>
                    <div>

                        {activeProveedor &&
                         <MainTable titulo="proveedores" campos={campos} contenido={movimientos.filter(movimiento => movimiento.proveedor != undefined && movimiento.proveedor._id == activeProveedor._id)} setActionRow={setActionRow} setRenderModal={setRenderModal} loading={loading}  /> 
                        }

                    </div>
                    
                </div>
           </div>
        </>
        
    )
}

export default Proveedores;