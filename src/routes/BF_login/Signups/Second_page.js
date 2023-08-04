import React, {useEffect, useState} from 'react';
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";

const Second_page = ({ onNext, onPrev, user_data}) => {
    // 유저 정보(이름, 개인정보)
    const [checked, setChecked] = useState(true);

    useEffect(() => {
        if(user_data.checked){
            setChecked(user_data.checked);
        }
    }, []);

    const handleNext = () => {
        // Step1 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
        onNext({checked});
    };

    const handlePrev = () => {
        onPrev();
    }

    const checkHandled = () => {
        setChecked(!checked);
    }

    return (
        <div>
            <div>
                <div>
                    <button onClick={handlePrev}>←</button>
                    <h3>4단계 중 2단계</h3>
                </div>
                <p>트위터 환경을 맞춤 설정하세요</p>
                <p>웹에서 트위터 컨텐츠가 표시되는 위치를 추적하세요</p>
                <div>
                    <p>트위터는 이 데이터를 이용해 사용자 경험을 맞춤 설정합니다.</p>
                    <p>이 웹브라우징 기록은 절대 사용자 이름, 이메일 또는 전화번호와 함께 저장되지 않습니다.</p>
                    <input type={"checkbox"} checked onChange={(e) => checkHandled(e)}></input>
                </div>
                <p>가입하면 트위터의 운영원칙, 개인정보 처리방침 및 쿠키 사용에 동의하게 됩니다. 트위터에서는 개인정보 처리방침에 명시된 목적에 따라 이메일 주소 및 전화번호 등 내 연락처 정보를 사용할 수 있습니다. 자세히 알아보기</p>
            </div>
            <button onClick={handleNext}>다음</button>
        </div>
    );
};

export default Second_page