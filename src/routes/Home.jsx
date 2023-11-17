import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRecoilState } from 'recoil';
import { userObjState } from '../util/recoil.jsx';
import useOnClickOutside from '../hooks/useOnClickOutside.jsx';
import { useMediaQuery } from 'react-responsive';
import Search from './Search.jsx';
import Nav from '../components/Nav.jsx';
import Loading from '../components/Loading.jsx';
import TweetDiv from '../components/TweetDiv.jsx';
import '../style/Home.css';

const Home = () => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const [followingPage, setFollowingPage] = useState(false);

  const navRef = useRef(null);

  useOnClickOutside(navRef, () => setIsNavOpen(false));

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
      <div className={'HomeMiddleDiv'}>
        <div className={'HomeMiddleSwitchFollowDiv'}>
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
          <Suspense fallback={<Loading forComponent={true} />}>
            <TweetDiv followingPage={followingPage} />
          </Suspense>
        )}
        {followingPage && <TweetDiv followingPage={followingPage} />}
      </div>
      {!useMediaQuery({ query: '(max-width: 1000px)' }) && <Search />}
    </div>
  );
};
export default Home;

//         <WriteTweet userObj={userObj} />
