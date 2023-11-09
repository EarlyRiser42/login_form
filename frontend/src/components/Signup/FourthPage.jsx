import React from 'react';
import { dbService } from '../../fbase';
import { doc, setDoc, collection } from 'firebase/firestore';
import '../../style/SignupFourthPage.css';

const FourthPage = ({ onNext, onPrev, user_data, page, setPage }) => {
  const handlePrev = () => {
    onPrev();
  };

  const Signup = async () => {
    onNext();
  };

  const Profile_toDB = async (userObj, user_data) => {
    const profileObj = {
      id: `${user_data.email.slice(
        0,
        user_data.email.indexOf('@'),
      )}${Math.floor(Math.random() * 1000)}`,
      displayName: user_data.name,
      photoURL:
        'https://firebasestorage.googleapis.com/v0/b/loginform-6747a.appspot.com/o/pfp%2Fbasic.png?alt=media&token=d2b2f037-ee93-4fad-a09d-733332ec28fc',
      backgroundimage:
        'https://firebasestorage.googleapis.com/v0/b/loginform-6747a.appspot.com/o/pfp%2Fbackgroundimage.png?alt=media&token=6e328859-4a03-485e-a487-dfdd89c008ba',
      birthyear: user_data.year,
      birthmonth: user_data.month,
      birthday: user_data.day,
      SignupAt: Date.now(),
      uid: userObj.uid,
      following: ['DlMywOmW2pU3PtilMywBCnFffaC2'],
      follower: [],
      likes: [],
      mentions: [],
    };

    /* mentions (later)
        const docRef = doc(collection(dbService, 'profile', userObj.uid, 'following'));
        await setDoc(docRef, []);
        */

    // for profile info
    await setDoc(doc(dbService, 'profile', userObj.uid), profileObj);
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
