import React, { forwardRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService, dbService } from '../fbase.js';
import { useRecoilState } from 'recoil';
import {
  errorState,
  loginState,
  profileImage,
  userObjState,
} from '../util/recoil.jsx';
import { deleteCookie } from '../util/cookie.jsx';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import '../style/Nav.css';

const Nav = forwardRef(({ isNavOpen }, ref) => {
  // for modal
  const navigate = useNavigate();
  const location = useLocation();

  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const [recoilError, setRecoilError] = useRecoilState(errorState);
  const [pfp, setPfp] = useRecoilState(profileImage);

  const onLogOutClick = () => {
    if (isLoggedIn.social) {
      authService.signOut();
    }
    setIsLoggedIn({ login: false, social: false });
    setUserObj({ displayName: '', uid: '', photoURL: '', id: '' });
    setPfp(
      'https://firebasestorage.googleapis.com/v0/b/loginform-6747a.appspot.com/o/pfp%2Fbasic.png?alt=media&token=d2b2f037-ee93-4fad-a09d-733332ec28fc',
    );
    deleteCookie('accessToken');
    deleteCookie('refreshTokenId');
    navigate('/');
  };

  const NavIconDiv = ({ imgSrc, imgAlt, linkTo, linkText }) => {
    return (
      <StyledNavHomeIcon>
        <div>
          <Link to={linkTo}>
            <img src={imgSrc} alt={imgAlt} />
            <span>{linkText}</span>
          </Link>
        </div>
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
              <div className={'NavPostImgDiv'}>
                <img className="NavPostImg" src={imgSrc} alt={imgAlt} />
              </div>
            </Link>
          </div>
        ) : (
          <div>
            <Link to={linkTo} state={state}>
              <button className="NavLogoutButton" onClick={onClick}>
                {buttonText}
              </button>
              <div className={'NavLogoutImgDiv'} onClick={onClick}>
                <img className="NavLogoutImg" src={imgSrc} alt={imgAlt} />
              </div>
            </Link>
          </div>
        )}
      </StyledNavButtonDiv>
    );
  };

  // 화면 너비 500px이하
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' });

  return (
    <>
      {isMobile ? (
        isNavOpen && (
          <nav className={`NavDiv ${isNavOpen ? 'NavDivOpen' : ''}`} ref={ref}>
            <div className={'NavLinkDiv'}>
              <div className={'NavUserObjDiv'}>
                <div className={'NavpfpDiv'}>
                  <img className={'Navpfp'} src={pfp} />
                  <img
                    className={'NavpfpLogoutImg'}
                    onClick={onLogOutClick}
                    src="./logout.svg"
                    alt="Logout"
                  />
                </div>
                <div className={'NavUserObjInfo'}>
                  <span className={'NavUserObjInfoBold'}>
                    {userObj.displayName}
                  </span>
                  <span>{userObj.id}</span>
                </div>
                <div className={'NavUserObjFollow'}>
                  <span>
                    <span>{userObj.following.length}</span>
                    팔로우 중
                  </span>
                  <span>
                    <span> {userObj.follower.length}</span>
                    팔로워
                  </span>
                </div>
              </div>
              <NavIconDiv
                imgSrc={'./home.png'}
                imgAlt={'Home'}
                linkTo={'/'}
                linkText={'홈'}
              />
              <NavIconDiv
                imgSrc={'./search.png'}
                imgAlt={'Search'}
                linkTo={`/search`}
                linkText={'검색'}
              />
              <NavIconDiv
                imgSrc={'./user-profile.png'}
                imgAlt={'Profile'}
                linkTo={`/profile/${userObj.uid}`}
                linkText={'프로필'}
              />
              <NavIconDiv
                imgSrc={'./message.png'}
                imgAlt={'message'}
                linkTo={`/message`}
                linkText={'메시지'}
              />
              <NavIconDiv
                imgSrc={'./list.png'}
                imgAlt={'list'}
                linkTo={`/list`}
                linkText={'리스트'}
              />
              <div className={'Navline'}></div>
            </div>
          </nav>
        )
      ) : (
        <nav className={'NavDiv'}>
          <div className={'NavLinkDiv'}>
            <NavIconDiv
              imgSrc={'./X_logo.svg'}
              imgAlt={'X_logo'}
              linkTo={'/'}
              linkText={''}
            />
            <NavIconDiv
              imgSrc={'./home.png'}
              imgAlt={'Home'}
              linkTo={'/'}
              linkText={'홈'}
            />
            <NavIconDiv
              imgSrc={'./search.png'}
              imgAlt={'Search'}
              linkTo={`/search`}
              linkText={'검색'}
            />
            <NavIconDiv
              imgSrc={'./user-profile.png'}
              imgAlt={'Profile'}
              linkTo={`/profile/${userObj.uid}`}
              linkText={'프로필'}
            />
            <NavIconDiv
              imgSrc={'./message.png'}
              imgAlt={'message'}
              linkTo={`/message`}
              linkText={'메시지'}
            />
            <NavIconDiv
              imgSrc={'./list.png'}
              imgAlt={'list'}
              linkTo={`/list`}
              linkText={'리스트'}
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
              linkTo="./"
              onClick={onLogOutClick}
              buttonText="Log Out"
              imgSrc="./logout.svg"
              imgAlt="Logout"
            />
          </div>
          <div className={'NavUserObjDiv'}>
            <div className={'NavpfpDiv'}>
              <img className={'Navpfp'} src={pfp} />
            </div>
            <div className={'NavUserObjInfo'}>
              <span className={'NavUserObjInfoBold'}>
                {userObj.displayName}
              </span>
              <span>{userObj.id}</span>
            </div>
          </div>
        </nav>
      )}
    </>
  );
});

const StyledNavHomeIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

  img {
    width: 30px;
    height: 30px;
  }

  div {
    width: 70%;
    display: flex;
  }

  a,
  a:visited,
  a:hover,
  a:active {
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

  @media (max-width: 1280px) {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    div {
      width: 70%;
      display: flex;
    }

    a,
    a:visited,
    a:hover,
    a:active {
      margin-left: 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: normal;
      font-size: 1.2rem;
      color: black;
      text-decoration: none;
    }

    a span {
      display: none;
    }
  }

  @media (max-width: 500px) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img {
      margin-left: 10px;
    }

    a span {
      display: block;
      font-weight: bolder;
    }
  }
`;

const StyledNavButtonDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  div {
    width: 70%;
    display: flex;
  }

  a {
    width: 100%;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 170px;
    height: 50px;
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
    display: flex;
    justify-content: center;
    align-items: center;

    .NavPostButton {
      display: none;
    }

    div {
      width: 60%;
      display: flex;
    }

    div div {
      border-radius: 50px;
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .NavPostImgDiv {
      background-color: #1d9bf0;
    }

    .NavLogoutImgDiv {
      background-color: white;
    }

    .NavLogoutImgDiv:hover {
      background-color: #e7e7e8;
    }

    .NavPostImg {
      display: flex;
      width: 60%;
      height: 60%;
    }

    .NavLogoutButton {
      display: none;
    }

    .NavLogoutImg {
      display: flex;
      width: 60%;
      height: 60%;
    }
  }

  @media (max-width: 500px) {
    align-items: center;
    justify-content: flex-start;

    .NavPostButton {
      display: none;
    }

    .NavPostImgDiv,
    .NavLogoutImgDiv {
      display: none;
    }

    .NavLogoutButton {
      display: none;
    }
  }
`;
export default Nav;
