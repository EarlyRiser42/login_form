import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { Tweets, userObjState } from '../..//util/recoil.jsx';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { dbService } from '../../fbase.js';
import { ProfileImage } from '../TweetForm.jsx';

const FollowForm = ({ info, writerObj }) => {
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [isFollowing, setisFollowing] = useState(
    userObj.following.includes(info),
  );

  const modifyFollowing = async () => {
    if (isFollowing) {
      const docRef = doc(dbService, 'users', userObj.uid);
      await updateDoc(docRef, {
        following: arrayRemove(info),
      });
      const myDocRef = doc(dbService, 'users', info);
      await updateDoc(myDocRef, {
        follower: arrayRemove(userObj.uid),
      });
      setisFollowing(!isFollowing);
      setUserObj({
        ...userObj,
        following: userObj.following.filter((likeId) => likeId !== info),
      });
    } else {
      const docRef = doc(dbService, 'users', userObj.uid);
      await updateDoc(docRef, {
        following: arrayUnion(info),
      });
      const myDocRef = doc(dbService, 'users', info);
      await updateDoc(myDocRef, {
        follower: arrayUnion(userObj.uid),
      });
      setisFollowing(!isFollowing);
      setUserObj({
        ...userObj,
        following: [...userObj.following, info],
      });
    }
  };

  return (
    <Container>
      <LeftContainer>
        <Link to={`/profile/${info}`} state={{ writerObj: writerObj }}>
          <ProfileImage
            dataSrc={writerObj.photoURL}
            src="https://fakeimg.pl/50x50/?text=+"
            alt="ProfilePicture"
          />
        </Link>
      </LeftContainer>
      <RightContainer>
        <UserInfoContainer>
          <DisplayName>{writerObj.displayName}</DisplayName>
          <UserName>@{writerObj.id}</UserName>
          <Intro>{writerObj.intro}</Intro>
        </UserInfoContainer>
        {!isFollowing && (
          <FollowButton onClick={modifyFollowing} $isFollowing={isFollowing}>
            팔로우
          </FollowButton>
        )}
        {isFollowing && (
          <FollowButton onClick={modifyFollowing} $isFollowing={isFollowing}>
            팔로잉
          </FollowButton>
        )}
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
`;

const LeftContainer = styled.div`
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

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 86%;
  height: 98%;
  margin-right: 2%;
  margin-bottom: 2%;
  @media (max-width: 500px) {
    width: 82%;
    margin-right: 4%;
  }
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 1%;
  justify-content: space-between;
`;

const DisplayName = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
`;

const UserName = styled.span`
  font-size: 0.9rem;
  color: grey;
`;

const Intro = styled.span`
  font-size: 0.9rem;
  min-height: 10px;
  color: black;
`;

const FollowButton = styled.button`
  align-self: flex-start;
  border-radius: 25px;
  border: 1px solid #cfd9de;
  cursor: pointer;
  margin-top: 7px;
  font-size: 0.8rem;
  text-align: center;
  width: 90px;
  height: 30px;
  font-weight: 600;
  background-color: ${(props) => (props.$isFollowing ? 'white' : 'black')};
  color: ${(props) => (props.$isFollowing ? 'black' : 'white')};
  &:hover {
    background-color: ${(props) =>
      props.$isFollowing ? '#FFEAEB' : '#272c30'};
  }
`;

export default FollowForm;
