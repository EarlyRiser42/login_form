import React, { useState } from 'react';
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";

const Fifth_page = ({ onDone, user_data }) => {
    const [photo, setPhoto] = useState('');

    const handleDone = () => {
        // Step3 페이지에서 입력한 데이터를 저장하고 회원가입 완료
        onDone({ photo });
    };

    const Signup = async (event) => {
        event.preventDefault();
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, user_data.email, user_data.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                //seterror(2);
                // ..
            });
    };

    return (
        <div>
            <div>{user_data.name}</div>
            <div>{user_data.email}</div>
            <div>{user_data.year}</div>
            <div>{user_data.month}</div>
            <div>{user_data.day}</div>
            <input onClick={Signup} type="submit" value="가입" />
        </div>
    );
};

export default Fifth_page