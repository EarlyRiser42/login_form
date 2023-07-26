import React, {useEffect, useState} from 'react';
import {fetchSignInMethodsForEmail, getAuth} from "firebase/auth";

const First_page = ({ onNext}) => {
    // 유저 정보(출생년도)
    const [year, setyear] = useState('1998');
    const [month, setmonth] = useState('04');
    const [day, setday] = useState('16');
    // 유저 정보(이름, 개인정보)
    const [name, setname] = useState("");
    const [email, setEmail] = useState("");

    // 에러 유무
    const [isregisterd, setisregisterd] = useState(0);
    const [error, seterror] = useState(0);

    const handleNext = () => {
        // Step1 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
        onNext({ name, email, year, month, day });
    };

    const generateYears = () => {
        const startYear = 1960;
        const currentYear = new Date().getFullYear();
        const years = [];

        for (let year = currentYear; year >= startYear; year--) {
            years.push({ value: year.toString(), name: "year" });
        }

        return years;
    };

    const generateDates = (date) => {
        const startDay = 1;
        const dates = [];

        for (let day = startDay; day <= date; day++) {
            if(date < 31){
                dates.push({ value: day.toString(), name: "month" });
            }
            else{
                dates.push({ value: day.toString(), name: "day" });
            }
        }
        return dates;
    }

    const years = generateYears();
    const months = generateDates(12);
    const days = generateDates(31);

    useEffect(() => {
        if(isregisterd !== 0){
            seterror(2);
        }
    }, [isregisterd]);

    const dateChange = (event) => {
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
            target: { value },
        } = event;
        setname(value);
    };

    const emailchange = async (event)  => {
        const {
            target: { value },
        } = event;
        setEmail(value);
        const auth = getAuth();
        await fetchSignInMethodsForEmail(auth, value)
            .then((result) => {
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
            <select defaultValue={""}>
                {props.options.length > 35 && <option value="" disabled>년</option>}
                {props.options.length === 31 && <option value="" disabled>일</option>}
                {props.options.length === 12 && <option value="" disabled>월</option>}
                {props.options.map((option, index) => (
                    <option key={index}
                            value={option.value}
                    >
                        {option.value}
                    </option>
                ))}
            </select>
        );
    };

    return (
        <div>
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
                        {error === 2 && <p>이미 등록된 이메일입니다.</p>}
                    </div>
                    <SelectBox options={months} onChange={dateChange} defaultValue=""></SelectBox>
                    <SelectBox options={days} onChange={dateChange} defaultValue=""></SelectBox>
                    <SelectBox options={years} onChange={dateChange} defaultValue=""></SelectBox>
                </form>
                <button disabled={error === 0 && email.length &&  name.length !== 0 ? false : true} onClick={handleNext}>다음</button>
        </div>
    );
};

export default First_page