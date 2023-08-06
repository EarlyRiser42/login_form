import React, {useState}  from "react";
import { Link,  useLocation } from "react-router-dom"
import { authService, firebaseInstance } from "fbase";

const Auth = ({setSigning, setModals}) => {
    // modal 뒷배경
    const location = useLocation();
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
    };

    return (
        <div>
            <Link to={"/signup"} state={{background: location}} ><button onClick={() => {setSigning(true); setModals(true);}}> 계정 만들기 </button></Link>
            <Link to={"/login"} state={{background: location}} ><button onClick={() => {setModals(true);}}> 로그인 </button></Link>
            <button name="google" onClick={onSocialClick}>Google 계정으로 가입하기</button>
            <button name="github" onClick={onSocialClick}>Github으로 가입하기</button>
        </div>
    );
};
export default Auth;