import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import { login } from '../../actions/users'

import "./Login.css";


const Login = () => {

    const [user, setUser] = useState({})
    const [loginStatus, setLoginStatus] = useState()

    const dispatch = useDispatch()
    
    function handleLogin(e){

        e.preventDefault()
        dispatch(login(user))
    
    }

    var state = useSelector(state => state)

    useEffect(()=>{
        if(state.users){
            if(state.users.login){
                if(state.users.login.error === 1){
                    setLoginStatus("not found")
                }
            }
        }
    })


    return(
        
        <section id="login-view">

            <div id="login-container">


                <form action="" id="login-form" onSubmit={(e)=>handleLogin(e)}>
                    <h3>Ingresar a PRJ</h3>
                    
                    <input type="email" name="email" id="email" onChange={(e)=>setUser({...user, mail: e.target.value})} defaultValue={""} />
                    <input type="password" name="password" id="password" onChange={(e)=>setUser({...user, password: e.target.value})} defaultValue={""} />
                    <input type="submit" value="ingresar" name="ingresar" id="ingresar" onClick={(e)=>handleLogin(e)} />

                    {loginStatus === "not found" &&
                        <div className="form-msj">Usuario no encontrado</div>
                    }

                </form>     

            </div>

        </section>
        
    )
}

export default Login;