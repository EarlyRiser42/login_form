import React, { useEffect, useState } from 'react';
import {
  fetchSignInMethodsForEmail,
  getAuth,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { authService, firebaseInstance } from '../../fbase';
import '../../style/LoginFirstPage.css';

const FirstPage = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(false);
    }, 3000); // 5초 후에 에러 메시지를 숨김

    // 컴포넌트가 unmount 될 때 타이머를 클리어하여 메모리 누수 방지
    return () => clearTimeout(timer);
  }, []);

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

  const handleNext = async () => {
    const auth = getAuth();
    await fetchSignInMethodsForEmail(auth, email)
      .then((result) => {
        if (result.length === 1) {
          setError(false);
          onNext({ email });
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        setError(true);
        // ..
      });
    // Step1 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
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
          <button className={'LoginNextButton'} onClick={handleNext}>
            다음
          </button>
        </div>
        <div>
          <button className={'LoginPasswordResetButton'} onClick={handleNext}>
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
