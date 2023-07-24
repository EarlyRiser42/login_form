import React from 'react';
import './Modal.css';
import { Link } from "react-router-dom"

const Modal = ({ children, onClose, showModal }) => {
    return (
        <div className={`modal-overlay ${showModal ? 'show' : ''}`}>
            <div className="modal-content">
                <Link to={"/"}>
                    <button className="modal-close" onClick={onClose}>
                        X
                    </button>
                </Link>
                {children}
            </div>
        </div>
    );
};

export default Modal;
