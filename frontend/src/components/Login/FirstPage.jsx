import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, firebaseInstance } from '../../fbase';
import { useRecoilState } from 'recoil';
import { errorState } from '../../recoil/recoil.jsx';
import axios from 'axios';
import '../../style/LoginFirstPage.css';

const FirstPage = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [recoilError, setRecoilError] = useRecoilState(errorState);

  const AuthButton = ({ name, onClick, logo, text }) => (
    <button className={'authButton'} name={name} onClick={onClick}>
      {text}
      <img
        src={logo}
        alt={`${name} logo`}
        style={{ width: '20px', height: '20px', marginLeft: '10px' }}
      />
    </button>
  );

  const onClick = async (value) => {
    const isEmail = value.includes('@');
    const queryParam = isEmail ? `email=${value}` : `id=${value}`;
    const url = `http://localhost:3000/api/checkEmailOrId?${queryParam}`;

    try {
      const response = await axios.get(url);

      if (response.status === 200 && response.data && response.data.exists) {
        onNext(value);
      }
      if (response.status === 200 && response.data && !response.data.exists) {
        setRecoilError('죄송합니다. 해당 계정을 찾을 수 없습니다.');
      }
    } catch (error) {
      if (error.response) {
        // 서버에서 응답이 올 경우
        switch (error.response.status) {
          case 400:
            setRecoilError('이메일 혹은 아이디를 제공해주세요.');
            break;
          case 500:
          default:
            setRecoilError('서버 오류가 발생했습니다.');
            break;
        }
      } else {
        // 서버에서 응답이 오지 않는 경우
        setRecoilError('요청에 문제가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === 'google') {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    await authService.signInWithPopup(provider);
    navigate('/');
  };

  const EmailChange = async (event) => {
    const {
      target: { value },
    } = event;
    setEmail(value);
  };

  return (
    <div className={'LoginModal'}>
      <div className={'LoginLogoDiv'}>
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
      <div className={'Loginh1Div'}>
        <span className={'Loginh1'}>X 가입하기</span>
      </div>
      <div className={'LoginButtonDiv'}>
        <AuthButton
          name="google"
          onClick={onSocialClick}
          logo="/google_logo.svg"
          text="Google 계정으로 로그인하기"
        />
        <AuthButton
          name="github"
          onClick={onSocialClick}
          logo="/github_logo.svg"
          text="Github으로 로그인하기"
        />
        <div>
          <div className={'line'}>
            <span style={{ fontWeight: 'normal', color: 'black' }}>또는</span>
          </div>
        </div>
        <div>
          <input
            className={'LoginInput'}
            name="email"
            type="email"
            placeholder="휴대폰 번호, 이메일 주소 또는 사용자 아이디"
            required
            value={email}
            onChange={EmailChange}
          />
        </div>
        <div>
          <button
            className={'LoginNextButton'}
            onClick={() => onClick(email)}
            disabled={!email}
          >
            다음
          </button>
        </div>
        <div>
          <button
            className={'LoginPasswordResetButton'}
            onClick={() => setRecoilError('구현중인 기능입니다.')}
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>
      </div>

      <div className={'Loginh4Div'}>
        <span className={'Loginh4'}>계정이 없으신가요?</span>
        <Link className={'LoginSignupLink'} to={'/signup'}>
          <span className={'LoginSignupLink'}>가입하기</span>
        </Link>
      </div>
    </div>
  );
};

export default FirstPage;
