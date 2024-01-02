import React, { useState, useEffect } from 'react';
import { dbService, storageService } from '../fbase';
import {
  doc,
  getDoc,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from 'firebase/firestore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { useRecoilState } from 'recoil';
import {
  PopUpOpenState,
  toastTextState,
  userObjState,
} from '../util/recoil.jsx';
import useLazyImageLoader from '../hooks/useLazyImageLoader.jsx';
import PopUp from './PopUp.jsx';

const TweetForm = ({ writeObj, isOwner, isModal, isMention }) => {
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isPopUpOpen, setIsPopUpOpen] = useRecoilState(PopUpOpenState);
  const [toastText, setToastText] = useRecoilState(toastTextState);
  // for modal
  const location = useLocation();
  const navigate = useNavigate();

  // 트윗 작성자 displayName, id, photoURL from profile DB
  const [writerObj, setWriterObj] = useState({});
  const [id, setId] = useState(''); // 상태로 id를 관리
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // like, mention
  const [mention_cnt, setMention_cnt] = useState(writeObj.MentionList.length);
  const [like, setLike] = useState(writeObj.likeList.includes(userObj.uid));
  const [like_cnt, setLike_cnt] = useState(writeObj.likeList.length);
  const [animation, setAnimation] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);
  const onDeleteClick = async () => {
    setIsPopUpOpen(true);
    if (isModal) {
      navigate(-1);
    }
  };

  const getTweetInfo = async (writeObj) => {
    // tweet의 이름, id, pfp 가져오는 코드
    const docRef = doc(dbService, 'users', writeObj.creatorId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setWriterObj(docSnap.data());
      setId(docSnap.data().id);
      setDisplayName(docSnap.data().displayName);
      setPhotoURL(docSnap.data().photoURL);
      if (docSnap.data().likes.indexOf(writeObj.tweetId) !== -1) {
        setLike(true);
      }
    } else {
      // docSnap.data() will be undefined in this case
      console.log('No such document! failed to load tweet writer id');
    }
    setMention_cnt(writeObj.MentionList.length);
    setLike(writeObj.likeList.includes(userObj.uid));
    setLike_cnt(writeObj.likeList.length);
  };

  // tweet 작성자 정보 가져오는 함수
  useEffect(() => {
    getTweetInfo(writeObj);
  }, [writeObj]);

  const onLike = async () => {
    if (like) {
      const profileRef = doc(dbService, 'users', userObj.uid);
      // 프로필에 좋아한 트윗 id 삭제
      await updateDoc(profileRef, {
        likes: arrayRemove(writeObj.tweetId),
      });
      if (isMention) {
        const tweetRef = doc(dbService, 'mentions', writeObj.id);
        // 멘션에 내 uid 삭제
        await updateDoc(tweetRef, {
          likeList: arrayRemove(userObj.uid),
        });
      } else {
        const tweetRef = doc(dbService, 'tweets', writeObj.id);
        // 트윗에 내 uid 삭제
        await updateDoc(tweetRef, {
          likeList: arrayRemove(userObj.uid),
        });
      }
      setLike(false);
      setLike_cnt(like_cnt - 1);
      setUserObj({
        ...userObj,
        likes: userObj.likes.filter((likeId) => likeId !== writeObj.id),
      });
    } else {
      setLike(true);
      setIsAnimated(true);
      const profileRef = doc(dbService, 'users', userObj.uid);
      // 프로필에 좋아한 트윗 id 추가
      await updateDoc(profileRef, {
        likes: arrayUnion(writeObj.tweetId),
      });
      if (isMention) {
        const tweetRef = doc(dbService, 'mentions', writeObj.id);
        // 멘션에 내 uid 추가
        await updateDoc(tweetRef, {
          likeList: arrayUnion(userObj.uid),
        });
      } else {
        const tweetRef = doc(dbService, 'tweets', writeObj.id);
        // 트윗에 내 uid 추가
        await updateDoc(tweetRef, {
          likeList: arrayUnion(userObj.uid),
        });
      }
      setLike_cnt(like_cnt + 1);
      setUserObj({
        ...userObj,
        likes: [...userObj.likes, writeObj.tweetId],
      });
    }
  };

  useEffect(() => {
    if (like && isAnimated) {
      setAnimation(1);
      setTimeout(() => {
        setAnimation(0);
      }, 1000); //
    }
  }, [like_cnt]);

  const onShare = async () => {
    const url =
      window.location.href + `/${writeObj.creatorId}/${writeObj.tweetId}`;
    await navigator.clipboard.writeText(url);
    setToastText({ type: 'notice', text: '클립보드에 복사했습니다.' });
  };

  const elapsedTime = (date) => {
    const start = new Date(date);
    const end = new Date();

    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (seconds < 60) return '방금';

    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분`;

    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간`;

    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}일`;

    return `${start.toLocaleDateString()}`;
  };

  const ActionContainer = ({ src, fill, alt, onClick, count, link }) => {
    return link ? (
      <TweetActions>
        <ActionSVGDiv $type={alt}>
          <Link to={link} state={{ background: location, writeObj: writeObj }}>
            <ActionSVG
              viewBox="0 0 24 18"
              onClick={onClick}
              alt={alt}
              fill={fill}
            >
              <path d={src} />
            </ActionSVG>
          </Link>
        </ActionSVGDiv>
        {count > 0 && <span>{count}</span>}
      </TweetActions>
    ) : (
      <TweetActions>
        <ActionSVGDiv $type={alt}>
          <ActionSVG
            viewBox="0 0 24 24"
            onClick={onClick}
            alt={alt}
            fill={fill}
          >
            <path d={src} />
          </ActionSVG>
        </ActionSVGDiv>
      </TweetActions>
    );
  };

  const LikeContainer = ({ alt, count }) => {
    const colors = [
      '#A0D6D8',
      '#92D2FC',
      '#B28FF6',
      '#A0D6D8',
      '#EE91AC',
      '#92D2FC',
    ];
    const angleBetweenPairs = 60;
    const angleOffsetWithinPair = 15;

    const dots = colors.flatMap((color, i) => {
      const firstAngle = i * angleBetweenPairs;
      const secondAngle = firstAngle + angleOffsetWithinPair;

      return [
        <OrbitDotWrapper
          key={`dot-first-${firstAngle}-${i}`}
          $angle={firstAngle}
        >
          <OrbitDot color={color} $index={firstAngle} />
        </OrbitDotWrapper>,
        <OrbitDotWrapper
          key={`dot-second-${secondAngle}-${i}`}
          $angle={secondAngle}
        >
          <OrbitDot color={color} $index={secondAngle} />
        </OrbitDotWrapper>,
      ];
    });

    return (
      <TweetActions>
        <ActionSVGDiv $type={alt}>
          {animation === 1 && <Orbit>{dots}</Orbit>}
          {!like && (
            <LikeSVG viewBox="0 0 24 24" onClick={onLike} alt={alt}>
              <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
            </LikeSVG>
          )}

          {like && (
            <LikeSVGColor
              viewBox="0 0 24 24"
              onClick={onLike}
              alt={alt}
              $animation={animation}
            >
              <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
            </LikeSVGColor>
          )}
        </ActionSVGDiv>
        {count > 0 && <span>{count}</span>}
      </TweetActions>
    );
  };

  const LazyTweetImage = ({ dataSrc, ...props }) => {
    const src = useLazyImageLoader(dataSrc, props.src);
    return <StyledTweetImage {...props} src={src} />;
  };

  return (
    <Container $isModal={isModal}>
      {isPopUpOpen && <PopUp writeObj={writeObj} />}
      <LeftContainer>
        <Link
          to={`/profile/${writeObj.creatorId}`}
          state={{ writerObj: writerObj }}
        >
          <LazyProfileImage
            dataSrc={photoURL}
            src="https://fakeimg.pl/50x50/?text=+"
            alt="ProfilePicture"
          />
        </Link>
        {isMention && (
          <LinkingLineContainer>
            <LinkingLine />
          </LinkingLineContainer>
        )}
      </LeftContainer>
      <RightContainer>
        <UpperContainer>
          <UserInfoContainer>
            <UerInfoInner>
              <span style={{ fontWeight: 'bold' }}>{displayName}</span>
              <div>
                <span>@{id}</span>
                <span>{elapsedTime(writeObj.createdAt)}</span>
              </div>
            </UerInfoInner>
            {isOwner && (
              <img
                src={'./close.svg'}
                alt="Delete"
                style={{
                  width: '15px',
                  height: '18px',
                  marginRight: '4%',
                  cursor: 'pointer',
                }}
                onClick={() => onDeleteClick(writeObj.id)}
              />
            )}
          </UserInfoContainer>
        </UpperContainer>
        <DownContainer>
          <TweetText>{writeObj.text}</TweetText>
          {writeObj.attachmentUrl && (
            <TweetImageContainer>
              <LazyTweetImage
                src="https://fakeimg.pl/400x200/?text=+"
                dataSrc={writeObj.attachmentUrl}
                alt="Tweet"
              />
            </TweetImageContainer>
          )}
          {!isModal && (
            <TweetActions>
              <ActionContainer
                src={
                  'M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z'
                }
                fill={'#1D9BF0'}
                alt="Mention"
                link={`/compose/mention`}
                count={mention_cnt}
              />
              <ActionContainer
                src={
                  'M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z'
                }
                fill={'#00BA7C'}
                alt="Retweet"
              />
              <LikeContainer alt="Like" count={like_cnt} />
              <ActionContainer
                src={
                  'M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z'
                }
                fill={'#1D9BF0'}
                alt="Bookmark"
                onClick={() => onShare(writeObj.id)}
              />
              <ActionContainer
                src={
                  'M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z'
                }
                fill={'#1D9BF0'}
                alt="Share"
                onClick={() => onShare(writeObj.id)}
              />
            </TweetActions>
          )}
        </DownContainer>
      </RightContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: auto;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  border-bottom: ${(props) =>
    props.$isModal ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'};
`;

