import React, {useState, useEffect} from 'react';
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import {Link} from "react-router-dom";

const Signup = () => {
    const next = (name, email, year, month, day) => {
        setfirstpage(false);
        return(
            <div>
                <div>{name}</div>
                <div>{email}</div>
                <div>{year}</div>
                <div>{month}</div>
                <div>{day}</div>
                <input onClick={Signup} type="submit" value="가입" />
            </div>
    )
    };

    const years = [
        { value: "apple", name: "year" },
        { value: "banana", name: "year" },
        { value: "orange", name: "year" },
    ];
    const months = [
        { value: "apple", name: "month" },
        { value: "banana", name: "month" },
        { value: "orange", name: "month" },
    ];
    const days = [
        { value: "apple", name: "day" },
        { value: "banana", name: "day" },
        { value: "orange", name: "day" },
    ];
    const [year, setyear] = useState('1998');
    const [month, setmonth] = useState('04');
    const [day, setday] = useState('16');
    const [name, setname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [comp, setComp] = useState();
    const [isregisterd, setisregisterd] = useState(0);
    const [firstpage, setfirstpage] = useState(true);
    const [error, seterror] = useState(0);
    const dateChange = (event) => {
        console.log(event)
        const {
            target: { name, value },
        } = event;
        if (name === "year") {
            setyear(value);
        } else if (name === "month") {
            setmonth(value);
        }
        else{
            setday(value);
        }
    }
    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "password") {
            setPassword(value);
        }
        else{
            setname(value);
        }
    };

    const emailchange = async (event)  => {
        const {
            target: { name, value },
        } = event;
        setEmail(value);
        const auth = getAuth();
        await fetchSignInMethodsForEmail(auth, value)
            .then((result) => {
                console.log(result, result.length)
                setisregisterd(result.length);
                seterror(0);
            }).catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage)
            seterror(1);
            // ..
        });
    }
    const SelectBox = (props) => {
        return (
            <select>
                {props.options.map((option, index) => (

                    <option key={index}
                        value={option.value}
                        defaultValue={props.defaultValue}
                    >
                        {option.value}
                    </option>
                ))}
            </select>
        );
    };
    const Signup = async (event) => {
        event.preventDefault();
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                seterror(2);
                // ..
            });
    };

    return (
        <div>
            {
                firstpage ?
                    <>
                        <form >
                            <input
                                name="name"
                                type="text"
                                placeholder="이름"
                                required
                                value={name}
                                onChange={onChange}
                            />
                            <input
                                name="email"
                                type="text"
                                placeholder="이메일"
                                required
                                value={email}
                                onChange={emailchange}
                            />
                            <div>
                                {error === 1 && <p>올바른 이메일을 입력해 주세요.</p>}
                                {(error === 2 || isregisterd > 0) && <p>이미 등록된 이메일입니다.</p>}
                            </div>
                            <input
                                name="password"
                                type="password"
                                placeholder="비밀번호"
                                required
                                value={password}
                                onChange={onChange}
                            />
                            <SelectBox options={years} onChange={dateChange} defaultValue="1998"></SelectBox>
                            <SelectBox options={months} onChange={dateChange} defaultValue="04"></SelectBox>
                            <SelectBox options={days} onChange={dateChange} defaultValue="16"></SelectBox>
                        </form>
                        <button disabled={error === 0 && email.length && password.length && name.length !== 0 ? false : true} onClick={() => setComp(next(name, email, year, month, day))}>다음</button>
                    </>

                :
                <div children={comp} />
            }


        </div>
    );
};

export default Signup