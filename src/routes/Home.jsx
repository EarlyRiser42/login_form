import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../fbase';
import { Link, useLocation } from 'react-router-dom';
import Nav from './Nav.jsx';
import { useRecoilState } from 'recoil';
import { userObjState } from '../util/recoil.jsx';
import useOnClickOutside from '../hooks/useOnClickOutside.jsx';
import '../style/Home.css';
import { useMediaQuery } from 'react-responsive';

const Home = () => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // 화면 너비 500px이하일 때만 hook 사용
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' });

  useEffect(() => {
    if (isMobile) {
      // nav 열렸을 때 nav 바깥을 클릭하면 닫도록 설정
      const navRef = useRef(null);
      useOnClickOutside(navRef, () => setIsNavOpen(false));
    }
  }, [isMobile]);

  return (
    <div className="HomeDiv">
      <Nav ref={navRef} isNavOpen={isNavOpen}></Nav>
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
    </div>
  );
};
export default Home;
