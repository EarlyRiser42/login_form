import React, { useState, useEffect, useRef, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilState } from 'recoil';
import {
  ModalOpenState,
  PopUpOpenState,
  toastTextState,
  userObjState,
} from '../util/recoil.jsx';
import useOnClickOutside from '../hooks/useOnClickOutside.jsx';
import { useMediaQuery } from 'react-responsive';
import Explore from './Explore.jsx';
import Nav from '../components/Nav.jsx';
import Loading from '../components/Loading.jsx';
import ErrorRetry from '../components/ErrorRetry.jsx';
import styled from 'styled-components';
import WriteTweet from '../components/WriteTweet.jsx';
import Toast from '../components/toast.jsx';

const TweetsContainer = React.lazy(() =>
  import('../components/TweetsContainer.jsx'),
);

const Home = () => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);
  const [isPopUpOpen, setIsPopUpOpen] = useRecoilState(PopUpOpenState);
  const [toastText, setToastText] = useRecoilState(toastTextState);
  // 지역변수
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [followingPage, setFollowingPage] = useState(false);

  const navRef = useRef(null);
  useOnClickOutside(navRef, () => setIsNavOpen(false));

  // 모달, 팝업 창 열릴시 부모 요소 스크롤 차단
  useEffect(() => {
    if (isModalOpen || isPopUpOpen || isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen, isPopUpOpen, isNavOpen]);

  const isMobile = useMediaQuery({ query: '(max-width: 500px)' });

  return (
    <HomeDiv $isNavOpen={isNavOpen}>
      <Nav ref={navRef} isNavOpen={isNavOpen} />
      {isMobile && (
        <HomeNavDiv>
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
        </HomeNavDiv>
      )}
      <HomeMiddleDiv>
        <HomeMiddleSwitchFollowDiv>
          <div onClick={() => setFollowingPage(false)}>
            {followingPage ? (
              <NormalText>추천</NormalText>
            ) : (
              <BoldText>추천</BoldText>
            )}
          </div>
          <div onClick={() => setFollowingPage(true)}>
            {followingPage ? (
              <BoldText>팔로우 중</BoldText>
            ) : (
              <NormalText>팔로우 중</NormalText>
            )}
          </div>
        </HomeMiddleSwitchFollowDiv>
        {!useMediaQuery({ query: '(max-width: 500px)' }) && (
          <WriteTweet userObj={userObj} />
        )}
        {!followingPage && (
          <ErrorBoundary
            FallbackComponent={() => (
              <ErrorRetry queryKey={['getTweets', followingPage]} />
            )}
          >
            <Suspense
              fallback={
                <Loading forComponent={true} isCircleAtCenter={false} />
              }
            >
              <TweetsContainer followingPage={followingPage} />
            </Suspense>
          </ErrorBoundary>
        )}
        {followingPage && (
          <ErrorBoundary
            FallbackComponent={() => (
              <ErrorRetry queryKey={['getTweets', followingPage]} />
            )}
          >
            <Suspense
              fallback={
                <Loading forComponent={true} isCircleAtCenter={false} />
              }
            >
              <TweetsContainer followingPage={followingPage} />
            </Suspense>
          </ErrorBoundary>
        )}
        {toastText.text && <Toast></Toast>}
      </HomeMiddleDiv>
      {!useMediaQuery({ query: '(max-width: 1000px)' }) && <Explore />}
    </HomeDiv>
  );
};

export const HomeDiv = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  @media (max-width: 500px) {
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    display: flex;
    background-color: ${(props) => (props.$isNavOpen ? 'gray' : 'transparent')};
  }
`;

export const HomeMiddleDiv = styled.div`
  margin-left: 28vw; /* nav의 크기 */
  width: 39vw;
  height: 100vh;

  @media (max-width: 1280px) {
    margin-left: 16vw;
    width: 46vw;
    height: 100vh;
    height: 100dvh;
    overflow-y: scroll;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 1000px) {
    width: 600px;
    margin-left: 19vw;
  }

  @media (max-width: 500px) {
    margin-left: 0;
    width: 100vw;
    height: 95vh;
    height: 95dvh;
  }
`;

export const HomeMiddleSwitchFollowDiv = styled.div`
  display: flex;
  flex-direction: row;

  div {
    width: 50%;
    min-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: #e7e7e8;
      cursor: pointer;
    }
  }
`;

export const BoldText = styled.span`
  font-weight: bold;
`;

export const NormalText = styled.span`
  font-weight: normal;
`;

const HomeNavDiv = styled.div`
  display: flex;
  height: 7vh;
  height: 7dvh;
  background-color: transparent;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .HomeOpenNavImg {
    margin-left: 4%;
    border-radius: 50px;
    width: 40px;
    height: 40px;
  }

  .HomeX_logo {
    width: 25px;
    height: 25px;
  }

  .HomeOpenSetting {
    border-radius: 50px;
    width: 20px;
    height: 20px;
    margin-top: 1%;
    margin-right: 4%;
  }
`;

export default Home;
