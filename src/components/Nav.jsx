import React, { forwardRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService, dbService } from '../fbase.js';
import { useRecoilState } from 'recoil';
import {
  errorState,
  loginState,
  ModalOpenState,
  profileImage,
  userObjState,
} from '../util/recoil.jsx';
import { deleteCookie } from '../util/cookie.jsx';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

const Nav = forwardRef(({ isNavOpen }, ref) => {
  // for modal
  const navigate = useNavigate();
  const location = useLocation();

  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);
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
    const isCurrentLocation = location.pathname === linkTo;
    return (
      <StyledNavHomeIcon>
        <div>
          <Link to={linkTo}>
            {!isCurrentLocation && <img src={imgSrc + '.svg'} alt={imgAlt} />}
            {isCurrentLocation && (
              <img src={imgSrc + '_dark.svg'} alt={imgAlt} />
            )}
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
    mobile,
  }) => {
    return (
      <StyledNavButtonDiv>
        {type === 'post' ? (
          <div>
            <Link to={linkTo} state={state}>
              <button className="NavPostButton" onClick={onClick}>
                {buttonText}
              </button>
              <div className={mobile ? 'NavPostImgDivMobile' : 'NavPostImgDiv'}>
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
      {isMobile && (
        <NavButton
          type="post"
          linkTo="/compose/tweet"
          buttonText="게시하기"
          imgSrc="/write_tweet.svg"
          imgAlt="writeTweet"
          mobile="true"
          state={{ background: location }}
        />
      )}
      {isMobile && isNavOpen && (
        <StyledNavDiv ref={ref}>
          <StyledNavLinkDiv>
            <StyledNavUserObjDiv>
              <StyledNavpfpDiv>
                <StyledNavpfp src={pfp} alt="Profile" />
                <StyledNavpfpLogoutImg
                  onClick={onLogOutClick}
                  src="/logout.svg"
                  alt="Logout"
                />
              </StyledNavpfpDiv>
              <StyledNavUserObjInfo>
                <StyledNavUserObjInfoBold>
                  {userObj.displayName}
                </StyledNavUserObjInfoBold>
                <span>{userObj.id}</span>
              </StyledNavUserObjInfo>
              <StyledNavUserObjFollow>
                <span>
                  <span>{userObj.following.length}</span>
                  팔로우 중
                </span>
                <span>
                  <span> {userObj.follower.length}</span>
                  팔로워
                </span>
              </StyledNavUserObjFollow>
            </StyledNavUserObjDiv>
            <NavIconDiv
              imgSrc={'./home'}
              imgAlt={'home'}
              linkTo={'/'}
              linkText={'홈'}
            />
            <NavIconDiv
              imgSrc={'./explore'}
              imgAlt={'explore'}
              linkTo={`/explore`}
              linkText={'검색'}
            />
            <NavIconDiv
              imgSrc={'/profile'}
              imgAlt={'profile'}
              linkTo={`/profile/${userObj.uid}`}
              linkText={'프로필'}
            />
            <NavIconDiv
              imgSrc={'./message'}
              imgAlt={'message'}
              linkTo={`/message`}
              linkText={'메시지'}
            />
            <NavIconDiv
              imgSrc={'./bookmark'}
              imgAlt={'bookmark'}
              linkTo={`/bookmark`}
              linkText={'북마크'}
            />
            <StyledNavline className={'Navline'}></StyledNavline>
          </StyledNavLinkDiv>
        </StyledNavDiv>
      )}
      {!isMobile && (
        <StyledNavDiv>
          <StyledNavLinkDiv className={'NavLinkDiv'}>
            <NavIconDiv imgSrc={'./X_logo'} imgAlt={'X_logo'} />
            <NavIconDiv
              imgSrc={'./home'}
              imgAlt={'home'}
              linkTo={'/'}
              linkText={'홈'}
            />
            <NavIconDiv
              imgSrc={'./explore'}
              imgAlt={'search'}
              linkTo={`/search`}
              linkText={'검색'}
            />
            <NavIconDiv
              imgSrc={'./profile'}
              imgAlt={'profile'}
              linkTo={`/profile/${userObj.uid}`}
              linkText={'프로필'}
            />
            <NavIconDiv
              imgSrc={'./message'}
              imgAlt={'message'}
              linkTo={`/message`}
              linkText={'메시지'}
            />
            <NavIconDiv
              imgSrc={'./bookmark'}
              imgAlt={'bookmark'}
              linkTo={`/bookmark`}
              linkText={'북마크'}
            />
            <NavButton
              type="post"
              linkTo="/compose/tweet"
              buttonText="게시하기"
              onClick={() => {}}
              imgSrc="./write_tweet.svg"
              imgAlt="writeTweet"
              mobile={false}
              state={{ background: location }}
            />
            <NavButton
              type="logout"
              linkTo="./"
              onClick={onLogOutClick}
              buttonText="Log Out"
              imgSrc="./logout.svg"
              mobile="false"
              imgAlt="Logout"
            />
          </StyledNavLinkDiv>
          <StyledNavUserObjDiv>
            <StyledNavpfpDiv>
              <StyledNavpfp src={pfp} alt="Profile" />
            </StyledNavpfpDiv>
            <StyledNavUserObjInfo>
              <StyledNavUserObjInfoBold>
                {userObj.displayName}
              </StyledNavUserObjInfoBold>
              <span>{userObj.id}</span>
            </StyledNavUserObjInfo>
          </StyledNavUserObjDiv>
        </StyledNavDiv>
      )}
    </>
  );
});

const StyledNavDiv = styled.nav`
  position: fixed;
  display: flex;
  flex-direction: column;
  margin-left: 11vw;
  width: 17vw;
  height: 100vh;
  justify-content: space-between;
  border-right: 1px solid rgba(0, 0, 0, 0.1);

  @media (max-width: 1280px) {
    margin-left: 6vw;
    width: 10vw;
  }

  @media (max-width: 1000px) {
    margin-left: 9vw;
    width: 10vw;
  }

  @media (max-width: 500px) {
    margin-left: 0vw;
    width: 65vw;
    position: absolute;
    z-index: 100;
    background: white;
  }
`;

const StyledNavLinkDiv = styled.div`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media (max-width: 1280px), (max-width: 1000px) {
    width: 100%;
  }
`;

const StyledNavUserObjDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 10vh;
  border-radius: 40px;

  &:hover {
    background-color: #e7e7e8;
  }

  @media (max-width: 1280px), (max-width: 1000px) {
    flex-direction: row;
    justify-content: center;
    width: 10vw;
    height: 10vh;
    margin-left: 0px;
  }

  @media (max-width: 500px) {
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    width: 98%;
    margin-left: 2%;
    margin-top: 2%;
    height: 20%;
  }
`;

const StyledNavpfpDiv = styled.div`
  margin-left: 15%;

  @media (max-width: 1280px) {
    margin-left: 0px;
  }

  @media (max-width: 500px) {
    margin-left: 0px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

const StyledNavpfpLogoutImg = styled.img`
  width: 20px;
  height: 20px;
  margin-top: 2%;
  margin-right: 5%;
`;

const StyledNavpfp = styled.img`
  border-radius: 50px;
  width: 50px;
  height: 50px;

  @media (max-width: 500px) {
    margin-left: 5%;
  }
`;

const StyledNavUserObjInfo = styled.div`
  margin-left: 10%;
  display: flex;
  flex-direction: column;

  @media (max-width: 1280px) {
    span {
      display: none;
    }
  }

  @media (max-width: 500px) {
    height: auto;
    margin-top: 3%;
    margin-left: 5%;
    span {
      display: inline;
    }
  }
`;
const StyledNavUserObjInfoBold = styled.span`
  font-weight: bolder;
`;
const StyledNavUserObjFollow = styled.div`
  @media (max-width: 500px) {
    margin-top: 2%;
    margin-left: 5%;
    display: flex;
    align-items: center;
    width: 100%;
    span {
      margin-right: 5px;
      font-size: 0.8rem;
      span {
        margin-right: 2px;
        font-weight: bold;
        font-size: 1rem;
      }
    }
  }
`;
const StyledNavline = styled.div`
  @media (max-width: 500px) {
    content: '';
    width: 95%;
    margin-top: 20px;
    background: rgba(0, 0, 0, 0.1);
    height: 2px;
    font-size: 0px;
    line-height: 0px;
  }
`;
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
    width: 98%;
    margin-left: 2%;
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

    .NavLogoutImgDiv {
      background-color: white;
    }

    .NavLogoutImgDiv:hover {
      background-color: #e7e7e8;
    }

    .NavPostImgDiv {
      background-color: #4a99e9;
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

    .NavPostImgDivMobile {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      bottom: 3%;
      right: 3%;
      background-color: #4a99e9;
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
