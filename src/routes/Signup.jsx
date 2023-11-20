import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal.jsx';
import FirstPage from '../components/Signup/FirstPage.jsx';
import SecondPage from '../components/Signup/SecondPage.jsx';
import ThirdPage from '../components/Signup/ThirdPage.jsx';
import FourthPage from '../components/Signup/FourthPage.jsx';
import FifthPage from '../components/Signup/FifthPage.jsx';
import SixthPage from '../components/Signup/SixthPage.jsx';
import { useRecoilState } from 'recoil';
import { isSigning, ModalOpenState } from '../util/recoil.jsx';

const Signup = () => {
  // 전역변수 recoil
  const [signing, setSigning] = useRecoilState(isSigning);
  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);
  // 유저 정보 전체
  const [user_data, setUser_data] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsModalOpen(true);
    setSigning(true);
    return () => {
      setIsModalOpen(false);
      setSigning(false);
    };
  }, []);

  const handleNextStep = (data) => {
    setUser_data({ ...user_data, ...data });
    setPage(page + 1);
  };

  const handlePrevStep = () => {
    setPage(page - 1);
  };

  return (
    <div>
      <Modal className={'SignUpModal'}>
        {page === 1 && (
          <FirstPage onNext={handleNextStep} user_data={user_data} />
        )}
        {page === 2 && (
          <SecondPage
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            user_data={user_data}
          />
        )}
        {page === 3 && (
          <ThirdPage
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            user_data={user_data}
          />
        )}
        {page === 4 && (
          <FourthPage
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            user_data={user_data}
            page={page}
            setPage={setPage}
          />
        )}
        {page === 5 && (
          <FifthPage user_data={user_data} onNext={handleNextStep} />
        )}
        {page === 6 && <SixthPage user_data={user_data} />}
      </Modal>
    </div>
  );
};

export default Signup;
