import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storageService, dbService } from '../fbase';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { userObjState, ModalOpenState } from '../util/recoil.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ClearImage,
  ClearImageDiv,
  Image,
  ImageContainer,
  PreviewImage,
  LazyProfileImageTweet,
  StyledInput,
  StyledLabel,
  SubmitButton,
  TweetTextArea,
} from './WriteTweet.jsx';
import { arrayUnion, updateDoc } from 'firebase/firestore';
import { LeftContainer, RightContainer } from './TweetForm.jsx';

const WriteMention = ({ writeObj }) => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);

  const [isModalOpen, setIsModalOpen] = useRecoilState(ModalOpenState);
  const location = useLocation();
  const navigate = useNavigate();
  // 지역변수
  const [mentionText, setMentionText] = useState('');
  const [attachment, setAttachment] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = '';
    const uuid = uuidv4();
    if (attachment !== '') {
      const attachmentRef = storageService.ref().child(`mentions/${uuid}`);
      const response = await attachmentRef.putString(attachment, 'data_url');
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const MentionObj = {
      tweetId: uuid,
      text: mentionText,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      toDBAt: Date.now(),
      likeList: [],
      MentionTo: [writeObj.tweetId, writeObj.creatorId],
      MentionList: [],
      attachmentUrl: attachmentUrl,
    };
    await dbService.collection('mentions').add(MentionObj);
    const tweetRef = dbService.collection('tweets').doc(writeObj.id);
    await updateDoc(tweetRef, {
      MentionList: arrayUnion(uuid),
    });
    setMentionText('');
    setAttachment('');
    if (location.state) {
      navigate(-1);
    }
  };

  const autoResize = (event) => {
    const textarea = event.target;
    setMentionText(textarea.value); // This will update the tweet state with the textarea value

    // Reset the height to shrink in case of text deletion
    textarea.style.height = 'auto';
    // Set the height to scrollHeight to expand to fit the content
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment(null);

  return (
    <MyMentionForm onSubmit={onSubmit} $isModalOpen={isModalOpen}>
      <LeftContainer>
        <LazyProfileImageTweet src={userObj.photoURL} />
      </LeftContainer>
      <RightContainer>
        <TweetTextArea
          name="tweet"
          placeholder="답글 게시하기"
          rows="1"
          required
          value={mentionText}
          onChange={autoResize}
          maxLength={140}
        />
        {attachment && (
          <ImageContainer>
            <PreviewImage src={attachment} />
            <ClearImageDiv>
              <ClearImage
                onClick={onClearAttachment}
                src={'/close_cross.svg'}
              />
            </ClearImageDiv>
          </ImageContainer>
        )}
        {!location.state && (
          <ButtonContainer>
            <StyledLabel htmlFor="fileInput3">
              <Image src="/tweet_add_photo.svg" alt="이미지 추가" />
            </StyledLabel>
            <StyledInput
              id="fileInput3"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
            <SubmitButton type="submit" disabled={!mentionText.trim()}>
              답글
            </SubmitButton>
          </ButtonContainer>
        )}
        {!!location.state && (
          <ButtonContainer>
            <StyledLabel htmlFor="fileInput4">
              <Image src="/tweet_add_photo.svg" alt="이미지 추가" />
            </StyledLabel>
            <StyledInput
              id="fileInput4"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
            <SubmitButton type="submit" disabled={!mentionText.trim()}>
              답글
            </SubmitButton>
          </ButtonContainer>
        )}
      </RightContainer>
    </MyMentionForm>
  );
};

const MyMentionForm = styled.form`
  width: 100%;
  height: auto;
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
  border-radius: ${(props) => (props.$isModalOpen ? '20px' : '0px')};
\` ;
  border-bottom: ${(props) =>
    props.$isModalOpen ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export default WriteMention;
