import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal.jsx';
import WriteTweet from '../components/WriteTweet.jsx';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ModalOpenState } from '../util/recoil.jsx';
import styled from 'styled-components';
const Login = () => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);

  return (
    <div>
      <Modal className={'writeTweetModal'}>
        <div className="writeTweet-modal">
          <WriteTweetCloseButtonDiv>
            <Link to={'/'}>
              <WriteTweetCloseButton
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                <WriteTweetCloseImg src="/close.svg" alt="close button" />
              </WriteTweetCloseButton>
            </Link>
            <span>초안</span>
          </WriteTweetCloseButtonDiv>
          <WriteTweet />
        </div>
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
  width: 90%;
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
export default Login;
