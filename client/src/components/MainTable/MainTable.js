import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import { useAppContext } from '../../contexts/AppContext';
import MainRow from './MainRow/MainRow'
import FormLoader from '../FormLoader/FormLoader'
import NoResults from '../../components/NoResults/NoResults'
import FiltroFecha from '../FiltroFecha/FiltroFecha';
import {tipos, estados, pagination, capitalize} from '../../GlobalFunctions';

import './MainTable.css'
import * as utils from './utils';
import Pagination from '../Pagination/Pagination';

const  MainTable = ({contenido, titulo, campos, setActionRow, table_size='1', subtitulo, setActiveSubtitulo, setConfirmData, setRenderModal, loading, bulkActions}) => {

    const {periodo, oficina} = useAppContext()
    const [filtros, setFiltros] = useState({tipo: '', buscar:'', estado:'', oficina, fecha:{periodo, fecha_desde:"", fecha_hasta:""}, fecha_entrega: {desde: "", hasta: ""}})
    const [clickedRow, setClickedRow] = useState(false);
    const[bulk, setBulk] = useState([])
    const [activePage, setActivePage] = useState(null)
    
    var ordenes = useSelector(state => state.ordenes) 
    var [virtualContenido, tipo_modal_create, rows_length] = utils.getCustomInformation(titulo, contenido, activePage, pagination, filtros, ordenes)

    useEffect(()=>{
        setFiltros({...filtros, oficina})
    }, [oficina])

    function handleOpenModal(tipo_modal_create){
        if(titulo == 'cajas'){   
            setActiveSubtitulo(subtitulo)
        }
        setRenderModal({type: tipo_modal_create})
    }

    function getEstadosKey(){
        if(titulo === "facturas" || titulo === "cash"){
            return "ordenes"
        }
        if(titulo === "cambios"){
            return "operaciones"
        }
        return titulo
    }
    
    const bulkActionsCounterHTML = () => <div className="bulk-actions">
                                        <div className="ba-counter">
                                        ({bulk.length})
                                        </div>
                                        {bulkActions.map((bulkAction, i)=>
                                        bulkAction.shouldBeShown(bulk) &&
                                        <div className="ba-action" onClick={()=>bulkAction.action(bulk, setBulk)} key={i}>{bulkAction.text}</div>
                                        )}
                                </div>

    const filtroTipoHTML = () => <select name="" className="filtro" id="f-tipo" onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}>
                            <option value="">Tipos</option>
                            {tipos[titulo].map((tipo)=>(
                                <option value={tipo} key={tipo}>{tipo}</option>
                                ))}
                            </select>

    const filtroEstadoHTML = () => <select name="" className="filtro" id="f-estado" onChange={(e) => setFiltros({...filtros, estado: e.target.value})}>
                        <option value="">Estados</option>
                        {estados[getEstadosKey()].map((estado)=>(
                            <option value={estado} key={estado}>{estado}</option>
                            ))}
                    </select>

    const filtroOrdenReciboHTML = () => <div className="filtro filtroOrdenRecibo">
        <input type="checkbox" checked={filtros?.hide_ordenes_recibo} onClick={(e)=> setFiltros({...filtros, hide_ordenes_recibo: !filtros.hide_ordenes_recibo})} /> Ocultar ordenes recibo
    </div>

    const createButtonHTML = <div id={"btn-cargar-" + titulo} className="btn-cargar" onClick={()=>handleOpenModal(tipo_modal_create)}>
                                <div>+</div>
                            </div>

    const renderRows = () => virtualContenido.map((row_data, index)=>(
        (row_data && index < pagination.ROWS_PER_PAGE) &&
        <MainRow key={row_data._id} setConfirmData={setConfirmData} tipo={titulo} subtipo={subtitulo} campos={campos} row_data={row_data} id={row_data._id} clickedRow={clickedRow} setClickedRow={setClickedRow} setActionRow={setActionRow} setRenderModal={setRenderModal} bulk={bulk} setBulk={setBulk} />
        )) 

    return(
            <>
                <main id="main-table-area" className={'size'+table_size}>
                    <div id="row-superior">
                        <h1>{capitalize(titulo)}</h1>
                        {utils.shouldHaveFiltros(titulo) &&
                        <div id="filtros">
                        <>
                            <div id="searchbar-cont" className="filtro">
                                <img src="../../imgs/lupita.svg" height="13px" id="f-searchbar" />
                                <input type="text" placeholder="Buscar" onChange={(e) => setFiltros({...filtros, buscar: e.target.value})} autoComplete="off" />
                            </div>

                            {utils.shouldHaveFiltroTipo(titulo) && 
                                filtroTipoHTML()
                            }                        
                            
                            { utils.shouldHaveFiltroEstado(titulo) &&
                                filtroEstadoHTML()
                            }

                            { utils.shouldHaveFiltroFechaEntrega(titulo) && 
                                <FiltroFecha label="Fecha Entrega" param="fecha_entrega" filtros={filtros} setFiltros={setFiltros} />
                            }

                            { utils.shouldHaveFiltroOrdenRecibo(titulo) &&
                                filtroOrdenReciboHTML()
                            }

                        </> 
                        </div>
                        }
                        
                        {(bulk.length > 0 && bulkActions) && 
                            bulkActionsCounterHTML(bulkActions)
                        }

                    </div>
                    
                    {utils.shouldHaveCreateButton(titulo) && 
                        createButtonHTML
                    }
                    <div id="table-cont">
                        <div id="table">
                            <div id="ths">
                                {campos.map((campo)=>(
                                    <div className="th cell" key={campo}>{campo}</div>
                                    ))}
                                <div className="th cell"></div>
                            </div>
                            {loading &&
                                <FormLoader/>
                            }          
                            <div id="tds" className={"tds-"+titulo.toLowerCase()}>
                                {renderRows()}
                            </div>
                        </div>
                    </div>

                    {(!loading && contenido.length<=0) ?
                        <NoResults />
                    :

                    utils.shouldHavePagination(titulo) &&
                        <Pagination rows_length={rows_length} setActivePage={setActivePage} />
                    }

                </main>
            </>
    )
}

export default MainTable;