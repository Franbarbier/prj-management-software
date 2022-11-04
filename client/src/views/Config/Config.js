import * as api from '../../api';

import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar';
import { getHistorialCambios } from '../../api';
import { updateConfig } from '../../actions/config';
import { hasCategoria } from '../../GlobalFunctions';

import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

import "./Config.css";


const Config = ({setActiveTab, user}) => {

    const dispatch = useDispatch()

    const[renderModal, setRenderModal] = useState({type:'', data:{}})
    const [config, setConfig] = useState(useSelector(state => state.config))
    const [ultimosCambios, setUltimosCambios] = useState()

    const [showCategorias, setShowCategorias] = useState({ingresos:false, egresos:false, categorias_in_cierre: false})

    var config_listener = useSelector(state => state.config)
    var stato = useSelector(state => state)

    const cat_ingresos_input = useRef()
    const cat_egresos_input = useRef()

    // Array que tiene categorias de ingresos y egresos para iterar en "Categorías en Cierre PRJ"
    const [allCategorias, setAllCategorias] = useState([])

    useEffect(()=>{
        getHistorialCambios({params:{limit: 10}}).then((res)=>
            setUltimosCambios(res.data)
        )
    }, [])

    useEffect(()=>{

        showCategorias.ingresos && cat_ingresos_input.current.focus()
        showCategorias.egresos && cat_egresos_input.current.focus()

    }, [showCategorias])

    useEffect(()=>{
        if(JSON.stringify(config_listener) !== JSON.stringify(config)){
            setConfig(config_listener)     
        }
   
    })

    useEffect(()=>{
            if(Array.isArray(config.categorias_egresos) && Array.isArray(config.categorias_ingresos)){

                let all_categorias = []
                for(let i in config.categorias_ingresos){
                    let cat = config.categorias_ingresos[i]
                    if(!hasCategoria(config.categorias_in_cierre.cierre_prj, {categoria: cat, tipo: "ingreso"})){
                        all_categorias.push({categoria: cat, tipo: 'ingreso'})
                    }
                }
                
                for(let e in config.categorias_egresos){
                    let cat = config.categorias_egresos[e]
                    if(!hasCategoria(config.categorias_in_cierre.cierre_prj, {categoria: cat, tipo: "egreso"})){
                        all_categorias.push({categoria: cat, tipo: 'egreso'})
                    }
                }

                setAllCategorias(all_categorias)
            }
    }, [config])

    // Cada vez que cambia la variable de estado "config", actualizamos config en Mongo
    useEffect(()=>{
        dispatch(updateConfig(config))
    }, [config])

    function createCat(input){

        if(input.current.value !== "" && !config["categorias_"+input.current.name].includes(input.current.value)){
            
            if(window.confirm("Estás seguro que querés crear esta nueva categoría?")){
                let copyConfig = {...config}
                copyConfig["categorias_"+input.current.name].push(input.current.value)
                setConfig(copyConfig)
                input.current.value = ""
            }

        }else{
            alert("El nombre de la categoría no puede estar vacío ni ser idéntico al de otra categoría ya creada.")
        }

    }

    function addCatToCierre(input){

            if(input.target.value !== ""){

                let copyConfig = {...config}
                let cat = JSON.parse(input.target.value)
                copyConfig.categorias_in_cierre.cierre_prj.push({categoria: cat.categoria, tipo: cat.tipo})
                setConfig(copyConfig)
                setShowCategorias({...showCategorias, categorias_in_cierre: false})
            }

    }

    function removeCatFromCierre(cat, cierre){
        let copyConfig = {...config}
        for(let c in config.categorias_in_cierre[cierre]){
            let categoria = config.categorias_in_cierre[cierre][c]
            if(categoria.tipo === cat.tipo && categoria.categoria === cat.categoria){
                copyConfig.categorias_in_cierre[cierre].splice(c,1)
                break
            }
        }

        setConfig(copyConfig)


    }

    function removeCat(cat, type){
        if(window.confirm("Estas seguro que deseas ELIMINAR la categoría: " + cat+"?")){

            if(window.confirm("Estas REALMENTE seguro de que queres eliminar la categoría " + cat + "?")){   
                let copyConfig = {...config}
                let index = copyConfig["categorias_"+type].indexOf(cat)
                copyConfig["categorias_"+type].splice(index, 1)
                setConfig(copyConfig)
            }
        }
    }


    return(
        <>  
            {renderModal.type === 'confirm-delete' &&
                <ConfirmDelete tipo="Categoria" setRenderModal={setRenderModal} />
            }
            <Sidebar vista="config" setActiveTab={setActiveTab} user={user} />
            <div id="config-view">
                <div className="mainPaddingHoriz mainPaddingTop">
                    <div className="config-container">
                        <div className="config-label">Categorías Ingresos</div>
                        <div className="cats-container">
                            {config.categorias_ingresos?.map((cat)=>
                                <div className="cat" key={Date.now() + cat}>
                                    <div>
                                        {cat}
                                    </div>

                                    <div className="r-tag" onClick={()=>removeCat(cat, "ingresos")}>
                                        x
                                    </div>
                                </div>
                            )}
                        </div>
                        {showCategorias.ingresos ?
                            <div className="add-cat-form">
                                <input ref={cat_ingresos_input} type="text" name="ingresos" id="" /><div className="btn-create" onClick={()=>createCat(cat_ingresos_input)}>Crear</div>
                            </div>
                        :
                        <div className="add-new" onClick={()=>setShowCategorias({...showCategorias, ingresos: true})}>
                            añadir nueva categoría
                        </div>
                        }
                    </div>
                    <div className="config-container">
                        <div className="config-label">Categorías Egresos</div>
                        <div className="cats-container">
                            {config.categorias_egresos?.map((cat)=>
                                <div className="cat" key={Date.now() + cat}>
                                    <div>
                                        {cat}
                                    </div>

                                    <div className="r-tag" onClick={()=>removeCat(cat, "egresos")}>
                                        x
                                    </div>

                                </div>
                            )}
                        </div>
                        {showCategorias.egresos ?
                            <div className="add-cat-form">
                                <input ref={cat_egresos_input} type="text" name="egresos" id="" /><div className="btn-create" onClick={()=>createCat(cat_egresos_input)}>Crear</div>
                            </div>
                        :
                        <div className="add-new" onClick={()=>setShowCategorias({...showCategorias, egresos: true})}>
                            añadir nueva categoría
                        </div>
                        }
                    </div>
                
                    <div className="config-container">
                        <div className="config-label">Categorías en Cierre PRJ</div>
                            <div className="cats-container">
                                {config.categorias_in_cierre?.cierre_prj?.map((cat)=>
                                    <div className="cat" key={Date.now() + cat.categoria + cat.tipo}>
                                        <div>
                                            {cat.categoria}
                                        </div>

                                        <div className="r-tag" onClick={()=>removeCatFromCierre(cat, "cierre_prj")}>
                                            x
                                        </div>

                                    </div>
                                )}
                            </div>
                            {showCategorias.categorias_in_cierre ?
                            <select name="" id="" onChange={(e)=>addCatToCierre(e)}>
                                <option value=""></option>
                                {allCategorias?.map((cat)=>
                                <option value={JSON.stringify(cat)} key={Date.now() + cat.categoria + cat.tipo}>{cat.categoria + " - (" + cat.tipo + ")"}</option>
                                )}
                            </select>
                            :
                            <div className="add-new" onClick={()=>setShowCategorias({...showCategorias, categorias_in_cierre: true})}>
                                añadir nueva categoría
                            </div>
                            }
                    </div>

                    <div className="config-container">
                        <div className="config-label">Últimos cambios registrados</div>

                        <div className="cc-cambios-registrados">
                            
                            {ultimosCambios?.map((cambio) =>
                                <div className="cr-cambio">
                                    <div>
                                        <div className="cr-celda">
                                                {cambio.cambio.toFixed(2)}
                                        </div>
                                        
                                        <div className="cr-celda">
                                                {cambio.dia}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                        </div>    
                        
                    </div>

                </div>


            </div>
        </>
        
    )
}

export default Config;