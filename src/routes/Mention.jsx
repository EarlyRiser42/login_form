import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ModalOpenState, userObjState } from '../util/recoil.jsx';
import styled from 'styled-components';
import WriteMention from '../components/WriteMention.jsx';
import TweetForm from '../components/TweetForm.jsx';
const Mention = () => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const location = useLocation();
  const navigate = useNavigate();

  const writeObj = location.state.writeObj;

  useEffect(() => {
    setIsModalOpen(true);
    return () => {
      setIsModalOpen(false);
    };
  }, []);

  return (
    <div>
      <Modal className={'writeMentionModal'}>
        <WriteTweetCloseButtonDiv>
          <WriteTweetCloseButton
            onClick={() => {
              setIsModalOpen(false);
              navigate(-1);
            }}
          >
            <WriteTweetCloseImg src="/close.svg" alt="close button" />
          </WriteTweetCloseButton>
          <span>초안</span>
        </WriteTweetCloseButtonDiv>
        <TweetForm
          key={writeObj.id}
          userObj={userObj}
          writeObj={writeObj}
          isOwner={writeObj.creatorId === userObj.uid}
          isModal={true}
          isMention={true}
        />
        <WriteMention writeObj={writeObj} />
      </Modal>
    </div>
  );
};

const WriteTweetCloseButtonDiv = styled.div`
  margin-top: 10px;
  margin-left: 3%;
  margin-bottom: 4%;
  height: 10%;
  width: 93%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  span {
    font-weight: bolder;
    color: #1d9bf0;
    font-size: 0.9rem;
  }
`;

const WriteTweetCloseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 5%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  // ... other styles
`;

const WriteTweetCloseImg = styled.img`
  width: 20px;
  height: 20px;
`;
export default Mention;
