import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ModalContainer from '../ModalContainer/ModalContainer';
import {tipos, provincias} from '../../GlobalFunctions'
import FormLoader from '../FormLoader/FormLoader'
import FormHeader from '../FormHeader/FormHeader'
import FormEditBtns from '../FormEditBtns/FormEditBtns'


import './EditCliente.css?r=4'
import { updateCliente } from '../../actions/clientes';

const EditCliente = ({ setRenderModal, data}) => {

    const dispatch = useDispatch()
    const [clienteData, setClienteData] = useState({...data})
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(false)

    async function handleSubmit(){
        setLoading(true)
        const onSuccess = () => (setLoading(false), setRenderModal(''))
        await updateCliente(clienteData, dispatch)
        onSuccess()
    }   

    return(
            <ModalContainer tipo="edit-cliente" setRenderModal={setRenderModal}>
                
                <div id="edit-cliente" className="form-cargar" onClick={(e)=>e.stopPropagation()}>

                    <FormHeader edit={edit} setEdit={setEdit} tipo="Cliente" />

                    <form action="" onSubmit={handleSubmit}>

                        <div className="multiple-data-cont">
                            <div className="data-cont">
                                <label htmlFor="Nombre">Nombre</label>
                                <input type="text" name="Nombre" id="cc-nombre" defaultValue={clienteData.nombre} autoComplete="off" onChange={(e) => setClienteData({...clienteData, nombre: e.target.value})} disabled={!edit} />
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Telefono">Telefono</label>
                                <input type="number" name="Telefono" id="cc-telefono" defaultValue={clienteData.telefono} autoComplete="off" onChange={(e) => setClienteData({...clienteData, telefono: e.target.value})} disabled={!edit}/>
                            </div>
                        </div>

                        <div className="data-cont" style={{maxWidth: "100%"}}>
                            <label htmlFor="Origen">Origen:</label>
                            <select name="Origen" id="cc-origen" onChange={(e) => setClienteData({...clienteData, origen: e.target.value})} disabled={!edit}>
                                <option value=""></option>
                                    {tipos.clientes.map((tipo)=>(
                                        <option value={tipo} selected={tipo===clienteData.origen} key={tipo}>{tipo}</option>
                                    ))}
                            </select>
                        </div>

                        <div className="multiple-data-cont">
                            <div className="data-cont">
                                <label htmlFor="Domicilio">Domicilio</label>
                                <input type="text" name="Domicilio" id="cc-domicilio" defaultValue={clienteData.domicilio} onChange={(e) => setClienteData({...clienteData, domicilio: e.target.value})} disabled={!edit}/>
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Localidad">Localidad</label>
                                <input type="text" name="Localidad" id="cc-localidad" defaultValue={clienteData.localidad} onChange={(e) => setClienteData({...clienteData, localidad: e.target.value})} disabled={!edit}/>
                            </div>
                        </div>

                        <div className="data-cont" style={{maxWidth: "100%"}}>
                            <label htmlFor="Provincia">Provincia</label>
                            <select name="Provincia" id="cc-provincia" onChange={(e) => setClienteData({...clienteData, provincia: e.target.value})}disabled={!edit}>
                                <option value=""></option>
                                {provincias.map((provincia)=>
                                    <option value={provincia.nombre} selected={provincia.nombre === clienteData.provincia} key={provincia.nombre}>{provincia.nombre}</option>
                                )}
                            </select>
                        </div>
                        <div className="multiple-data-cont">
                            <div className="data-cont">
                                <label htmlFor="Banco">Banco</label>
                                <input type="text" name="Banco" id="cc-banco" defaultValue={clienteData.banco} onChange={(e) => setClienteData({...clienteData, banco: e.target.value})} disabled={!edit}/>
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Nro de cuenta">Nro de cuenta</label>
                                <input type="text" name="Nro de cuenta" id="cc-nro-cuenta" defaultValue={clienteData.nro_cuenta} onChange={(e) => setClienteData({...clienteData, nro_cuenta: e.target.value})} disabled={!edit}/>
                            </div>
                        </div>
                        <div className="multiple-data-cont">
                            <div className="data-cont" style={{width: "48%"}}>
                                <label htmlFor="Tipo de cuenta">Tipo de cuenta</label>
                                <select name="Tipo de cuenta" id="cc-tipo-cuenta" onChange={(e) => setClienteData({...clienteData, tipo_cuenta: e.target.value})}disabled={!edit}>
                                    <option value=""></option>
                                    <option value="Caja de Ahorro" selected={"Caja de Ahorro" === clienteData.tipo_cuenta}>Caja de Ahorro</option>
                                    <option value="Cuenta corriente" selected={"Cuenta corriente" === clienteData.tipo_cuenta}>Cuenta corriente</option>
                                </select>
                            </div>
                            <div className="data-cont">
                                <label htmlFor="cbu">CBU</label>
                                <input type="number" name="cbu" defaultValue={clienteData.cbu}  id="cc-cbu" onChange={(e) => setClienteData({...clienteData, cbu: e.target.value})} disabled={!edit}/>
                            </div>
                        </div>

                        <div className="data-cont">
                            <label htmlFor="Alias">Alias</label>
                            <input type="text" name="Alias" defaultValue={clienteData.alias} id="cc-alias" onChange={(e) => setClienteData({...clienteData, alias: e.target.value})} disabled={!edit}/>
                        </div>
                        
                        <Link to={`/cliente/${clienteData._id}`}>
                            <div className="data-cont verSaldo">
                                VER SALDO
                            </div>
                        </Link>

                        <FormEditBtns handleSubmit={handleSubmit} setRenderModal={setRenderModal} edit={edit} tipo="Cliente" />
                    </form>
                    { loading && 
                        <FormLoader />
                    }
                </div>

            </ModalContainer>
    )
}

export default EditCliente