export const LeftContainer = styled.div`
  width: 10%;
  height: 98%;
  margin-left: 1%;
  margin-right: 1%;
  margin-bottom: 2%;
  overflow: hidden;
  @media (max-width: 500px) {
    width: 16%;
  }
`;

const StyledProfileImage = styled.img`
  margin-left: 20%;
  width: 40px;
  height: 40px;
  border-radius: 50px;
`;

export const LazyProfileImage = ({ dataSrc, ...props }) => {
  const src = useLazyImageLoader(dataSrc, props.src);
  return <StyledProfileImage {...props} src={src} />;
};

const LinkingLineContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 25px;
`;

const LinkingLine = styled.div`
  height: 100%;
  margin-left: 30px;
  border-left: 2px solid rgba(0, 0, 0, 0.2);
`;

export const RightContainer = styled.div`
  width: 86%;
  height: 98%;
  margin-right: 2%;
  margin-bottom: 2%;
  @media (max-width: 500px) {
    width: 82%;
    margin-right: 4%;
  }
`;

const UpperContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const DownContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const UserInfoContainer = styled.div`
  display: flex;
  width: 100%;
  height: 1%;
  justify-content: space-between;
  @media (max-width: 360px) {
    div {
      flex-direction: column;
    }
  }
`;

const UerInfoInner = styled.div`
  display: flex;
  justify-content: space-around;
  span {
    margin-right: 10px;
  }
  @media (max-width: 500px) {
    span {
      margin-right: 6px;
    }
  }
