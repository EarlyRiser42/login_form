import React from 'react';
import './Modal.css';


const Modal = ({ page, children}) => {
    const divClassName = page < 5 ? "modalDiv" : "modalDiv_notfromAuth";
    return (

        <div className={divClassName}>
            <div className="modal">
                {children}
            </div>
        </div>
    );
};

export default Modal;
