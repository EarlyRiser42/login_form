import React, {useEffect, useState} from 'react';
import {fetchSignInMethodsForEmail, getAuth, sendPasswordResetEmail} from "firebase/auth";
import {Link, useNavigate } from "react-router-dom"
import {authService, firebaseInstance} from "../../../fbase";

const First_page = ({ onNext, setPage}) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setError(false);
        }, 3000); // 5초 후에 에러 메시지를 숨김

        // 컴포넌트가 unmount 될 때 타이머를 클리어하여 메모리 누수 방지
        return () => clearTimeout(timer);
    }, []);

    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;
        let provider;
        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        await authService.signInWithPopup(provider);
        navigate("/");
    };

    const handleNext = async () => {
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

    const EmailChange = async (event)  => {
        const {
            target: { value },
        } = event;
        setEmail(value);
    }

    return (
        <div>
            <div>
                <Link to={"/"}><button>X</button></Link>
            </div>
            <div>
                <span>X 가입하기</span>
            </div>
            <div>
                <button name="google" onClick={onSocialClick}>Google 계정으로 로그인</button>
                <button name="github" onClick={onSocialClick}>Github으로 로그인</button>
            </div>
            <div>
                <div className={"line"}></div>
                <span>또는</span>
                <div className={"line"}></div>
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
                <button onClick={handleNext}>다음</button>
            </div>
            <div>
                <Link to={"/pwreset"}><button>비밀번호를 잊으셨나요?</button></Link>
            </div>
            <div>
                <span>계정이 없으신가요?</span>
                <Link to={"/signup"}><span>가입하기</span></Link>
            </div>
            <div>
                {error && <span>죄송합니다. 해당 계정을 찾을 수 없습니다.</span>}
            </div>
        </div>
    );
};

export default First_page