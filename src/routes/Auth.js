import React, { useState}  from "react";
import { Link } from "react-router-dom"
import { authService, firebaseInstance } from "fbase";
import AuthForm from "components/AuthForm";
const Auth = ({setIsModalOpen}) => {
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

    const onClick = () => {
        setIsModalOpen(true);
    };

    return (
        <div>
            <AuthForm />
            <div>
                <Link to={"/signup"}><button onClick={onClick}>Sign up</button></Link>
                <button name="google" onClick={onSocialClick}>Continue with Google</button>
                <button name="github" onClick={onSocialClick}>Continue with Github</button>
            </div>
        </div>
    );
};
export default Auth;