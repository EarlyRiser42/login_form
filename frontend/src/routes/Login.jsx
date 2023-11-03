import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal.jsx';
import FirstPage from '../components/Login/FirstPage.jsx';
import SecondPage from '../components/Login/SecondPage.jsx';

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
        <div className="login-modal">
          {page === 1 && <FirstPage onNext={handleNextStep} />}
          {page === 2 && <SecondPage user_data={user_data} />}
        </div>
      </Modal>
    </div>
  );
};

export default Login;
