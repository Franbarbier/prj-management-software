import React, {useState, useMemo, useEffect, useRef} from 'react';
import { periodos, oficinas } from '../GlobalFunctions';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { getConfig, getCambioDia } from '../actions/config';
import { getClientes } from '../actions/clientes';
import { getProveedores } from '../actions/proveedores';
import { getOperaciones } from '../actions/operaciones';
import { getCuentas } from '../actions/cuentas';
import { getOrdenes } from '../actions/ordenes';

const AppContext = React.createContext();

export function AppProvider(props){

    const dispatch = useDispatch()
    const { pathname } = useLocation()
    const [oficina, setOficina] = useState(oficinas[0]);
    const [periodo, setPeriodo] = useState(periodos.default().rango)
    const [filtrosInitialized, setFiltrosInitialized] = useState(false)
    const ALL_TIME = periodos.get_rango_from_periodo(periodos.periodos[3])
    const [loadingOperaciones, setLoadingOperaciones] = useState(false) 
    const [loadingOrdenes, setLoadingOrdenes] = useState(false) 
    const [loadingClientes, setLoadingClientes] = useState(false) 
    const [loadingConfig, setLoadingConfig] = useState(false) 
    const [loadingProveedores, setLoadingProveedores] = useState(false) 
    const [loadingCuentas, setLoadingCuentas] = useState(false) 
    const [loadingCambioDia, setLoadingCambioDia] = useState(false) 
    const [notifications, setNotifications] = useState([])
    const setters = [setLoadingOperaciones, setLoadingOrdenes, setLoadingClientes, setLoadingConfig, setLoadingProveedores, setLoadingCuentas, setLoadingCambioDia]

    useEffect(()=>{
        setNotifications([])
    }, [pathname, periodo])

    useEffect(()=>{
        try{
            var filtrosGlobales = localStorage.getItem('filtrosGlobales')
            filtrosGlobales = JSON.parse(filtrosGlobales)
            filtrosGlobales?.oficina && setOficina(filtrosGlobales.oficina)
        }catch(e){
            console.log('Error al usar localStorage para acceder a filtrosGlobales')
        }
        setFiltrosInitialized(true)
    },[])

    useEffect(()=>{
        setAllLoading()
        if(!window.location.href.includes('login')){
            setAllLoading(true)
            dispatch(getConfig()).then(()=>setLoadingConfig(false))
            dispatch(getCambioDia()).then(()=>setLoadingCambioDia(false))
            dispatch(getOrdenes({params:{tipo: '', vista:'ordenes', periodo}})).then(()=>setLoadingOrdenes(false))
            dispatch(getOperaciones({params:{tipo: '', vista:'operaciones', periodo}})).then(()=>setLoadingOperaciones(false))
            dispatch(getClientes({params:{tipo: '', vista:'clientes', periodo:ALL_TIME}})).then(()=>setLoadingClientes(false))
            dispatch(getProveedores()).then(()=>setLoadingProveedores(false))
            dispatch(getCuentas()).then(()=>setLoadingCuentas(false))        
        }
    }, [pathname, periodo])

    function setAllLoading(){
        for(let setter of setters){
            setter(true)
        }
    }

    useEffect(()=>{
        try{
            filtrosInitialized && localStorage.setItem('filtrosGlobales', JSON.stringify({oficina, periodo}))
        }catch(e){
            console.log('Error al usar localStorage para guardar filtrosGlobales')
        }
    }, [oficina, periodo])

    const value = useMemo(()=>{
        return ({
            oficina,
            setOficina,
            periodo,
            setPeriodo,
            loading: {operaciones: loadingOperaciones, ordenes: loadingOrdenes, clientes: loadingClientes, cambio_dia: loadingCambioDia, proveedores: loadingProveedores, config: loadingConfig, cuentas: loadingCuentas},
            notifications,
            setNotifications
        })
    }, [oficina, periodo, loadingOperaciones, loadingOrdenes, loadingClientes, loadingCambioDia, loadingProveedores, loadingConfig, loadingCuentas, notifications])


    return <AppContext.Provider value={value} {...props} />

}

export function useAppContext(){
    const context = React.useContext(AppContext)
    if(!context){
        throw new Error("useAppContext must be inside AppContext provider")
    }
    return context;
}