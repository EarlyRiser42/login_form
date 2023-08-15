import React, {useEffect, useState} from "react";
import {authService, dbService} from "fbase";
import {useParams, Link, useLocation, useNavigate} from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Information from "./Information";
import TweetForm from "../../../components/TweetForm";
const Profile = ({userObj, setTweetPath}) => {
    const [tweets, setTweets] = useState([]);
    const navigate = useNavigate()

    const handleTweetClick = (event, tweetId) => {
        // 이벤트 버블링을 막기 위해 해당 이벤트가 이미지 엘리먼트에서 발생한 경우에는 핸들러를 처리하지 않음
        if (event.target.tagName.toLowerCase() === "img" || event.target.closest("img")) {
            return;
        }

        // 이동할 경로 설정
        const newPath = `/${userObj.uid}/${tweetId}`;

        // 경로 변경, url 이동
        setTweetPath(newPath);
        navigate(newPath);
    };

    useEffect( () => {
        const q = query(collection(dbService, "tweets"), where("creatorId", "==", userObj.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tweetArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTweets(tweetArray);
        });

        // 컴포넌트 언마운트 시 리스너 해제
        return () => unsubscribe();
    },[]);

    return(
      <div>
          <div>
              <Information userObj={userObj}/>
          </div>
          <div>
              <div>
                  <Link to={`/${userObj.uid}`}><span>게시물</span></Link>
              </div>
              <div>
                  <Link to={`/${userObj.uid}/with_replies`}><span>답글</span></Link>
              </div>
              <div>
                  <Link to={`/${userObj.uid}/media`}><span>미디어</span></Link>
              </div>
              <div>
                  <Link to={`/${userObj.uid}/likes`}><span>마음에 들어요</span></Link>
              </div>
          </div>
          <div style={{ marginTop: 30 }}>
              {tweets.map((tweet) => (
                  <div
                      key={tweet.id}
                      onClick={(event) => handleTweetClick(event, tweet.tweetId)}
                      style={{ cursor: "pointer" }}
                  >
                      <TweetForm
                          key={tweet.id}
                          userObj={userObj}
                          writeObj={tweet}
                          isOwner={tweet.creatorId === userObj.uid && tweet.retweet_id === userObj.uid}
                          tweetPage={false}
                      />
                  </div>
              ))}
          </div>
      </div>
    );
}

export default Profile;