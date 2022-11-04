import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ScrollToTop from './ScrollToTop';
import Operaciones from './views/Operaciones/Operaciones'
import Clientes from './views/Clientes/Clientes'
import Ordenes from './views/Ordenes/Ordenes'
import OrdenesJuan from './views/OrdenesJuan/OrdenesJuan'
import Proveedores from './views/Proveedores/Proveedores'
import Cajas from './views/Cajas/Cajas'
import Facturas from './views/Facturas/Facturas'
import Cambios from './views/Cambios/Cambios'
import Cash from './views/Cash/Cash'
import Inicio from './views/Inicio/Inicio';
import Cierre from './views/Cierre/Cierre';
import Config from './views/Config/Config';
import Depositos from './views/Depositos/Depositos';
import ApartadoCliente from './views/ApartadoCliente/ApartadoCliente';
import LiquidarTransferencias from './components/LiquidarTransferencias/LiquidarTransferencias';
import { verifyUser } from './api';
import { AppProvider } from './contexts/AppContext';
import Login from './views/Login/Login'
import MainLayout from './layouts/MainLayout';
import './Generales.css'


const App = () => {

    const [activeTab, setActiveTab] = useState('operaciones')
    const [user, setUser] = useState()

    useEffect(()=>{
        verifyUser().then((res)=>setUser(res))
    }, [])


    function render(){

        return <Router>
                  <AppProvider>
                    <ScrollToTop/>
                    <Switch>
                        <Route exact path="/">
                            <MainLayout>
                                <Inicio setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/operaciones">
                            <MainLayout>
                                <Operaciones setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/clientes">
                            <MainLayout>
                                <Clientes setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/cliente/:id">
                            <MainLayout>
                                <ApartadoCliente setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/ordenes">
                            <MainLayout>
                                <Ordenes setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/ordenesjuan">
                            <MainLayout>
                                <OrdenesJuan setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/proveedores">
                            <MainLayout>
                                <Proveedores setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/cambios">
                            <MainLayout>
                                <Cambios setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/cajas">
                            <MainLayout>
                                <Cajas setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/cash">
                            <MainLayout>
                                <Cash setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/facturas">
                            <MainLayout>
                                <Facturas setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/cierre">
                            <MainLayout>
                                <Cierre setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/login">
                            <MainLayout>
                                <Login />
                            </MainLayout>
                        </Route>
                        <Route path="/config">
                            <MainLayout>
                                <Config setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/depositos">
                            <MainLayout>
                                <Depositos setActiveTab={setActiveTab} user={user} />
                            </MainLayout>
                        </Route>
                        <Route path="/liquidar">
                            <MainLayout>
                                <LiquidarTransferencias setRenderModal={{}} />
                            </MainLayout>
                        </Route>
                    </Switch>
                  </AppProvider>
              </Router>
    }

    return (
            render()        
    )

}   

export default App