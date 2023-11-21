import TweetForm from './TweetForm.jsx';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ModalOpenState, Tweets, userObjState } from '../util/recoil.jsx';
import { useQuery } from 'react-query';
import axios from 'axios';

const TweetDiv = ({ followingPage }) => {
  // 전역변수 recoil

  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [tweets, setTweets] = useRecoilState(Tweets);
  // 지역변수
  const navigate = useNavigate();

  const {
    data: fetchtweet,
    isLoading: tweetsLoading,
    error: tweetsError,
  } = useQuery(
    ['getTweets', followingPage],
    () => {
      const requestData = {
        following: userObj.following,
        userId: userObj.uid,
        followingPage,
      };
      return axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/getTweets`,
        requestData,
      );
    },
    {
      cacheTime: 60000 * 25, // 캐시 유지 시간: 25분
      staleTime: 60000 * 25, // 스테일 데이터 시간: 25분
      retry: false,
      enabled: !!userObj.uid,
      suspense: true,
    },
  );

  useEffect(() => {
    if (fetchtweet) {
      setTweets(fetchtweet.data);
    }
    if (tweetsError) {
      throw new Error('Error fetching tweets');
    }
  }, [fetchtweet, tweetsError]);

  const handleTweetClick = (event, writeObj, tweetId) => {
    // 이벤트 버블링을 막기 위해 해당 이벤트가 이미지 엘리먼트에서 발생한 경우에는 핸들러를 처리하지 않음
    if (
      event.target.tagName.toLowerCase() === 'img' ||
      event.target.closest('img')
    ) {
      return;
    }
    // 이동할 경로 설정
    const newPath = `/${writeObj.uid}/${tweetId}`;
    // 경로 변경, url 이동
    navigate(newPath);
  };

  return (
    <div>
      {tweets.map((tweet) => (
        <div
          key={tweet.id}
          onClick={(event) =>
            handleTweetClick(event, tweet.creatorId, tweet.tweetId)
          }
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
  );
};

export default TweetDiv;
