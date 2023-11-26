import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BoldText,
  HomeDiv,
  HomeMiddleDiv,
  HomeMiddleSwitchFollowDiv,
  NormalText,
} from './Home.jsx';
import Nav from '../components/Nav.jsx';
import { useMediaQuery } from 'react-responsive';
import Explore from './Explore.jsx';
import Information from '../components/Profile/Information.jsx';
import PostsContainer from '../components/Profile/PostsContainer.jsx';
import MentionsContainer from '../components/Profile/MentionsContainer.jsx';
import MediaContainer from '../components/Profile/MediaContainer.jsx';
import LikesContainer from '../components/Profile/LikesContainer.jsx';

const Profile = () => {
  const params = useParams();

  // 전역변수 recoil
  const [isNavOpen, setIsNavOpen] = useState(false);
  // 지역변수
  const [myTweets, setMyTweets] = useState([]);
  const [myMentions, setMyMentions] = useState([]);
  const [myLikes, setMyLikes] = useState([]);
  const [pageName, setPageName] = useState('게시물');
  const navRef = useRef(null);

  const renderTabText = (tabName) => {
    const isCurrentPage = pageName === tabName;
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
          <div onClick={() => setPageName('게시물')}>
            {renderTabText('게시물')}
          </div>
          <div onClick={() => setPageName('답글')}>{renderTabText('답글')}</div>
          <div onClick={() => setPageName('미디어')}>
            {renderTabText('미디어')}
          </div>
          <div onClick={() => setPageName('마음에 들어요')}>
            {renderTabText('마음에 들어요')}
          </div>
        </HomeMiddleSwitchFollowDiv>
        {pageName === '게시물' && (
          <PostsContainer
            tweets={myTweets}
            setTweets={setMyTweets}
            pageName={pageName}
          />
        )}
        {pageName === '답글' && (
          <MentionsContainer
            tweets={myTweets}
            setTweets={setMyTweets}
            pageName={pageName}
          />
        )}
        {pageName === '미디어' && (
          <MediaContainer
            tweets={myTweets}
            setTweets={setMyTweets}
            pageName={pageName}
          />
        )}{' '}
        {pageName === '마음에 들어요' && (
          <LikesContainer
            tweets={myTweets}
            setTweets={setMyTweets}
            pageName={pageName}
          />
        )}
      </HomeMiddleDiv>
      {!useMediaQuery({ query: '(max-width: 1000px)' }) && <Explore />}
    </HomeDiv>
  );
};

export default Profile;
