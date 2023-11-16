import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userObjState } from '../util/recoil.jsx';
import useOnClickOutside from '../hooks/useOnClickOutside.jsx';
import { useMediaQuery } from 'react-responsive';
import { dbService } from '../fbase';
import Search from './Search.jsx';
import Nav from './Nav.jsx';
import '../style/Home.css';
import TweetForm from '../components/TweetForm.jsx';
import WriteTweet from '../components/WriteTweet.jsx';

const Home = () => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const [followingPage, setFollowingPage] = useState(false);
  const [tweets, setTweets] = useState([]);

  const navRef = useRef(null);
  const navigate = useNavigate();

  useOnClickOutside(navRef, () => setIsNavOpen(false));

  useEffect(() => {
    setTweets([]);
    if (followingPage) {
      // tweets 컬렉션에서 가져온 데이터를 필터링
      dbService
        .collection('tweets')
        .where('creatorId', 'in', userObj.following) // following 배열에 포함된 경우만 가져오기
        .orderBy('toDBAt', 'desc')
        .onSnapshot((snapshot) => {
          const tweetArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTweets(tweetArray);
        });
    } else {
      dbService
        .collection('tweets')
        .orderBy('toDBAt', 'desc')
        .onSnapshot((snapshot) => {
          const tweetArray = snapshot.docs
            .filter((doc) => doc.data().creatorId !== userObj.uid) // 조건을 만족하는 문서만 필터링
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          setTweets(tweetArray);
        });
    }
  }, [followingPage]);

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
