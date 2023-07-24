import React, { useState } from 'react';

const Third_page = ({ onNext }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleNext = () => {
        // Step1 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
        onNext({ name, email });
    };

    return (
        <div>
            <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleNext}>다음</button>
        </div>
    );
};

export default Third_page