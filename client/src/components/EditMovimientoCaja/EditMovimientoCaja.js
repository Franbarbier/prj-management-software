import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import { updateMovimientoCaja } from '../../actions/movimientos'
import ModalContainer from '../ModalContainer/ModalContainer';
import {formatDateYmd} from '../../GlobalFunctions'
import FormHeader from '../FormHeader/FormHeader';
import FormEditBtns from '../FormEditBtns/FormEditBtns';


import './EditMovimientoCaja.css?r=4'

const EditMovimientoCaja = ({data, cajasData, activeCaja, setRenderModal}) => {

    const [movimientoCajaData, setMovimientoCajaData] = useState({...data})
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(false)

    const dispatch = useDispatch()

    async function handleSubmit(){
        if(movimientoCajaData.importe != '' && movimientoCajaData.importe != undefined){
            setLoading(true)
            const onSuccess = () => (setLoading(false), setRenderModal(''))   
            await updateMovimientoCaja(movimientoCajaData, dispatch)
            onSuccess()
        }else{
            alert('El campo "Importe" no puede estar vacío.')
        }
    }

    var categorias_options = []
    if(data.tipo==1){
        categorias_options = ['', 'Orden', 'Giro proveedor', 'Otro']
    }else if(data.tipo==0){
        categorias_options = ['', 'Motos', 'Sueldos', 'Otros']
    }


    

    return(
            <ModalContainer tipo="edit-movimiento-caja" setRenderModal={setRenderModal}>
                
                <div id="edit-movimiento-caja" className="form-cargar" onClick={(e)=>e.stopPropagation()}>

                    <FormHeader edit={edit} setEdit={setEdit} tipo="Movimiento Caja" />

                    <form action=""  onSubmit={handleSubmit}>
                        <div className="multiple-data-cont">
                            <div className="data-cont">
                                <label htmlFor="fecha">Fecha</label>
                                <input type="date" name="fecha" id="cmc-fecha" defaultValue={formatDateYmd(movimientoCajaData.fecha_creado)} onChange={(e) => setMovimientoCajaData({...movimientoCajaData, fecha_creado: e.target.value, caja: cajasData[activeCaja].divisa})}  disabled={!edit}/>
                            </div>
                            <div className="data-cont">
                                <label htmlFor="importe">Importe</label>
                                <input type="number" name="importe" id="cmc-importe" defaultValue={movimientoCajaData.importe} onChange={(e) => setMovimientoCajaData({...movimientoCajaData, importe: e.target.value})}  disabled={!edit}/>
                                
                            </div>
                        </div>

                        <div className="multiple-data-cont">
                            <div className="data-cont">
                                <label htmlFor="descripcion">Descripcion</label>
                                <input type="text" name="descipcion" id="cmc-descripcion" defaultValue={movimientoCajaData.descripcion} onChange={(e) => setMovimientoCajaData({...movimientoCajaData, descripcion: e.target.value, caja: cajasData[activeCaja].divisa})}  disabled={!edit}/>
                            </div>

                            <div className="data-cont" style={{width: "100%"}}>
                                <label htmlFor="categoria">Categoría</label>
                                <select name="cateogira" id="cmc-categoria" defaultValue={movimientoCajaData.categoria} onChange={(e) => setMovimientoCajaData({...movimientoCajaData, categoria: e.target.value, caja: cajasData[activeCaja].divisa})} disabled={!edit}>
                                    {categorias_options.map((option) => 
                                        <option value={option} className={option.toLowerCase()} key={option}>{option}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <FormEditBtns handleSubmit={handleSubmit} setRenderModal={setRenderModal} edit={edit} tipo="Movimiento Caja" />
                    </form>
                </div>


            </ModalContainer>
    )
}

export default EditMovimientoCaja