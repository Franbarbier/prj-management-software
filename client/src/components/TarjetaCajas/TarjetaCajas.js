import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import { useAppContext } from '../../contexts/AppContext';
import { getBalancesCajas } from '../../actions/reportes'
import TarjetaData from '../TarjetaData/TarjetaData';

import './TarjetaCajas.css'

const TarjetaCajas = () => {

    const {oficina} = useAppContext()
    
    var tarjetaData = [
        {
            titulo: '',
            prefijo: '',
            sufijo: 'K',
            numero: "",
            descr: 'ARS'
        },
        {
            titulo: '',
            prefijo: '',
            sufijo: 'K',
            numero: "",
            descr: 'EUR'
        },
        {
            titulo: '',
            prefijo: '',
            sufijo: 'K',
            numero: "",
            descr: 'USD'
        }
    ]

    const [data, setData] = useState(tarjetaData)

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getBalancesCajas())
    }, [])
    
    const cajas = useSelector(state => state.reportes.cajas)
    
    useEffect(()=>{
        if(cajas!==undefined){
            updateCajas()
        }
    }, [oficina, cajas])

    function updateCajas(){
        let copy_tarjeta_data = [...tarjetaData]
        for(let index in Object.keys(cajas)){
            copy_tarjeta_data[index].numero = (cajas[oficina]?.[copy_tarjeta_data[index].descr]?.['balance'] / 1000).toFixed(2)
        }
        setData(copy_tarjeta_data)
    }

    return(
        <TarjetaData tarjetaData={data} titulo="Cajas" />
    )
}

export default TarjetaCajas