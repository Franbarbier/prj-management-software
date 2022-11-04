import React, {useState, useEffect} from 'react';
import * as utils from './utils';
import { useDispatch, useSelector } from 'react-redux';
import { createMovimientoCaja, createMovimientoProveedor } from '../../../../actions/movimientos'
import { changeEstado } from '../../../../actions/globales'
import { createOrdenSolo } from '../../../../actions/ordenes';
import { createOperacion } from '../../../../actions/operaciones';
import { useAppContext } from '../../../../contexts/AppContext';
import './CeldaEstado.css?r=1'

const CeldaEstado = ({ setRefreshRow, tipo, content, row_data, setRenderModal }) => {

    const { setNotifications } = useAppContext();
    const [cellContent, setCellContent] = useState(content)
    const [selectOptions, setSelectOptions] = useState([])
    const cambio_dia = useSelector(state => state?.config?.cambio_dia)

    useEffect(()=>{
        setSelectOptions(utils.determineSelectOptionsByTipo(tipo, content))
    }, [tipo, content])

    const dispatch = useDispatch()

    function handleChangeEstado(value){

        const automationsCreated = []
        const ROW_TYPE = utils.determineRowTypeByTipo(tipo)

        dispatch(changeEstado({row_data, tipo, value})).then(async ()=> {
            setRefreshRow(Date.now())
            if(ROW_TYPE === "orden"){
                
                // Cuando se marca como entregada una orden entrega/recibo, se generea el movimiento prov/caja (falta el mov. saldo) 
                if( value === "Entregada"){

                    // # Si alguna de estas ordenes tiene ARS, y no viene de un cambio tipo_cambio = "Compra", crear un cambio
                    if(utils.shouldCreateCambioFromOrden(row_data)){
                        const cambioFromOrden = utils.createObjectCambioFromOrden(row_data, cambio_dia)
                        let success = await createOperacion(cambioFromOrden, dispatch)
                        success && automationsCreated.push({entity: "operacion", type: "cambio", action:"create"})
                    }

                    switch(row_data.tipo) {
                        case "Moto":
                        case "Depósito":
                        case "Retira":
                            // # Crear movimientos de caja ars y/o usd                          
                            const cashHasMovimientoCaja = await utils.ordenHasMovimientoCaja(row_data._id)
                            if(!cashHasMovimientoCaja){
                                const movCajaArs = utils.shouldCreateMovCajaARS(row_data, utils.createObjectMovCaja(row_data))
                                if(movCajaArs){
                                    let success = await createMovimientoCaja(movCajaArs, dispatch)
                                    success && automationsCreated.push({entity: "movimiento", type: "caja ars", action:"create"})
                                }
                                const movCajaUsd = utils.shouldCreateMovCajaUSD(row_data, utils.createObjectMovCaja(row_data))
                                if(movCajaUsd){
                                    let success = await createMovimientoCaja(movCajaUsd, dispatch)
                                    success && automationsCreated.push({entity: "movimiento", type: "caja usd", action:"create"})
                                }
                            }
                            break;
                        case "Factura":
                        case "Cash Cash":
                        case "Crypto":
                        case "Transferencia":
                            var transferencias = [row_data]
                            function setBulk(){}
                            var data = {transferencias: transferencias, setBulk}   
                            setRenderModal({type: 'liquidar-transferencias', data})
                            break;
                        case "Recibo":
                            var ordenReciboData = [row_data]
                            var data = {ordenReciboData}   
                            setRenderModal({type: 'orden-recibo', data})
                            break;
                        case "Recibo Crypto":
                            var transferencias = [row_data]
                            var data = {ordenReciboData : transferencias}            
                            setRenderModal({type: 'orden-recibo', data})
                        break;                
                        default:
                            break;
                    }
                    
                }
            }else if(ROW_TYPE === "operacion"){

                if(row_data.proveedor_as_cliente){
                    if (value !== "Pendiente") {
                        const movimientoProveedor = {importe: row_data.monto_a_entregar, estado: "Enviado", cuenta_destino: row_data.cuenta_destino._id, proveedor: row_data.proveedor._id, operacion: row_data._id, origen: `Operacion ${row_data._id}`}
                        const operacionHasMovimientoProveedor = await utils.operacionHasMovimientoProveedor(row_data._id)
                        if(!operacionHasMovimientoProveedor){
                            let successMov = await createMovimientoProveedor(movimientoProveedor, dispatch)
                            successMov && automationsCreated.push({entity: "movimiento", type: "proveedor", action:"create"})
                        }
                    }
                }else{
               
                    if (row_data.tipo_operacion === "Bajada") {
                        if (value !== "Pendiente") {

                            if (row_data.tipo_envia !== "Cliente") {
                                const ordenRecibo = utils.createObjectOrdenRecibo(row_data)
                                const operacionHasOrdenRecibo = await utils.operacionHasOrdenRecibo(row_data._id)
                                if(!operacionHasOrdenRecibo){

                                    const movimientoProveedor = utils.createObjectMovimientoProveedorFromOperacion(row_data, true)
                                    let successMov = await createMovimientoProveedor(movimientoProveedor, dispatch)
                                    successMov && automationsCreated.push({entity: "movimiento", type: "proveedor", action:"create"})

                                    let success = await createOrdenSolo([ordenRecibo], dispatch)
                                    success && automationsCreated.push({entity: "orden", type: "recibo", action:"create"})
                                }
                            }

                            // # Creamos una subida si es necesario
                            if(utils.shouldCreateSubida(row_data)){
                                const operacionSubida = utils.createObjectSubida(row_data)
                                let resultOp = await createOperacion(operacionSubida, dispatch)

                                let success = resultOp.operaciones[0]
                                success && automationsCreated.push({entity: "operacion", type: "subida", action:"create"})
                                
                                // utils.createOrdenRecibeCliente(resultOp[1].operaciones[0])
                                success = await createOrdenSolo([utils.createOrdenRecibeCliente(resultOp.operaciones[0])], dispatch)
                                success && automationsCreated.push({entity: "orden", type: "recibo", action:"create"})
                            }
                        }
                    }else{

                        if(utils.operacionConfirmada(value)) {
                            if (row_data.tipo_envia !== "Cliente") {
                                // # Creamos la orden recibo:
                                const ordenRecibo = utils.createObjectOrdenRecibo(row_data)
                                const operacionHasOrdenRecibo = await utils.operacionHasOrdenRecibo(row_data._id)
                                if(!operacionHasOrdenRecibo){
                                    let success = await createOrdenSolo([ordenRecibo], dispatch)
                                    success && automationsCreated.push({entity: "orden", type: "recibo", action:"create"})
                                }
                            }

                            // # Creamos una subida si es necesario
                            if(utils.shouldCreateSubida(row_data)){
                                const operacionSubida = utils.createObjectSubida(row_data)
                                let resultOp = await createOperacion(operacionSubida, dispatch)

                                let success = resultOp[0]
                                success && automationsCreated.push({entity: "operacion", type: "subida", action:"create"})
                                
                                createOrdenSolo([utils.createOrdenRecibeCliente(resultOp.operaciones[0])], dispatch)
                            }
                        }
                    }
                }

            }
            setCellContent({...cellContent, Valor: value})
            setNotifications(automationsCreated)
        })
    }

    useEffect(()=>{
        setCellContent(content)
    }, [row_data])

    return(
        <div className={"estado-celda " + cellContent?.Valor?.toLowerCase() + "-celda"} onClick={(e)=>e.stopPropagation()} onDoubleClick={(e)=> e.stopPropagation()}>
            <select name="" id="" className={"estado-select"} onChange={(e)=>handleChangeEstado(e.target.value)}>
                    <option value=""></option>
                {selectOptions.map((option) => option === cellContent.Valor ? 
                    <option value={option} selected className={option.toLowerCase()} key={option}>{option}</option>
                    :
                    <option value={option} className={option.toLowerCase()} key={option}>{option}</option>
                )}
            </select>
        </div>
    )
}

export default CeldaEstado