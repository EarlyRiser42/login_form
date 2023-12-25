import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ModalOpenState, Tweets, userObjState } from '../../util/recoil.jsx';
import { doc, getDoc } from 'firebase/firestore';
import { dbService } from '../../fbase.js';
import FollowForm from './FollowForm.jsx';
import Loading from '../Loading.jsx';

const FollowsContainer = ({ followList }) => {
  // 전역변수 recoil
  const navigate = useNavigate();

  const [writersInfo, setWritersInfo] = useState({});

  const getTweetInfo = async (info) => {
    const docRef = doc(dbService, 'users', info);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setWritersInfo((prevInfo) => ({
        ...prevInfo,
        [info]: docSnap.data(),
      }));
    } else {
      console.log('No such document! failed to load tweet writer id');
    }
  };

  useEffect(() => {
    followList.forEach((info) => getTweetInfo(info));
  }, [followList]);

  const handleTweetClick = (event, info) => {
    // 이벤트 버블링을 막기 위해 해당 이벤트가 이미지 엘리먼트에서 발생한 경우에는 핸들러를 처리하지 않음
    if (
      event.target.tagName.toLowerCase() === 'button' ||
      event.target.closest('img')
    ) {
      return;
    }

    navigate(`/profile/${info}`, { state: { writerObj: writersInfo[info] } });
  };

  const isWritersInfoLoaded = followList.every((info) => writersInfo[info]);

  return (
    <div>
      {isWritersInfoLoaded ? (
        followList.map((info) => (
          <div
            key={info}
            onClick={(event) => handleTweetClick(event, info)}
            style={{ cursor: 'pointer' }}
          >
            <FollowForm info={info} writerObj={writersInfo[info]} />
          </div>
        ))
      ) : (
        <Loading forComponent={true} />
      )}
    </div>
  );
};

export default FollowsContainer;
