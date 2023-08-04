import React, {useEffect, useState} from 'react';
import {fetchSignInMethodsForEmail, getAuth} from "firebase/auth";
import {Link, useNavigate} from "react-router-dom"

const First_page = ({ onNext, user_data}) => {
    // 유저 정보(출생년도)
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');

    // 유저 정보(이름, 개인정보)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // 에러 유무
    const [isregisterd, setIsregisterd] = useState(0);
    const [error, setError] = useState(0);

    //페이지 이동
    const navigate = useNavigate();

    useEffect(() => {
        if(user_data.year){
            setYear(user_data.year);
        }
        if(user_data.month){
            setMonth(user_data.month);
        }
        if(user_data.day){
            setDay(user_data.day);
        }
        if(user_data.name){
            setName(user_data.name);
        }
        if(user_data.email){
            setEmail(user_data.email);
        }
    }, []);

    const handleNext = () => {
        // Step1 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
        onNext({ name, email, year, month, day });
    };
    //

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
            setError(2);
        }
    }, [isregisterd]);


    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setName(value);
    };

    const EmailChange = async (event)  => {
        const {
            target: { value },
        } = event;
        setEmail(value);
        const auth = getAuth();
        await fetchSignInMethodsForEmail(auth, value)
            .then((result) => {
                setIsregisterd(result.length);
                setError(0);
            }).catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage)
                setError(1);
                // ..
            });
    }

    const SelectYear = (props) => {
        return (
            <select defaultValue={year} onChange={(e) => setYear(e.target.value )}>
                <option value="" disabled>년</option>
                {props.options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.value}
                    </option>
                ))}
            </select>
        );
    };

    const SelectMonth = (props) => {
        return (
            <select defaultValue={month} onChange={(e) => setMonth(e.target.value )}>
                <option value="" disabled>월</option>
                {props.options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.value}
                    </option>
                ))}
            </select>
        );
    };

    const SelectDay = (props) => {
        return (
            <select defaultValue={day} onChange={(e) => setDay(e.target.value )}>
            <option value="" disabled>일</option>
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
            <div>
                <Link to={"/"}><button>X</button></Link>
                <h3>4단계 중 1단계</h3>
            </div>

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
                        onChange={EmailChange}
                    />
                    <div>
                        {error === 1 && <p>올바른 이메일을 입력해 주세요.</p>}
                        {error === 2 && <p>이미 등록된 이메일입니다.</p>}
                    </div>
                    <SelectMonth options={months} ></SelectMonth>
                    <SelectDay options={days} ></SelectDay>
                    <SelectYear options={years} ></SelectYear>
                </form>
                <button disabled={error === 0 && email.length &&  name.length !== 0 ? false : true} onClick={handleNext}>다음</button>
        </div>
    );
};

export default First_page