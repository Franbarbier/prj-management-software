import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import FormLoader from '../FormLoader/FormLoader'
import { tipos } from '../../GlobalFunctions'
import FormaEntrega from './FormaEntrega/FormaEntrega';
import { createOrdenSolo } from '../../actions/ordenes';
import './CreateOrden.css'
import { useAppContext } from '../../contexts/AppContext';


const CreateOrden = ({ recibeProv=false, monto_a_entregar, setRenderModal, setHayOrden, hayOrden, datosOperacion, ordenesEdit = false, cliente, entregasDefault=[], edit, create, setEntregasEditadas= ()=>{} , setDeletedOrds, deletedOrds, divisaRecibe, cambioPRJ }) => {


    const [entregas, setEntregas] = useState([])
    const { oficina } = useAppContext()

    const [operaciones, setOperaciones] = useState(useSelector(state=>state.operaciones))
    // listener para saber si se quiere borrar una forma de entrega - deprecado
    const [borrarForma, setBorrarForma] = useState()
    // Variable que se usa para activar y desactivar el loader
    const [loading, setLoading] = useState(false)
    const[selectedOperacion, setSelectedOperacion] = useState()
    
    const [recibo, setRecibo] = useState(false)

    const [forceCambio, setForceCambio] = useState(0)

    
    // Calculadora para asegurarse que a nadie se le entrege de mas o de menos
    const[calculo, setCalculo] = useState({
        monto : monto_a_entregar,
        cambio : cambioPRJ ? cambioPRJ : 1
    })


    const[montosCheck, setMontosCheck] = useState(0)
    const[montoEntrega, setMontoEntrega] = useState(0)    


    useEffect( ()=> {

        if (calculo.cambio == 1 && document.getElementById("cambio-actual").value != '' ) {
            var getCambio = document.getElementById('cambio-actual').value
        }else{
            var getCambio = calculo.cambio 
        }
        
        var totArs = 0;
        var x = document.getElementsByClassName('montos-ars');
        for(var i = 0; i<x.length; i++){
            
            // discriminamos las ordenes de ingreso, para la calculadora
            if (x[i].closest('.forma-entrega').className.split(' ').indexOf('recibiendo') == -1 ) {
                if (x[i].value !== '') {
                    totArs += parseInt(x[i].value)
                    // padresin.getElementsByClassName('montos-arsAusd')[0].value
                }
            }
                
        }

        var totUsd = 0;
        var y = document.getElementsByClassName('montos-usd');
        for(var i = 0; i<y.length; i++){
            // discriminamos las ordenes de ingreso, para la calculadora
            if (y[i].closest('.forma-entrega').className.split(' ').indexOf('recibiendo') == -1 ) {
                if (y[i].value !== '') {
                    totUsd += parseInt(y[i].value)
                   
                }

            }
        }

        
        // menjunje para agregar los USDT + comision en caso que sea crypto
        var totUsdt = 0;
        var y = document.getElementsByClassName('montos-usdt');
        var usdtConCometa = 0;
        var usdtConCometa = 0;
        
        for(var i = 0; i<y.length; i++){
            let padresin = y[i].closest('.forma-entrega')
            
            if (padresin.className.split(' ').indexOf('recibiendo') == -1 ) {
                if (y[i].value !== '' && y[i].value !== 0) {
                    totUsdt += parseInt(y[i].value)
                }
                let prjCometa = padresin.querySelector('.prj-cometa').value
                if (prjCometa > 0) {
                    usdtConCometa = prjCometa*totUsdt/100 + totUsdt + usdtConCometa;
                }else{
                    usdtConCometa = totUsdt + usdtConCometa;
                }
            }
        }
        
        console.log(usdtConCometa)

        // menjunje para agregar la comision en % y mto. fijo en cash cash
        var cometaFijaCash = document.getElementsByClassName('fijo-cometa-cash');

        var comisionCashUsd = 0
        
        for(var i = 0; i< cometaFijaCash.length; i++){
            if (cometaFijaCash[i].value !== '' && cometaFijaCash[i].value !== 0) {
                let padresin = cometaFijaCash[i].closest('.forma-entrega')
                let cuantoCashUsd = padresin.querySelector('.montos-usd').value
                comisionCashUsd += parseInt(cometaFijaCash[i].value)
            }
        }


        if (divisaRecibe == "USD" || divisaRecibe == "USDT" ) {
            
            var usd_entrega2 = parseInt(totUsd + parseInt(totArs /  parseInt( getCambio )) ) + usdtConCometa + comisionCashUsd
            var diferencia = usd_entrega2 - parseInt(monto_a_entregar)
            
        }else if(divisaRecibe == "ARS"){
            var ars_entrega2 = parseInt(totArs + parseInt(totUsd *  parseInt( getCambio )) ) + (usdtConCometa + comisionCashUsd *  parseInt( getCambio ))
            var diferencia = ars_entrega2 - parseInt(monto_a_entregar)
            console.log(ars_entrega2)
            console.log(monto_a_entregar)
        }
        
 
        if (diferencia != undefined) {
            setMontoEntrega(diferencia.toFixed(2))
        }

        setEntregasEditadas(entregas)

            
    }, [entregas, montosCheck])


    
    function handleDatosRecibe (e) {
        setCalculo(({...calculo, cambio: e.target.value}))
        setMontosCheck(montosCheck + 1)
        let allEntregas = document.querySelectorAll(".forma-entrega")
        for (let index = 0; index < allEntregas.length; index++) {
            const element = allEntregas[index];
            if (!element.querySelector('.montos-ars').hasAttribute('disabled')) {
                element.querySelector('.montos-ars').value = element.querySelector('.montos-arsAusd').value * e.target.value ;
            }
        }
        console.log(e.target.value)
    } 


    const dispatch = useDispatch()

    // Traemos los clientes
    useEffect(()=>{
        
        
        // Si cliequeaste en editar orden:
        if(ordenesEdit !== false){
            for (let index = 0; index < ordenesEdit.length; index++) {
                const element = ordenesEdit[index];
                element.id = index+1;
            }
            setEntregas(ordenesEdit)
        }
       
        setMontosCheck(montosCheck+1)

    }, [])

    var operaciones_listener = useSelector(state=> state.operaciones)

    useEffect(()=>{
        if(JSON.stringify(operaciones_listener)!== JSON.stringify(operaciones)){
            setOperaciones(operaciones_listener)
        }
    })

    const handleSubmitOrdenes = async (e) => {
        e.preventDefault()

        for (let i = 0; i < entregas.length; i++) {

            if (!recibeProv) {
                entregas[i].cliente = datosOperacion.cliente._id
            }else{
                entregas[i].proveedor = datosOperacion.proveedor_as_cliente._id

            }
            
            entregas[i].operacion =  datosOperacion._id
            entregas[i].cambio_operacion = calculo?.cambio
            

            if (recibo == true) {
                entregas[i].recibo = true
                entregas[i].tipo = 'Recibo'
            }else{
                
                if (!entregas[i].tipo || entregas[i].tipo === "") {
                    alert('Debe seleccionar una forma de entrega!')
                    return false;
                }
            }

            if(entregas[i].tipo == "Recibo"){
                entregas[i].recibo = true;
            }

                
            if (!entregas[i].oficina || entregas[i].oficina === "") {
                alert('Debe seleccionar una oficina!')
                return false;
                
            }
            
        }
        
        setEntregas(entregas)
        setLoading(true)
        const onSuccess = () => (setLoading(false), setRenderModal(''))
        await createOrdenSolo(entregas, dispatch)
        onSuccess()
    }

    const tipo_entrega = tipos.ordenes;

    function nueva_forma() {
        var newForma = {};
        newForma.id = entregas.length + 1;
        newForma.ars = 0;
        newForma.usd = 0;
        newForma.oficina = oficina;
        newForma.fecha_entrega = new Date();
        
        setEntregas(entregas => [...entregas, newForma])
        setHayOrden(true)
    }

    // useEffect( () => {
    //     if ( document.getElementById("cambio-actual").value * 1 == cambioPRJ ) {
    //         setCalculo({...calculo, cambio : cambioPRJ})
    //     }
    // })

    // useEffect( () => {
    //     console.log(calculo)
    // }, [])

    // if (cambio_actual == cambioPRJ) {
    // useEffect( () => {
    //     var cambio_actual = (document.getElementById("cambio-actual").value * 1
    //     setCalculo({...calculo, cambio : cambioPRJ})
    // })
    
    // }

    return(
            <>
                    <form action="" onSubmit={handleSubmitOrdenes}>
                    <div id="">
                        <div>
                            <>
                            <div className="data-cont">
                                <label htmlFor="cambio-actual">Cambio operación</label>
                                <input onChange={(e) => handleDatosRecibe(e)} id="cambio-actual" defaultValue={ cambioPRJ } type="number" />
                                </div>
                            <div>

                            <div id="formas-titulo-cont">
                                <label htmlFor="">Formas de entrega</label>
                                <span id="montoEntrega" className={ montoEntrega > 0 ? "entregamas" : "entregamenos" }> { !recibo ? 'entregando' : 'recibiendo' } {divisaRecibe} {montoEntrega} </span>
                            </div>
                        
                                <ul id="ul-formas">
                                    <>
                                        {entregasDefault.map((forma, index)=>(
                                            <FormaEntrega oficina={oficina} index={index} NoEditable={true} editedOrd={forma} opciones={tipo_entrega} setBorrarForma={setBorrarForma} entregas={entregas} setHayOrden={setHayOrden} setMontosCheck={setMontosCheck} setEntregas={setEntregas} entregaID={forma._id} montosCheck={montosCheck} cliente={selectedOperacion?.cliente} key={forma} />
                                        ))}
                                        {entregas.map((forma, index)=>(
                                            <FormaEntrega oficina={oficina} index={index} deletedOrds={deletedOrds} setDeletedOrds={setDeletedOrds} NoEditable={!edit} create={create} editedOrd={forma} opciones={tipo_entrega} setBorrarForma={setBorrarForma} entregas={entregas} setHayOrden={setHayOrden} setMontosCheck={setMontosCheck} setEntregas={setEntregas} entregaID={forma.id} montosCheck={montosCheck} cliente={selectedOperacion?.cliente} key={forma} />
                                        ))}                        
                                
                                    </>
                                   
                                
                                </ul>
                               
                            </div>

                            </>
                           

                            
                        </div>
                        


                        { create == true && 
                        <>
                            <p id="agregarOrdenBtn" style={{'cursor': 'pointer'}} onClick={ () => { nueva_forma() } }>Agregar nueva orden</p>
                            {hayOrden ?
                            <div className="cont-btns tipo-bajada tipo-crypto-compra tipo-crypto-venta">
                                <div className="btn-cancelar" onClick={()=>setRenderModal('')}>Descartar Ordenes</div>
                                <div className="btn-create" id="btn-crear-operacion" onClick={handleSubmitOrdenes}>Crear Ordenes</div>
                            </div>
                            :
                            <div className="btn-cancelar" style={{'float':'right'}} onClick={()=>setRenderModal('')}>
                                Cerrar
                            </div>
                            }
                        </>
                        }
                       


                    </div>
                    </form>
                    

                    { loading && 
                    <FormLoader />
                    }

            </>
    )
}

export default CreateOrden;