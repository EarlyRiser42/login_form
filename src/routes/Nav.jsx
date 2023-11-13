import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService, dbService } from '../fbase';
import { useRecoilState } from 'recoil';
import { loginState, userObjState } from '../util/recoil.jsx';
import { deleteCookie } from '../util/cookie.jsx';
import styled from 'styled-components';
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

  const NavIconDiv = ({ imgSrc, imgAlt, linkTo, linkText }) => {
    return (
      <StyledNavHomeIcon>
        <Link to={linkTo}>
          <img src={imgSrc} alt={imgAlt} width="30px" height="30px" />
          <span>{linkText}</span>
        </Link>
      </StyledNavHomeIcon>
    );
  };

  const NavButton = ({
    type,
    linkTo,
    onClick,
    buttonText,
    imgSrc,
    imgAlt,
    state,
  }) => {
    return (
      <StyledNavButtonDiv>
        {type === 'post' ? (
          <div>
            <Link to={linkTo} state={state}>
              <button className="NavPostButton">{buttonText}</button>
              <img className="NavPostImg" src={imgSrc} alt={imgAlt} />
            </Link>
          </div>
        ) : (
          <div>
            <button className="NavLogoutButton" onClick={onClick}>
              {buttonText}
            </button>
            <img className="NavLogoutImg" src={imgSrc} alt={imgAlt} />
          </div>
        )}
      </StyledNavButtonDiv>
    );
  };

  return (
    <nav className={'NavDiv'}>
      <div className={'NavLinkDiv'}>
        <div className={'NavLogoDiv'}>
          <img className={'NavXLogo'} src="/X_logo.svg" alt="X logo" />
        </div>
        <NavIconDiv
          imgSrc={'./home.png'}
          imgAlt={'LinkToHome'}
          linkTo={'/'}
          linkText={'홈'}
        />
        <NavIconDiv
          imgSrc={'./user-profile.png'}
          imgAlt={'LinkToUserProfile'}
          linkTo={`/profile/${userObj.uid}`}
          linkText={'프로필'}
        />
        <NavButton
          type="post"
          linkTo="/compose/tweet"
          buttonText="게시하기"
          imgSrc="./write_tweet.png"
          imgAlt="writeTweet"
          state={{ background: location }}
        />

        <NavButton
          type="logout"
          onClick={onLogOutClick}
          buttonText="Log Out"
          imgSrc="./logout.svg"
          imgAlt="Logout"
        />
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

const StyledNavHomeIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  width: 100%;
  height: 40px;
  border-radius: 40px;
  border: none;
  background-color: white;
  font-size: 16px;
  font-weight: 550;
  color: black;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: #e7e7e8;
  }

  a,
  a:visited,
  a:hover,
  a:active {
    margin-left: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: normal;
    font-size: 1.2rem;
    color: black;
    text-decoration: none;
  }

  a span {
    margin-left: 30px;
  }
`;

const StyledNavButtonDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  div {
    width: 80%;
  }
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    padding: 10px 20px;
    border-radius: 25px;
    border: none;
    font-size: 16px;
    font-weight: 550;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .NavPostButton {
    background-color: #4a99e9;
    color: white;

    &:hover {
      background-color: #198cd8;
    }
  }

  .NavLogoutButton {
    background-color: white;
    color: black;

    &:hover {
      background-color: #e7e7e8;
    }
  }

  img {
    display: none;
  }

  @media (max-width: 1280px) {
    .NavPostButton {
      display: none;
    }

    .NavPostImg {
      display: flex;
      width: 60px;
      height: 60px;
    }

    .NavLogoutButton {
      display: none;
    }

    .NavLogoutImg {
      display: flex;
      width: 40px;
      height: 40px;
    }
  }

  @media (max-width: 500px) {
  }
`;
export default Nav;
