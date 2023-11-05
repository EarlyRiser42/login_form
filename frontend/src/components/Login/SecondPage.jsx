import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { errorState } from '../../recoil/recoil.jsx';
import axios from 'axios';
import '../../style/LoginSecondPage.css';

const SecondPage = ({ user_data }) => {
  const [password, setPassword] = useState('');
  const [recoilError, setRecoilError] = useRecoilState(errorState);

  const navigate = useNavigate();

  // 비밀번호 보이기 안보이기
  const [isShowPwChecked, setShowPwChecked] = useState(false);
  const passwordRef = useRef(null);

  const onClick = async (event) => {
    event.preventDefault();
    navigate('/');
    setRecoilError('잘못된 비밀번호입니다.');
  };

  const handleShowPwChecked = async () => {
    const password = await passwordRef.current;
    if (password === null) return;

    await setShowPwChecked(!isShowPwChecked);
    if (!isShowPwChecked) {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setPassword(value);
  };

  return (
    <div className={'LoginModal2'}>
      <div className={'LoginLogoDiv2'}>
        <div className={'LoginCloseButtonDiv'}>
          <Link to={'/'}>
            <button className={'LoginCloseButton'}>
              <img
                className={'LoginCloseImg'}
                src="/close.svg"
                alt="close button"
              />
            </button>
          </Link>
        </div>
        <img className={'LoginXLogo'} src="/X_logo.svg" alt="X logo" />
      </div>
      <div className={'Loginh1Div_2'}>
        <span className={'Loginh1_2'}>비밀번호를 입력하세요</span>
      </div>
      <div>
        <div className={'LoginDisabledInputDiv'}>
          <input
            className={'LoginDisabledInput'}
            name="email"
            type="text"
            placeholder={user_data.email}
            maxLength={16}
            required
            value={user_data.email}
            disabled={true}
          />
        </div>
      </div>
      <div className={'LoginPasswordInputDiv'}>
        <input
          className={'LoginPasswordInput'}
          name="password"
          type="password"
          placeholder="비밀번호"
          maxLength={16}
          required
          value={password}
          ref={passwordRef}
          onChange={onChange}
        />
        <button
          className={'TogglePasswordVisibility'}
          onClick={handleShowPwChecked}
        >
          {!isShowPwChecked && (
            <img
              src={'/show.png'}
              alt={'비밀번호 보기'}
              width={'25px'}
              height={'25px'}
            />
          )}
          {isShowPwChecked && (
            <img src={'/hide.png'} alt={'비밀번호 숨기기'} height={30} />
          )}
        </button>
      </div>
      <button
        className={password ? 'LoginDoneButtonBlack' : 'LoginDoneButtonGray'}
        onClick={onClick}
      >
        로그인
      </button>
      <div className={'Loginh4Div2'}>
        <span className={'Loginh42'}>계정이 없으신가요?</span>
        <Link className={'LoginSignupLink'} to={'/signup'}>
          <span className={'LoginSignupLink'}>가입하기</span>
        </Link>
      </div>
    </div>
  );
};

export default SecondPage;
