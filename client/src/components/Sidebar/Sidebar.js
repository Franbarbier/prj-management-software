import React from 'react';
import { Link } from 'react-router-dom';
import {logout} from '../../actions/users';

import './Sidebar.css'

const Sidebar = ({vista, setActiveTab, user}) => {

    const tabs = ['Inicio', 'Operaciones', 'Ordenes', 'OrdenesJuan', 'Depositos', 'Cambios', 'Cajas', 'Clientes', 'Proveedores', 'Facturas', 'Cash', 'Cierre', 'Config']

    return(
            <>

                <div id="sidebar">

                    <div id="user-info">
                        <div id="u-pp">
                            <img src="" alt="" />
                        </div>
                        <div id="u-nombre">{user?.name}</div>
                        <div id="u-logout" onClick={logout}>
                            Cerrar sesión
                        </div>
                    </div>

                    <nav id="navigation-menu">
                        {tabs.map((tab)=> (
                        <Link to={tab.toLocaleLowerCase() !== 'inicio' ? '/'+tab.toLocaleLowerCase() : '/'} key={tab}>
                            <div id={"tab-" + tab.toLowerCase()} className={tab.toLowerCase()===vista.toLowerCase() ? "nav-tab active-tab" : "nav-tab"} onClick={() => setActiveTab(tab.toLowerCase())}>{tab}</div>
                        </Link>
                            ))}
                    </nav>

                </div>
            </>
    )
}

export default Sidebar