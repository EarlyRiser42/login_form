import React, { useState } from 'react';

const Fourth_page = ({ onNext, user_data }) => {
    const handleNext = () => {
        // Step1 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
        onNext();
    };
    const onClick = () => {

    }
    return (
        <div>
            <div>
            <p>계정을 생성하세요</p>
            </div>
            <div>
                <p>이름</p>
                <input
                    name="name"
                    type="text"
                    placeholder="비밀번호"
                    value={user_data.name}
                    onClick={onClick}
                />
                <img src={"img/greencheck.png"} alt={"greencheck"} width={20} />
            </div>
            <div>
                <p>이메일</p>
                <input
                    name="email"
                    type="text"
                    placeholder="이메일"
                    value={user_data.email}
                    onClick={onClick}
                />
                <img src={"img/greencheck.png"} alt={"greencheck"} width={20}/>
            </div>
            <div>
                <p>생년월일</p>
                <input
                    name="birth"
                    type="text"
                    placeholder="생년월일"
                    value={user_data.year}
                    onClick={onClick}
                />
                <img src={"img/greencheck.png"} alt={"greencheck"} width={20}/>
            </div>
            <button onClick={handleNext}>가입</button>
        </div>

    );
};

export default Fourth_page