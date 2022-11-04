import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import { formatDateYmd, oficinas } from '../../../GlobalFunctions';
import Cancelar from '../../../images/cancel.svg';
import Nota from '../../../images/note4.svg';




const FormaRecibo = ({opciones, entregaID, entregas, setEntregas, setMontosCheck, montosCheck, cliente, setHayOrden, editedOrd = false, NoEditable=false }) => {

    const [nota, setNota] = useState('vacioOculto')
    
    // useEffect(()=>{
        
    //     setEntregas([{
    //         ars: 0,
    //         fecha_entrega: new Date(),
    //         id: 1,
    //         usd: 0,
    //         recibo: true
    //     }])

    // }, [])
    
    // useEffect(()=>{
    //     console.log(entregas)
        
    // }, [entregas])




    
    // Cuando tocas los campos USD y ARS los guarda en cada entrega y verifica con un useEffect que no se pase del "monto a entregar"
    function changedMonto (e, entregas) {

        let padresin = e.closest('.forma-entrega')
        var id = padresin.id.replace('entrega',' ');
        let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
        let divisa = e.className.replace("montos-", "");
        let entregasCopy = JSON.parse(JSON.stringify(entregas))
        
        if (e.className != "montos-usdt") {
            entregasCopy[i_entrega][divisa] = parseInt(e.value)

            if (e.className == "montos-ars") {
                padresin.querySelector('.montos-arsAusd').value = (e.value /  parseInt(document.querySelector('#cambio-actual').value)).toFixed(2)
            }

        }else{

            let crypto = {
                wallet : padresin.querySelector('.wallet').value,
                comision : padresin.querySelector('.prj-cometa').value * 1,
                usdt_a_enviar : padresin.querySelector('.montos-usdt').value * 1
            }
            entregasCopy[i_entrega].tipo_orden = {'crypto' : crypto};
            console.log(entregasCopy[i_entrega], entregasCopy[i_entrega].tipo_orden)
        }

        setEntregas(entregasCopy) 
        setMontosCheck(montosCheck + 1)
    }
    
    function changedMontoArsUsd(e, entregas) {
        let padresin = e.closest('.forma-entrega')
        let arsi = parseInt(padresin.querySelector('.montos-ars').value)
        let cambio =  parseInt(document.querySelector('#cambio-actual').value)
        padresin.querySelector('.montos-ars').value = (e.value * cambio).toFixed(2)

        var id = padresin.id.replace('entrega',' ');
        let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
        
        let entregasCopy = JSON.parse(JSON.stringify(entregas))
        entregasCopy[i_entrega]['ars'] = parseInt((e.value * cambio).toFixed(2))
        setEntregas(entregasCopy)
        setMontosCheck(montosCheck + 1)

    }


    // elimina del objeto la entrega eliminada
    function delete_forma (e, entregas) {

        let padresin = e.closest('.forma-entrega')
        let id = padresin.id.replace('entrega','');
        const newEntregas = entregas.filter(entrega => entrega.id != id);
        setEntregas(newEntregas)
        
        if (document.getElementById('ul-formas').childNodes.length <= 1) {
            setHayOrden(false)
        }
    }


    // Hice un quilombo, pero no podran decir que no funciona! :) Abrir y cerrar el textarea y dejar grabado si hay no notas para el css del icono
    var greatNoteFather = '';
    function newNota(e){
        setNota('escribiteAlgo')
        document.getElementById('modal-container').addEventListener('click', notaClickListenerT(e))
        let padresin = e.target.closest('.forma-entrega')
        
        // Que se ponga focus en cuanto se abra el textarea
        var myVar = setInterval(myTimer, 300);
        function myTimer() {
            padresin.querySelector('.notaBox').focus()
        }
    }
    function notaClickListenerT(e){
        let padresin = e.target.closest('.forma-entrega')

        greatNoteFather = padresin;
        document.getElementById('modal-container').addEventListener('click', newClick)
    }
    function newClick(e) {
        if(e.target.localName != "textarea") {
            let padresin = greatNoteFather;
            if (padresin.querySelector('.notaBox').value == '') {
                var id = padresin.id.replace('entrega','');
                let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
                let entregasCopy = JSON.parse(JSON.stringify(entregas))
                entregasCopy[i_entrega].nota = padresin.querySelector('.notaBox').value
                setEntregas(entregasCopy) 
                setNota('dejasteVacio')
            }else{
                var id = padresin.id.replace('entrega','');
                let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
                let entregasCopy = JSON.parse(JSON.stringify(entregas))
                entregasCopy[i_entrega].nota = padresin.querySelector('.notaBox').value
                setEntregas(entregasCopy) 
                setNota('notaAgregada')
            }
            document.getElementById('modal-container').removeEventListener('click', newClick)
        }        
    }



    function handleFechaEntrega(e, este){
        let padresin = este.closest('.forma-entrega')
        let id = padresin.id.replace('entrega','');
        let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
        let entregasCopy = JSON.parse(JSON.stringify(entregas))
        var fecha_entrega = padresin.querySelector('.queFecha').value
        
        entregasCopy[i_entrega].fecha_entrega = fecha_entrega
        setEntregas(entregasCopy) 
    }

    let d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    var today = [year, month, day].join('-');

    if ( editedOrd.tipo_orden ) {
        var tipo_orden = Object.keys(editedOrd.tipo_orden)[1]   
    }


    var tiene_tipo = false
    var tiene_cliente = false
    var large = 'large';
    if (NoEditable == false){

        // if ('tipo_orden' in editedOrd) {
        //     tiene_tipo = true
        // }
        if (cliente) {
            tiene_cliente = true
        }
        large = ''
    }

    return(
            <li className={"forma-entrega " + editedOrd?.estado + " " + large} id={"entrega"+entregaID} >
                <div>
                    <div className="tipo-entrega-ofi">

                        <select name="" id="q-ofi" onChange={(e)=> setEntregas(entregas.map(entrega => entrega.id == entregaID ? {...entrega, oficina : e.target.value} : entrega))} disabled={NoEditable}>
                            <option disabled selected>{ editedOrd.oficina != null ? editedOrd.oficina : "Oficina"}</option>
                            {oficinas.map((oficina)=>
                                <option value={oficina}>{oficina}</option>
                            )}
                        </select>
                    </div>
                    <div className="montos-cont">
                        
                        <div className="montos">
                            <span>USD</span>
                            <input disabled={NoEditable} type="number"  defaultValue={editedOrd ? editedOrd.usd :"0"} className="montos-usd" onChange={ (e) => changedMonto(e.target, entregas) } />
                        </div>
                        <div className="montos">
                            <span>ARS</span>
                            <input disabled={NoEditable} type="number" defaultValue={editedOrd ? editedOrd.ars :"0"} className="montos-ars" onChange={ (e) => changedMonto(e.target, entregas) } />
                        </div>
                        <div className="montos conversion">
                            <span>USD en ARS</span>
                            <input disabled={NoEditable} type="number"  defaultValue="0" className="montos-arsAusd" onChange={ (e) => changedMontoArsUsd(e.target, entregas) } />
                        </div>
                    </div>
                </div>
                
                <article>
                    <div className="fecha">
                        <label for="check">Nos entrega:</label>
                        {/* <input defaultChecked={true} type="checkbox" className="check" name="recibeHoy" onChange={(e)=> handleFechaEntrega(e.target.value, e.target)}/> */}
                        <input disabled={NoEditable} className="queFecha" min={today} defaultValue={editedOrd ? formatDateYmd(editedOrd.fecha_entrega) : today} type="date" onChange={(e)=> handleFechaEntrega(e.target.value, e.target)}/>
                    </div>
                </article>
                {!NoEditable &&
                    <img src={Cancelar} className="deleteForma"  onClick={ (e) => delete_forma(e.target, entregas)}/>
                }
                <article className="agregarNota-cont">
                    <div>
                        <textarea className={nota + " notaBox"} placeholder="Agregar nota a la orden"></textarea>
                        <div>
                            <img src={Nota} className="agregarNota" onClick={ (e) => newNota(e) }/>
                        </div>
                    </div>
                </article>
            </li>
    )
}

export default FormaRecibo;