import React from 'react';

import './Tab.css';

const Tab = ({ full_data, index, setActiveTab, activeTab}) => {

    return(
            <>
                <li onClick={()=>setActiveTab(index)}  className={activeTab!=null && activeTab === index && 'tab-active'} ><span>{full_data.divisa}</span>&nbsp;<p>{full_data.balance}</p></li>
            </>
    )
}

export default Tab;