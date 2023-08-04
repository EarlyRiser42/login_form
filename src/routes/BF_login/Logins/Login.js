import React, {useEffect, useState} from 'react';
import Modal from '../Signups/Modal';
import First_page from "./First_page";
import Second_page from "./Second_page";

const Login = ({modals}) => {
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
            <Modal modals={modals}>
                <div className="login-modal">
                    {page === 1 && <First_page onNext={handleNextStep} user_data={user_data} />}
                    {page === 2 && <Second_page  user_data={user_data}/>}
                </div>
            </Modal>
        </div>
    );
};

export default Login