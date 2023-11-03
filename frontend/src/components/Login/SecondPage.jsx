import React, { useEffect, useState, useRef } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SecondPage = ({ user_data }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // 비밀번호 보이기 안보이기
  const [isShowPwChecked, setShowPwChecked] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(false);
    }, 3000); // 5초 후에 에러 메시지를 숨김

    // 컴포넌트가 unmount 될 때 타이머를 클리어하여 메모리 누수 방지
    return () => clearTimeout(timer);
  }, []);

  const onClick = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, user_data.email, password)
      .then((userCredential) => {
        // logged in
        const user = userCredential.user;
        console.log(user);
        // ...
        navigate('/');
      })
      .catch((error) => {
        setError(true);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
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

  return (
    <div>
      <div>
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          maxLength={16}
          required
          value={password}
          ref={passwordRef}
          onChange={onChange}
        />
        <button onClick={handleShowPwChecked}>
          {!isShowPwChecked && (
            <img src={'/img/show.png'} alt={'비밀번호 보기'} height={30} />
          )}
          {isShowPwChecked && (
            <img src={'/img/hide.png'} alt={'비밀번호 숨기기'} height={30} />
          )}
        </button>
      </div>
      <button onClick={onClick}>로그인</button>
      <div>{error && <span>잘못된 비밀번호입니다.</span>}</div>
    </div>
  );
};

export default SecondPage;
