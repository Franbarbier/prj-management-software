import React from 'react';

import ModalContainer from '../ModalContainer/ModalContainer';

import './Confirm.css'

const Confirm = ({text, setRenderModal, action}) => {

    return(
            <ModalContainer tipo="confirm" setRenderModal={setRenderModal}>

                <div id="" className="form-cargar modal-confirm" onClick={(e)=>e.stopPropagation()}>

                    <h2 style={{marginBottom: "15px"}}>{text}</h2>

                                      
                    <div style={{width: "100%"}}>

                        <div className="confirm-delete-btns">
                            <div className="btn-cancelar" onClick={()=>setRenderModal('')}>Cancelar</div>
                            <div className="btn-create" onClick={action}>Confirmar</div>
                        </div>

                    </div>
                    
                </div>


            </ModalContainer>
    )
}

export default Confirm