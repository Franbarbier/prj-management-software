import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader'
import { getIdentifier } from '../../GlobalFunctions'
import { updateProveedor } from '../../actions/proveedores';
import './EditProveedor.css?r=4'

const EditProveedor = ({setRenderModal, data, currentCuentas}) => {

    const [proveedorData, setProveedorData] = useState(JSON.parse(JSON.stringify(data)))
    const [cuentas, setCuentas] = useState([...currentCuentas])
    const dispatch = useDispatch()    
    const [loading, setLoading] = useState(false)

    async function handleSubmit(){
        setLoading(true)
        const onSuccess = () => (setLoading(false), setRenderModal(''))
        await updateProveedor({proveedorData, cuentas}, dispatch)
        onSuccess()
    }   

    function handleAddCuenta(nombre){
        if(nombre!== ''){
            var id_temp = getIdentifier()
            setCuentas(cuentas.concat({"id_temp": id_temp, "nombre": nombre}))
        }else{
            alert("El nombre de la cuenta no puede estar vacío.")
        }
        
    }


    function handleCloseModal(){
            setRenderModal('')
    }

    function handleRemoveCuenta(cue){
        if(cue._id){
            alert("A momento no está la función de borrar cuenta. Es un tema a ver. Consultarlo con los chicos.")
        }else{
            setCuentas(cuentas.filter(cuenta => cuenta.id_temp != cue.id_temp))
        }
    }


    

    return(
            <ModalContainer tipo="edit-proveedor" setRenderModal={setRenderModal}>
                
                <div id="edit-proveedor" className="form-cargar" onClick={(e)=>e.stopPropagation()}>

                    <h2>Editar Proveedor</h2>

                    <form action="" onSubmit={handleSubmit}>

                        <div className="data-cont" style={{maxWidth: '100%'}}>
                            <label htmlFor="Nombre">Nombre</label>
                            <input type="text" name="Nombre" id="ep-nombre" defaultValue={proveedorData.nombre} autoComplete="off" onChange={(e) => setProveedorData({...proveedorData, nombre: e.target.value})} />
                        </div>

                        <div className="multiple-data-cont">
                            <div className="data-cont">
                                <label htmlFor="Divisa Proveedor">Divisa del Proveedor</label>
                                <div className="radio-container">
                                    <input type="radio" id="ep-divisa-usd" name="Divisa Proveedor" value="USD" checked={"USD" === proveedorData.divisa} onChange={(e) => setProveedorData({...proveedorData, divisa: e.target.value})} />
                                    <label htmlFor="Divisa Proveedor">USD</label>
                                    <input type="radio" id="ep-divisa-crypto" name="Divisa Proveedor" value="Crypto" checked={"Crypto" === proveedorData.divisa} onChange={(e) => setProveedorData({...proveedorData, divisa: e.target.value})} />
                                    <label htmlFor="Divisa Proveedor">Crypto</label>
                                </div>
                            </div>

                            <div className="data-cont" >
                                <label htmlFor="Fee">Fee (%)</label>
                                <input type="number" name="Fee" id="ep-fee" defaultValue={proveedorData.fee} autoComplete="off" style={{width: "30%"}} onChange={(e) => setProveedorData({...proveedorData, fee: e.target.value})} />
                            </div>
                        </div>


                        <div className="" id="input-add-container">
                            <div className="data-cont" style={{maxWidth: "100%"}}>
                                <label htmlFor="Cuentas">Cuentas</label>
                                <input type="text" name="Cuentas" id="ep-cuenta" />
                            </div>
                            <div className="btn-add" onClick={(e) => handleAddCuenta(document.getElementById('ep-cuenta').value)}>
                                <div>+</div>
                            </div>
                        </div>

                        <div id="cont-cuentas"> 
                            {cuentas.map((cue)=>(
                            <div className="cp-cuenta" key={cue._id}>
                                <div className="cp-cuenta-nombre">
                                {cue.nombre}
                                </div>
                                <div className="cp-x" onClick={()=>handleRemoveCuenta(cue)}>
                                    <img src="imgs/cross.svg" height="5px" alt="" />
                                </div>
                            </div>
                            ))}
                        </div>

                        <div className="cont-btns">
                            <div className="btn-cancelar" onClick={()=>handleCloseModal()}>Cancelar</div>
                            <div className="btn-create" id="btn-crear-proveedor" onClick={handleSubmit}>Actualizar Proveedor</div>
                        </div>
                    
                    </form>
                    

                    { loading && 
                    <FormLoader />
                    }


                </div>

            </ModalContainer>
    )
}

export default EditProveedor