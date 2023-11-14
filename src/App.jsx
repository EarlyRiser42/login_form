import React, { useState, useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { loadingState, loginState, userObjState } from './util/recoil.jsx';
import Loading from './components/Loading.jsx';
import Home from './routes/Home.jsx';
import Auth from './routes/Auth.jsx';
import Signup from './routes/Signup.jsx';
import Login from './routes/Login.jsx';
import { getCookie } from './util/cookie.jsx';
import { authService } from './fbase';
import { useQuery } from 'react-query';
import axios from 'axios';

function App() {
  // 전역 변수 recoil
  const [loading, setLoading] = useRecoilState(loadingState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const [userObj, setUserObj] = useRecoilState(userObjState);

  const navigate = useNavigate();

  // cookies
  const [accessToken, setAccessToken] = useState('');
  const [refreshTokenId, setRefreshTokenId] = useState('');

  // for modal background
  const location = useLocation();
  const background = location.state && location.state.background;

  // 회원가입 중
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    // 지속적인 로그인을 위하여 accessToken과 refreshTokenId 활용
    setAccessToken(getCookie('accessToken'));
    setRefreshTokenId(getCookie('refreshTokenId'));

    // social login했을때 로그인 유지
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          // Auth에 담겨 있는 값
          displayName: user.displayName,
          id: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
        });
        setIsLoggedIn({ login: true, social: true });
      } else {
        setUserObj({ displayName: '', id: '', uid: '', photoURL: '' });
      }
    });
  }, []);

  // 유저 정보 불러오기, accessToken이 쿠키에 있을때만
  const {
    data: userData,
    isLoading: userDataLoading,
    error: userDataError,
  } = useQuery(
    'getProfile',
    () => {
      return axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/getProfile`,
        {
          params: { accessToken: accessToken },
        },
      );
    },
    {
      cacheTime: 60000 * 25, // 1분 * 25
      staleTime: 60000 * 25,
      retry: false,
      enabled: !!accessToken,
    },
  );

  // 지속적 로그인
  const {
    data: validLogin,
    isLoading: validLoading,
    error: validError,
  } = useQuery(
    'validateToken',
    () => {
      return axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/validateToken`,
        {
          params: { accessToken: accessToken, refreshTokenId: refreshTokenId },
        },
      );
    },
    {
      cacheTime: 60000 * 30, // 1분 * 30
      staleTime: 60000 * 30,
      retry: false,
      enabled: !!accessToken,
    },
  );
  // use query의 response가 변화할 때 실행
  useEffect(() => {
    if (userData) {
      setUserObj({ ...userData.data.user });
    }
    if (userDataError) {
      console.log(userDataError);
    }
    if (validLogin) {
      setLoading(true);
      setIsLoggedIn({ login: true, social: false });
      navigate('/');
      setLoading(false);
    }
    if (validError) {
      console.log(validError);
    }
  }, [userData, userDataError, validLogin, validError]);

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
