import React, { useState, useEffect } from 'react';
import { dbService } from '../fbase';
import TweetForm from '../components/TweetForm';
import { useLocation, useNavigate } from 'react-router-dom';
import Explore from './Explore.jsx';
import Nav from '../components/Nav.jsx';
import styled from 'styled-components';
import { HomeDiv, HomeMiddleDiv } from './Home.jsx';
import { useMediaQuery } from 'react-responsive';
import { useRecoilState } from 'recoil';
import { toastTextState, userObjState } from '../util/recoil.jsx';
import WriteMention from '../components/WriteMention.jsx';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorRetry from '../components/ErrorRetry.jsx';
import MentionsContainer from '../components/MentionsContainer.jsx';
import { getDocs, query, collection, where } from 'firebase/firestore';
import Toast from '../components/toast.jsx';

const TweetDetail = () => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [toastText, setToastText] = useRecoilState(toastTextState);
  const navigate = useNavigate();
  const { state } = useLocation();
  //  지역변수
  const [originTweet, setOriginTweet] = useState({}); // 멘션으로 들어올 경우, 멘션의 원글
  const writeObj = state.tweet;

  const getOriginTweet = async (writeObj) => {
    if (writeObj.MentionTo) {
      const querySnapshot = await getDocs(
        query(
          collection(dbService, 'tweets'),
          where('tweetId', '==', writeObj.MentionTo[0]),
        ),
      );
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setOriginTweet(docSnap.data());
      } else {
        console.log('No such document! failed to load tweet writer id');
      }
    }
  };

  useEffect(() => {
    getOriginTweet(writeObj);
    // 멘션 디테일 페이지에서 뒤로가기 시 원 트윗이 두개 렌더링 되는것 방지
    return () => {
      setOriginTweet({});
    };
  }, [writeObj]);

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
        {originTweet && Object.keys(originTweet).length > 0 && (
          <TweetForm
            writeObj={originTweet}
            isOwner={originTweet.creatorId === userObj.uid}
            tweetPage={true}
            isModal={false}
            isMention={false}
          />
        )}
        <TweetForm
          writeObj={writeObj}
          isOwner={writeObj.creatorId === userObj.uid}
          tweetPage={true}
          isModal={false}
          isMention={false}
        />
        <WriteMention writeObj={writeObj} />
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
        {toastText.text && <Toast></Toast>}
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
