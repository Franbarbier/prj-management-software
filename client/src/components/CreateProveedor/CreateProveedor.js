import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader'
import {getIdentifier} from '../../GlobalFunctions'


import './CreateProveedor.css?r=4'
import { createProveedor } from '../../actions/proveedores';

const CreateProveedor = ({setRenderModal}) => {

    const [proveedorData, setProveedorData] = useState({})
    const [cuentas, setCuentas] = useState([])
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(){
        setLoading(true)
        const onSuccess =  () => (setLoading(false), setRenderModal(''), window.location.reload(""))
        await createProveedor({proveedorData, cuentas}, dispatch)
        onSuccess()
    }   

    function handleAddCuenta(nombre){

        if(nombre !== ''){
            var id_temp = getIdentifier()
            setCuentas(cuentas.concat({"id_temp": id_temp, "nombre": nombre}))
        }else{
            alert("El nombre de la cuenta no puede estar vacío.")
        }
        
    }


    function handleCloseModal(){
        setProveedorData({})
        setRenderModal('')
    }
    

    return(
            <ModalContainer tipo="create-proveedor" setRenderModal={setRenderModal}>
                
                <div id="create-proveedor" className="form-cargar" onClick={(e)=>e.stopPropagation()}>

                    <h2>Cargar Proveedor</h2>

                    <form action="" onSubmit={handleSubmit}>

                        <div className="data-cont" style={{maxWidth: '100%'}}>
                            <label htmlFor="Nombre">Nombre</label>
                            <input type="text" name="Nombre" id="cp-nombre" autoComplete="off" onChange={(e) => setProveedorData({...proveedorData, nombre: e.target.value})} />
                        </div>

                        <div className="multiple-data-cont">
                            <div className="data-cont">
                                <label htmlFor="Divisa Proveedor">Divisa del Proveedor</label>
                                <div className="radio-container">
                                    <input type="radio" id="cp-divisa-usd" name="Divisa Proveedor" value="USD" onChange={(e) => setProveedorData({...proveedorData, divisa: e.target.value})} />
                                    <label htmlFor="Divisa Proveedor">USD</label>
                                    <input type="radio" id="cp-divisa-ars" name="Divisa Proveedor" value="ARS" onChange={(e) => setProveedorData({...proveedorData, divisa: e.target.value})} />
                                    <label htmlFor="Divisa Proveedor">ARS</label>
                                </div>
                            </div>

                            <div className="data-cont" >
                                <label htmlFor="Fee">Fee (%)</label>
                                <input type="number" name="Fee" id="cp-fee" autoComplete="off" style={{width: "30%"}} onChange={(e) => setProveedorData({...proveedorData, fee: e.target.value})} />
                            </div>
                        </div>


                        <div className="" id="input-add-container">
                            <div className="data-cont" style={{maxWidth: "100%"}}>
                                <label htmlFor="Cuentas">Cuentas</label>
                                <input type="text" name="Cuentas" id="cp-cuenta" />
                            </div>
                            <div className="btn-add" onClick={(e) => handleAddCuenta(document.getElementById('cp-cuenta').value)}>
                                <div>+</div>
                            </div>
                        </div>

                        <div id="cont-cuentas"> 
                            {cuentas.map((cue)=>(
                                <div className="cp-cuenta" key={cue._id}>
                                    <div className="cp-cuenta-nombre">
                                    {cue.nombre}
                                    </div>
                                    <div className="cp-x" onClick={()=>setCuentas(cuentas.filter(cuenta => cuenta.id_temp != cue.id_temp))}>
                                        <img src="imgs/cross.svg" height="5px" alt="" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cont-btns">
                            <div className="btn-cancelar" onClick={()=>handleCloseModal()}>Cancelar</div>
                            <div className="btn-create" id="btn-crear-proveedor" onClick={handleSubmit}>Crear Proveedor</div>
                        </div>
                    
                    </form>
                    

                    { loading && 
                    <FormLoader />
                    }


                </div>

            </ModalContainer>
    )
}

export default CreateProveedor