import TweetForm from './TweetForm.jsx';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ModalOpenState, userObjState } from '../util/recoil.jsx';
import { useIntersect } from '../hooks/useIntersect.jsx';
import Loading from './Loading.jsx';
import styled from 'styled-components';
import { useGetMentions } from '../hooks/useGetMentions.jsx';

const MentionsContainer = ({ mentionPage }) => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);

  // 지역변수
  const [mentions, setMentions] = useState([]);
  const navigate = useNavigate();

  const { data, hasNextPage, isFetching, fetchNextPage } = useGetMentions({
    size: 10, // 페이지 당 트윗 수
    userObj,
    mentionPage,
  });

  const fetchedTweets = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.contents) : []),
    [data],
  );

  // 불러온 트윗 데이터를 전역 Recoil 상태로 설정
  useEffect(() => {
    setMentions(fetchedTweets);
  }, [fetchedTweets]);

  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  });

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
      {mentions.map((mention) => (
        <div
          key={mention.id}
          onClick={(event) => handleTweetClick(event, mention, mention.tweetId)}
          style={{ cursor: 'pointer' }}
        >
          <TweetForm
            key={mention.id}
            userObj={userObj}
            writeObj={mention}
            isOwner={mention.creatorId === userObj.uid}
            isModal={false}
            isMention={true}
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

export default MentionsContainer;
