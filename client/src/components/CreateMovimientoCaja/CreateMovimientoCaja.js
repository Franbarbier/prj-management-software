import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { formatDateYmd } from '../../GlobalFunctions';
import { useAppContext } from '../../contexts/AppContext';
import { createMovimientoCaja } from '../../actions/movimientos' 
import ModalContainer from '../ModalContainer/ModalContainer';
import FormLoader from '../FormLoader/FormLoader';
import './CreateMovimientoCaja.css?r=4'

const CreateMovimientoCaja = ({tipo='', activeCaja, cajasData, setRenderModal}) => {

    const {oficina} = useAppContext()
    const [movimientoCajaData, setMovimientoCajaData] = useState({caja:cajasData[activeCaja].divisa, oficina, tipo, fecha_creado: formatDateYmd(new Date())})
    const [categorias, setCategorias] = useState(useSelector(state => state.config["categorias_"+tipo]))

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    async function handleSubmit(){
        if(movimientoCajaData.importe != '' && movimientoCajaData.importe != undefined){
            setLoading(true)
            const onSuccess = () => (setLoading(false), setRenderModal(''), setMovimientoCajaData({}))
            await createMovimientoCaja(movimientoCajaData, dispatch)
            onSuccess()
        }else{
            alert('El campo "Importe" no puede estar vacío.')
        }
    }

    function handleCloseModal(){
        setRenderModal('')
    }

    

    return(
            <ModalContainer tipo="create-movimiento-caja" setRenderModal={setRenderModal}>
                
                <div id="create-movimiento-proveedor" className="form-cargar" onClick={(e)=>e.stopPropagation()}>
                    <h2>Cargar Movimiento Caja ({tipo.substring(0, tipo.length - 1)})</h2>
                    <form action=""  onSubmit={handleSubmit}>
                        <div className="multiple-data-cont">
                            <div className="data-cont">
                                <label htmlFor="fecha">Fecha</label>
                                <input type="date" name="fecha" id="cmc-fecha" value={movimientoCajaData.fecha_creado} onChange={(e) => setMovimientoCajaData({...movimientoCajaData, fecha_creado: e.target.value, tipo: tipo == 'ingresos' ? 1 : 0, caja: cajasData[activeCaja].divisa})} />
                            </div>
                            <div className="data-cont">
                                <label htmlFor="importe">Importe</label>
                                <input type="number" name="importe" id="cmc-importe" onChange={(e) => setMovimientoCajaData({...movimientoCajaData, importe: e.target.value, tipo: tipo == 'ingresos' ? 1 : 0})} />
                            </div>
                        </div>
                        <div className="multiple-data-cont">
                            <div className="data-cont">
                                <label htmlFor="descripcion">Descripcion</label>
                                <input type="text" name="descipcion" id="cmc-descripcion" onChange={(e) => setMovimientoCajaData({...movimientoCajaData, descripcion: e.target.value, tipo: tipo == 'ingresos' ? 1 : 0, caja: cajasData[activeCaja].divisa})} />
                            </div>
                            <div className="data-cont" style={{width: "100%"}}>
                                <label htmlFor="categoria">Categoría</label>
                                <select name="cateogira" id="cmc-categoria" onChange={(e) => setMovimientoCajaData({...movimientoCajaData, categoria: e.target.value, tipo: tipo == 'ingresos' ? 1 : 0, caja: cajasData[activeCaja].divisa})}>
                                    <option value=""></option>
                                    {categorias.map((option) => 
                                        <option value={option} key={option} className={option.toLowerCase()}>{option}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="cont-btns">
                            <div className="btn-cancelar" onClick={()=>handleCloseModal()}>Cancelar</div>
                            <div className="btn-create" id="btn-crear-proveedor" onClick={handleSubmit}>Crear Movimiento</div>
                        </div>
                    </form>
                    {loading && 
                        <FormLoader />
                    }
                </div>


            </ModalContainer>
    )
}

export default CreateMovimientoCaja