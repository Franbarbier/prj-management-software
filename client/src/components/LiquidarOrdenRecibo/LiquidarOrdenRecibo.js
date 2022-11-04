import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAppContext } from '../../contexts/AppContext';
import { liquidarTransferencias } from '../../actions/ordenes'
import { createMovimientoCaja } from '../../actions/movimientos'
import { changeEstado } from '../../actions/globales'; 
import FormLoader from '../FormLoader/FormLoader';
import ModalContainer from "../ModalContainer/ModalContainer";
import Input from "../Input/Input";
import{ cajas, oficinas, estados, formatDateYmd, getNombreYIdOrd } from '../../GlobalFunctions';
import './LiquidarOrdenRecibo.css';

const LiquidarOrdenRecibo = ({renderModal, setRenderModal }) => {

    const { oficina, setNotifications } = useAppContext()
    const [loading, setLoading] = useState(false)

    console.log(renderModal.data.ordenReciboData)
    const [ordenALiquidar, setOrdenALiquidar] = useState(renderModal.data.ordenReciboData[0])

    const [transferencias, setTransferencias] = useState([renderModal.data.ordenReciboData[0]])

    const [tipoOrden, setTipoOrden] = useState("")


    // Estados para ordenes recibo tipo Proveedor
    const proveedores = useSelector(state => state?.proveedores)
    const cuentas = useSelector(state => state?.cuentas)
    const [cuentaDestino, setCuentaDestino] = useState()
    const [proveedor, setProveedor] = useState( )

    // Estados para ordenes recibo tipo caja
    const tipo = 1;
    const [cajasData, setCajasData] = useState(cajas) 
    const[activeCaja, setActiveCaja] = useState(0)
    const [movimientoCajaData, setMovimientoCajaData] = useState({caja:cajasData[activeCaja].divisa, oficina, tipo, fecha_creado: formatDateYmd(new Date())})
    const [categorias, setCategorias] = useState(useSelector(state => state.config["categorias_"+tipo]))

    const [comision, setComision] = useState(ordenALiquidar.operacion.comision_proveedor ? ordenALiquidar.operacion.comision_proveedor : 0);
    const [cometaFija, setCometaFija] = useState();

    const dispatch = useDispatch();

    useEffect( () => {
        setCometaFija(comision * ordenALiquidar.operacion.monto_llega / 100)
    }, [comision])


    useEffect(()=>{
        setDefaultData()
    }, [])

    function setDefaultData(){
        if(ordenALiquidar.operacion.tipo_operacion === "Subida"){
            setTipoOrden("Caja")
        }
        if(ordenALiquidar.operacion.tipo_operacion === "Bajada" && ordenALiquidar.operacion?.tipo_recibe === "Proveedor"){
            setTipoOrden("Proveedor")
            setProveedor(proveedores.filter((prov)=>prov._id === ordenALiquidar.operacion?.proveedor)[0])
            setCuentaDestino(cuentas.filter((cuenta)=>cuenta._id === ordenALiquidar.operacion?.cuenta_destino)[0])
        }
        
    }


        
    console.log(proveedores)
        

    function opcionProveedor() {
        var transferencia = ordenALiquidar;
        
            function isPesos(transferencia){
                return (transferencia.ars > 0 && transferencia.usd < 1)
            }

            function shouldInsertCotizacion(transferencia){
                return ((isPesos(transferencia) && proveedor?.divisa !== 'ARS') || (!isPesos(transferencia) && (proveedor?.divisa !== 'USD' && proveedor?.divisa !== 'Crypto'))) && proveedor
            }

            function setCotizacion(value, transferencia){
                let copyTransferencias = [...transferencias]
                for(let t in copyTransferencias){
                    if(copyTransferencias[t]._id === transferencia._id){
                        copyTransferencias[t].cotizacion = value
                    }
                }
                setTransferencias(copyTransferencias)
            }

            return (
                <>
                    <div className="liquidar__transferencias">
                        
                            <div className="liquidar__transferencia">
                                <div className="liquidar__transferenciaCampos">
                                    <div>{ordenALiquidar.operacion.cliente?.nombre}</div>

                                    {/* Si el proveedor de destino es en USD y este importe es en ARS, pedimos que se asigne una cotizacion */}
                                    {shouldInsertCotizacion(ordenALiquidar) &&
                                        <div style={{width:"100px"}}>
                                            <Input type="number" placeholder="Cotizacion" onChange={(value)=>setCotizacion(value, transferencia)} />
                                        </div>
                                    }
                                    
                                    <div className="liquidar__transferenciaImporte">
                                        <span>
                                            {ordenALiquidar.tipo == "Recibo Crypto" ?
                                                "USDT"
                                            :
                                                isPesos(transferencia) ? 'ARS' : 'USD'
                                            }
                                        </span>
                                        {ordenALiquidar.operacion.monto_llega}
                                    </div>
                                    
                                    
                                </div>

                                <div className="liquidar__transferenciaQuitar" onClick={()=>setTransferencias(transferencias.filter((t)=>t._id !== transferencia._id))}>x</div>
                            </div>
                    </div>

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

                        {proveedor && 
                        <div className="data-cont" style={{width: "100%"}}>
                            <label>Cuenta de destino</label>
                            <select onChange={(e)=>setCuentaDestino(e.target.value)} value={cuentaDestino?._id}>
                                <option value={""}></option>
                                {cuentas.filter(cuenta => cuenta?.proveedor?._id === proveedor?._id).map((cuenta)=>
                                    <option value={cuenta._id} key={cuenta._id}>{cuenta.nombre}</option>
                                )}
                            </select>                      
                        </div>
                        }
                        
                    </div>
                    <div className="multiple-data-cont" style={{width: "100%"}}>
                        <div className="data-cont">
                            <label>Com prov(%)</label>
                            <Input type="number" value={comision} onChange={ (value) => setComision(value) }/>
                        </div>
                        <div className="data-cont" style={{width: "50%"}}>
                            <label>Com prov</label>
                            <span>{cometaFija}</span>
                        </div>
                    </div>
                </>
            )

    }
    


    function opcionCaja() {
        
        function getDivisa(){
            if(ordenALiquidar.usd>0){
                return "usd"
            }else if(ordenALiquidar.ars>0){
                return "ars"
            }
        }

        return (
            <>
                <form action=""  onSubmit={handleSubmit}>
                    <div className="multiple-data-cont">
                        <div className="data-cont" style={{width: "100%"}}>
                            <label htmlFor="fecha">Fecha</label>
                            <input type="date" name="fecha" id="cmc-fecha" value={movimientoCajaData.fecha_creado} onChange={(e) => setMovimientoCajaData({...movimientoCajaData, fecha_creado: e.target.value, tipo: tipo == 'ingresos' ? 1 : 0, caja: cajasData[activeCaja].divisa})} />
                        </div>
                        <div className="data-cont" style={{width: "100%"}}>
                            <label htmlFor="importe">Importe</label>
                            <input type="number" name="importe" id="cmc-importe" defaultValue={ordenALiquidar[getDivisa()]} onChange={(e) => setMovimientoCajaData({...movimientoCajaData, importe: e.target.value, tipo: tipo == 'ingresos' ? 1 : 0})} disabled />
                        </div>
                    </div>
                    <div className="multiple-data-cont">
                    <div className="data-cont" style={{width: "100%"}}>
                            <label htmlFor="descripcion">Oficina</label>
                           <select id="movCaja-oficina" onChange={(e) => console.log(oficina)}>
                                <option value={ordenALiquidar.oficina}>{ordenALiquidar.oficina}</option>
                                {oficinas.map((ofi) => 
                                    <option value={ofi} className={ofi.toLowerCase()} key={ofi}>{ofi}</option>
                                )}
                           </select>
                        </div>
                        <div className="data-cont" style={{width: "100%"}}>
                        <label htmlFor="descripcion">Caja</label>
                           <select id="movCaja-caja" value={getDivisa().toUpperCase()}>
                                <option value="" selected></option>
                                {cajasData.map((caja) => 
                                    <option value={caja.divisa} className={caja.divisa.toLowerCase()} key={caja.divisa}>{caja.divisa}</option>
                                )}
                           </select>
                        </div>
                    </div>
                    <div className="multiple-data-cont">
                        <div className="data-cont">
                            <label htmlFor="descripcion">Descripcion</label>
                            <input type="text" name="descipcion" id="cmc-descripcion" onChange={(e) => setMovimientoCajaData({...movimientoCajaData, descripcion: e.target.value, tipo: tipo == 'ingresos' ? 1 : 0, caja: cajasData[activeCaja].divisa})}  defaultValue={getNombreYIdOrd(ordenALiquidar)} disabled/>
                        </div>
                        <div className="data-cont" style={{width: "100%"}}>
                            <label htmlFor="categoria">Categoría</label>
                            <select name="cateogira" id="cmc-categoria" onChange={(e) => setMovimientoCajaData({...movimientoCajaData, categoria: e.target.value, tipo: tipo == 'ingresos' ? 1 : 0, caja: cajasData[activeCaja].divisa})}>
                                <option value="Orden Recibo">Orden Recibo</option>
                            </select>
                        </div>
                    </div>
                </form>
            </>
        )
    }

    
    async function handleSubmit (){
        if (tipoOrden == '') {
            alert('Seleccione una formapara liquidar la orden')
            return false;
        }
        if (tipoOrden == 'Caja') {
            const newMovimientoCaja = {
                categoria: document.getElementById("cmc-categoria").value,
                descripcion: document.getElementById("cmc-descripcion").value,
                fecha_creado: ordenALiquidar.fecha_creado,
                oficina: document.getElementById("movCaja-oficina").value,
                importe : document.getElementById("cmc-importe").value,
                caja : document.getElementById("movCaja-caja").value,
                orden: ordenALiquidar._id,
                tipo: 1
            }
            console.log('movcaja a crear: ', newMovimientoCaja)
            setLoading(true)
            if(newMovimientoCaja.importe !== '' && newMovimientoCaja.importe !== undefined){
                let success = await createMovimientoCaja(newMovimientoCaja, dispatch)
                success && setNotifications([{entity: "movimiento", type: "caja", action:"create"}])
                setRenderModal('')           
            }else{
                alert('El campo "Importe" no puede estar vacío.')
            }
        }
        if (tipoOrden == 'Proveedor') {
            handleSubmitProveedor()
        }
        setLoading(false)        
    }


    async function handleSubmitProveedor (){
        if(proveedor !== "" && cuentaDestino !== ""){
            setLoading(true)
            let response = await liquidarTransferencias({transferencias, proveedor, cuenta_destino:cuentaDestino, comision})
            setLoading(false)
            if(response.error === 0){
                setRenderModal('')
                setNotifications([{entity: "movimiento", type: "proveedor", action:"create"}])
            }else{
                alert("No se pudieron crear los movimientos correctamente.")
            }
        }else{
            alert("Proveedor y cuenta destino tienen que tener un valor asignado.")
        }
    }

    

    

    return ( 
        <ModalContainer setRenderModal={setRenderModal}>

            <div className="form-cargar liquidar">

                <h2>Completar orden recibo</h2>

                <div className="multiple-data-cont" style={{width: "100%"}}>
                    
                    <div className="data-cont">
                        <label htmlFor="tipo-operacion">Dónde recibo:</label>
                        <div className="radio-container">
                            <input type="radio" id="radios-Caja" name="Tipo recibo" checked={tipoOrden === "Caja"} onChange={ (e) => {setTipoOrden(e.target.value) } } value="Caja"/>
                            <label for="radios-Caja">Caja</label>

                            <input type="radio" id="radios-Proveedor" name="Tipo recibo" value="Proveedor" checked={tipoOrden === "Proveedor"} onChange={ (e) => {setTipoOrden(e.target.value) } } />
                            <label for="radios-Proveedor">Proveedor</label>
                            
                        </div>
                    </div>

                </div>

                {tipoOrden === 'Caja' && opcionCaja()}

                {tipoOrden === 'Proveedor' && opcionProveedor()}

                <div className="cont-btns" style={{width: "100%"}}>
                    <div className="btn-cancelar" onClick={()=>setRenderModal('')}>Cancelar</div>
                    <div className="btn-create" onClick={handleSubmit}>Liquidar Orden</div>
                </div>

                {loading && 
                    <FormLoader />
                }

            </div>

        </ModalContainer>
     );
}
 
export default LiquidarOrdenRecibo;