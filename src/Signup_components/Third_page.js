import React, { useState } from 'react';

const Third_page = ({ onNext}) => {
    const [password, setPassword] = useState("");

    const handleNext = () => {
        // Step2 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
        onNext(password);
    };

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setPassword(value);

    };

    return (
        <div>
            <p>비밀번호가 필요합니다</p>
            <p>8자 이상이어야 합니다.</p>
            <input
                name="password"
                type="text"
                placeholder="비밀번호"
                required
                value={password}
                onChange={onChange}
            />
            <button disabled={password.length < 8} onClick={handleNext}>다음</button>
        </div>
    );
};

export default Third_page