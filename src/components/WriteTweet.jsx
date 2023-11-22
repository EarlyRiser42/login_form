import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storageService, dbService } from '../fbase';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import {
  profileImage,
  myTweets,
  userObjState,
  ModalOpenState,
} from '../util/recoil.jsx';
import { useLocation } from 'react-router-dom';

const WriteTweet = () => {
  // 전역변수 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const [tweet, setTweet] = useRecoilState(myTweets);
  const [pfp, setPfp] = useRecoilState(profileImage);
  const location = useLocation();

  // 지역변수
  const [tweetText, setTweetText] = useState('');
  const [attachment, setAttachment] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = '';
    const uuid = uuidv4();
    if (attachment !== '') {
      const attachmentRef = storageService.ref().child(`tweets/${uuid}`);
      const response = await attachmentRef.putString(attachment, 'data_url');
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const tweetObj = {
      tweetId: uuid,
      text: tweetText,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      toDBAt: Date.now(),
      likeList: [],
      MentionList: [],
      attachmentUrl: attachmentUrl,
    };
    await dbService.collection('tweets').add(tweetObj);
    setTweet([{ ...tweetObj, id: tweetObj.tweetId }, ...tweet]);
    setTweetText('');
    setAttachment('');
  };

  const autoResize = (event) => {
    const textarea = event.target;
    setTweetText(textarea.value); // This will update the tweet state with the textarea value

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

  const onFileChange2 = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader2 = new FileReader();
    reader2.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader2.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment(null);

  return (
    <TweetForm onSubmit={onSubmit}>
      <LeftContainer>
        <ProfileImage src={pfp} />
      </LeftContainer>
      <RightContainer>
        <TweetContainer>
          <TweetTextArea
            name="tweet"
            placeholder="무슨 일이 일어나고 있나요?"
            rows="1"
            required
            value={tweetText}
            onChange={autoResize}
            maxLength={140}
          />
          <MentionGuideSpan>
            <MentionGuideSpanImg src={'/earth.svg'} />
            모든 사람이 답글을 달 수 있습니다
          </MentionGuideSpan>
        </TweetContainer>

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
          <InnerContainer>
            <StyledLabel htmlFor="fileInput">
              <Image src="/tweet_add_photo.svg" alt="이미지 추가" />
            </StyledLabel>
            <StyledInput
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
            <SubmitButton type="submit" disabled={!tweetText.trim()}>
              게시하기
            </SubmitButton>
          </InnerContainer>
        )}
        {!!location.state && (
          <InnerContainer>
            <StyledLabel htmlFor="fileInput2">
              <Image src="/tweet_add_photo.svg" alt="이미지 추가" />
            </StyledLabel>
            <StyledInput
              id="fileInput2"
              type="file"
              accept="image/*"
              onChange={onFileChange2}
            />
            <SubmitButton type="submit" disabled={!tweetText.trim()}>
              게시하기
            </SubmitButton>
          </InnerContainer>
        )}
      </RightContainer>
    </TweetForm>
  );
};

// Styled components
const TweetForm = styled.form`
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const LeftContainer = styled.div`
  width: 12%;
`;

const RightContainer = styled.div`
  width: 88%;
`;

const ProfileImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const TweetContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export const TweetTextArea = styled.textarea`
  width: 95%;
  border: none;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 19px;
  resize: none;

  font-family:
    'Chirp',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  &:focus {
    outline: none;
  }
`;

const MentionGuideSpan = styled.span`
  margin-top: 10px;
  margin-bottom: 15px;
  font-weight: bolder;
  font-size: 0.8rem;
  color: #1da1f2;
  display: flex;
  align-items: center;
`;

const MentionGuideSpanImg = styled.img`
  width: 15px;
  height: 15px;
  margin-left: 10px;
  margin-right: 5px;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-height: 40px;
  margin-top: 10px;
`;

export const StyledLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 15%;
`;

export const StyledInput = styled.input`
  display: none;
`;

export const Image = styled.img`
  margin-right: 45%;
  width: 20px;
  height: 20px;
`;

export const SubmitButton = styled.button`
  background-color: #1da1f2;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  width: auto;
  min-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  &:hover {
    background-color: ${(props) => (props.disabled ? '#aaa' : '#1991db')};
  }

  &:disabled {
    background-color: #99cdf8;
    cursor: not-allowed;
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
`;

export const ClearImageDiv = styled.div`
  position: absolute;
  top: 20px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 60px;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ClearImage = styled.img`
  border: none;
  cursor: pointer;
`;

export default WriteTweet;
