import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSignUp } from '../../hooks/useSignup.jsx';
import '../../style/Signup/SignupFourthPage.css';
import { sha256 } from 'crypto-hash';

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
      photoURL: 'https://via.placeholder.com/150x150',
      backgroundImage: 'https://placehold.co/600x400/1DA1F2/1DA1F2.png',
      birthyear: user_data.year,
      birthmonth: user_data.month,
      birthday: user_data.day,
      SignupAt: Date.now(),
      uid: uid,
      intro: '',
      following: ['DlMywOmW2pU3PtilMywBCnFffaC2'],
      follower: [],
      likes: [],
      mentions: [],
    };

    try {
      const signUpResult = await signUp.mutateAsync({ userObj });
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
      <button className={'SignupFourthPageButtonBlack'} onClick={Signup}>
        가입
      </button>
    </div>
  );
};

export default FourthPage;
