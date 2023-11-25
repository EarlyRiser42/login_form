import React, { useEffect, useMemo, useRef, useState } from 'react';
import { dbService } from '../fbase';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { userObjState } from '../util/recoil.jsx';
import {
  BoldText,
  HomeDiv,
  HomeImgDivForMobile,
  HomeMiddleDiv,
  HomeMiddleSwitchFollowDiv,
  NormalText,
} from './Home.jsx';
import Nav from '../components/Nav.jsx';
import { useMediaQuery } from 'react-responsive';
import Explore from './Explore.jsx';
import Information from '../components/Profile/Information.jsx';
import Loading from '../components/Loading.jsx';
import { useIntersect } from '../hooks/useIntersect.jsx';
import styled from 'styled-components';
import PostsContainer from '../components/Profile/PostsContainer.jsx';
import { useGetMyTweets } from '../hooks/useGetMyTweets.jsx';

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userUid = params.profile;

  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isNavOpen, setIsNavOpen] = useState(false);
  // 지역변수
  const [myTweets, setMyTweets] = useState([]);
  const [pageName, setPageName] = useState('게시물');
  const navRef = useRef(null);

  const { data, hasNextPage, isFetching, fetchNextPage } = useGetMyTweets({
    size: 10, // 페이지 당 트윗 수
    userObj,
    pageName,
  });

  const fetchedTweets = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.contents) : []),
    [data],
  );

  // 불러온 트윗 데이터를 전역 Recoil 상태로 설정
  useEffect(() => {
    setMyTweets(fetchedTweets);
  }, [fetchedTweets]);

  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  });

  const renderTabText = (tabName) => {
    const isCurrentPage = pageName === tabName;
    return isCurrentPage ? (
      <BoldText>{tabName}</BoldText>
    ) : (
      <NormalText>{tabName}</NormalText>
    );
  };

  return (
    <HomeDiv $isNavOpen={isNavOpen}>
      <Nav ref={navRef} isNavOpen={isNavOpen} />
      <HomeMiddleDiv>
        <Information />
        <HomeMiddleSwitchFollowDiv>
          <div onClick={() => setPageName('게시물')}>
            {renderTabText('게시물')}
          </div>
          <div onClick={() => setPageName('답글')}>{renderTabText('답글')}</div>
          <div onClick={() => setPageName('미디어')}>
            {renderTabText('미디어')}
          </div>
          <div onClick={() => setPageName('마음에 들어요')}>
            {renderTabText('마음에 들어요')}
          </div>
        </HomeMiddleSwitchFollowDiv>
        {pageName === '게시물' && <PostsContainer myTweets={myTweets} />}
        {isFetching && <Loading forComponent={true} />}
        <Target ref={ref} />
      </HomeMiddleDiv>
      {!useMediaQuery({ query: '(max-width: 1000px)' }) && <Explore />}
    </HomeDiv>
  );
};

const Target = styled.div`
  height: 1px;
`;

export default Profile;
