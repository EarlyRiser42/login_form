import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSignUp } from '../../hooks/useSignup.jsx';
import '../../style/Signup/SignupFourthPage.css';
import { sha256 } from 'crypto-hash';
import { SignupButton } from './FirstPage.jsx';

const FourthPage = ({ onNext, onPrev, user_data, page, setPage }) => {
  // react query hooks
  const signUp = useSignUp();
  const handlePrev = () => {
    onPrev();
  };

  const Signup = async () => {
    const uid = uuidv4(); // Generate the UUID on the frontend

    const hashedPassword = await sha256(
      user_data.password + `${import.meta.env.VITE_REACT_APP_FRONT_HASH}`,
    );

    const userObj = {
      id: `${user_data.email.slice(
        0,
        user_data.email.indexOf('@'),
      )}${Math.floor(Math.random() * 1000)}`,
      email: user_data.email,
      password: hashedPassword,
      displayName: user_data.name,
      photoURL: 'https://fakeimg.pl/50x50/?text=+',
      backgroundImage: 'https://fakeimg.pl/600x400/?text=+',
      birthyear: user_data.year,
      birthmonth: user_data.month,
      birthday: user_data.day,
      SignupAt: Date.now(),
      uid: uid,
      intro: '',
      following: ['3431d11c-cf44-481b-805d-0835f7e77a68'],
      follower: [],
      likes: [],
      mentions: [],
    };

    try {
      const signUpResult = await signUp.mutateAsync({ queryParam: userObj });
      if (signUpResult) {
        onNext({ uid });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClick = (event) => {
    const {
      target: { name },
    } = event;
    if (name === 'name') {
      setPage(page - 3);
    } else if (name === 'email') {
      setPage(page - 3);
    } else {
      setPage(page - 3);
    }
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
          <h3>4단계 중 4단계</h3>
        </div>
      </div>
      <div className={'SignupFourthPageh1Div'}>
        <h1>계정을 생성하세요</h1>
      </div>
      <div className={'SignupLastInputDiv'}>
        <input
          className={'SignupLastInput'}
          name="name"
          type="text"
          placeholder="이름"
          value={user_data.name}
          onClick={onClick}
          onChange={onClick}
        />
        <img src={'/greencheck.svg'} alt={'greencheck'} width={20} />
      </div>
      <div className={'SignupLastInputDiv'}>
        <input
          className={'SignupLastInput'}
          name="email"
          type="text"
          placeholder="이메일"
          value={user_data.email}
          onClick={onClick}
          onChange={onClick}
        />
        <img src={'/greencheck.svg'} alt={'greencheck'} width={20} />
      </div>
      <div className={'SignupLastInputDiv'}>
        <input
          className={'SignupLastInput'}
          name="birth"
          type="text"
          placeholder="생년월일"
          value={user_data.year}
          onClick={onClick}
          onChange={onClick}
        />
        <img src={'/greencheck.svg'} alt={'greencheck'} width={20} />
      </div>
      <SignupButton disabled={false} onClick={Signup}>
        가입
      </SignupButton>
    </div>
  );
};

export default FourthPage;
