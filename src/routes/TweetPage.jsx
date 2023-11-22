import React, { useState, useEffect } from 'react';
import { dbService } from '../fbase';
import TweetForm from '../components/TweetForm';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Search from './Search';
import Nav from '../components/Nav.jsx';
import styled from 'styled-components';

const TweetPage = ({ userObj }) => {
  const parm = useParams();
  const tweetId = parm.tweetPath;
  const { state } = useLocation();
  const writeObj = state.tweet;

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
    <TweetPageContainer>
      <Nav />
      <TweetContainer>
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
                onChange={onFileChange}
              />
              <SubmitButton type="submit" disabled={!mentionText.trim()}>
                답글
              </SubmitButton>
            </ButtonContainer>
          </MyMentionInnerContainer>
        </MyMentionContainer>
      </TweetContainer>
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
      <Search />
    </TweetPageContainer>
  );
};

const TweetPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const TweetContainer = styled.div`
  width: 39vw;
  height: 15vh;
  margin-left: 28vw;
`;

const NavContainer = styled.div`
  width: 100%;
  height: 50%;
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

const TweetTextArea = styled.textarea`
  width: 100%;
  border: none;
  padding-left: 10px;
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const StyledLabel = styled.label`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  width: 10%;
`;

const StyledInput = styled.input`
  display: none;
`;

const Image = styled.img`
  margin-left: 10%;
  width: 20px;
  height: 20px;
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
  width: 17%;
  margin-right: 2%;
  min-width: 40px;
  max-height: 33px;
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

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
`;

const ClearImageDiv = styled.div`
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

const ClearImage = styled.img`
  border: none;
  cursor: pointer;
`;
export default TweetPage;
