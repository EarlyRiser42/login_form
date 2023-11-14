import React, { useState, useEffect, useRef } from 'react';
import { authService, dbService } from '../fbase';
import { Link, useLocation } from 'react-router-dom';
import Nav from './Nav.jsx';
import { useRecoilState } from 'recoil';
import { userObjState } from '../util/recoil.jsx';
import useOnClickOutside from '../hooks/useOnClickOutside.jsx';
import '../style/Home.css';
import { useMediaQuery } from 'react-responsive';
import Search from './Search.jsx';
import { getCookie } from '../util/cookie.jsx';

const Home = () => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // 화면 너비 500px이하
  const isTablet = useMediaQuery({ query: '(max-width: 1000px)' });

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
      <div className={'HomeRightDiv'}>Home</div>
      {!isTablet && <Search />}
    </div>
  );
};
export default Home;
