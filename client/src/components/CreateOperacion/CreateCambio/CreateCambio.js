import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Input from '../../Input/Input';

const CreateCambio = ({operacionData, setOperacionData, operacionCon, divisaRecibe}) => {

    const cambio_dia = useSelector(state => state?.config?.cambio_dia)
    const proveedores = useSelector(state => state?.proveedores)
    const cuentas = useSelector(state => state?.cuentas)

    useEffect(()=>{
        function getSpread(){
            var cambio_cliente = operacionData.cambio_cliente
            if(operacionData.cambio_cliente===undefined){
                cambio_cliente = 0
            }
            return (cambio_cliente - operacionData.cambio_prj).toFixed(2)
        }

        let monto_a_entregar;
        if(operacionData.tipo_cambio === "Compra"){
            monto_a_entregar = (operacionData.monto_enviado / operacionData.cambio_cliente)
        }else if(operacionData.tipo_cambio === "Venta"){
            monto_a_entregar = (operacionData.monto_enviado * operacionData.cambio_cliente)
        }
        setOperacionData({...operacionData, monto_a_entregar, spread: getSpread(), cambio_prj: cambio_dia})
    }, [operacionData.monto_enviado, operacionData.cambio_cliente, operacionData.cambio_prj, operacionData.tipo_cambio])

    return ( 
        <div>
            <div className="data-cont">
                <label>Tipo Cambio:</label>
                <div className="radio-container">
                    <input type="radio" value="Compra" checked={operacionData.tipo_cambio === "Compra"} onClick={(e)=>setOperacionData({...operacionData, tipo_cambio: e.target.value})} />
                    <label htmlFor="Compra">Compra</label>
                    <input type="radio" value="Venta" checked={operacionData.tipo_cambio === "Venta"} onClick={(e)=>setOperacionData({...operacionData, tipo_cambio: e.target.value})} />
                    <label htmlFor="Venta">Venta</label>
                </div>
            </div>

            {operacionData.tipo_cambio !== undefined &&
            <>
                <div className="data-cont">
                    <label>Monto {operacionData.tipo_cambio === "Compra" ? "a Recibir" : "Enviado"}</label>
                    <Input type="number" value={operacionData.monto_enviado} onChange={(value)=>setOperacionData({...operacionData, monto_enviado: value})} />
                </div>

                <div className="multiple-data-cont" style={{justifyContent: "flex-start"}}>
                    <div className="data-cont" style={{width: "30%", marginRight: "20px"}}>
                        <label>Cambio Nuestro</label>
                        <Input type="number" value={operacionData.cambio_prj} disabled={true} />
                    </div>
                    <div className="data-cont" style={{width: "30%", marginRight: "20px"}}>
                        <label>Cambio {operacionCon}</label>
                        <Input type="number" value={operacionData.cambio_cliente} onChange={(value)=>setOperacionData({...operacionData, cambio_cliente: value})} />
                    </div>
                    <div className="data-cont">
                        <label>Spread</label>
                        <div>{operacionData?.spread ? operacionData.spread : ""}</div>
                    </div>
                </div>

                {operacionCon === "Proveedor" &&
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

                <div className="multiple-data-cont">
                    <div className="data-cont">
                        <label>Monto a entregar - {divisaRecibe}</label>
                        <Input type="number" value={operacionData.monto_a_entregar} onChange={(value)=>setOperacionData({...operacionData, monto_a_entregar: value})} />
                    </div>
                </div>
            </>
            }
        </div>
     );
}
 
export default CreateCambio;