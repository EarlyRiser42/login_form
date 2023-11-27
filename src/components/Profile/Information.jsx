import React, { useEffect, useState } from 'react';
import { dbService } from '../../fbase';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { userObjState } from '../../util/recoil.jsx';
import { NavContainer } from '../../routes/TweetDetail.jsx';
import styled from 'styled-components';

const Information = ({ userInfo, owner }) => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);

  const location = useLocation();
  const navigate = useNavigate();

  const profile_id = useParams().profile;
  // 유저 개인정보들
  const [backgroundImage, setBackgroundImage] = useState(
    userInfo.backgroundImage,
  );
  const [id, setId] = useState(userInfo.id);
  const [displayName, setDisplayName] = useState(userInfo.displayName);
  const [intro, setIntro] = useState(userInfo.intro);
  const [SignupAt, setSignupAt] = useState(userInfo.SignupAt);
  const [pfp, setPfp] = useState(userInfo.photoURL);
  const [isFollowing, setisFollowing] = useState(
    userObj.following.includes(userInfo.uid),
  );

  useEffect(() => {
    setId(userInfo.id);
    setDisplayName(userInfo.displayName);
    setIntro(userInfo.intro);
    setSignupAt(userInfo.SignupAt);
    setPfp(userInfo.photoURL);
    setisFollowing(userObj.following.includes(userInfo.uid));
  }, [userInfo, userObj.following]);

  useEffect(() => {
    const resizeHandler = () => {
      const profileImage = document.querySelector('.profile-image');
      if (profileImage) {
        if (window.innerWidth <= 680) {
          const newWidth = profileImage.offsetWidth;
          console.log(newWidth);
          profileImage.style.height = `${newWidth}px`;
        } else {
          profileImage.style.height = '135px';
        }
      }
    };

    window.addEventListener('resize', resizeHandler);

    resizeHandler();

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

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
      const myDocRef = doc(dbService, 'users', userInfo.uid);
      await updateDoc(myDocRef, {
        follower: arrayRemove(userObj.uid),
      });
      setisFollowing(!isFollowing);
      setUserObj({
        ...userObj,
        following: userObj.following.filter((likeId) => likeId !== profile_id),
      });
    } else {
      const docRef = doc(dbService, 'users', userObj.uid);
      await updateDoc(docRef, {
        following: arrayUnion(profile_id),
      });
      const myDocRef = doc(dbService, 'users', userInfo.uid);
      await updateDoc(myDocRef, {
        follower: arrayUnion(userObj.uid),
      });
      setisFollowing(!isFollowing);
      setUserObj({
        ...userObj,
        following: [...userObj.following, profile_id],
      });
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
          <ProfileImage className={'profile-image'} src={pfp} alt="profile" />
          {owner && (
            <Link
              to={`${profile_id}/editProfile`}
              state={{ background: location }}
            >
              <EditProfileButton>프로필 수정</EditProfileButton>
            </Link>
          )}
          {!owner && !isFollowing && (
            <FollowButton onClick={modifyFollowing} $isFollowing={isFollowing}>
              팔로우
            </FollowButton>
          )}
          {!owner && isFollowing && (
            <FollowButton onClick={modifyFollowing} $isFollowing={isFollowing}>
              팔로잉
            </FollowButton>
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
            <StyledProfileUserObjFollow>
              <span>
                <span>{userInfo.following.length}</span>
                팔로우 중
              </span>
              <span>
                <span> {userInfo.follower.length}</span>
                팔로워
              </span>
            </StyledProfileUserObjFollow>
          </FollowInfo>
        </InfoSection>
      </ProfileSection>
    </ProfileContainer>
  );
};

const StyledProfileUserObjFollow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  span {
    margin-right: 5px;
    font-size: 0.8rem;
    span {
      margin-right: 2px;
      font-weight: bold;
      font-size: 1rem;
    }
  }
`;

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
  top: -70px;
  left: 20px;
  @media (max-width: 680px) {
    width: 23%;
    object-fit: cover;
    top: -70px;
  }
  @media (max-width: 440px) {
    top: -60px;
  }
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
  font-weight: 600;
  background-color: ${(props) => (props.$isFollowing ? 'white' : 'black')};
  color: ${(props) => (props.$isFollowing ? 'black' : 'white')};
  &:hover {
    background-color: ${(props) =>
      props.$isFollowing ? '#FFEAEB' : '#272c30'};
  }
`;

const InfoSection = styled.div`
  width: 96%;
  margin-top: 13%;
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

export default Information;
