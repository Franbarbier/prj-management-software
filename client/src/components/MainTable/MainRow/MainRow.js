import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import { getCleanRowType } from '../../../GlobalFunctions';
import {getCustomInformation, shouldStayClicked, shouldHaveNote, shouldBeFaved, shouldHaveActions, shouldHaveBulkSelect} from './utils';
import {favRow} from '../../../actions/globales';
import CeldaEstado from './CeldaEstado/CeldaEstado';
import ClickToCopy from '../../ClickToCopy/ClickToCopy';

import './MainRow.css';

const MainRow = ({tipo, campos, id, row_data, setClickedRow, setActionRow, setConfirmData, setRenderModal, clickedRow, bulk, setBulk}) => {

    const[refreshRow, setRefreshRow] = useState(null)
    const[clickedClass, setClickedClass] = useState('')

    var [campo_to_dbvalue, tipo_modal_edit] = getCustomInformation(tipo, row_data)
    
    const dispatch = useDispatch()

    useEffect(()=>{
        if(clickedRow){
            if(shouldStayClicked(tipo)){               
                if(clickedRow._id === row_data._id){
                    setClickedClass('clicked-row')
                }else{
                    setClickedClass('')
                }
            }

        }
    })  

    function handleClickRow(row_data){
        if(shouldHaveActions(tipo)){
            setClickedRow(row_data)
        }
    }

    function handleBulkSelector(row_data, e){
        e.stopPropagation();
        if ( e.target.closest(".main-row").classList.contains("rowSelected")) {
            let copyBulk = [...bulk];
            for(let c in copyBulk){
                let row = copyBulk[c]
                if(row._id === row_data._id){
                     copyBulk.splice(c, 1)
                     setBulk(copyBulk)
                     break
                }
            }
            e.target.closest(".main-row").classList.remove("rowSelected")
            e.target.closest(".main-row").querySelector('.bulkSelect').classList.remove("bulkSelected")
        }else{
            setBulk([...bulk, row_data])
            e.target.closest(".main-row").classList.add("rowSelected")
            e.target.closest(".main-row").querySelector('.bulkSelect').classList.add("bulkSelected")
        }
    }

    function handleClickTrash(){
        setRenderModal({type:'confirm-delete'})
        setActionRow(row_data)
    }

    function handleClickFav(){
        let fav_status = 1;
        if(row_data.fav_status == 1){
            fav_status = 0;
        }
        dispatch(favRow({id: row_data._id, tipo: tipo, fav_status: fav_status}))
        row_data.fav_status = fav_status
        setRefreshRow(Date.now())
    }

    let [fav, fav_img] = shouldBeFaved(row_data);

    let [note, note_img] = shouldHaveNote(row_data)

    function cell_content(campo_content, campo_name){
        if(campo_name === 'Estado') return <CeldaEstado setRefreshRow={setRefreshRow} setConfirmData={setConfirmData} tipo={tipo} id={id} content={campo_content} row_data={row_data} setRenderModal={setRenderModal} />
        if(campo_name.includes("ID") && campo_content.Valor?.length>0) return <ClickToCopy>{campo_content.Valor}</ClickToCopy>
        return campo_content.Valor
    } 

    function handleDoubleClick(){
        if(shouldHaveActions(tipo)) setRenderModal({type: tipo_modal_edit, data: row_data}) 
    }

    const bulkSelectorHTML = <div className="bulkSelect" onClick={(e) => handleBulkSelector(row_data, e)}>
                        <div>
                            <div>
                            </div>
                        </div>
                        </div>

    const corroborarHTML = <div className="corroborar">
                                <div>!</div>
                            </div>

    const rowActionsHTML = <div className="bold cell actions-cell" onClick={(e)=> e.stopPropagation()}>
                                <span className="action fav">
                                    <img src={"imgs/"+fav_img+".svg"}  alt="" onClick={handleClickFav} />
                                </span>
                                <span className="action note">
                                    <img src={"imgs/"+note_img+".svg"}  alt="" />
                                    {note_img == 'has-note' && 
                                    <div className="nota-modal">
                                        <div>
                                            {row_data.nota}
                                        </div>
                                    </div>
                                    }
                                </span>
                                <span className="action trash">
                                    <img src="imgs/trash.svg" onClick={handleClickTrash} alt="" />
                                </span>
                            </div>

    const celdaHTML = (campo) =>{
                    const cellContent = cell_content(campo_to_dbvalue[campo], campo);
                    return <div className={campo_to_dbvalue[campo].Tipo + " cell "} key={campo} title={typeof cellContent === "string" && cellContent}>
                        {campo=='Monto' && <span className="divisa"> </span>}   
                        {cellContent}
                    </div>
                }

    return( 
            <div className={(row_data.recibo && "tipo_recibo") + " main-row " + fav + " " + note +  " " + clickedClass + " " +((row_data?.operacion?.corroborar || row_data?.corroborar) && " main-row__corroborar") + ` tipo-${getCleanRowType(tipo)}`} id={id} onClick={() => handleClickRow(row_data)} onDoubleClick={()=>handleDoubleClick()}>

                { (row_data?.operacion?.corroborar || row_data?.corroborar) &&
                corroborarHTML
                }

                {shouldHaveBulkSelect(tipo) && bulkSelectorHTML }

                {campos.map((campo)=>(
                    celdaHTML(campo)
                ))}

                {shouldHaveActions(tipo) && rowActionsHTML }
                
            </div>
    )
}

export default MainRow