import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, firebaseInstance } from '../../fbase';
import { useRecoilState } from 'recoil';
import { errorState, loginState, ModalOpenState } from '../../util/recoil.jsx';
import axios from 'axios';
import styled from 'styled-components';

const FirstPage = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [recoilError, setRecoilError] = useRecoilState(errorState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);

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
    const requestData = isEmail ? { email: value } : { id: value };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/checkEmailOrId`,
        requestData,
      );

      if (response.status === 200 && response.data && response.data.exists) {
        onNext({ email: value });
      }
      if (response.status === 200 && response.data && !response.data.exists) {
        setRecoilError('죄송합니다. 해당 계정을 찾을 수 없습니다.');
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
    setIsLoggedIn({ login: true, social: true });
    navigate('/');
  };

  const EmailChange = async (event) => {
    const {
      target: { value },
    } = event;
    setEmail(value);
  };

  return (
    <LoginModal>
      <LoginLogoDiv>
        <LoginCloseButtonDiv>
          <Link to={'/'}>
            <LoginCloseButton onClick={() => setIsModalOpen(false)}>
              <LoginCloseImg src="/close.svg" alt="close button" />
            </LoginCloseButton>
          </Link>
        </LoginCloseButtonDiv>
        <LoginXLogo src="/X_logo.svg" alt="X logo" />
      </LoginLogoDiv>
      <Loginh1Div>
        <Loginh1>X 가입하기</Loginh1>
      </Loginh1Div>
      <LoginButtonDiv>
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
          <LoginInput
            name="email"
            type="email"
            placeholder="휴대폰 번호, 이메일 주소 또는 사용자 아이디"
            required
            value={email}
            onChange={EmailChange}
          />
        </div>
        <div>
          <LoginNextButton onClick={() => onClick(email)}>다음</LoginNextButton>
        </div>
        <div>
          <LoginPasswordResetButton
            onClick={() => setRecoilError('구현중인 기능입니다.')}
          >
            비밀번호를 잊으셨나요?
          </LoginPasswordResetButton>
        </div>
      </LoginButtonDiv>
      <Loginh4Div>
        <span>계정이 없으신가요?</span>
        <Link to={'/signup'}>
          <LoginSignupLink>가입하기</LoginSignupLink>
        </Link>
      </Loginh4Div>
    </LoginModal>
  );
};

export const LoginModal = styled.div`
  width: 590px;
  height: 650px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 700px) {
    width: 100vw;
    height: 100vh;
  }

  @media (max-width: 480px) {
    width: 100vw;
    height: 90vh;
  }
`;

export const LoginLogoDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin-top: 2%;
`;

export const LoginCloseButtonDiv = styled.div`
  margin-left: 4%;
  margin-right: 37%;
  height: 100%;

  @media (max-width: 480px) {
    margin-left: 4%;
    margin-right: 35%;
    margin-top: 0%;
  }
`;

export const LoginCloseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 90%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e7e7e8;
  }
`;

export const LoginCloseImg = styled.img`
  width: 20px;
  height: 20px;
`;

export const LoginXLogo = styled.img`
  width: 30px;
  height: 25px;
`;

const Loginh1Div = styled.div`
  width: 100%;
  max-width: 300px;
  margin-bottom: 15%;
`;

const Loginh1 = styled.span`
  font-weight: bold;
  font-size: 2rem;
`;

const LoginButtonDiv = styled.div`
  width: 100%;
  height: auto;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: -20%;

  @media (max-width: 700px) {
    margin-top: -30%;
  }

  @media (max-width: 480px) {
    margin-top: -30%;
  }
`;

const LoginInput = styled.input`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 255px;
  height: 20px;
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 16px;
  color: black;
  cursor: pointer;
  text-decoration: none;
`;

const LoginNextButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 40px;
  padding: 10px 20px;
  border-radius: 25px;
  border: 1px solid #ccc;
  background-color: black;
  font-size: 16px;
  font-weight: 550;
  color: white;
  cursor: pointer;
  text-decoration: none;
`;

const LoginPasswordResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 40px;
  padding: 10px 20px;
  border-radius: 25px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 16px;
  font-weight: 550;
  color: black;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: #e7e7e8;
  }
`;

const Loginh4Div = styled.div`
  width: 100%;
  max-width: 300px;
  margin-bottom: 10%;
  @media (max-width: 700px) {
    max-width: 290px;
    margin-top: -10%;
    margin-bottom: 10%;
  }

  @media (max-width: 480px) {
    margin-top: -10%;
    margin-bottom: 10%;
  }
`;

export const LoginSignupLink = styled.span`
  margin-left: 2%;
  text-decoration: none; /* 밑줄 제거 */
  color: #4a99e9; /* 글씨색을 파란색으로 */
  cursor: pointer;
`;
export default FirstPage;
