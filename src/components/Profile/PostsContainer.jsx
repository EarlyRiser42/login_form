import TweetForm from '../TweetForm.jsx';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ModalOpenState, userObjState } from '../../util/recoil.jsx';
import { useIntersect } from '../../hooks/useIntersect.jsx';
import Loading from '../Loading.jsx';
import styled from 'styled-components';
import { useGetMentions } from '../../hooks/useGetMentions.jsx';

const PostsContainer = ({ myTweets }) => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);

  const navigate = useNavigate();

  const handleTweetClick = (event, tweet, tweetId) => {
    // 이벤트 버블링을 막기 위해 해당 이벤트가 이미지 엘리먼트에서 발생한 경우에는 핸들러를 처리하지 않음
    if (
      event.target.tagName.toLowerCase() === 'img' ||
      event.target.closest('img')
    ) {
      return;
    }
    navigate(`/${tweet.creatorId}/${tweetId}`, { state: { tweet } });
  };

  return (
    <div>
      {myTweets.map((myTweets) => (
        <div
          key={myTweets.id}
          onClick={(event) =>
            handleTweetClick(event, myTweets, myTweets.tweetId)
          }
          style={{ cursor: 'pointer' }}
        >
          <TweetForm
            key={myTweets.id}
            userObj={userObj}
            writeObj={myTweets}
            isOwner={myTweets.creatorId === userObj.uid}
            isModal={false}
            isMention={false}
          />
        </div>
      ))}
    </div>
  );
};

export default PostsContainer;
