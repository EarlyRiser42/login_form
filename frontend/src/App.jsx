import React, { useState, useEffect } from 'react';
import { authService } from './fbase';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { atom } from 'recoil';
import Loading from './components/Loading.jsx';
import Home from './routes/Home.jsx';
import Auth from './routes/Auth.jsx';
import Signup from './routes/Signup.jsx';
import Login from './routes/Login.jsx';

function App() {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // for modal background
  const location = useLocation();
  const background = location.state && location.state.background;

  // 전역 변수 관리 recoil
  const errorState = atom({
    key: 'errorState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
  });

  return (
    <div>
      {loading && <Loading />}
      {isLoggedIn ? (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </>
      ) : (
        <>
          <Routes location={background || location}>
            <Route path="/" element={<Auth />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
          {background && (
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/signup" element={<Signup />} />
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
