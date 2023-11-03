import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal.jsx';

const Signup = () => {
  // 유저 정보 전체
  const [user_data, setUser_data] = useState([]);
  // 페이지 현재 상태
  const [page, setPage] = useState(1);

  const handleNextStep = (data) => {
    setUser_data({ ...user_data, ...data });
    setPage(page + 1);
  };

  const handlePrevStep = () => {
    setPage(page - 1);
  };

  const handleDone = () => {
    setPage(page + 1);
  };

  return (
    <div>
      <Modal></Modal>
    </div>
  );
};

export default Signup;
