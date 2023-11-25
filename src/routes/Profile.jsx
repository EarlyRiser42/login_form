import React, { useEffect, useRef, useState } from 'react';
import { dbService } from '../fbase';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { userObjState } from '../util/recoil.jsx';
import {
  BoldText,
  HomeDiv,
  HomeImgDivForMobile,
  HomeMiddleDiv,
  HomeMiddleSwitchFollowDiv,
  NormalText,
} from './Home.jsx';
import Nav from '../components/Nav.jsx';
import { useMediaQuery } from 'react-responsive';
import WriteTweet from '../components/WriteTweet.jsx';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorRetry from '../components/ErrorRetry.jsx';
import TweetsContainer from '../components/TweetsContainer.jsx';
import Explore from './Explore.jsx';
import Information from '../components/Profile/Information.jsx';

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userUid = params.profile;

  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isNavOpen, setIsNavOpen] = useState(false);
  // 지역변수
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState('게시물');
  const navRef = useRef(null);

  const handleTweetClick = (event, tweetId) => {
    // 이벤트 버블링을 막기 위해 해당 이벤트가 이미지 엘리먼트에서 발생한 경우에는 핸들러를 처리하지 않음
    if (
      event.target.tagName.toLowerCase() === 'img' ||
      event.target.closest('img')
    ) {
      return;
    }
    // 이동할 경로 설정
    const newPath = `/${userUid}/${tweetId}`;
    // 경로 변경, url 이동
    navigate(newPath);
  };

  const renderTabText = (tabName) => {
    const isCurrentPage = page === tabName;
    return isCurrentPage ? (
      <BoldText>{tabName}</BoldText>
    ) : (
      <NormalText>{tabName}</NormalText>
    );
  };

  return (
    <HomeDiv $isNavOpen={isNavOpen}>
      <Nav ref={navRef} isNavOpen={isNavOpen} />
      <HomeMiddleDiv>
        <Information />
        <HomeMiddleSwitchFollowDiv>
          <div onClick={() => setPage('게시물')}>{renderTabText('게시물')}</div>
          <div onClick={() => setPage('답글')}>{renderTabText('답글')}</div>
          <div onClick={() => setPage('미디어')}>{renderTabText('미디어')}</div>
          <div onClick={() => setPage('마음에 들어요')}>
            {renderTabText('마음에 들어요')}
          </div>
        </HomeMiddleSwitchFollowDiv>
      </HomeMiddleDiv>
      {!useMediaQuery({ query: '(max-width: 1000px)' }) && <Explore />}
    </HomeDiv>
  );
};

export default Profile;
