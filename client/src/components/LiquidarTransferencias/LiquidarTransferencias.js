import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAppContext } from '../../contexts/AppContext';
import { liquidarTransferencias } from '../../actions/ordenes'
import { changeEstado } from '../../actions/globales'; 
import { estados } from '../../GlobalFunctions';
import FormLoader from '../FormLoader/FormLoader';
import ModalContainer from "../ModalContainer/ModalContainer";
import Input from "../Input/Input";
import './LiquidarTransferencias.css';

const LiquidarTransferencias = ({renderModal, setRenderModal}) => {

    const { setNotifications } = useAppContext()
    const [loading, setLoading] = useState(false)
    const proveedores = useSelector(state => state?.proveedores)
    const cuentas = useSelector(state => state?.cuentas)
    const [transferencias, setTransferencias] = useState([...renderModal.data.transferencias])
    var cuentaDefault = cuentas.filter(cuenta => cuenta?.proveedor?._id === transferencias[0].operacion.proveedor)
    const [cuentaDestino, setCuentaDestino] = useState(cuentaDefault[0]?._id)
    const [proveedor, setProveedor] = useState( proveedores.filter((p) => p._id === cuentaDefault[0]?.proveedor._id)[0] )

    useEffect(()=>{
        transferencias.length < 1 && setRenderModal('')             
    })
    

    const dispatch = useDispatch();

    async function handleSubmit (){
        if (transferencias[0].recibe_cliente === false) {
            if(proveedor !== "" && cuentaDestino !== ""){
                console.log('AHIVA: ', transferencias)
                // console.log(transferencias, proveedor, cuentaDestino)
                setLoading(true)
                    let response = await liquidarTransferencias({transferencias, proveedor, cuenta_destino:cuentaDestino})
                    setLoading(false)
                    if(response.error === 0){
                        renderModal.data.setBulk([])
                        updateEstadosTransferencias()
                        setNotifications([{entity: "movimiento", type: "proveedor", action:"create"}])
                    }else{
                        alert("No se pudieron crear los movimientos correctamente.")
                    }
                }else{
                    alert("Proveedor y cuenta destino tienen que tener un valor asignado.")
            }
        }else{
            renderModal.data.setBulk([])
            setRenderModal('')
        }
    }

    function isPesos(transferencia){
        return (transferencia.ars > 0 && transferencia.usd < 1)
    }

    function updateEstadosTransferencias(){
        for(let transferencia of transferencias){
            dispatch(changeEstado({row_data:transferencia, tipo: 'ordenes', value: estados.ordenes[1]}))
        }
        setRenderModal('')
    }

    return ( 
        <ModalContainer setRenderModal={setRenderModal}>
            <div className="form-cargar liquidar">
                <h2>Liquidar transferencias</h2>
                <div className="liquidar__transferencias">
                    {transferencias.map((transferencia, i) => 
                        <div className="liquidar__transferencia" key={transferencia._id}>
                            <div className="liquidar__transferenciaCampos">
                                <div>{transferencia.operacion.cliente?.nombre}</div>
                                <div className="liquidar__transferenciaImporte">
                                        <span>
                                            {transferencia.tipo == "Crypto" ?
                                            <>
                                                <span>USDT</span>
                                                <span id="a_transferir">{transferencia.tipo_orden.crypto.usdt_a_enviar}</span>
                                            </>
                                            :
                                            <>
                                                <span>{isPesos(transferencia) ? 'ARS' : 'USD'}</span>
                                                <span id="a_transferir">{transferencia.ars ? transferencia.ars : transferencia.usd}</span>
                                            </>
                                            }
                                        </span>
                                </div>
                            </div>
                            <div className="liquidar__transferenciaQuitar" onClick={()=>setTransferencias(transferencias.filter((t)=>t._id !== transferencia._id))}>x</div>
                        </div>
                    )}
                </div>

                {transferencias[0].recibe_cliente === false  && 
                <>
                <div className="multiple-data-cont" style={{width: "100%"}}>
                    <div className="data-cont" style={{width: "100%"}}>
                        <label htmlFor="cuenta-origen">Seleccionar Proveedor</label>
                        <select onChange={(e)=>setProveedor(proveedores.filter((p) => p._id === e.target.value)[0])} value={proveedor?._id}>
                            <option value=""></option>
                            {proveedores.map((proveedor)=>
                                <option value={proveedor._id} key={proveedor._id}>{proveedor.nombre} - ({proveedor.divisa})</option>
                            )}
                        </select>
                    </div>

                    {/* {proveedor &&  */}
                    <div className="data-cont" style={{width: "100%"}}>
                        <label>Cuenta de destino</label>
                        <select onChange={(e)=>setCuentaDestino(e.target.value)}>
                            
                            {/* {cuentaDefault.length > 0 ? <option selected value={cuentaDefault[0]?._id}>{cuentaDefault[0]?.nombre }</option> : <option value=""> </option>} */}
                            
                            {cuentas.filter(cuenta => cuenta?.proveedor?._id === proveedor?._id).map((cuenta)=>
                                <option value={cuenta._id} key={cuenta._id}>{cuenta.nombre}</option>
                            )}
                        </select>                      
                    </div>
                    {/* } */}
                </div>
                </>
                }
                <div className="cont-btns" style={{width: "100%"}}>
                    <div className="btn-cancelar" onClick={()=>setRenderModal('')}>Cancelar</div>
                    <div className="btn-create" onClick={handleSubmit}>Liquidar Transferencias</div>
                </div>
                {loading && 
                    <FormLoader />
                }
            </div>
        </ModalContainer>
     );
}
 
export default LiquidarTransferencias;