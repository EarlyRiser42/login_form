import React, { useEffect, useState } from 'react';
import { authService, dbService } from '../../fbase';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { userObjState } from '../../util/recoil.jsx';

const Information = () => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);

  const location = useLocation();
  const profile_id = useParams().profile;
  const writeObj = location.state ? location.state.writeObj : '';

  // 본인 계정인지 아닌지 확인
  const owner = userObj.uid === profile_id;
  const userInfo = owner ? userObj : writeObj;

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

  const [following, setFollowing] = useState(true);
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

  const follow = async () => {
    const docRef = doc(dbService, 'users', userObj.uid);
    await updateDoc(docRef, {
      following: arrayUnion(profile_id),
    });
    setFollowing(true);
  };

  const unfollow = async () => {
    const docRef = doc(dbService, 'users', userObj.uid);
    await updateDoc(docRef, {
      following: arrayRemove(profile_id),
    });
    setFollowing(false);
  };

  return (
    <div>
      <div>
        <img src={backgroundImage} width="100px" height="50px" />
      </div>
      <div>
        <img src={pfp} width="50px" height="50px" />
      </div>
      <div>
        {owner && (
          <Link
            to={`${profile_id}/editProfile`}
            state={{ background: location }}
          >
            <button>프로필 수정</button>
          </Link>
        )}
        {!owner && !following && <button onClick={follow}>팔로우</button>}
        {!owner && following && <button onClick={unfollow}>언팔로우</button>}
      </div>
      <div>
        <span>{displayName}</span>
        <span>{'@' + id}</span>
      </div>
      <div>
        <span>{intro}</span>
      </div>
      <div>
        <span>{elapsedTime(SignupAt)}</span>
      </div>
      <div>
        <Link>
          <div>
            <span>{follow_cnt} 팔로우 중</span>
          </div>
        </Link>
        <Link>
          <div>
            <span>{follower_cnt} 팔로워</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Information;
