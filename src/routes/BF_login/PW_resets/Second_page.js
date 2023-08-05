import React, {useEffect, useState} from 'react';
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import {Link} from "react-router-dom";

const Second_page = ({onNext, user_data}) => {
    const findpw = () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, user_data.email)
            .then(() => {
                onNext();
                // Password reset email sent!
                // ..
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
    }

    return(
        <div>
            <div>
                <Link to={"/"}><button>X</button></Link>
            </div>
            <div>
                <span>어떤 방법으로 인증 코드를 받으시겠어요?</span>
                <span>비밀번호를 변경하기 전에 본인임을 인증을 해야 합니다.</span>
                <span>먼저 인증 코드를 받을 기기를 선택해 주세요.</span>
            </div>
            <div>
                <span>{user_data.email}로 이메일 보내기</span>
                <img src={"img/bluecheck.png"} alt={"bluecheck"} width={20}/>
            </div>
            <div>
                액세스 권한이 없는 경우 X 고객지원팀에 문의해 주세요.
            </div>
            <div>
                <button onClick={findpw}>다음</button>
                <Link to={"/"}><button>취소</button></Link>
            </div>
        </div>
    );
}

export default Second_page