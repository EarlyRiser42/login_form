import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';

const Login = ({ modals }) => {
  // 유저 정보 전체
  const [user_data, setUser_data] = useState([]);
  // 페이지 현재 상태
  const [page, setPage] = useState(1);

  const handleNextStep = (data) => {
    setUser_data({ ...user_data, ...data });
    setPage(page + 1);
  };

  return (
    <div>
      <Modal>
        <div className="login-modal"></div>
      </Modal>
    </div>
  );
};

export default Login;
