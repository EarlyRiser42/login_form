import React, { useState, useEffect } from 'react';
import { dbService } from '../fbase';
import TweetForm from '../components/TweetForm';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Explore from './Explore.jsx';
import Nav from '../components/Nav.jsx';
import styled from 'styled-components';
import { HomeDiv, HomeImgDivForMobile, HomeMiddleDiv } from './Home.jsx';
import { useMediaQuery } from 'react-responsive';
import { useRecoilState } from 'recoil';
import { userObjState } from '../util/recoil.jsx';
import WriteMention from '../components/WriteMention.jsx';

const TweetDetail = () => {
  const parm = useParams();
  const tweetId = parm.tweetPath;
  const { state } = useLocation();
  const writeObj = state.tweet;

  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);

  // 지역변수
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navigate = useNavigate();
  const [mentions, setMentions] = useState([]);

  useEffect(() => {
    dbService
      .collection('mentions')
      .where('mentionTo', '==', tweetId)
      .get()
      .then((querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMentions(documents);
      })
      .catch((error) => {
        console.error('Error getting mention documents:', error);
      });
  }, []);

  return (
    <HomeDiv>
      <Nav />
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
        <NavContainer>
          <img
            src={'./left_arrow.svg'}
            onClick={() => {
              navigate(-1);
            }}
          />
          <span>게시하기</span>
        </NavContainer>
        <TweetForm
          userObj={userObj}
          writeObj={writeObj}
          isOwner={writeObj.creatorId === userObj.uid}
          tweetPage={true}
        />
        <WriteMention />
      </HomeMiddleDiv>
      <div>
        {mentions.map((mention) => (
          <TweetForm
            userObj={userObj}
            writeObj={mention}
            isOwner={mention.creatorId === userObj.uid}
            tweetPage={false}
          />
        ))}
      </div>
      {!useMediaQuery({ query: '(max-width: 1000px)' }) && <Explore />}
    </HomeDiv>
  );
};

const NavContainer = styled.div`
  width: 100%;
  height: 10%;
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
