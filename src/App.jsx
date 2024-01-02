import React, { useState, useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import {
  isSigning,
  loadingState,
  loginState,
  userObjState,
} from './util/recoil.jsx';
import Loading from './components/Loading.jsx';
import Home from './routes/Home.jsx';
import Auth from './routes/Auth.jsx';
import Signup from './routes/Signup.jsx';
import Login from './routes/Login.jsx';
import { getCookie, setCookie, setExpiryCookie } from './util/cookie.jsx';
import { authService } from './fbase';
import { useQuery } from 'react-query';
import axios from 'axios';
import './App.css';
import Tweet from './routes/Tweet.jsx';
import TweetDetail from './routes/TweetDetail.jsx';
import Mention from './routes/Mention.jsx';
import Profile from './routes/Profile.jsx';
import Follow from './routes/Follow.jsx';

function App() {
  // 전역 변수 recoil
  const [loading, setLoading] = useRecoilState(loadingState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [signing, setSigning] = useRecoilState(isSigning);

  // 지역 변수
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const navigate = useNavigate();

  // for modal background
  const location = useLocation();
  const background = location.state && location.state.background;

  // 자동 로그인
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
          params: {
            accessToken: getCookie('accessToken'),
            refreshTokenId: getCookie('refreshTokenId'),
          },
        },
      );
    },
    {
      cacheTime: 60000 * 5, // 1분 * 5
      staleTime: 60000 * 5,
      retry: false,
      enabled: !!getCookie('accessToken') || (!!isLoggedIn.login && !signing),
    },
  );

  // use query의 response가 변화할 때 실행 (자동로그인)
  useEffect(() => {
    if (validLogin) {
      const user = validLogin.data.user;
      if (validLogin.data.accessToken) {
        setExpiryCookie(
          'accessToken',
          validLogin.data.accessToken,
          5,
          'minutes',
        );
      }
      setUserObj(user);
      setIsLoggedIn({ login: true, social: false });
      setIsAuthChecked(true);
      navigate('/');
    }
    if (validError) {
      console.log(validError);
    }
  }, [validLogin, validError]);

  // 로그인 후 새로고침 || 로그인 실패? || 회원가입 할 때(6번째 페이지)
  return (
    <div>
      {(!isAuthChecked || (isAuthChecked && !isLoggedIn.login) || loading) && (
        <Loading forComponent={false} />
      )}
      {isLoggedIn.login && !signing ? (
        <>
          <Routes location={background || location}>
            <Route path="/" element={<Home />} />
            <Route
              path="/:profile/:tweetPath"
              element={<TweetDetail userObj={userObj} />}
            />
            <Route path="/profile/:profile" element={<Profile />} />
            <Route path="/profile/:profile/follow" element={<Follow />} />
          </Routes>
          {background && (
            <Routes>
              <Route path="/compose/tweet" element={<Tweet />} />
              <Route path="/compose/mention" element={<Mention />} />
            </Routes>
          )}
        </>
      ) : (
        <>
          <Routes location={background || location}>
            <Route path="/" element={<Auth />} />
            <Route
              path="/signup"
              element={<Signup setSigning={setSigning} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
          {background && (
            <Routes>
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
