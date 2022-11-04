import './FormHeader.css';

const FormHeader = ({edit, setEdit, tipo}) => {
    return ( 
        <div className="formHeader">
            <h2>
                {!edit ? "Info " : "Editar "} 
                {tipo}
            </h2>
            <div className="formHeader__editarBtn" onClick={()=>setEdit(!edit)}>
                {!edit ? "EDITAR" : "CANCELAR"}
            </div>
        </div>
     );
}
 
export default FormHeader;