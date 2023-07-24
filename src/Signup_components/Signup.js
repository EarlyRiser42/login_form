import React, {useState, useEffect} from 'react';
import First_page from "./First_page";
import Second_page from "./Second_page";
import Third_page from "./Third_page";
import Fourth_page from "./Fourth_page";
import Fifth_page from "./Fifth_page";
import Modal from "./Modal";
const Signup = ({isModalOpen, setIsModalOpen}) => {
    // 유저 정보 전체
    const [userData, setUserData] = useState({});
    // 페이지 현재 상태
    const [page, setpage] = useState(1);

    const handleNextStep = (data) => {
        setUserData({ ...userData, ...data });
        setpage(page + 1);
    };

    const handleSignupDone = (data) => {
        setUserData({ ...userData, ...data });
        console.log('회원가입 완료:', userData);
        // 여기서 서버로 회원가입 데이터를 보내는 등의 처리를 할 수 있습니다.
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            {isModalOpen && (
                <Modal showModal={isModalOpen} onClose={handleCloseModal}>
                    <div className="signup-modal">
                        {page === 1 && <First_page onNext={handleNextStep} />}
                        {page === 2 && <Second_page onNext={handleNextStep} />}
                        {page === 3 && <Third_page onNext={handleNextStep} />}
                        {page === 4 && <Fourth_page onNext={handleNextStep} />}
                        {page === 5 && <Fifth_page onDone={handleSignupDone} />}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Signup