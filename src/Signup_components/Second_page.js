import React, { useState } from 'react';
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";

const Second_page = ({ onNext, user_data }) => {
    // 유저 정보(이름, 개인정보)

    const handleNext = () => {
        // Step1 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
        onNext(user_data.name, user_data.email);
    };


    return (
        <div>
            <button onClick={handleNext}>다음</button>
        </div>
    );
};

export default Second_page