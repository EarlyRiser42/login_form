import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { PopUpOpenState } from '../util/recoil.jsx';
import { dbService, storageService } from '../fbase.js';

const PopUp = ({ writeObj }) => {
  const [isPopUpOpen, setIsPopUpOpen] = useRecoilState(PopUpOpenState);

  const handleDelete = async () => {
    await tweetDelete(writeObj);
    setIsPopUpOpen(false);
  };

  const tweetDelete = async (writeObj) => {
    await dbService.doc(`tweets/${writeObj.id}`).delete();
    if (writeObj.photoURL) {
      await storageService.refFromURL(writeObj.photoURL).delete();
    }
  };

  const handleUndo = () => {
    setIsPopUpOpen(false);
  };

  return (
    <PopUpContainer>
      <PopUpContent>
        <PopUpH1>게시을(를) 삭제할까요?</PopUpH1>
        <PopUpSpan>
          이 동작은 취소할 수 없으며 내 프로필, 나를 팔로우하는 계정의 타임라인,
          그리고 검색 결과에서 삭제됩니다.
        </PopUpSpan>
        <DeleteButton onClick={handleDelete}>삭제하기</DeleteButton>
        <UndoButton onClick={handleUndo}>취소</UndoButton>
      </PopUpContent>
    </PopUpContainer>
  );
};

const PopUpContainer = styled.div`
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(153, 153, 153, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const PopUpContent = styled.div`
  width: 320px;
  height: 280px;
  background-color: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 320px) {
    width: 80%;
  }
`;

const PopUpH1 = styled.h1`
  font-size: 1.2rem;
  width: 80%;
  text-align: left;
`;

const PopUpSpan = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #536471;
  width: 80%;
  text-align: left;
  margin-bottom: 5%;
`;

const DeleteButton = styled.button`
  width: 80%;
  height: 50px;
  margin-bottom: 5%;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: bold;
  border: none;
  color: white;
  background-color: #f4222d;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #dc1f29;
  }
`;

const UndoButton = styled.button`
  width: 80%;
  height: 50px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: bold;
  border: 1px solid #cfd9de;
  color: black;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #e7e7e8;
  }
`;

export default PopUp;
