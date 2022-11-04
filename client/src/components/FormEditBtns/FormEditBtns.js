import './FormEditBtns.css';

const FormEditBtns = ({handleSubmit, setRenderModal, edit, tipo}) => {
    return ( 
        <div className="cont-btns">
            <div className="btn-cancelar" onClick={()=>setRenderModal('')}>
                {!edit ? "Cerrar" : "Cancelar"}
            </div>

            {edit &&
                <div className="btn-create" onClick={handleSubmit}>Actualizar {tipo}</div>
            }
        </div>
     );
}
 
export default FormEditBtns;