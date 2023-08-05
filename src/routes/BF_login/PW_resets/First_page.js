import React, {useEffect, useState} from 'react';
import {fetchSignInMethodsForEmail, getAuth} from "firebase/auth";
import {Link} from "react-router-dom";

const First_page = ({onNext}) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setError(false);
        }, 3000); // 5초 후에 에러 메시지를 숨김

        // 컴포넌트가 unmount 될 때 타이머를 클리어하여 메모리 누수 방지
        return () => clearTimeout(timer);
    }, []);

    const EmailChange = async (event)  => {
        const {
            target: { value },
        } = event;
        setEmail(value);
    }


    const onClick = async () => {
        const auth = getAuth();
        await fetchSignInMethodsForEmail(auth, email)
            .then((result) => {
                if(result.length === 1){
                    setError(false);
                    onNext({email});
                }
                else{
                    setError(true);
                }
            }).catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage)
                setError(true);
                // ..
            });
        // Step1 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
    };

    return (
        <div>
            <div>
                <Link to={"/"}><button>X</button></Link>
            </div>
            <div>
                <span>내 X계정 찾기</span>
                <span>비밀번호를 변경하려면 계정에 연결된 이메일, 전화번호 또는 사용자 아이디를 입력해 주세요.</span>
            </div>
            <div>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={EmailChange}
                />
            </div>
            <div>
                <button disabled={!(error === false && email.length !== 0)} onClick={onClick}>다음</button>
            </div>
            <div>
                {error && <span>죄송합니다. 해당 계정을 찾을 수 없습니다.</span>}
            </div>
        </div>
    );
};

export default First_page