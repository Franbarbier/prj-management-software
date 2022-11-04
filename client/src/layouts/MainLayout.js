import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "../contexts/AppContext";
import './MainLayout.css';

const MainLayout = ({children}) => {

    
    return ( 
        <div className="mainLayout">
            {children}
            <Notifications />
        </div>
     );
}

export const Notifications = () => {

    const { notifications, setNotifications } = useAppContext();
    
    const Notification = ({notification}) => {

        const [show, setShow] = useState(false)
        const TIME_ON_SCREEN = 3500

        useEffect(()=>{
            setShow(true)
            let timeout = setTimeout(()=>{
                setShow(false)
                setNotifications([])
            }, TIME_ON_SCREEN)
            return ()=>{
                clearTimeout(timeout)
            }
        }, [])

        function getActionText(){
            if(notification.action === "create"){
                return "creada"
            }else if(notification.action === "delete"){
                return "eliminada"
            }else if(notification.action === "edit"){
                return "actualizada"
            }
            if(notification.type === "operacion" || notification.type === "orden"){
                return "creada"
            }
            return "creado"
        }

        return (
            <div className={`notifications__notification notifications__notification-${notification.action} ${!show ? "notifications__notification-hidden" : ""}`}>
                <span className="entity_type">{notification.entity} {notification.type}</span> {getActionText()} con éxito.
            </div>
        )
    }

    return (
        <div className="notifications">
            <div className="notifications__container">
                {notifications.map((notification)=>
                    <Notification notification={notification} />
                )}
            </div>
        </div>
    )

}
 
export default MainLayout;