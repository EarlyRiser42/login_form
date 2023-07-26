import React from 'react';
import './Modal.css';
import { Link, useNavigate } from "react-router-dom"

const Modal = ({ children}) => {
    const navigate = useNavigate();
    return (
        <div className="modalDiv">
            <div className="modal">
                <button  onClick={() => navigate(-1)}>
                    X
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
