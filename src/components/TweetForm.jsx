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
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { Tweets, userObjState } from '../util/recoil.jsx';
import useLazyImageLoader from '../hooks/useLazyImageLoader.jsx';

const TweetForm = ({ writeObj, isOwner, isModal, isMention }) => {
  const [tweets, setTweets] = useRecoilState(Tweets);
  const [userObj, setUserObj] = useRecoilState(userObjState);
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
  const [like_animation, setLike_animation] = useState(false);
  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this write?');
    if (ok) {
      await dbService.doc(`tweets/${writeObj.id}`).delete();
      setTweets(tweets.filter((tweet) => tweet.tweetId !== writeObj.tweetId));
      if (writeObj.photoURL) {
        await storageService.refFromURL(writeObj.photoURL).delete();
      }
    }
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
    // 컴포넌트가 마운트될 때 writeObj.creatorId를 이용하여 getId를 호출하고 결과를 상태에 저장
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
      setLike_animation(true);
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
      setLike(true);
      setLike_cnt(like_cnt + 1);
      setUserObj({
        ...userObj,
        likes: [...userObj.likes, writeObj.tweetId],
      });
      setTimeout(() => {
        setLike_animation(false);
      }, 200);
    }
  };

  const onShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
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

  const ActionContainer = ({
    src,
    alt,
    onClick,
    isCount,
    count,
    isLink,
    link,
  }) => {
    return (
      <TweetActions>
        <ActionImageContainer
          onClick={onClick}
          src={src}
          alt={alt}
          isLink={isLink}
          link={link}
        />
        {isCount && count > 0 && <span>{count}</span>}
      </TweetActions>
    );
  };

  const ActionImageContainer = ({ onClick, src, alt, isLink, link }) => {
    return isLink ? (
      <ActionImageDiv $type={alt}>
        <Link to={link} state={{ background: location, writeObj: writeObj }}>
          <ActionImage onClick={onClick} src={src} alt={alt} />
        </Link>
      </ActionImageDiv>
    ) : (
      <ActionImageDiv $type={alt}>
        <ActionImage onClick={onClick} src={src} alt={alt} />
      </ActionImageDiv>
    );
  };

  const LikeContainer = ({ alt, count }) => {
    return (
      <TweetActions>
        <ActionImageDiv $type={alt}>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="likeButton"
            width="18.75"
            height="18.75"
          >
            <path
              d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
              fill="#536471"
            />
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="likeButtonColor"
              width="24"
              height="24"
              opacity="0"
            >
              <path
                d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                fill="#F91880"
              />
            </svg>
          </svg>
        </ActionImageDiv>
        {count > 0 && <span>{count}</span>}
      </TweetActions>
    );
  };

  // TweetImage 컴포넌트
  const TweetImage = ({ dataSrc, ...props }) => {
    const src = useLazyImageLoader(dataSrc, props.src);
    return <StyledTweetImage {...props} src={src} />;
  };

  return (
    <Container $isModal={isModal}>
      <LeftContainer>
        <Link
          to={`/profile/${writeObj.creatorId}`}
          state={{ writerObj: writerObj }}
        >
          <ProfileImage
            dataSrc={photoURL}
            src="https://fakeimg.pl/50x50/?text=+"
            alt="ProfilePicture"
          />
        </Link>
        {isMention && isModal && (
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
                style={{ width: '15px', height: '18px', marginRight: '20px' }}
                onClick={() => onDeleteClick(writeObj.id)}
              />
            )}
          </UserInfoContainer>
        </UpperContainer>
        <DownContainer>
          <TweetText>{writeObj.text}</TweetText>
          {writeObj.attachmentUrl && (
            <TweetImageContainer>
              <TweetImage
                src="https://fakeimg.pl/600x400/?text=+"
                dataSrc={writeObj.attachmentUrl}
                alt="Tweet"
              />
            </TweetImageContainer>
          )}
          {!isModal && (
            <TweetActions>
              <ActionContainer
                src={'./mention.svg'}
                alt="Mention"
                isLink={true}
                link={`/compose/mention`}
                isCount={true}
                count={mention_cnt}
              />
              <ActionContainer src={'./retweet.svg'} alt="Retweet" />
              <LikeContainer alt="Like" count={like_cnt} />
              <ActionContainer
                src={'./bookmark_tweet.svg'}
                alt="Bookmark"
                onClick={() => onShare(writeObj.id)}
              />
              <ActionContainer
                src={'./share.svg'}
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

const ActionImageDiv = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50px;
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

const ActionImage = styled.img`
  width: 18.75px;
  height: 18.75px;
  cursor: pointer;
`;

const LikeImage = styled.div`
  cursor: pointer;
  width: 25px;
  height: 25px;
  background-image: url('/like.png');
  background-position: left;
  background-repeat: no-repeat;
  background-size: 4900%;
  animation: heart-burst 0.3s steps(28) forwards;
  @keyframes heart-burst {
    from {
      background-position: left;
    }
    to {
      background-position: right;
    }
  }
`;

export const ProfileImage = ({ dataSrc, ...props }) => {
  const src = useLazyImageLoader(dataSrc, props.src);
  return <StyledProfileImage {...props} src={src} />;
};

export default TweetForm;
