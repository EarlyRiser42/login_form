import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userObjState } from '../util/recoil.jsx';
import useOnClickOutside from '../hooks/useOnClickOutside.jsx';
import { useMediaQuery } from 'react-responsive';
import Search from './Search.jsx';
import Nav from './Nav.jsx';
import TweetForm from '../components/TweetForm.jsx';
import WriteTweet from '../components/WriteTweet.jsx';
import { useQuery } from 'react-query';
import '../style/Home.css';
import axios from 'axios';

const Home = () => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const [tweets, setTweets] = useState([]);
  const [followingPage, setFollowingPage] = useState(false);

  const navRef = useRef(null);
  const navigate = useNavigate();

  useOnClickOutside(navRef, () => setIsNavOpen(false));

  const {
    data: fetchtweet,
    isLoading: tweetsLoading,
    error: tweetsError,
  } = useQuery(
    'getTweets',
    () => {
      const requestData = {
        following: userObj.following, // 배열을 직접 본문에 넣음
        userId: userObj.uid,
        followingPage,
      };

      return axios
        .post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/getTweets`,
          requestData,
        )
        .catch((error) => {
          console.log(error);
        });
    },
    {
      cacheTime: 60000 * 25, // 캐시 유지 시간: 25분
      staleTime: 60000 * 25, // 스테일 데이터 시간: 25분
      retry: 3,
      enabled: !!userObj.uid,
    },
  );

  useEffect(() => {
    if (fetchtweet) {
      setTweets(fetchtweet.data);
    }
  }, [fetchtweet, tweetsError]);

  const handleTweetClick = (event, tweetId) => {
    // 이벤트 버블링을 막기 위해 해당 이벤트가 이미지 엘리먼트에서 발생한 경우에는 핸들러를 처리하지 않음
    if (
      event.target.tagName.toLowerCase() === 'img' ||
      event.target.closest('img')
    ) {
      return;
    }

    // 이동할 경로 설정
    const newPath = `/${userObj.uid}/${tweetId}`;

    // 경로 변경, url 이동
    navigate(newPath);
  };

  return (
    <div className={isNavOpen ? 'HomeDivNavOpen' : 'HomeDiv'}>
      <Nav ref={navRef} isNavOpen={isNavOpen} />
      <div className={'HomeImgDivForMobile'}>
        <img
          className={'HomeOpenNavImg'}
          src={userObj.photoURL}
          alt={'OpenNav'}
          onClick={() => {
            setIsNavOpen(true);
          }}
        />
        <img className={'HomeX_logo'} src={'./X_logo.svg'} alt={'X_logo'} />
        <img
          className={'HomeOpenSetting'}
          src={'./setting.svg'}
          alt={'OpenSetting'}
        />
      </div>
      <div className={'HomeRightDiv'}>
        <div className={'HomeRightSwitchFollowDiv'}>
          <div
            onClick={() => {
              setFollowingPage(false);
            }}
          >
            <span className={followingPage ? 'notbold' : 'bold'}>추천</span>
          </div>
          <div
            onClick={() => {
              setFollowingPage(true);
            }}
          >
            <span className={followingPage ? 'bold' : 'notbold'}>
              팔로우 중
            </span>
          </div>
        </div>
        {!followingPage && (
          <div>
            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                onClick={(event) => handleTweetClick(event, tweet.tweetId)}
                style={{ cursor: 'pointer' }}
              >
                <TweetForm
                  key={tweet.id}
                  userObj={userObj}
                  writeObj={tweet}
                  isOwner={tweet.creatorId === userObj.uid}
                  tweetPage={false}
                />
              </div>
            ))}
          </div>
        )}
        {followingPage && (
          <div style={{ marginTop: 30 }}>
            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                onClick={(event) => handleTweetClick(event, tweet.tweetId)}
                style={{ cursor: 'pointer' }}
              >
                <TweetForm
                  key={tweet.id}
                  userObj={userObj}
                  writeObj={tweet}
                  isOwner={tweet.creatorId === userObj.uid}
                  tweetPage={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {!useMediaQuery({ query: '(max-width: 1000px)' }) && <Search />}
    </div>
  );
};
export default Home;

//         <WriteTweet userObj={userObj} />
