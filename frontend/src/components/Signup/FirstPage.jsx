import React, { useEffect, useState } from 'react';
import { fetchSignInMethodsForEmail, getAuth } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { errorState, ModalOpenState } from '../../util/recoil.jsx';
import axios from 'axios';

const FirstPage = ({ onNext, user_data }) => {
  // 유저 정보(출생년도)
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  // 유저 정보(이름, 개인정보)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // 전역상태 recoil
  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);
  const [recoilError, setRecoilError] = useRecoilState(errorState);

  useEffect(() => {
    if (user_data.year) {
      setYear(user_data.year);
    }
    if (user_data.month) {
      setMonth(user_data.month);
    }
    if (user_data.day) {
      setDay(user_data.day);
    }
    if (user_data.name) {
      setName(user_data.name);
    }
    if (user_data.email) {
      setEmail(user_data.email);
    }
  }, []);

  const generateYears = () => {
    const startYear = 1960;
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push({ value: year.toString(), name: 'year' });
    }

    return years;
  };

  const generateDates = (date) => {
    const startDay = 1;
    const dates = [];
    for (let day = startDay; day <= date; day++) {
      if (date < 31) {
        dates.push({ value: day.toString(), name: 'month' });
      } else {
        dates.push({ value: day.toString(), name: 'day' });
      }
    }
    return dates;
  };

  const years = generateYears();
  const months = generateDates(12);
  const days = generateDates(31);

  const NameChange = (event) => {
    const {
      target: { value },
    } = event;
    setName(value);
  };

  const EmailChange = async (event) => {
    const {
      target: { value },
    } = event;
    setEmail(value);
    const auth = getAuth();
    await fetchSignInMethodsForEmail(auth, value)
      .then((result) => {
        setIsregisterd(result.length);
        setError(0);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        setError(1);
        // ..
      });
  };

  const toNextPage = async (value) => {
    const isEmail = value.includes('@');
    const queryParam = isEmail ? `email=${value}` : `id=${value}`;
    const url = `http://localhost:3000/api/checkEmailOrId?${queryParam}`;

    try {
      const response = await axios.get(url);

      if (response.status === 200 && response.data && response.data.exists) {
        setRecoilError('이미 등록된 이메일입니다.');
      }
      if (response.status === 200 && response.data && !response.data.exists) {
        onNext({ name, email, year, month, day });
      }
    } catch (error) {
      if (error.response) {
        // 서버에서 응답이 올 경우
        setRecoilError('서버 오류가 발생했습니다.');
      } else {
        // 서버에서 응답이 오지 않는 경우
        setRecoilError('요청에 문제가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const SelectYear = (props) => {
    return (
      <select defaultValue={year} onChange={(e) => setYear(e.target.value)}>
        <option value="" disabled>
          년
        </option>
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
      <select defaultValue={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="" disabled>
          월
        </option>
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
      <select defaultValue={day} onChange={(e) => setDay(e.target.value)}>
        <option value="" disabled>
          일
        </option>
        {props.options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div>
      <div className={'SignupCloseButtonDiv'}>
        <div>
          <Link to={'/'}>
            <button
              className={'SignupCloseButton'}
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              <img
                className={'SignupCloseImg'}
                src="/close.svg"
                alt="close button"
              />
            </button>
          </Link>
        </div>
        <div>
          <h3>4단계 중 1단계</h3>
        </div>
      </div>
      <div>
        <div>
          <h1>계정을 생성하세요</h1>
        </div>
        <form>
          <input
            name="name"
            type="text"
            placeholder="이름"
            required
            value={name}
            onChange={NameChange}
          />
          <input
            name="email"
            type="text"
            placeholder="이메일"
            required
            value={email}
            onChange={EmailChange}
          />
          <span>생년월일</span>
          <span>
            이 정보는 공개적으로 표시되지 않습니다. 비즈니스, 반려동물 등 계정
            주제에 상관없이 나의 연령을 확인하세요.
          </span>
          <SelectMonth options={months}></SelectMonth>
          <SelectDay options={days}></SelectDay>
          <SelectYear options={years}></SelectYear>
        </form>
      </div>

      <button
        disabled={!(!recoilError && !email.length && !name.length)}
        onClick={toNextPage}
      >
        다음
      </button>
    </div>
  );
};

export default FirstPage;
