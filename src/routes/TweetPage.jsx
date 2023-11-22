import React, { useState, useEffect } from 'react';
import { dbService } from '../fbase';
import TweetForm from '../components/TweetForm';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Search from './Search';
import Nav from '../components/Nav.jsx';
import styled from 'styled-components';
import { HomeDiv, HomeImgDivForMobile, HomeMiddleDiv } from './Home.jsx';
import { useMediaQuery } from 'react-responsive';
import {
  ClearImage,
  ClearImageDiv,
  ImageContainer,
  PreviewImage,
  StyledInput,
  StyledLabel,
  SubmitButton,
  TweetTextArea,
  Image,
} from '../components/WriteTweet.jsx';

const TweetPage = ({ userObj }) => {
  const parm = useParams();
  const tweetId = parm.tweetPath;
  const { state } = useLocation();
  const writeObj = state.tweet;

  const [isNavOpen, setIsNavOpen] = useState(false);

  // 지역변수
  const [attachment, setAttachment] = useState('');
  const [mentionText, setMentionText] = useState('');

  const navigate = useNavigate();
  const [mentions, setMentions] = useState([]);

  useEffect(() => {
    dbService
      .collection('mentions')
      .where('mentionTo', '==', tweetId)
      .get()
      .then((querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMentions(documents);
      })
      .catch((error) => {
        console.error('Error getting mention documents:', error);
      });
  }, []);

  const autoResize = (event) => {
    const textarea = event.target;
    setMentionText(textarea.value); // This will update the tweet state with the textarea value

    // Reset the height to shrink in case of text deletion
    textarea.style.height = 'auto';
    // Set the height to scrollHeight to expand to fit the content
    textarea.style.height = `${textarea.scrollHeight}px`;
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
    <HomeDiv>
      <Nav />
      <HomeImgDivForMobile>
        <img
          className={'HomeOpenNavImg'}
          src={userObj.photoURL}
          alt={'OpenNav'}
          onClick={() => {
            setIsNavOpen(true);
          }}
        />
        <img className={'HomeX_logo'} src={'./X_logo.svg'} alt={'X_logo'} />
        <img
          className={'HomeOpenSetting'}
          src={'./setting.svg'}
          alt={'OpenSetting'}
        />
      </HomeImgDivForMobile>
      <HomeMiddleDiv>
        <NavContainer>
          <img
            src={'./left_arrow.svg'}
            onClick={() => {
              navigate(-1);
            }}
          />
          <span>게시하기</span>
        </NavContainer>
        <TweetForm
          userObj={userObj}
          writeObj={writeObj}
          isOwner={writeObj.creatorId === userObj.uid}
          tweetPage={true}
        />
        <MyMentionContainer>
          <PFP src={userObj.photoURL} alt="PFP" />
          <MyMentionInnerContainer>
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
            <ButtonContainer>
              <StyledLabel htmlFor="fileInput">
                <Image src="/tweet_add_photo.svg" alt="이미지 추가" />
              </StyledLabel>
              <StyledInput
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={onFileChange2}
              />
              <SubmitButton type="submit" disabled={!mentionText.trim()}>
                답글
              </SubmitButton>
            </ButtonContainer>
          </MyMentionInnerContainer>
        </MyMentionContainer>
      </HomeMiddleDiv>
      <div>
        {mentions.map((mention) => (
          <TweetForm
            userObj={userObj}
            writeObj={mention}
            isOwner={mention.creatorId === userObj.uid}
            tweetPage={false}
          />
        ))}
      </div>
      {!useMediaQuery({ query: '(max-width: 1000px)' }) && <Search />}
    </HomeDiv>
  );
};

const NavContainer = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 19px;
    height: 19px;
    margin-left: 3%;
  }
  img:hover {
    cursor: pointer;
  }
  span {
    font-weight: bold;
    margin-left: 7%;
    font-size: 1.3rem;
  }
`;

const MyMentionContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
`;

const PFP = styled.img`
  margin-top: 4%;
  margin-left: 3%;
  width: 40px;
  height: 40px;
  border-radius: 50px;
`;

const MyMentionInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 90%;
  margin-left: 2%;
  margin-right: 3%;
  height: auto;
  min-height: 120px;
  margin-top: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export default TweetPage;
