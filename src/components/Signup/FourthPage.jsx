import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSignUp } from '../../hooks/useSignup.jsx';
import '../../style/Signup/SignupFourthPage.css';

const FourthPage = ({ onNext, onPrev, user_data, page, setPage }) => {
  // react query hooks
  const signUp = useSignUp();
  const handlePrev = () => {
    onPrev();
  };

  const Signup = async () => {
    const uid = uuidv4(); // Generate the UUID on the frontend

    const userObj = {
      id: `${user_data.email.slice(
        0,
        user_data.email.indexOf('@'),
      )}${Math.floor(Math.random() * 1000)}`,
      email: user_data.email,
      password: user_data.password,
      displayName: user_data.name,
      photoURL:
        'https://firebasestorage.googleapis.com/v0/b/loginform-6747a.appspot.com/o/pfp%2Fbasic.png?alt=media&token=d2b2f037-ee93-4fad-a09d-733332ec28fc',
      backgroundimage:
        'https://firebasestorage.googleapis.com/v0/b/loginform-6747a.appspot.com/o/pfp%2Fbackgroundimage.png?alt=media&token=6e328859-4a03-485e-a487-dfdd89c008ba',
      birthyear: user_data.year,
      birthmonth: user_data.month,
      birthday: user_data.day,
      SignupAt: Date.now(),
      uid: uid,
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
              src="/left-arrow.png"
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
        <img src={'/greencheck.png'} alt={'greencheck'} width={20} />
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
        <img src={'/greencheck.png'} alt={'greencheck'} width={20} />
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
        <img src={'/greencheck.png'} alt={'greencheck'} width={20} />
      </div>
      <button className={'SignupFourthPageButtonBlack'} onClick={Signup}>
        가입
      </button>
    </div>
  );
};

export default FourthPage;
