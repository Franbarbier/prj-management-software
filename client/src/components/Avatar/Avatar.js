import React, {useState, useEffect} from 'react';

import './Avatar.css'

const Avatar = ({avatar}) => {

    return(
            <div className="avatar-container">
                <div className="av-img">
                    <img src="imgs/avatar.svg" height="70px" />
                </div>
                <div className="av-info">
                    <div className="av-mainText">{avatar.mainText}</div>
                    <div className="av-secondaryText">{avatar.secondaryText}</div>
                </div>
            </div>
    )
}

export default Avatar