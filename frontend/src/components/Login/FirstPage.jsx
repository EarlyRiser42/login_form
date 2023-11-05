import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, firebaseInstance } from '../../fbase';
import { useRecoilState } from 'recoil';
import { errorState } from '../../recoil/recoil.jsx';
import { useIsUserExist } from '../../hooks/useIsUserExist.js';
import '../../style/LoginFirstPage.css';

const FirstPage = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useRecoilState(errorState);

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

  const { isLoading, error, data } = useIsUserExist(email);

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
            onClick={() => isUserExist(email)}
          >
            다음
          </button>
        </div>
        <div>
          <button
            className={'LoginPasswordResetButton'}
            onClick={() => setError('구현중인 기능입니다.')}
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
