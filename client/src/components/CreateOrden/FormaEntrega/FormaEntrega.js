import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import { formatDateYmd, oficinas } from '../../../GlobalFunctions';
import Cancelar from '../../../images/cancel.svg';
import Nota from '../../../images/note4.svg';




const FormaEntrega = ({oficina={oficina}, opciones, setBorrarForma, entregaID, entregas, setEntregas, setMontosCheck, montosCheck, cliente, setHayOrden, editedOrd = false, NoEditable=false, setDeletedOrds, create=false, index }) => {

    const [nota, setNota] = useState('vacioOculto')
    
    useEffect(()=>{
        console.log(entregas)
    })


    // Depende el tipo de orden, va a asignar los campos en el objeto de entrega
    function checkDataOrden(e, padresin) {


        if (e == 'Moto') {
            padresin.querySelector('.if-moto').style.display = 'flex';
            
            let id = padresin.id.replace('entrega','');
            let i_entrega = entregas.map(entr => entr.id).indexOf(parseInt(id) );
            let entregasCopy = JSON.parse(JSON.stringify(entregas))
            let moto = {
                localidad : padresin.querySelector('.localidad').value,
                provincia : padresin.querySelector('.provincia').value,
                domicilio : padresin.querySelector('.domicilio').value,
                depto : padresin.querySelector('.depto').value
            }
            
            entregasCopy[i_entrega].tipo_orden = {'moto' : moto};
            entregasCopy[i_entrega].tipo = e
        
            setEntregas(entregasCopy) 

        
        }else if (e == 'Depósito') {
            padresin.querySelector('.if-deposito').style.display = 'flex';
        
            let id = padresin.id.replace('entrega','');
            let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
            let entregasCopy = JSON.parse(JSON.stringify(entregas))
            let deposito = {
                banco : padresin.querySelector('.banco').value,
                nro_cuenta : padresin.querySelector('.nroCuenta').value,
                titular : padresin.querySelector('.titular').value,
                tipo_cuenta : padresin.querySelector('.tipo').value,
                cbu : padresin.querySelector('.cbu').value,
                alias : padresin.querySelector('.alias').value
            }
            entregasCopy[i_entrega].tipo_orden = {'deposito' : deposito};
            entregasCopy[i_entrega].tipo = e
            
            setEntregas(entregasCopy)
        
        }else if (e == 'Crypto') {
            padresin.querySelector('.if-crypto').style.display = 'flex';
        
            for (let index = 0; index < padresin.querySelectorAll('.montos').length; index++) {
                const element = padresin.querySelectorAll('.montos')[index];
                element.style.display = 'none';
            }
            padresin.querySelector('.montos-ars').value = 0;
            padresin.querySelector('.montos-usd').value = 0;
            padresin.querySelector('#usdt-cont').style.display = 'block';
        
            let id = padresin.id.replace('entrega','');
            let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
            let entregasCopy = JSON.parse(JSON.stringify(entregas))
            let crypto = {
                wallet : padresin.querySelector('.wallet').value,
                comision : padresin.querySelector('.prj-cometa').value * 1,
                usdt_a_enviar : padresin.querySelector('.montos-usdt').value * 1
            }
            entregasCopy[i_entrega].tipo_orden = {'crypto' : crypto};
            entregasCopy[i_entrega].tipo = e
            
            setEntregas(entregasCopy)
            
        }else if (e == 'Transferencia') {
            padresin.querySelector('.if-transferencia').style.display = 'flex';
        
            let id = padresin.id.replace('entrega','');
            let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
            let entregasCopy = JSON.parse(JSON.stringify(entregas))
        
            let transferencia = {
                banco : padresin.querySelector('.banco-transf').value,
                nro_cuenta : padresin.querySelector('.nroCuenta-transf').value,
                titular : padresin.querySelector('.titular-transf').value,
                tipo_cuenta : padresin.querySelector('.tipo-transf').value,
                cbu : padresin.querySelector('.cbu-transf').value,
                alias : padresin.querySelector('.alias-transf').value
            }
            entregasCopy[i_entrega].tipo_orden = {'transferencia' : transferencia};
            entregasCopy[i_entrega].tipo = e
            setEntregas(entregasCopy)  
        
        }else if (e == 'Cash Cash' ) {
            padresin.querySelector('.if-cash').style.display = 'flex';
        
            let id = padresin.id.replace('entrega','');
            let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
            let entregasCopy = JSON.parse(JSON.stringify(entregas))
            let cash = {
                comision: padresin.querySelector('.porcentaje-cometa-cash').value * 1,
            }

            if (entregasCopy[i_entrega].usd > 0) {
                cash.monto_cliente = entregasCopy[i_entrega].usd
            }else if(entregasCopy[i_entrega].ars > 0) {
                cash.monto_cliente = entregasCopy[i_entrega].ars
            }
            
            entregasCopy[i_entrega].tipo_orden = {'cash' : cash};
            entregasCopy[i_entrega].tipo = e
            console.log(entregasCopy[i_entrega])
            setEntregas(entregasCopy)
            
        }else if (e == 'Factura' ) {
            padresin.querySelector('.montos-usd').value = 0;
            let usdCont = padresin.querySelector('.montos-usd').closest('.montos')
            usdCont.style.display = 'none';

            let id = padresin.id.replace('entrega','');
            let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
            let entregasCopy = JSON.parse(JSON.stringify(entregas))
            
            
            let factura = {
                monto_factura_ars: padresin.querySelector('.montos-ars').value,
            }

            console.log(padresin.querySelector('.montos-ars').value)
            entregasCopy[i_entrega].tipo_orden = {'factura' : factura};
            entregasCopy[i_entrega].tipo = e


            setEntregas(entregasCopy)  
            
        }else{
           
            let id = padresin.id.replace('entrega','');
            let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
            let entregasCopy = JSON.parse(JSON.stringify(entregas))
            entregasCopy[i_entrega].tipo_orden = null;
            entregasCopy[i_entrega].tipo = e
            setEntregas(entregasCopy)  
        
        }
    }

    var recibiendo = ''
    // tomamos y asignamos el tipo de entrega del select, a la entrega que corresponde
    function handleTipoEntrega(e, este){
        
        // A que entrega pertenecen los datos
        let padresin = este.closest('.forma-entrega')
        
        // Ocultamos la info de todas las entregas y dejamos los campos default
        for (let index = 0; index < padresin.querySelectorAll('.desplegables').length; index++) {
            const element = padresin.querySelectorAll('.desplegables')[index];
            element.style.display = 'none';
        }
        padresin.querySelector('.montos-ars').style.opacity = 1;
        padresin.querySelector('.montos-ars').removeAttribute("disabled");
        for (let index = 0; index < padresin.querySelectorAll('.montos').length; index++) {
            const element = padresin.querySelectorAll('.montos')[index];
            element.style.display = 'block';
        }
        padresin.querySelector('#usdt-cont').style.display = 'none';
        padresin.querySelector('.montos-usdt').value = 0;

        checkDataOrden(e, padresin)
        
        if(este.value == 'Recibo'){
            este.closest('.forma-entrega').className += " recibiendo";
        }else{
            este.closest('.forma-entrega').classList.remove("recibiendo");
        }

        console.log(este.value)
    
    }
    
    // cada vez que tipias, se fija si es moto / deposito y appendea el objeto con la info a la entrega que corresponde
    function handleDatosEntrega(e, este) {
        let padresin = este.closest('.forma-entrega')
       
        let value = padresin.querySelector('.selectTipoEntrega').value

        // console.log(value, padresin)

        checkDataOrden(value, padresin)
       
}

    // si esta chequeado el "hoy" asigna el dia de hoy sino toma el valor del input, y lo appendea a la entrega que corresponde
    function handleFechaEntrega(e, este){
        let padresin = este.closest('.forma-entrega')
        let id = padresin.id.replace('entrega','');
        let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
        let entregasCopy = JSON.parse(JSON.stringify(entregas))
        var fecha_entrega = padresin.querySelector('.queFecha').value
        
        entregasCopy[i_entrega].fecha_entrega = fecha_entrega
        setEntregas(entregasCopy) 
    }

    // elimina del objeto la entrega eliminada
    function delete_forma (e, entregas) {

        let padresin = e.closest('.forma-entrega')
        let id = padresin.id.replace('entrega','');
        setBorrarForma(id);
        const newEntregas = entregas.filter(entrega => entrega.id != id);
        console.log(newEntregas)
        setEntregas(newEntregas)
        
        if (document.getElementById('ul-formas').childNodes.length <= 1) {
            setHayOrden(false)
        }

        // Mecanismo para eliminar orden desde "Edit Orden"
        // for (let index = 0; index < entregas.length; index++) {
        //     const element = entregas[index];
        //     if (element._id == e.getAttribute('data-id') ) {
        //         setDeletedOrds(deletedOrds => [...deletedOrds, ... [element._id] ])
        //     }
        // }
        
        
    }



    // Cuando tocas los campos USD y ARS los guarda en cada entrega y verifica con un useEffect que no se pase del "monto a entregar"
    function changedMonto (e, entregas) {

        let padresin = e.closest('.forma-entrega')

        var id = padresin.id.replace('entrega',' ');
        let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
        var divisa = e.className.replace("montos-", "");
        divisa = divisa.split(' ', 99)
        divisa = divisa[0]
        console.log(divisa)
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
        }

        let checkfactus = padresin.querySelector('.selectTipoEntrega')
        if(checkfactus.value == "Factura"){
            let id = padresin.id.replace('entrega','');
            let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
            let entregasCopy = JSON.parse(JSON.stringify(entregas))
            
            
            let factura = {
                monto_factura_ars: padresin.querySelector('.montos-ars').value * 1,
            }
            entregasCopy[i_entrega].tipo_orden = {'factura' : factura};

            console.log( entregasCopy[i_entrega])
        }

        setEntregas(entregasCopy) 
        setMontosCheck(montosCheck + 1)
    }

    function changedMontoArsUsd(e, entregas) {
        let padresin = e.closest('.forma-entrega')
        let cambio =  parseInt(document.querySelector('#cambio-actual').value)
        padresin.querySelector('.montos-ars').value = (e.value * cambio).toFixed(2)

        var id = padresin.id.replace('entrega',' ');
        let i_entrega = entregas.map(e => e.id).indexOf(parseInt(id) );
        
        let entregasCopy = JSON.parse(JSON.stringify(entregas))
        console.log(id, i_entrega, entregasCopy)
        entregasCopy[i_entrega]['ars'] = parseInt((e.value * cambio).toFixed(2))
        setEntregas(entregasCopy)
        setMontosCheck(montosCheck + 1)

    }

    // Hice un quilombo, pero no podran decir que no funciona! :) Abrir y cerrar el textarea y dejar grabado si hay no notas para el css del icono 
    function newNota(e){
        setNota('escribiteAlgo')
        document.getElementById('modal-container').addEventListener('click', notaClickListenerT(e))
        // document.getElementsByClassName('modal-container')[0].addEventListener('click', notaClickListenerT(e))
        let padresin = e.target.closest('.forma-entrega')
        
        // Que se ponga focus en cuanto se abra el textarea
        var myVar = setInterval(myTimer, 300);
        function myTimer() {
            padresin.querySelector('.notaBox').focus()
        }
    }
 
    var greatNoteFather = '';
    
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

    function comision_crypto(value, target ){
        let padresin = target.closest('.forma-entrega')
        let cuantoCashUsd = padresin.querySelector('.montos-usd').value

        handleDatosEntrega(value, target)
        setMontosCheck(montosCheck + 1)
    }

    function comision_cash(value, target ){
        handleDatosEntrega(value, target)
        if( target.className.includes('porcentaje-cometa-cash')  ){
            let padresin = target.closest('.forma-entrega')
            let usdEntregar = padresin.querySelector('.montos-usd').value


            padresin.querySelector('.fijo-cometa-cash').value = target.value * parseInt(usdEntregar) /100
        }else{
            let padresin = target.closest('.forma-entrega')
            padresin.querySelector('.porcentaje-cometa-cash').value = ''

        }
        setMontosCheck(montosCheck + 1)
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

        if ('tipo_orden' in editedOrd) {
            tiene_tipo = true
        }
        if (cliente) {
            tiene_cliente = true
        }
        large = ''
        
        
    }
    

    if (editedOrd.recibo) {
        recibiendo = 'recibiendo'
    }
    
    var usdAEntregar = editedOrd.usd;
    var arsAEntregar = editedOrd.ars;
    
    
    if (editedOrd.tipo == "Factura" ) {
        usdAEntregar = 0
        arsAEntregar = editedOrd.tipo_orden?.factura?.monto_factura_ars
    }else if(editedOrd.tipo == "Cash Cash" ){
        usdAEntregar =  editedOrd.tipo_orden?.cash?.monto_cliente
        arsAEntregar = 0
    }

    return(
        <li className={"forma-entrega " + editedOrd?.estado + " " + large+" " + recibiendo } key={"entrega"+entregaID} id={"entrega"+entregaID}  >
        <div>
            <article>
                <div className="fecha">
                    <label for="check">Recibe:</label>
                    {/* <input defaultChecked={true} type="checkbox" className="check" name="recibeHoy" onChange={(e)=> handleFechaEntrega(e.target.value, e.target)}/> */}
                    <input disabled={NoEditable} className="queFecha" min={today} defaultValue={editedOrd ? formatDateYmd(editedOrd.fecha_entrega) : today} type="date" onChange={(e)=> handleFechaEntrega(e.target.value, e.target)}/>
                </div>
            </article>
            <div className="tipo-entrega-ofi">
                <select className="selectTipoEntrega" onChange={(e)=> handleTipoEntrega(e.target.value, e.target)} disabled={NoEditable}>
                    {/* <option disabled selected>Forma de entrega</option> */}
                    <option disabled selected>{ editedOrd.tipo != null ? editedOrd.tipo : "Forma de entrega"}</option>
                    {opciones.map((opcion)=>(
                        <option value={opcion}>{opcion}</option>
                        ))}
                </select>

                <select name="" id="q-ofi" onChange={(e)=> setEntregas(entregas.map(entrega => entrega.id == entregaID ? {...entrega, oficina : e.target.value} : entrega))} disabled={NoEditable}>
                    <option selected value={ editedOrd.oficina != null ? editedOrd.oficina : oficina}>{ editedOrd.oficina != null ? editedOrd.oficina : oficina}</option>
                    {oficinas.map((oficina)=>
                        <option value={oficina}>{oficina}</option>
                    )}
                </select>
            </div>
            <div className="montos-cont">

                <div className="montos" id="usdt-cont" style={{'display': editedOrd.tipo == 'Crypto' || editedOrd.tipo == 'Recibo Crypto' ? 'block' : 'none'}}>
                    <span>USDT</span>
                    <input disabled={NoEditable} type="number" defaultValue={ editedOrd.tipo == 'Crypto' || editedOrd.tipo == 'Recibo Crypto' ? editedOrd.tipo_orden.crypto.usdt_a_enviar : "0"}  className="montos-usdt" onChange={ (e) => changedMonto(e.target, entregas) } />
                </div>
                
                <div className="montos" style={{'display': editedOrd.tipo == 'Crypto' || editedOrd.tipo == 'Recibo Crypto' || editedOrd.tipo == 'Factura'   ? 'none' : 'block'}}>
                    <span>USD</span>
                    <input disabled={NoEditable} type="number"  defaultValue={editedOrd ? usdAEntregar :"0"} className="montos-usd" onChange={ (e) => changedMonto(e.target, entregas) } />
                </div>
                <div className="montos" style={{'display': editedOrd.tipo == 'Crypto' || editedOrd.tipo == 'Recibo Crypto' ? 'none' : 'block'}}>
                    <span>ARS</span>
                    <input disabled={NoEditable} type="number" defaultValue={editedOrd ? arsAEntregar :"0"} className="montos-ars" onChange={ (e) => changedMonto(e.target, entregas) } />
                </div>
                 

                <div className="montos conversion">
                    <span>USD en ARS</span>
                    <input disabled={NoEditable} type="number"  defaultValue="0" className="montos-arsAusd" onChange={ (e) => changedMontoArsUsd(e.target, entregas) } />
                </div>
            </div>
        </div>
            {/* Aca deberia ir algo dinamico que meta el componente de la opcion seleccionada, pero por el momento mando displays  */}
        <aside>
            <div className="if-moto desplegables">
                <input placeholder="Provincia" className="provincia" defaultValue={tiene_tipo ? editedOrd.tipo_orden?.moto?.provincia : tiene_cliente ? cliente.provincia : "" } onChange={(e)=> handleDatosEntrega(e.target.value, e.target)} />
                <input placeholder="Localidad" className="localidad" defaultValue={tiene_tipo ? editedOrd.tipo_orden?.moto?.localidad : tiene_cliente ? cliente.localidad : "" } onChange={(e)=> handleDatosEntrega(e.target.value, e.target)}  />
                <input placeholder="Domicilio" className="domicilio" defaultValue={tiene_tipo ? editedOrd.tipo_orden?.moto?.domicilio : tiene_cliente ? cliente.domicilio : "" } onChange={(e)=> handleDatosEntrega(e.target.value, e.target)}  />
                <input placeholder="Depto" className="depto"   defaultValue={tiene_tipo ? editedOrd.tipo_orden?.moto?.depto : tiene_cliente ? cliente.depto : "" } onChange={(e)=> handleDatosEntrega(e.target.value, e.target)} />
            </div>
            <div className="if-deposito desplegables" style={{'display':editedOrd.tipo_orden?.deposito ? 'block' : 'none' }}>
                <input disabled={NoEditable} placeholder="Banco" className="banco" defaultValue={ !tiene_tipo ? editedOrd.tipo_orden?.deposito?.banco : tiene_cliente ? cliente.banco : ""  }  onChange={(e)=> handleDatosEntrega(e.target.value, e.target)} />
                <input disabled={NoEditable} type="number" placeholder="Nro de cuenta" className="nroCuenta" defaultValue={!tiene_tipo ? editedOrd.tipo_orden?.deposito?.nro_cuenta : tiene_cliente ? cliente.nro_cuenta : "" } onChange={(e)=> handleDatosEntrega(e.target.value, e.target)} />
                <input disabled={NoEditable} placeholder="Titular" className="titular" defaultValue={!tiene_tipo ? editedOrd.tipo_orden?.deposito?.titular : tiene_cliente ? cliente.titular : "" } onChange={(e)=> handleDatosEntrega(e.target.value, e.target)}  />
                <input disabled={NoEditable} placeholder="Tipo Cuenta" className="tipo" defaultValue={!tiene_tipo ? editedOrd.tipo_orden?.deposito?.tipo_cuenta : tiene_cliente ? cliente.tipo_cuenta : "" } onChange={(e)=> handleDatosEntrega(e.target.value, e.target)} />
                <input disabled={NoEditable} placeholder="CBU" className="cbu" defaultValue={!tiene_tipo ? editedOrd.tipo_orden?.deposito?.cbu : tiene_cliente ? cliente.cbu : "" } onChange={(e)=> handleDatosEntrega(e.target.value, e.target)}/>
                <input disabled={NoEditable} placeholder="Alias" className="alias" defaultValue={!tiene_tipo ? editedOrd.tipo_orden?.deposito?.alias : tiene_cliente ? cliente.alias : "" } onChange={(e)=> handleDatosEntrega(e.target.value, e.target)}/>
            </div>
            <div className="if-crypto desplegables" style={{'display':editedOrd.tipo_orden?.crypto ? 'block' : 'none' }}>
                <input placeholder="Wallet" className="wallet" defaultValue={!tiene_tipo ? editedOrd.tipo_orden?.crypto?.wallet : tiene_cliente ? cliente.wallet : "" }  onChange={(e)=> handleDatosEntrega(e.target.value, e.target)} />
                <label className="label-cometa">%</label>
                <input type="number" placeholder="Comision PRJ %" defaultValue={ tipo_orden == 'crypto' ? editedOrd.tipo_orden?.crypto.comision : "0"} min="0" className="prj-cometa" onChange={(e, entregas)=> comision_crypto(e.target.value, e.target)}  />
            </div>
            <div className="if-transferencia desplegables" style={{'display':editedOrd.tipo_orden?.transferencia ? 'block' : 'none' }}>
                <input disabled={NoEditable} placeholder="Banco"  defaultValue={ editedOrd.tipo_orden?.transferencia?.banco } className="banco-transf"  onChange={(e)=> handleDatosEntrega(e.target.value, e.target)}  />
                <input disabled={NoEditable} type="number" placeholder="Nro de cuenta"  defaultValue={!tiene_tipo ? editedOrd.tipo_orden?.transferencia?.nro_cuenta : tiene_cliente ? cliente.nro_cuenta : "" } className="nroCuenta-transf"  onChange={(e)=> handleDatosEntrega(e.target.value, e.target)} />
                <input disabled={NoEditable} placeholder="Titular"  defaultValue={!tiene_tipo ? editedOrd.tipo_orden?.transferencia?.titular : tiene_cliente ? cliente.titular : "" } className="titular-transf"  onChange={(e)=> handleDatosEntrega(e.target.value, e.target)}  />
                <input disabled={NoEditable} placeholder="Tipo"  defaultValue={!tiene_tipo ? editedOrd.tipo_orden?.transferencia?.tipo_cuenta : tiene_cliente ? cliente.tipo_cuenta : "" } className="tipo-transf"  onChange={(e)=> handleDatosEntrega(e.target.value, e.target)}  />
                <input disabled={NoEditable} placeholder="CBU"  defaultValue={!tiene_tipo ? editedOrd.tipo_orden?.transferencia?.cbu : tiene_cliente ? cliente.cbu : "" } className="cbu-transf"  onChange={(e)=> handleDatosEntrega(e.target.value, e.target)} />
                <input disabled={NoEditable} placeholder="Alias"  defaultValue={!tiene_tipo ? editedOrd.tipo_orden?.transferencia?.alias : tiene_cliente ? cliente.alias : "" } className="alias-transf"  onChange={(e)=> handleDatosEntrega(e.target.value, e.target)}/>
            </div>
            <div className="if-cash desplegables">
            
                <label className="label-cometa">%</label>
                <input disabled={NoEditable} type="number" placeholder="Comision %" defaultValue={ tipo_orden == 'cash' ? editedOrd.tipo_orden?.cash.comision : ""} min="0" className="porcentaje-cometa-cash" onChange={(e, entregas)=> comision_cash(e.target.value, e.target)}  />
                <label className="label-cometa fijo">U$D</label>
                <input disabled={NoEditable} type="number" placeholder="Comision fija" defaultValue={ tipo_orden == 'cash' ? editedOrd.tipo_orden?.cash.comision : ""} min="0" className="fijo-cometa-cash fijo" onChange={(e, entregas)=> comision_cash(e.target.value, e.target)}  />
            </div>
            
        </aside>
        
        {create == true &&
            <img src={Cancelar} data-id={editedOrd._id} className="deleteForma"  onClick={ (e) => delete_forma(e.target, entregas)}/>
        }
        {/* <article className="agregarNota-cont">
            <div>
                <textarea className={nota + " notaBox"} placeholder="Agregar nota a la orden"></textarea>
                <div>
                    <img src={Nota} className="agregarNota" onClick={ (e) => newNota(e) }/>
                </div>
            </div>
        </article> */}
    </li>
    )
}

export default FormaEntrega;