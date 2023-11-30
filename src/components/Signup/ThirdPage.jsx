import React, { useEffect, useState, useRef } from 'react';
import '../../style/Signup/SignupThirdPage.css';
import {
  LoginPasswordInput,
  LoginPasswordInputDiv,
  TogglePasswordVisibilityButton,
  VisibilityIcon,
} from '../Login/SecondPage.jsx';
import * as PropTypes from 'prop-types';
import { SignupButton } from './FirstPage.jsx';

function TogglePasswordVisibility(props) {
  return null;
}

TogglePasswordVisibility.propTypes = {
  isShowPwChecked: PropTypes.bool,
  handleShowPwChecked: PropTypes.func,
};
const ThirdPage = ({ onNext, onPrev, user_data }) => {
  const [password, setPassword] = useState('');

  // 비밀번호 보이기 안보이기
  const [isShowPwChecked, setShowPwChecked] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (user_data.password) {
      setPassword(user_data.password);
    }
  }, []);

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

  const handleNext = () => {
    // Step2 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
    onNext({ password });
  };

  const handlePrev = () => {
    onPrev();
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
    <div>
      <div className={'SignupPrevButtonDiv'}>
        <div>
          <button className={'SignupPrevButton'} onClick={handlePrev}>
            <img
              className={'SignupPrevImg'}
              src="/left_arrow.svg"
              alt="close button"
            />
          </button>
        </div>
        <div className={'SignupPrevh3Div'}>
          <h3>4단계 중 3단계</h3>
        </div>
      </div>
      <div className={'SignupPasswordMiddleDiv'}>
        <h1>비밀번호가 필요합니다</h1>
        <h3>8자 이상이어야 합니다.</h3>
        <div className={'SignupPasswordInputDiv'}>
          <LoginPasswordInputDiv>
            <LoginPasswordInput
              name="password"
              type="password"
              placeholder="비밀번호"
              maxLength={16}
              required
              value={password}
              ref={passwordRef}
              onChange={onChange}
            />
            <TogglePasswordVisibility
              isShowPwChecked={isShowPwChecked}
              handleShowPwChecked={handleShowPwChecked}
            />
          </LoginPasswordInputDiv>
        </div>
      </div>
      <SignupButton disabled={password.length < 8} onClick={handleNext}>
        다음
      </SignupButton>
    </div>
  );
};

export default ThirdPage;
