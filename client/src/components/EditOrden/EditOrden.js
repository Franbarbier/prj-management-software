import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ModalContainer from '../ModalContainer/ModalContainer';
import CreateOrden from '../CreateOrden/CreateOrden';
import { divisaRecibeFunc } from '../../GlobalFunctions'; 

import { editOrdenes } from '../../actions/ordenes';
import './EditOrden.css';
import FormHeader from '../FormHeader/FormHeader';
import FormEditBtns from '../FormEditBtns/FormEditBtns';

const EditOrden = ({ setRenderModal, orden}) => {
    
    const [loading, setLoading] = useState(false)  
    
    const [divisaRecibe, setDivisaRecibe] =  useState('USD')

    
    const [edit, setEdit] = useState(false)
    const [deletedOrds, setDeletedOrds] = useState([])
    const [entregasEditadas, setEntregasEditadas] = useState(false)
    
    const [hayOrden, setHayOrden] = useState(false)
    const [datosOperacion , setDatosOperacion] = useState({
        cliente: '',
        cliente_borrador : null,
        fecha_creado: '',
        monto_a_entregar : '',
        como_recibe : '',
    })
    
    const ordenes = useSelector(state => state.ordenes.filter((ordens)=>ordens.operacion?._id == orden.operacion?._id ))
        

    const dispatch = useDispatch()

    useEffect(()=>{

        setDatosOperacion({
            id_op : ordenes[0].operacion._id,
            tipo_operacion : ordenes[0].operacion.tipo_operacion,
            cliente: orden.operacion?.cliente._id,
            fecha_creado: ordenes[0].operacion.fecha_creado,
            monto_a_entregar : ordenes[0].operacion.monto_a_entregar,
            como_recibe : ordenes[0].operacion.como_recibe,

        })
        
       
        const divisa = divisaRecibeFunc(ordenes[0].operacion)
        setDivisaRecibe( divisa )

    }, [])


    // esto deberia venir de algun lugar porque está aca y en "CreateOrden"
    function isClienteBorrador(operacion){
        return operacion?.cliente === null
    }
    function getClienteNombre(operacion){
        if(isClienteBorrador(operacion)){
            return operacion?.cliente_borrador
        }else{
            return operacion?.cliente.nombre
        }
    }


    function uniq(a) {
        var seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
   
    async function handleSubmit(){
        setLoading(true)
        const onSuccess = () => (setLoading(false), setRenderModal(''))
        await editOrdenes(entregasEditadas, deletedOrds, dispatch)
        onSuccess()
    }


    return(
            <>
              <ModalContainer tipo="edit-orden" setRenderModal={setRenderModal}>

       
                    <div id="edit-orden" class="form-cargar" onClick={(e)=>e.stopPropagation()}> 

                        <FormHeader edit={edit} setEdit={setEdit} tipo="Orden" />
                  
                        <div>
                            
                            <>
                                <div className="multiple-data-cont" style={{width: "100%"}} id="cont-operacion-existente">
                                    <div className="data-cont" style={{"width" : "45%"}}>
                                        <label htmlFor="operacion">Operación</label>
                                        <input id="" defaultValue={( getClienteNombre(orden.operacion) ) + " - " + orden._id} disabled />
                                    </div>
                                    <div className="data-cont" style={{"width" : "45%"}}>
                                        <label htmlFor="operacion">Tipo operación</label>
                                        <input id="" defaultValue={orden.operacion.tipo_operacion} disabled />
                                    </div>
                                    
                                </div>
                                <div className="multiple-data-cont" style={{width: "100%"}}>
                                    <div className="data-cont" style={{"width" : "45%"}}>
                                        <label htmlFor="operacion">Cliente</label>
                                        <input id="" defaultValue={ orden?.operacion?.cliente ? orden.operacion.cliente.nombre : orden.operacion?.cliente_borrador } disabled />
                                    </div>
                                    <div className="data-cont" style={{"width" : "45%"}}>
                                        <label htmlFor="operacion">Fecha</label>
                                        <input id="" defaultValue={orden.operacion.fecha_creado} disabled />
                                    </div>
                                </div>
                            
                            <div className="multiple-data-cont datos-orden" style={{width: "100%"}}>
                                    <div className="data-cont">
                                        <label htmlFor="recibe">Tiene que recibir</label>
                                        <div className="tiene-que-recibir">
                                            <div className="recibe-usd">{divisaRecibe}</div>

                                            <input id="recibe" defaultValue={orden.operacion.monto_a_entregar} disabled type="number" />
                                        </div>
                                    </div>
                                    <div className="data-cont" style={{"width" : "45%"}}>
                                        <label htmlFor="operacion">Cómo quería recibir</label>
                                        <input id="" defaultValue={orden.operacion.como_recibe} disabled />
                                    </div>
                                

                            </div>
                            </>                        
                        </div>

                        <CreateOrden divisaRecibe={divisaRecibe} deletedOrds={deletedOrds} setDeletedOrds={setDeletedOrds} setEntregasEditadas={setEntregasEditadas} edit={edit} create={false} ordenesEdit={ordenes} monto_a_entregar={datosOperacion.monto_a_entregar} setRenderModal={setRenderModal} datosOperacion={datosOperacion} setHayOrden={setHayOrden} hayOrden={hayOrden} enOpereta={false} />
                        
                        <FormEditBtns handleSubmit={handleSubmit} setRenderModal={setRenderModal} edit={edit} tipo="Orden(es)" />


                    </div>
                </ModalContainer>
            </>
    )
}

export default EditOrden;

