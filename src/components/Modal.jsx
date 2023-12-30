import React, { useEffect } from 'react';
import '../style/Modal.css';
import { toastTextState, ModalBackgroundGrayState } from '../util/recoil.jsx';
import { useRecoilState, useRecoilValue } from 'recoil';
import Toast from './toast.jsx';

const Modal = ({ children, className }) => {
  const [toastText, setToastText] = useRecoilState(toastTextState);
  const [modalBackground, setModalBackground] = useRecoilState(
    ModalBackgroundGrayState,
  );

  return (
    <div className={modalBackground ? 'modalGrayDiv' : 'modalDiv'}>
      <div className={className}>
        {children}
        {toastText && <Toast></Toast>}
      </div>
    </div>
  );
};

export default Modal;
