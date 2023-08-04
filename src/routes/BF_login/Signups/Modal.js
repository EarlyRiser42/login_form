import React from 'react';
import './Modal.css';


const Modal = ({ modals, children}) => {
    const divClassName = modals ? "modalDiv" : "modalDiv_notfromAuth";
    return (

        <div className={divClassName}>
            <div className="modal">
                {children}
            </div>
        </div>
    );
};

export default Modal;
