import React, { useState, useEffect, useRef, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilState } from 'recoil';
import { ModalOpenState, userObjState } from '../util/recoil.jsx';
import useOnClickOutside from '../hooks/useOnClickOutside.jsx';
import { useMediaQuery } from 'react-responsive';
import Explore from './Explore.jsx';
import Nav from '../components/Nav.jsx';
import Loading from '../components/Loading.jsx';
import ErrorRetry from '../components/ErrorRetry.jsx';
import styled from 'styled-components';
import WriteTweet from '../components/WriteTweet.jsx';

const TweetsContainer = React.lazy(() =>
  import('../components/TweetsContainer.jsx'),
);

const Home = () => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);

  const [followingPage, setFollowingPage] = useState(false);

  const navRef = useRef(null);
  useOnClickOutside(navRef, () => setIsNavOpen(false));

  // 모달 창 열릴시 부모 요소 스크롤 차단
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

  return (
    <HomeDiv $isNavOpen={isNavOpen}>
      <Nav ref={navRef} isNavOpen={isNavOpen} />
      <HomeImgDivForMobile>
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
      </HomeImgDivForMobile>
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
  }

  @media (max-width: 1000px) {
    width: 600px;
    margin-left: 19vw;
  }

  @media (max-width: 500px) {
    margin-left: 0;
    width: 100vw;
    height: 95vh;
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

export const HomeImgDivForMobile = styled.div`
  display: none;
  @media (max-width: 500px) {
    display: flex;
    height: 5vh;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .HomeOpenNavImg {
    margin-left: 2%;
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
    margin-top: 10px;
    margin-right: 20px;
  }
`;

export default Home;
