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
import { Tweets } from '../util/recoil.jsx';

const TweetForm = ({ userObj, writeObj, isOwner, tweetPage }) => {
  const [tweets, setTweets] = useRecoilState(Tweets);

  // for modal
  const location = useLocation();
  const navigate = useNavigate();

  // 트윗 작성자 displayName, id, photoURL from profile DB
  const [id, setId] = useState(''); // 상태로 id를 관리
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // like, mention
  const [mention_cnt, setMention_cnt] = useState(0);
  const [like, setLike] = useState(writeObj.likeList.length !== 0);
  const [like_cnt, setLike_cnt] = useState(writeObj.likeList.length);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this write?');
    if (ok) {
      await dbService.doc(`tweets/${writeObj.id}`).delete();
      setTweets(tweets.filter((tweet) => tweet.tweetId !== writeObj.tweetId));
      if (writeObj.photoURL) {
        await storageService.refFromURL(writeObj.photoURL).delete();
      }
    }
    if (tweetPage) {
      navigate(-1);
    }
  };

  const getTweetInfo = async (writeObj) => {
    // tweet의 이름, id, pfp 가져오는 코드
    const docRef = doc(dbService, 'users', writeObj.creatorId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
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
    // 멘션 개수 가져오는 함수
    dbService
      .collection('mentions')
      .where('mentionTo', '==', writeObj.tweetId)
      .get()
      .then((querySnapshot) => {
        setMention_cnt(querySnapshot.size);
      })
      .catch((error) => {
        console.error('Error getting mention documents:', error);
      });
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

      const tweetRef = doc(dbService, 'tweets', writeObj.id);
      // 트윗에 내 uid 삭제
      await updateDoc(tweetRef, {
        like_id: arrayRemove(userObj.uid),
      });

      // tweet의 like cnt 감소
      dbService
        .collection('tweets')
        .where('tweetId', '==', writeObj.tweetId)
        .get()
        .then(async (querySnapshot) => {
          for (const doc of querySnapshot.docs) {
            const docRef = dbService.collection('tweets').doc(doc.id);
            const docData = (await getDoc(docRef)).data();
            const likeCount = docData.like_cnt;
            await updateDoc(docRef, { like_cnt: likeCount - 1 });
          }
        })
        .catch((error) => {
          console.error(`Error getting documents: ${error}`);
        });
      setLike(false);
      setLike_cnt(like_cnt - 1);
    } else {
      const profileRef = doc(dbService, 'users', userObj.uid);
      // 프로필에 좋아한 트윗 id 추가
      await updateDoc(profileRef, {
        likes: arrayUnion(writeObj.tweetId),
      });

      const tweetRef = doc(dbService, 'tweets', writeObj.id);
      // 트윗에 내 uid 삭제
      await updateDoc(tweetRef, {
        like_id: arrayUnion(userObj.uid),
      });

      // tweet의 like cnt 증가
      dbService
        .collection('tweets')
        .where('tweetId', '==', writeObj.tweetId)
        .get()
        .then(async (querySnapshot) => {
          for (const doc of querySnapshot.docs) {
            const docRef = dbService.collection('tweets').doc(doc.id);
            const docData = (await getDoc(docRef)).data();
            const likeCount = docData.like_cnt;
            await updateDoc(docRef, { like_cnt: likeCount + 1 });
          }
        })
        .catch((error) => {
          console.error(`Error getting documents: ${error}`);
        });

      setLike(true);
      setLike_cnt(like_cnt + 1);
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
    if (seconds < 60) return '방금 전';

    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분 전`;

    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간 전`;

    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}일 전`;

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
      <Link to={link}>
        <ActionImage onClick={onClick} src={src} alt={alt} />
      </Link>
    ) : (
      <ActionImage onClick={onClick} src={src} alt={alt} />
    );
  };

  return (
    <Container>
      <LeftContainer>
        <Link to={`/profile/${writeObj.creatorId}`}>
          <ProfileImage src={photoURL} alt="Profile" />
        </Link>
      </LeftContainer>
      <RightContainer>
        <UpperContainer>
          <UserInfoContainer>
            <UerInfoInner>
              <span style={{ fontWeight: 'bold' }}>{displayName}</span>
              <span>@{id}</span>
              <span>{elapsedTime(writeObj.createdAt)}</span>
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
        <TweetText>{writeObj.text}</TweetText>
        {writeObj.photoURL && (
          <TweetImageContainer>
            <TweetImage src={writeObj.photoURL} alt="Tweet" />
          </TweetImageContainer>
        )}

        <TweetActions>
          <ActionContainer
            src={'./mention.png'}
            alt="Mention"
            isLink={true}
            link={`/compose/mention`}
            isCount={true}
            count={writeObj.mention_cnt}
          />
          <ActionContainer src={'./retweet.png'} alt="Retweet" />
          <ActionContainer
            src={writeObj.like ? './like_color.png' : './like.png'}
            alt="Like"
            onClick={() => onLike(writeObj.id)}
            isCount={true}
            count={writeObj.like_cnt}
          />
          <ActionContainer
            src={'./share.png'}
            alt="Share"
            onClick={() => onShare(writeObj.id)}
          />
        </TweetActions>
      </RightContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: auto;
  margin-top: 10px;
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const LeftContainer = styled.div`
  width: 15%;
`;

const RightContainer = styled.div`
  width: 85%;
`;

const UpperContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const ProfileImage = styled.img`
  margin-left: 20%;
  width: 40px;
  height: 40px;
  border-radius: 50px;
`;

const UserInfoContainer = styled.div`
  display: flex;
  width: 100%;
  height: 1%;
  justify-content: space-between;
`;

const UerInfoInner = styled.div`
  display: flex;
  justify-content: space-around;
  span {
    margin-right: 10px;
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
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TweetImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 30px;
`;

const TweetActions = styled.div`
  width: 100%;
  min-height: 30px;
  display: flex;
  justify-content: space-between;
`;

const ActionImage = styled.img`
  width: 16.75px;
  height: 15.75px;
  cursor: pointer;
`;

export default TweetForm;
