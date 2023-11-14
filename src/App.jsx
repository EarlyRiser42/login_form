import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { loadingState, loginState, userObjState } from './util/recoil.jsx';
import Loading from './components/Loading.jsx';
import Home from './routes/Home.jsx';
import Auth from './routes/Auth.jsx';
import Signup from './routes/Signup.jsx';
import Login from './routes/Login.jsx';
import { getCookie } from './util/cookie.jsx';
import { useValidateToken } from './hooks/useValidateToken.jsx';
import { authService } from './fbase';
import { useGetProfile } from './hooks/useGetProfile.jsx';

function App() {
  const [loading, setLoading] = useRecoilState(loadingState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const [userObj, setUserObj] = useRecoilState(userObjState);

  // for modal background
  const location = useLocation();
  const background = location.state && location.state.background;

  // 회원가입 중
  const [signing, setSigning] = useState(false);

  const validateTokenMutation = useValidateToken();
  const getProfileMutation = useGetProfile();

  // 회원 정보 불러오기
  const refreshUser = () => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      getProfileMutation.mutate({ accessToken });
    }
  };

  // 지속적 로그인
  useEffect(() => {
    // 지속적인 로그인을 위하여 accessToken과 refreshTokenId 활용
    const accessToken = getCookie('accessToken');
    const refreshTokenId = getCookie('refreshTokenId');
    if (accessToken) {
      refreshUser();
      validateTokenMutation.mutate({ accessToken, refreshTokenId });
    }
    // social login했을때 로그인 유지
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          // Auth에 담겨 있는 값
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
        });
        setIsLoggedIn({ login: true, social: true });
      } else {
        setUserObj({ displayName: '', uid: '', photoURL: '' });
      }
    });
  }, []);

  return (
    <div>
      {loading && <Loading />}
      {isLoggedIn.login && !signing ? (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </>
      ) : (
        <>
          <Routes location={background || location}>
            <Route path="/" element={<Auth setSigning={setSigning} />} />
            <Route
              path="/signup"
              element={<Signup setSigning={setSigning} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
          {background && (
            <Routes>
              <Route path="/" element={<Auth setSigning={setSigning} />} />
              <Route
                path="/signup"
                element={<Signup setSigning={setSigning} />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </>
      )}
    </div>
  );
}

export default App;
