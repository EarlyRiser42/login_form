import React from 'react';
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";

const Fourth_page = ({ onNext, onPrev, user_data, page, setPage }) => {
    const handlePrev = () => {
        onPrev();
    }

    const Signup = async (event) => {
        event.preventDefault();
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, user_data.email, user_data.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                onNext();
                console.log(user);
                console.log("회원가입 완료");
                // ...
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                //seterror(2);
                // ..
            });
    };

    const onClick = (event) => {
        const {
            target: { name },
        } = event;
        if(name === "name"){
            setPage(page-3);
        }
        else if(name === "email"){
            setPage(page-3);
        }
        else{
            setPage(page-3);
        }
    }

    return (
        <div>
            <div>
                <button onClick={handlePrev}>←</button>
                <h4>4단계 중 4단계</h4>
            </div>
            <div>
            <h3>계정을 생성하세요</h3>
            </div>
            <div>
                <h5>이름</h5>
                <input
                    name="name"
                    type="text"
                    placeholder="비밀번호"
                    value={user_data.name}
                    onClick={onClick}
                    onChange={onClick}
                />
                <img src={"img/greencheck.png"} alt={"greencheck"} width={20} />
            </div>
            <div>
                <h5>이메일</h5>
                <input
                    name="email"
                    type="text"
                    placeholder="이메일"
                    value={user_data.email}
                    onClick={onClick}
                    onChange={onClick}
                />
                <img src={"img/greencheck.png"} alt={"greencheck"} width={20}/>
            </div>
            <div>
                <h5>생년월일</h5>
                <input
                    name="birth"
                    type="text"
                    placeholder="생년월일"
                    value={user_data.year}
                    onClick={onClick}
                    onChange={onClick}
                />
                <img src={"img/greencheck.png"} alt={"greencheck"} width={20}/>
            </div>
            <button onClick={Signup}>가입</button>
        </div>

    );
};

export default Fourth_page