import React from "react";
import Error404 from '../assets/404.png'

const NotFound = () => {
    return (
        <>
            <div className="position-relative h-50 w-50">
                <img src={Error404} alt="404" className="img-fluid" style={{position:'fixed', top: '50%', left:'50%', transform: 'translate(-50%, -50%)', width: '65%'}}/>
            </div>
        </>
    )
}

export default NotFound