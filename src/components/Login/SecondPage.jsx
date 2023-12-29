import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { useRecoilState } from 'recoil';
import { ModalOpenState } from '../../util/recoil.jsx';
import { sha256 } from 'crypto-hash';
import {
  LoginCloseButton,
  LoginCloseButtonDiv,
  LoginCloseImg,
  LoginLogoDiv,
  LoginModal,
  LoginSignupLink,
  LoginXLogo,
  signalByEnter,
} from './FirstPage.jsx';
import styled, { css } from 'styled-components';
import Loading from '../Loading.jsx';

const SecondPage = ({ user_data }) => {
  const [password, setPassword] = useState('');

  // 비밀번호 보이기 안보이기
  const [isShowPwChecked, setShowPwChecked] = useState(false);
  const passwordRef = useRef(null);

  // 로그인 api 전역 관리
  const { mutate, isLoading } = useLogin();
  // 전역 상태 recoil
  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);

  const onClick = async (value) => {
    const isEmail = user_data.email.includes('@');
    const hashedPassword = await sha256(
      value + `${import.meta.env.VITE_REACT_APP_FRONT_HASH}`,
    );
    const queryParam = {
      password: hashedPassword,
    };
    if (isEmail) {
      queryParam.email = user_data.email;
    } else {
      queryParam.id = user_data.email;
    }

    mutate(queryParam);
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

  const TogglePasswordVisibility = ({
    isShowPwChecked,
    handleShowPwChecked,
  }) => {
    return (
      <TogglePasswordVisibilityButton onClick={handleShowPwChecked}>
        {!isShowPwChecked ? (
          <VisibilityIcon src="/show.svg" alt="비밀번호 보기" />
        ) : (
          <VisibilityIcon src="/hide.svg" alt="비밀번호 숨기기" />
        )}
      </TogglePasswordVisibilityButton>
    );
  };

  return (
    <LoginModal2>
      {isLoading ? (
        <Loading forComponent={true} isCircleAtCenter={true} />
      ) : (
        <>
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
          <Loginh1Div2>
            <Loginh12>비밀번호를 입력하세요</Loginh12>
          </Loginh1Div2>
          <LoginInputDiv>
            <LoginDisabledInputDiv>
              <LoginDisabledInput
                name="email"
                type="text"
                placeholder={user_data.email}
                maxLength={16}
                required
                value={user_data.email}
                disabled={true}
              />
            </LoginDisabledInputDiv>
            <LoginPasswordInputDiv>
              <LoginPasswordInput
                name="password"
                type="password"
                placeholder="비밀번호"
                maxLength={16}
                required
                value={password}
                ref={passwordRef}
                onKeyDown={(e) => signalByEnter(e, () => onClick(password))}
                onChange={onChange}
              />
              <TogglePasswordVisibility
                isShowPwChecked={isShowPwChecked}
                handleShowPwChecked={handleShowPwChecked}
              />
            </LoginPasswordInputDiv>
          </LoginInputDiv>
          <LoginButtonDiv>
            <LoginButton $password={password} onClick={() => onClick(password)}>
              로그인
            </LoginButton>
          </LoginButtonDiv>
          <Loginh4Div2>
            <span>계정이 없으신가요?</span>
            <Link to={'/signup'}>
              <LoginSignupLink>가입하기</LoginSignupLink>
            </Link>
          </Loginh4Div2>
        </>
      )}
    </LoginModal2>
  );
};

const LoginModal2 = styled.div`
  width: 590px;
  height: 650px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 700px) {
    width: 100vw;
    height: 100vh;
  }

  @media (max-width: 480px) {
    width: 100vw;
    height: 100dvh;
  }
`;

const Loginh1Div2 = styled.div`
  margin-top: 5%;
  @media (max-width: 480px) {
    margin-top: 10%;
    margin-bottom: 7%;
  }
`;

const Loginh12 = styled.span`
  font-weight: bold;
  font-size: 2rem;
  @media (max-width: 480px) {
    font-weight: bold;
    font-size: 1.8rem;
  }
`;

const LoginInputDiv = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 5%;
  margin-bottom: 40%;
  @media (max-width: 700px) {
    min-height: 150px;
    margin-bottom: 40%;
  }

  @media (max-width: 480px) {
    min-height: 150px;
    margin-bottom: 10%;
  }
`;

const LoginDisabledInputDiv = styled.div`
  position: relative;
  width: 100%;
  max-width: 450px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5%;
  border-radius: 5px;
  @media (max-width: 480px) {
    max-width: 350px;
    border-radius: 25px;
  }
`;

const LoginDisabledInput = styled.input`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-indent: 8px;
  font-size: 17px;
`;

const LoginButtonDiv = styled.div`
  @media (max-width: 480px) {
    margin-top: 50%;
  }
`;

export const LoginPasswordInputDiv = styled.div`
  position: relative;
  width: 100%;
  max-width: 450px;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  @media (max-width: 480px) {
    max-width: 350px;
  }
`;

export const LoginPasswordInput = styled(LoginDisabledInput)``;

export const TogglePasswordVisibilityButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  cursor: pointer;
  border: none;
`;

export const VisibilityIcon = styled.img`
  display: block;
  height: 25px;
  width: 25px;
`;

const LoginButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 450px;
  min-height: 50px;
  border-radius: 25px;
  border: none;
  font-size: 16px;
  font-weight: 550;
  color: white;
  cursor: pointer;
  background-color: ${(props) => (props.$password ? 'black' : '#86898c')};
  margin-bottom: 5%;
  @media (max-width: 480px) {
    width: 350px;
  }
`;

const Loginh4Div2 = styled.div`
  width: 100%;
  max-width: 440px;
  @media (max-width: 480px) {
    max-width: 340px;
    margin-top: 5%;
    width: 100%;
  }
`;

export default SecondPage;
