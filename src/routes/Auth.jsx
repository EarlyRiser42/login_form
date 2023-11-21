import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService, firebaseInstance } from '../fbase';
import '../style/Auth.css';
import { useRecoilState } from 'recoil';
import { isSigning, ModalOpenState } from '../util/recoil.jsx';

const Auth = () => {
  // modal 뒷배경
  const location = useLocation();

  // 전역변수 recoil
  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);

  // 모달 창 열릴시 부모 요소 스크롤 차단
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

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
  };

  return (
    <div className={isModalOpen ? 'auth_Div_withModal' : 'auth_Div'}>
      <div className={'auth_LeftDiv'}>
        <img src="/X_logo.svg" alt="X logo" className={'X_Logo_svg'} />
      </div>
      <div className={'auth_RightDiv'}>
        <div className={'auth_h14'}>
          <span className={'auth_h1'}>지금 일어나고 있는 일</span>
          <span className={'auth_h4'}>지금 가입하세요.</span>
        </div>
        <div className={'authButtonDiv'}>
          <AuthButton
            name="google"
            onClick={onSocialClick}
            logo="/google_logo.svg"
            text="Google 계정으로 가입하기"
          />
          <AuthButton
            name="github"
            onClick={onSocialClick}
            logo="/github_logo.svg"
            text="Github으로 가입하기"
          />
          <div>
            <div className={'line'}>
              <span style={{ fontWeight: 'normal', color: 'black' }}>또는</span>
            </div>
          </div>
          <Link to={'/signup'} state={{ background: location }}>
            <button className={'authCreateAccountButton'}>계정 만들기</button>
          </Link>
          <span style={{ fontWeight: 'lighter', fontSize: '0.7rem' }}>
            가입하시려면 <span>쿠키 사용</span>을 포함해{' '}
            <span>이용약관과 개인정보 처리</span>
            {<br />}
            방침에 동의해야 합니다.
          </span>
        </div>
        <div className={'authLoginDiv'}>
          <span style={{ fontWeight: 'bolder', fontSize: '1rem' }}>
            이미 트위터에 가입하셨나요?
          </span>
          <Link to={'/login'} state={{ background: location }}>
            <button className={'authLoginButton'}>로그인</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Auth;
