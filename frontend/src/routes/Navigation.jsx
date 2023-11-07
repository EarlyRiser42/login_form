import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import { useRecoilState } from 'recoil';
import { loginState, userObjState } from '../util/recoil.jsx';

const Navigation = () => {
  // for modal
  const navigate = useNavigate();
  const location = useLocation();

  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);

  const onLogOutClick = () => {
    if (isLoggedIn.social) {
      authService.signOut();
    }
    setIsLoggedIn({ login: false, social: false });
    navigate('/');
  };

  return (
    <nav>
      <div>
        <Link to="/">홈</Link>
        <Link to={`/profile/${userObj.uid}`}>프로필</Link>
      </div>
      <div>
        <Link to="/compose/tweet" state={{ background: location }}>
          <button>게시하기</button>
        </Link>
        <button onClick={onLogOutClick}>Log Out</button>
      </div>
      <div>
        <span>{userObj.displayName}</span>
        <span>{userObj.id}</span>
        <img src={userObj.photoURL} width="50px" height="50px" />
      </div>
    </nav>
  );
};
export default Navigation;
