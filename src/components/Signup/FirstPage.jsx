import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { toastTextState, ModalOpenState } from '../../util/recoil.jsx';
import axios from 'axios';
import styled from 'styled-components';
import '../../style/Signup/SignupFirstPage.css';

export const SignupButton = ({ disabled, onClick, children }) => (
  <ButtonDiv>
    <NextButton disabled={disabled} onClick={onClick}>
      {children}
    </NextButton>
  </ButtonDiv>
);

export const NextButton = styled.button`
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 500px;
  min-height: 50px;
  border-radius: 25px;
  border: none;
  font-size: 16px;
  font-weight: 550;
  color: white;
  cursor: pointer;
  bottom: 120px;
  background-color: ${(props) => (props.disabled ? '#86898C' : 'black')};
  @media (max-width: 600px) {
    width: 430px;
  }
  @media (max-width: 480px) {
    width: 350px;
  }
`;

export const ButtonDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

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
  const [toastText, setToastText] = useRecoilState(toastTextState);

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
  };

  const toNextPage = async (value) => {
    const isEmail = value.includes('@');
    const requestData = isEmail ? { email: value } : { id: value };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/checkEmailOrId`,
        requestData,
      );

      if (response.status === 200 && response.data && response.data.exists) {
        setToastText('이미 등록된 이메일입니다.');
      }
      if (response.status === 200 && response.data && !response.data.exists) {
        onNext({ name, email, year, month, day });
      }
    } catch (error) {
      if (error.response) {
        // 서버에서 응답이 올 경우
        setToastText('서버 오류가 발생했습니다.');
      } else {
        // 서버에서 응답이 오지 않는 경우
        setToastText('요청에 문제가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const SelectYear = (props) => {
    return (
      <select
        className="select-year"
        defaultValue={year}
        onChange={(e) => setYear(e.target.value)}
      >
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
      <select
        className="select-month"
        defaultValue={month}
        onChange={(e) => setMonth(e.target.value)}
      >
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
      <select
        className="select-day"
        defaultValue={day}
        onChange={(e) => setDay(e.target.value)}
      >
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
    <div className={'SignupFirstPageDiv'}>
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
        <div className={'SignupCloseh3Div'}>
          <h3>4단계 중 1단계</h3>
        </div>
      </div>
      <div className={'SignupFirstPageMiddleDiv'}>
        <div className={'SignupFirstPageMiddleh1Div'}>
          <h1>계정을 생성하세요</h1>
        </div>
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
        <span className={'SignupFirstPageMiddleh4'}>생년월일</span>
        <span className={'SignupFirstPageMiddleh5'}>
          이 정보는 공개적으로 표시되지 않습니다. 비즈니스, 반려동물 등 계정
          주제에 상관없이 나의 연령을 확인하세요.
        </span>
        <div className={'SignupFirstPageMiddleSelectDiv'}>
          <SelectMonth options={months}></SelectMonth>
          <SelectDay options={days}></SelectDay>
          <SelectYear options={years}></SelectYear>
        </div>
      </div>
      <SignupButton
        disabled={
          !(
            email.length > 0 &&
            name.length > 0 &&
            year !== '' &&
            month !== '' &&
            day !== '' &&
            recoilError === ''
          )
        }
        onClick={() => {
          toNextPage(email);
        }}
      >
        다음
      </SignupButton>
    </div>
  );
};

export default FirstPage;
