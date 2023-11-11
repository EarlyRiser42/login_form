import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import { useRecoilState } from 'recoil';
import { loginState, userObjState } from '../util/recoil.jsx';
import { deleteCookie } from '../util/cookie.jsx';
import '../style/Nav.css';

const Nav = () => {
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
    deleteCookie('accessToken');
    deleteCookie('refreshTokenId');
    navigate('/');
  };

  return (
    <nav className={'NavDiv'}>
      <div className={'NavLinkDiv'}>
        <div className={'NavLogoDiv'}>
          <img className={'NavXLogo'} src="/X_logo.svg" alt="X logo" />
        </div>
        <div className={'NavHomeIcon'}>
          <Link to="/">
            <img
              src={'./home.png'}
              alt={'LinkToHome'}
              width={'30px'}
              height={'30px'}
            />
            <span>홈</span>
          </Link>
        </div>
        <div className={'NavProfileIcon'}>
          <Link to={`/profile/${userObj.uid}`}>
            <img
              src={'./user-profile.png'}
              alt={'LinkToUserProfile'}
              width={'30px'}
              height={'30px'}
            />
            <span>프로필</span>
          </Link>
        </div>
        <div className={'NavPostButtonDiv'}>
          <Link to="/compose/tweet" state={{ background: location }}>
            <button className={'NavPostButton'}>게시하기</button>
          </Link>
        </div>
        <div className={'NavLogoutButtonDiv'}>
          <button className={'NavLogoutButton'} onClick={onLogOutClick}>
            Log Out
          </button>
        </div>
      </div>

      <div className={'NavUserObjDiv'}>
        <div className={'NavpfpDiv'}>
          <img className={'Navpfp'} src={userObj.photoURL} />
        </div>
        <div className={'NavUserObjInfo'}>
          <span>{userObj.displayName}</span>
          <span>{userObj.id}</span>
        </div>
      </div>
    </nav>
  );
};
export default Nav;
