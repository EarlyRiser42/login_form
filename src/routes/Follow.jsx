import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRecoilState } from 'recoil';
import { ModalOpenState, userObjState } from '../util/recoil.jsx';
import { useMediaQuery } from 'react-responsive';
import Explore from './Explore.jsx';
import Nav from '../components/Nav.jsx';
import {
  BoldText,
  HomeDiv,
  HomeMiddleDiv,
  HomeMiddleSwitchFollowDiv,
  NormalText,
} from './Home.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import FollowsContainer from '../components/Profile/FollowsContainer.jsx';
import { NavContainer } from './TweetDetail.jsx';

const Follow = () => {
  // 전역변수 recoil
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userInfo = location.state.userInfo;
  const [followingPage, setFollowingPage] = useState(
    location.state.isFollowing,
  );
  console.log(userInfo);
  const navRef = useRef(null);

  return (
    <HomeDiv $isNavOpen={isNavOpen}>
      <Nav ref={navRef} isNavOpen={isNavOpen} />
      <HomeMiddleDiv>
        <NavContainer>
          <img
            src={'./left_arrow.svg'}
            onClick={() => {
              navigate(-1);
            }}
          />
          <span>{userInfo.displayName}</span>
        </NavContainer>
        <HomeMiddleSwitchFollowDiv>
          <div onClick={() => setFollowingPage(false)}>
            {followingPage ? (
              <NormalText>팔로워</NormalText>
            ) : (
              <BoldText>팔로잉</BoldText>
            )}
          </div>
          <div onClick={() => setFollowingPage(true)}>
            {followingPage ? (
              <BoldText>팔로잉</BoldText>
            ) : (
              <NormalText>팔로워</NormalText>
            )}
          </div>
        </HomeMiddleSwitchFollowDiv>
        {!followingPage && <FollowsContainer followList={userInfo.follower} />}
        {followingPage && <FollowsContainer followList={userInfo.following} />}
      </HomeMiddleDiv>
      {!useMediaQuery({ query: '(max-width: 1000px)' }) && <Explore />}
    </HomeDiv>
  );
};

export default Follow;
