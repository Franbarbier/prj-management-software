import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import * as utils from '../utils';
import Input from '../../Input/Input';

const CreateBajada = ({operacionData, setOperacionData, divisaRecibe}) => {

    const proveedores = useSelector(state => state?.proveedores)
    const cuentas = useSelector(state => state?.cuentas)
    const clientes = useSelector(state => state?.clientes)

    useEffect(()=>{
        let monto_enviado = utils.getMontoEnviado(operacionData)
        setOperacionData({...operacionData, monto_enviado})
    }, [operacionData.monto_llega, operacionData.fee_plataforma])

    useEffect(()=>{
        setOperacionData({...operacionData, comision_proveedor: proveedores.filter((p) => p._id === operacionData.proveedor)[0]?.fee})
    }, [operacionData.proveedor])

    useEffect(()=>{
        setOperacionData({...operacionData, comision_proveedor_cantidad: utils.getComisionProveedorCantidad(operacionData), monto_a_entregar: utils.getMontoAEntregar(operacionData)})
    }, [operacionData.comision_proveedor])

    useEffect(()=>{
        setOperacionData({...operacionData, comision_proveedor: utils.getComisionProveedor(operacionData), monto_a_entregar: utils.getMontoAEntregar(operacionData)})
    }, [operacionData.comision_proveedor_cantidad])

    useEffect(()=>{
        setOperacionData({...operacionData, comision_prj_cantidad: utils.getComisionPrjCantidad(operacionData), monto_a_entregar: utils.getMontoAEntregar(operacionData)})
    }, [operacionData.comision_prj])

    useEffect(()=>{
        setOperacionData({...operacionData, comision_prj: utils.getComisionPrj(operacionData), monto_a_entregar: utils.getMontoAEntregar(operacionData)})
    }, [operacionData.comision_prj_cantidad])


    return ( 

        <div>
            
            <div className="data-cont">
                <label>Monto que llega</label>
                <Input type="number" value={operacionData.monto_llega} onChange={(value) => setOperacionData({...operacionData, monto_llega: value})} />
            </div>

            <div className="multiple-data-cont">
                <div className="data-cont">
                    <label htmlFor="cuenta-origen">Cuenta de origen {operacionData.cuenta_origen}</label>
                    <Input type="text" value={operacionData.cuenta_origen} onChange={(value) => setOperacionData({...operacionData, cuenta_origen: value})} />
                </div>
                <div className="data-cont">
                    <label htmlFor="fee">Fee plataforma</label>
                    <Input type="number" value={operacionData.fee_plataforma} onChange={(value) => setOperacionData({...operacionData, fee_plataforma: value})} style={{width: "30%"}} />
                </div>
            </div>

            <div className="multiple-data-cont">
                <div className="data-cont">
                    <label>Monto Enviado</label>
                    <Input type="number" value={operacionData.monto_enviado} onChange={(value)=>setOperacionData({...operacionData, monto_enviado: value})} />
                </div>
                <div className="data-cont">
                    <label>Recibe</label>
                    <div className="radio-container">
                        <input type="radio" value="Proveedor" checked={operacionData.tipo_recibe === "Proveedor"} onClick={(e)=>setOperacionData({...operacionData, tipo_recibe: e.target.value, cliente_recibe: null})} />
                        <label htmlFor="Proveedor">Proveedor</label>
                        <input type="radio" value="Cliente" checked={operacionData.tipo_recibe === "Cliente"} onClick={(e)=>setOperacionData({...operacionData, tipo_recibe: e.target.value, proveedor: null, cuenta_destino: null, comision_proveedor: 0, comision_proveedor: 0})} />
                        <label htmlFor="Cliente">Cliente</label>
                    </div>
                </div>
            </div>

            {operacionData?.tipo_recibe === "Proveedor" &&
                <div className="multiple-data-cont">
                    <div className="data-cont" style={{width: "100%"}} >
                        <label>Proveedor</label>
                        <select onChange={(e)=>setOperacionData({...operacionData, proveedor: e.target.value})}>
                            <option value=""></option>
                            {proveedores.map((proveedor)=>
                                <option value={proveedor._id} key={proveedor._id}>{proveedor.nombre} - ({proveedor.divisa})</option>
                            )}
                        </select>
                    </div>
                    <div className="data-cont" style={{width: "100%"}} >
                        <label>Cuenta de destino</label>
                        <select onChange={(e)=>setOperacionData({...operacionData, cuenta_destino: e.target.value})}>
                            <option value=""></option>
                            {cuentas.filter(cuenta => cuenta?.proveedor?._id == operacionData.proveedor).map((cuenta)=>
                                <option value={cuenta._id} key={cuenta._id}>{cuenta.nombre}</option>
                            )}
                        </select>
                    </div>
                </div>
            }

            {operacionData?.tipo_recibe === "Cliente" &&
                <div className="data-cont" style={{width: "100%"}}>
                    <label>Cliente</label>
                    <select onChange={(e)=>setOperacionData({...operacionData, cliente_recibe: e.target.value})}>
                        <option value=""></option>
                        {clientes.map((cliente)=>
                            <option value={cliente._id} key={cliente._id}>{cliente.nombre}</option>
                        )}
                    </select>
                </div>
            }

            <div className="multiple-data-cont">
                {operacionData.tipo_recibe === "Proveedor" &&
                <div className="multiple-data-cont" style={{width: "48%"}}>
                    <div className="data-cont">
                        <label>Com prov(%)</label>
                        <Input type="number" value={operacionData.comision_proveedor} onChange={(value)=>setOperacionData({...operacionData, comision_proveedor: value})} />
                    </div>
                    <div className="data-cont">
                        <label>Com prov</label>
                        <Input type="number" value={operacionData.comision_proveedor_cantidad} onChange={(value)=>setOperacionData({...operacionData, comision_proveedor_cantidad: value})} />
                    </div>
                </div>
                }

                <div className="multiple-data-cont" style={{width: "48%"}}>
                    <div className="data-cont">
                        <label>Com PRJ(%)</label>
                        <Input type="number" value={operacionData.comision_prj} onChange={(value)=>setOperacionData({...operacionData, comision_prj: value})} />
                    </div>
                    <div className="data-cont">
                        <label>Com PRJ</label>
                        <Input type="number" value={operacionData.comision_prj_cantidad} onChange={(value)=>setOperacionData({...operacionData, comision_prj_cantidad: value})} />
                    </div>
                </div>
            </div>

            <div className="multiple-data-cont">
                <div className="data-cont" id="a_entregar_calc">
                    <label>Monto a entregar - {divisaRecibe}</label>
                    <Input type="number" value={operacionData.monto_a_entregar} onChange={(value)=>setOperacionData({...operacionData, monto_a_entregar: value})} />
                </div>
            </div>

        </div>

     );
}
 
export default CreateBajada;