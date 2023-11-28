import React, { useState, useEffect } from 'react';
import { dbService } from '../fbase';
import TweetForm from '../components/TweetForm';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Explore from './Explore.jsx';
import Nav from '../components/Nav.jsx';
import styled from 'styled-components';
import { HomeDiv, HomeImgDivForMobile, HomeMiddleDiv } from './Home.jsx';
import { useMediaQuery } from 'react-responsive';
import { useRecoilState } from 'recoil';
import { userObjState } from '../util/recoil.jsx';
import WriteMention from '../components/WriteMention.jsx';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorRetry from '../components/ErrorRetry.jsx';
import MentionsContainer from '../components/MentionsContainer.jsx';

const TweetDetail = () => {
  const { state } = useLocation();
  const writeObj = state.tweet;

  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);

  // 지역변수
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <HomeDiv>
      <Nav />
      <HomeMiddleDiv>
        <NavContainer>
          <img
            src={'./left_arrow.svg'}
            onClick={() => {
              navigate(-1);
            }}
          />
          <span>게시하기</span>
        </NavContainer>
        <TweetForm
          userObj={userObj}
          writeObj={writeObj}
          isOwner={writeObj.creatorId === userObj.uid}
          tweetPage={true}
          isModal={false}
          isMention={false}
        />
        <WriteMention />
        <ErrorBoundary
          FallbackComponent={() => (
            <ErrorRetry queryKey={['getTweets', false]} />
          )}
        >
          <MentionsContainer
            mentionPage={writeObj.MentionList}
            followingPage={false}
          />
        </ErrorBoundary>
      </HomeMiddleDiv>
      {!useMediaQuery({ query: '(max-width: 1000px)' }) && <Explore />}
    </HomeDiv>
  );
};

export const NavContainer = styled.div`
  width: 100%;
  height: 10%;
  min-height: 47px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 19px;
    height: 19px;
    margin-left: 3%;
  }
  img:hover {
    cursor: pointer;
  }
  span {
    font-weight: bold;
    margin-left: 7%;
    font-size: 1.3rem;
  }
`;

export default TweetDetail;
