import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { getOrdenesCliente } from '../../api';
import { getRealSaldoOrden } from '../../GlobalFunctions';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainTable from '../../components/MainTable/MainTable';
import './ApartadoCliente.css';

const ApartadoCliente = ({ setActiveTab, user }) => {

    const campos = ["Fecha", "ID Orden", "Importe"]
    const [loading, setLoading] = useState(false)
    const [ordenesCliente, setOrdenesCliente] = useState([]);
    const [saldoCliente, setSaldoCliente] = useState(0)
    
    const { id } = useParams();
    const clientes = useSelector(state => state?.clientes)
    const cliente = clientes.filter((client)=>client._id === id)[0]

    function calculateSaldoCliente(){
        if(ordenesCliente.length > 0){

            let montoRecibo = 0;
            let montoNoRecibo = 0;
            for(let orden of ordenesCliente){
                if(orden.recibo){
                    montoRecibo += getRealSaldoOrden(orden)
                }else{
                    montoNoRecibo += getRealSaldoOrden(orden)
                }
            }
            
            return (montoRecibo - montoNoRecibo).toFixed(2)
        }
    }

    useEffect(()=>{
        setLoading(true)
        getOrdenesCliente(id).then((res)=>{
            if(res.status === 201){
                setOrdenesCliente(res.data)
            }
            setLoading(false)
        })
    }, [id])

    useEffect(()=>{
        setSaldoCliente(calculateSaldoCliente())
    }, [ordenesCliente])

    

    return ( 
        <>
        <Sidebar vista="saldo cliente" setActiveTab={setActiveTab} user={user} />
        <div className="mainPaddingHoriz mainPaddingTop">
            <div className="saldoClienteHeader">
                <h1>{cliente?.nombre}</h1>
                <div>Saldo: USD<span>{saldoCliente}</span></div>
            </div>
            <section className="tablasSaldoCliente">
                <article>
                    <MainTable titulo="ordenes cliente" campos={campos} contenido={ordenesCliente.filter((orden)=>!orden.recibo)} loading={loading} />
                </article>
                <article>
                    <MainTable titulo="ordenes cliente" campos={campos} contenido={ordenesCliente.filter((orden)=>orden.recibo)} loading={loading} />
                </article>
            </section>
        </div>
        </>
     );
}
 
export default ApartadoCliente;