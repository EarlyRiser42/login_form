import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useUpdateProfile from '../../hooks/useUpdateProfile';
import '../../style/Signup/SignupSixthPage.css';
import { useRecoilState } from 'recoil';
import { isSigning, loadingState } from '../../util/recoil.jsx';
import { SignupLogoDiv, SignupXLogo } from './FifthPage.jsx';

const SixthPage = ({ user_data }) => {
  // 전역 변수 recoil
  const [loading, setLoading] = useRecoilState(loadingState);
  const [signing, setSigning] = useRecoilState(isSigning);

  // react query
  const updateProfile = useUpdateProfile();

  const initial = `${user_data.email.slice(
    0,
    user_data.email.indexOf('@'),
  )}${Math.floor(Math.random() * 1000)}`;

  const [name, setName] = useState(initial);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setName(value);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onClick = async () => {
    if (initial !== name || user_data.photoURL) {
      console.log('프로필 업데이트 중.');
      setLoading(true);
      setSigning(false);
      await sleep(2000);

      try {
        await updateProfile.mutateAsync({
          uid: user_data.uid,
          photoURL: user_data.photoURL,
          name: name,
        });
        console.log('프로필 업데이트 완료.');
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      setSigning(false);
    }
  };

  return (
    <div className={'SignupSixthPageDiv'}>
      <SignupLogoDiv>
        <SignupXLogo src="/X_logo.svg" alt="X logo" />
      </SignupLogoDiv>
      <div className={'SignupSixthPageUpperDiv'}>
        <div className={'SignupSixthPageSpanDiv'}>
          <h1>이름을 가르쳐 주시겠어요?</h1>
          <span>
            @사용자 아이디는 고유한 나만의 아이디입니다. 나중에 언제든 바꿀 수
            있습니다.
          </span>
        </div>
        <div className="inputcontainer">
          <span>사용자 아이디</span>
          <div className={'inputDownContainer'}>
            <img src="/email.svg" alt="@" width="20" />
            <input
              name="name"
              type="text"
              placeholder="사용자 아이디"
              maxLength="25"
              required
              value={name}
              onChange={onChange}
            />
            <img
              src="/greencheck.svg"
              alt="greencheck"
              className="greencheck"
              width="20"
            />
          </div>
        </div>
      </div>

      <div className={'SignupFifthPageButtonDiv'}>
        {initial === name && (
          <Link to={'/'}>
            <button className={'SignupNextButtonWhite'} onClick={onClick}>
              지금은 넘어가기
            </button>
          </Link>
        )}
        {initial !== name && (
          <Link to={'/'}>
            <button className={'SignupNextButtonBlack'} onClick={onClick}>
              완료
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SixthPage;
