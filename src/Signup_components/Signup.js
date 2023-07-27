import React, {useState, useEffect} from 'react';
import First_page from "./First_page";
import Second_page from "./Second_page";
import Third_page from "./Third_page";
import Fourth_page from "./Fourth_page";
import Fifth_page from "./Fifth_page";
import Modal from "./Modal";

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
        setPage(page-1);
    }

    return (
        <div>
                <Modal>
                    <div className="signup-modal">
                        {page === 1 && <First_page onNext={handleNextStep} user_data={user_data}/>}
                        {page === 2 && <Second_page onNext={handleNextStep} onPrev={handlePrevStep} user_data={user_data}/>}
                        {page === 3 && <Third_page onNext={handleNextStep} onPrev={handlePrevStep} user_data={user_data} />}
                        {page === 4 && <Fourth_page onNext={handleNextStep} onPrev={handlePrevStep} user_data={user_data} page = {page} setPage={setPage}/>}
                        {page === 5 && <Fifth_page onNext={handleNextStep} user_data={user_data}/>}
                    </div>
                </Modal>
        </div>
    );
};

export default Signup