import React, { useEffect } from 'react';
import '../style/Modal.css';
import { errorState } from '../recoil/recoil.jsx';
import { useRecoilState, useRecoilValue } from 'recoil';

const Modal = ({ children }) => {
  const [error, setError] = useRecoilState(errorState);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000); // reset the error after 3 seconds
    }
  }, [error, setError]);
  return (
    <div className="modalDiv">
      <div className="modal">{children}</div>
      {error && <div className={'errorMessageDiv'}>{error}</div>}
    </div>
  );
};

export default Modal;
