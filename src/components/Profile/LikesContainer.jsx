import TweetForm from '../TweetForm.jsx';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntersect } from '../../hooks/useIntersect.jsx';
import Loading from '../Loading.jsx';
import styled from 'styled-components';
import { useGetMyTweets } from '../../hooks/useGetMyTweets.jsx';

const LikesContainer = ({ userInfo, pageName }) => {
  const navigate = useNavigate();

  const { data, hasNextPage, isFetching, fetchNextPage } = useGetMyTweets({
    size: 10, // 페이지 당 트윗 수
    userInfo,
    pageName,
  });

  const fetchedLikes = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.contents) : []),
    [data],
  );

  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  });

  const handleTweetClick = (event, tweet, tweetId) => {
    // 이벤트 버블링을 막기 위해 해당 이벤트가 이미지 엘리먼트에서 발생한 경우에는 핸들러를 처리하지 않음
    if (
      event.target.tagName.toLowerCase() === 'svg' ||
      event.target.closest('svg') ||
      event.target.tagName.toLowerCase() === 'img' ||
      event.target.closest('img') ||
      event.target.tagName.toLowerCase() === 'button' ||
      event.target.closest('button')
    ) {
      return;
    }

    navigate(`/${tweet.creatorId}/${tweetId}`, { state: { tweet } });
  };

  return (
    <div>
      {fetchedLikes.map((tweet) => (
        <div
          key={tweet.id}
          onClick={(event) => handleTweetClick(event, tweet, tweet.tweetId)}
          style={{ cursor: 'pointer' }}
        >
          <TweetForm
            key={tweet.id}
            writeObj={tweet}
            isOwner={tweet.creatorId === userInfo.uid}
            isModal={false}
            isMention={false}
          />
        </div>
      ))}
      {isFetching && <Loading forComponent={true} />}
      <Target ref={ref} />
    </div>
  );
};

const Target = styled.div`
  height: 1px;
`;

export default LikesContainer;
