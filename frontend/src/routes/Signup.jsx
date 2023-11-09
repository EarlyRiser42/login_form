import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal.jsx';
import FirstPage from '../components/Signup/FirstPage.jsx';
import SecondPage from '../components/Signup/SecondPage.jsx';

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
      <Modal>
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
      </Modal>
    </div>
  );
};
/*

        {page === 3 && (
          <Third_page
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            user_data={user_data}
          />
        )}
        {page === 4 && (
          <Fourth_page
            onNext={handleDone}
            onPrev={handlePrevStep}
            user_data={user_data}
            page={page}
            setPage={setPage}
            setModals={setModals}
          />
        )}
        {page === 5 && (
          <Fifth_page onNext={handleNextStep} user_data={user_data} />
        )}
        {page === 6 && (
          <Sixth_page user_data={user_data} setSigning={setSigning} />
        )}
 */
export default Signup;
