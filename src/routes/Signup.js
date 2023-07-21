import React, {useState} from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {Link} from "react-router-dom";

const Signup = () => {
    const next = (name, email, year, month, day) => {
        console.log(name, email, year, month, day)
        return(
            <div>
                <div>{name}</div>
                <div>{email}</div>
                <div>{year}</div>
                <div>{month}</div>
                <div>{day}</div>
                <input type="submit" value="Sign up" />
            </div>
    )
    };
    /* const year = () => {
        const empty = []
        for(let i=1960; i<2024; i++){
            const cash = {}
            cash['value'] = i;
            empty.add(cash)
        }
        console.log(empty)
        return empty
    }
    */
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
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
        else{
            setname(value);
        }
    };
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
    const onSubmit = async (event) => {
        event.preventDefault();
        const auth = getAuth();
        console.log(auth)
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                // ..
            });
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    name="name"
                    type="text"
                    placeholder="name"
                    required
                    value={name}
                    onChange={onChange}
                />
                <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                />
                <SelectBox options={years} onChange={dateChange} defaultValue="1998"></SelectBox>
                <SelectBox options={months} onChange={dateChange} defaultValue="04"></SelectBox>
                <SelectBox options={days} onChange={dateChange} defaultValue="16"></SelectBox>
                <button onClick={() => setComp(next(name, email, year, month, day))}>next</button>
                <div children={comp} />
            </form>
        </div>
    );
};

export default Signup