import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal.jsx';
import FirstPage from '../components/Login/FirstPage.jsx';
import SecondPage from '../components/Login/SecondPage.jsx';
import { useRecoilState } from 'recoil';
import { ModalOpenState } from '../util/recoil.jsx';

const Login = () => {
  // 전역변수 recoil
  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);
  // 지역변수 - 유저 정보 전체
  const [user_data, setUser_data] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsModalOpen(true);
    return () => {
      setIsModalOpen(false);
    };
  }, []);

  const handleNextStep = (data) => {
    setUser_data({ ...user_data, ...data });
    setPage(page + 1);
  };
  console.log(page);
  return (
    <div>
      <Modal className={'LoginModal'}>
        <div className="login-modal">
          {page === 1 && <FirstPage onNext={handleNextStep} />}
          {page === 2 && <SecondPage user_data={user_data} />}
        </div>
      </Modal>
    </div>
  );
};

export default Login;
