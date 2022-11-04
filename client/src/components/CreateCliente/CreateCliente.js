import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import {tipos, provincias} from '../../GlobalFunctions'
import { createCliente } from '../../actions/clientes';
import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader'

import './CreateCliente.css'

const CreateCliente = ({setRenderModal}) => {

    const [clienteData, setClienteData] = useState({})
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    async function handleSubmit(){
        setLoading(true)
        const onSuccess = () => (setLoading(false), setRenderModal(''))
        await createCliente({clienteData}, dispatch)
        onSuccess()
    }   
    

    return(
            <ModalContainer tipo="create-cliente" setRenderModal={setRenderModal}>
                
                <div id="create-cliente" className="form-cargar" onClick={(e)=>e.stopPropagation()}>

                    <h2>Cargar Cliente</h2>

                    <form action="" onSubmit={handleSubmit}>

                        <div className="multiple-data-cont">
                            <div className="data-cont">
                                <label htmlFor="Nombre">Nombre</label>
                                <input type="text" name="Nombre" id="cc-nombre" autoComplete="off" onChange={(e) => setClienteData({...clienteData, nombre: e.target.value})} />
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Telefono">Telefono</label>
                                <input type="number" name="Telefono" id="cc-telefono" autoComplete="off" onChange={(e) => setClienteData({...clienteData, telefono: e.target.value})} />
                            </div>
                        </div>

                        <div className="data-cont" style={{maxWidth: "100%"}}>
                            <label htmlFor="Origen">Origen:</label>
                            <select name="Origen" id="cc-origen" onChange={(e) => setClienteData({...clienteData, origen: e.target.value})} >
                                <option value=""></option>
                                    {tipos.clientes.map((tipo)=>(
                                        <option value={tipo} key={tipo}>{tipo}</option>
                                    ))}
                            </select>
                        </div>

                        <div className="multiple-data-cont">
                            <div className="data-cont">
                                <label htmlFor="Domicilio">Domicilio</label>
                                <input type="text" name="Domicilio" id="cc-domicilio" onChange={(e) => setClienteData({...clienteData, domicilio: e.target.value})} />
                            </div>
                            <div className="data-cont">
                                <label htmlFor="Localidad">Localidad</label>
                                <input type="text" name="Localidad" id="cc-localidad" onChange={(e) => setClienteData({...clienteData, localidad: e.target.value})} />
                            </div>
                        </div>

                        <div className="data-cont" style={{maxWidth: "100%"}}>
                            <label htmlFor="Provincia">Provincia</label>
                            <select name="Provincia" id="cc-provincia" onChange={(e) => setClienteData({...clienteData, provincia: e.target.value})}>
                                <option value=""></option>
                                {provincias.map((provincia)=>
                                    <option value={provincia.nombre} key={provincia.nombre}>{provincia.nombre}</option>
                                )}
                            </select>
                        </div>

                        <div className="multiple-data-cont">
                                
                                <div className="data-cont">
                                    <label htmlFor="Banco">Banco</label>
                                    <input type="text" name="Banco" id="cc-banco" onChange={(e) => setClienteData({...clienteData, banco: e.target.value})} />
                                </div>
                                <div className="data-cont">
                                    <label htmlFor="Nro de cuenta">Nro de cuenta</label>
                                    <input type="text" name="Nro de cuenta" id="cc-nro-cuenta" onChange={(e) => setClienteData({...clienteData, nro_cuenta: e.target.value})} />
                                </div>

                        </div>

                        <div className="multiple-data-cont">
                                
                                <div className="data-cont" style={{width: "48%"}}>
                                    <label htmlFor="Tipo de cuenta">Tipo de cuenta</label>
                                    <select name="Tipo de cuenta" id="cc-tipo-cuenta" onChange={(e) => setClienteData({...clienteData, tipo_cuenta: e.target.value})}>
                                        <option value=""></option>
                                        <option value="Caja de ahorro">Caja de ahorro</option>
                                        <option value="Cuenta corriente">Cuenta corriente</option>
                                    </select>
                                </div>

                                <div className="data-cont">
                                    <label htmlFor="cbu">CBU</label>
                                    <input type="number" name="cbu" id="cc-cbu" onChange={(e) => setClienteData({...clienteData, cbu: e.target.value})} />
                                </div>

                        </div>

                        <div className="data-cont">
                            <label htmlFor="Alias">Alias</label>
                            <input type="text" name="Alias" id="cc-alias" onChange={(e) => setClienteData({...clienteData, alias: e.target.value})} />
                        </div>
                        
                        <div className="cont-btns">
                            <div className="btn-cancelar" onClick={()=>setRenderModal('')}>Cancelar</div>
                            <div className="btn-create" id="btn-crear-cliente" onClick={handleSubmit}>Crear Cliente</div>
                        </div>
                    
                    </form>
                    

                    { loading && 
                    <FormLoader />
                    }


                </div>

            </ModalContainer>
    )
}

export default CreateCliente