`;

const TweetText = styled.div`
  margin-top: 5px;
  min-height: 30px;
  width: 75%;
`;

const TweetImageContainer = styled.div`
  width: 100%;
  min-height: 100px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const StyledTweetImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 30px;
`;

const TweetActions = styled.div`
  width: 100%;
  min-height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ActionSVGDiv = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: ${(props) => {
      switch (props.$type) {
        case 'Mention':
          return '#E4EEF7';
        case 'Retweet':
          return '#E3F1EB';
        case 'Like':
          return '#F9E3EB';
        case 'Bookmark':
          return '#E4EEF7';
        case 'Share':
          return '#E4EEF7';
        default:
          return 'transparent'; // 기본 색상
      }
    }};
  }
`;

const ActionSVG = styled.svg`
  width: 18.75px;
  height: 18.75px;
  cursor: pointer;
  fill: #536471;
  &:hover {
    fill: ${(props) => props.fill};
  }
`;

const LikeSVG = styled.svg`
  width: 18.75px;
  height: 18.75px;
  cursor: pointer;
  fill: #536471;
  &:hover {
    fill: #f91880;
  }
`;

const heartburst = keyframes`
  0% {
    transform: scale(0);
  }
  30%{
    transform: scale(0.1);
  }
  35%{
    transform: scale(0.5);
  }
  40%{
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
`;

const LikeSVGColor = styled.svg`
  width: 18.75px;
  height: 18.75px;
  fill: #f91880;
  animation: ${(props) =>
    props.$animation === 1
      ? css`
          ${heartburst} 1s linear
        `
      : 'none'};
`;

const circleToOrbit = keyframes`
  0% {
    width: 1px;
    height: 1px;
    background-color: #DD4588;
  }
  
  20%{
    width: 6px;
    height: 6px;
    background-color: #D56AC0;
  }

  25%{
    width: 8px;
    height: 8px;
    background-color: #D56AC0;
  }
  
  30%{
    width: 9px;
    height: 9px;
    background-color: transparent;
    border: 7px solid #CC8EF5;
  }
  
  35%{
    width: 13px;
    height: 13px;
    background-color: transparent;
    border: 5px solid #CC8EF5;
  }
  
  40%{
    width: 20px;
    height: 20px;
    border: 1px solid #CC8EF5;
  }
  45%{
    width: 22px;
    height: 22px;
    background-color: transparent;
    border: none;
  }
  100% {
    width: 22px;
    height: 22px;
    background-color: transparent;
    border: none;
  }
`;

const Orbit = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  animation: ${circleToOrbit} 1s linear;
  transform: translate(-50%, -50%);
`;

const moveOutwards = keyframes`
  0% {
    transform: translateX(0px);
  opacity: 0;
}
  28% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  50% {
    transform: translateX(-2px) 
    scale(0.9);
  }
  75% {
    transform: translateX(-4px) 
    scale(0.7);
  }
  100% {
    transform: translateX(-7px) 
    scale(0);}
`;

const fadeout = keyframes`
  0% { 
    transform: scale(1);
    opacity: 0;
  }
  33%{
    opacity: 0;
  }
  35%{
    opacity: 1;
  }
  50% {
    transform: translateX(-1px)
    scale(0.7);
  }
  75% {
    transform: translateX(-2px)
    scale(0.5);
  }
  85% {
    transform: translateX(-4px)
    scale(0.3);
  }
  90% { transform: scale(0);}
`;

// 궤도 위의 작은 원
const OrbitDot = styled.div`
  position: absolute;
  top: 0;
  left: 25%;
  width: 2px;
  height: 2px;
  opacity: 0;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${(props) =>
    props.$index % 2 === 0
      ? css`
          ${moveOutwards} 0.3s linear 0.4s
        `
      : css`
          ${fadeout} 0.3s linear 0.4s
        `};
`;

const OrbitDotWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${(props) => `rotate(${props.$angle}deg)`}
    translateX(-15px);
  transform-origin: 50% 50%;
`;

export default TweetForm;
