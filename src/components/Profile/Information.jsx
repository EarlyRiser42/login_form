import React, { useEffect, useState } from 'react';
import { dbService } from '../../fbase';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { userObjState } from '../../util/recoil.jsx';
import { NavContainer } from '../../routes/TweetDetail.jsx';
import styled from 'styled-components';
import { StyledNavUserObjFollow } from '../Nav.jsx';

const Information = () => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);

  const location = useLocation();
  const navigate = useNavigate();
  const profile_id = useParams().profile;
  const writerObj = location.state ? location.state.writerObj : '';

  // 본인 계정인지 아닌지 확인
  const owner = userObj.uid === profile_id;
  const userInfo = owner ? userObj : writerObj;

  // 유저 개인정보들
  const [backgroundImage, setBackgroundImage] = useState(
    userObj.backgroundImage,
  );
  const [id, setId] = useState(userInfo.id);
  const [displayName, setDisplayName] = useState(userInfo.displayName);
  const [intro, setIntro] = useState(userInfo.intro);
  const [SignupAt, setSignupAt] = useState(userInfo.SignupAt);
  const [pfp, setPfp] = useState(userInfo.photoURL);
  const [follow_cnt, setFollow_cnt] = useState(userInfo.following.length);
  const [follower_cnt, setFollower_cnt] = useState(userInfo.follower.length);
  const [isFollowing, setisFollowing] = useState(
    userInfo.following.includes(writerObj.uid),
  );

  const elapsedTime = (date) => {
    const start = new Date(date);
    return (
      '가입일: ' +
      String(start.getFullYear()) +
      '년 ' +
      String(start.getMonth() + 1) +
      '월'
    );
  };

  const modifyFollowing = async () => {
    if (isFollowing) {
      const docRef = doc(dbService, 'users', userObj.uid);
      await updateDoc(docRef, {
        following: arrayRemove(profile_id),
      });
      setisFollowing(!isFollowing);
    } else {
      const docRef = doc(dbService, 'users', userObj.uid);
      await updateDoc(docRef, {
        following: arrayUnion(profile_id),
      });
      setisFollowing(!isFollowing);
    }
  };

  return (
    <ProfileContainer>
      <NavContainer>
        <img
          src={'./left_arrow.svg'}
          onClick={() => {
            navigate(-1);
          }}
        />
        <span>{displayName}</span>
      </NavContainer>
      <BackgroundImage src={backgroundImage} alt="background" />
      <ProfileSection>
        <UpperSection>
          <ProfileImage src={pfp} alt="profile" />
          {owner && (
            <Link
              to={`${profile_id}/editProfile`}
              state={{ background: location }}
            >
              <EditProfileButton>프로필 수정</EditProfileButton>
            </Link>
          )}
          {!owner && !isFollowing && (
            <FollowButton onClick={modifyFollowing}>팔로우</FollowButton>
          )}
          {!owner && isFollowing && (
            <FollowButton onClick={modifyFollowing}>언팔로우</FollowButton>
          )}
        </UpperSection>
        <InfoSection>
          <DisplayName>{displayName}</DisplayName>
          <UserName>@{id}</UserName>
          <Intro>{intro}</Intro>
          <SignupDateContainer>
            <CalendarImage src={'/calender.svg'} alt="Calendar" />
            <span>{elapsedTime(SignupAt)}</span>
          </SignupDateContainer>
          <FollowInfo>
            <StyledNavUserObjFollow>
              <span>
                <span>{userObj.following.length}</span>
                팔로우 중
              </span>
              <span>
                <span> {userObj.follower.length}</span>
                팔로워
              </span>
            </StyledNavUserObjFollow>
          </FollowInfo>
        </InfoSection>
      </ProfileSection>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  width: 100%;
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProfileImage = styled.img`
  width: 135px;
  height: 135px;
  border-radius: 50%;
  border: 4px solid white;
  position: absolute;
  top: -50px; // Adjust based on your actual layout
  left: 20px;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  background: white;
  margin-top: -40px;
`;

const UpperSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`;

const EditProfileButton = styled.button`
  position: absolute;
  width: 111px;
  height: 36px;
  border-radius: 25px;
  border: 1px solid #cfd9de;
  background: white;
  cursor: pointer;
  margin-top: 10px;
  font-weight: 500;
  font-size: 1rem;
  text-align: center;
  right: 15px;
  &:hover {
    background-color: #e7e7e8;
  }
`;

const FollowButton = styled(EditProfileButton)`
  width: 81px;
  height: 36px;
  &:hover {
    background-color: #272c30;
  }
`;

const InfoSection = styled.div`
  width: 96%;
  margin-top: 17%;
  margin-bottom: 3%;
  margin-left: 4%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const DisplayName = styled.span`
  font-size: 1.4rem;
  font-weight: bold;
`;

const UserName = styled.span`
  color: grey;
`;

const Intro = styled.span`
  min-height: 10px;
  color: black;
`;

const SignupDateContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #333;
  margin-top: 10px;
`;

// 달력 이미지
const CalendarImage = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const FollowInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

const FollowCount = styled.span`
  color: #333;
`;

export default Information;
