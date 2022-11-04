import React, {useState, useEffect} from 'react';

import './NoResults.css'

const NoResults = () => {

    return(
        <div className="no-results">
            <img src="imgs/empty-box.svg" width="100px" alt="" style={{opacity: .7}} />
            <div>no hay resultados :)</div>
        </div>
    )
}

export default NoResults