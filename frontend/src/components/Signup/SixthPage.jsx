import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useUpdateProfile from '../../hooks/useUpdateProfile';
import '../../style/Signup/SignupSixthPage.css';

const SixthPage = ({ user_data, setSigning }) => {
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

  const onClick = async () => {
    console.log(user_data.photo);
    console.log(initial !== name);
    if (initial !== name || user_data.photo) {
      try {
        await updateProfile.mutateAsync({
          uid: user_data.uid,
          photo: user_data.photo,
          name: name,
        });
      } catch (error) {
      } finally {
        console.log('프로필 업데이트 완료.');
        setSigning(false);
      }
    } else {
      setSigning(false);
    }
  };

  return (
    <div className={'SignupSixthPageDiv'}>
      <div className={'SignupFifthPageLogoDiv'}>
        <img className={'LoginXLogo'} src="/X_logo.svg" alt="X logo" />
      </div>
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
          <div>
            <img src="/email.png" alt="@" width="20" />
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
              src="/greencheck.png"
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
