import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storageService, dbService } from '../fbase';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { profileImage } from '../util/recoil.jsx';

const WriteTweet = ({ userObj }) => {
  console.log(userObj);
  const [tweet, setTweet] = useState('');
  const [attachment, setAttachment] = useState('');
  const [pfp, setPfp] = useRecoilState(profileImage);

  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    const value = e.target.value;
    setTweet(value); // 내용 업데이트
  };

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
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      toDBAt: Date.now(),
      likeList: [],
      attachmentUrl: attachmentUrl,
    };
    await dbService.collection('tweets').add(tweetObj);

    setTweet('');
    setAttachment('');
  };

  const autoResize = (event) => {
    const textarea = event.target;
    setTweet(textarea.value); // This will update the tweet state with the textarea value

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
    <TweetForm onSubmit={onSubmit}>
      <LeftContainer>
        {' '}
        <ProfileImage src={pfp} />
      </LeftContainer>
      <RightContainer>
        <TweetContainer>
          <TweetTextArea
            name="tweet"
            placeholder="무슨 일이 일어나고 있나요?"
            rows="1"
            required
            value={tweet}
            onChange={autoResize}
            maxLength={140}
          />
          <MentionGuideSpan>
            <MentionGuideSpanImg src={'/earth.png'} />
            모든 사람이 답글을 달 수 있습니다
          </MentionGuideSpan>
        </TweetContainer>

        {attachment && (
          <div>
            <PreviewImage src={attachment} />
            <ClearImage onClick={onClearAttachment} src={'/close_cross.png'} />
          </div>
        )}
        <InnerContainer>
          <StyledLabel htmlFor="fileInput">
            <Image src="/tweet_add_photo.png" alt="이미지 추가" />
          </StyledLabel>
          <StyledInput
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
          <SubmitButton type="submit" disabled={!tweet.trim()}>
            게시하기
          </SubmitButton>
        </InnerContainer>
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
  width: 13%;
`;

const RightContainer = styled.div`
  width: 87%;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const TweetContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const TweetTextArea = styled.textarea`
  width: 92%;
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
`;

const MentionGuideSpanImg = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;
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

const StyledLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 15%;
`;

const StyledInput = styled.input`
  display: none;
`;

const Image = styled.img`
  margin-right: 45%;
  width: 25px;
  height: 25px;
`;

const SubmitButton = styled.button`
  background-color: #1da1f2;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  width: 22%;
  min-width: 110px;
  max-height: 35px;
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

const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
`;

const ClearImage = styled.img`
  position: absolute;
  top: 14%; // Adjust as necessary for your layout
  right: 36%; // Adjust as necessary for your layout
  width: 30px;
  height: 30px;
  border: none;
  padding: 5px 10px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
`;

export default WriteTweet;
