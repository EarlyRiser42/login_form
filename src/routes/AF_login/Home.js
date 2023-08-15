import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import WriteTweet from "../../components/WriteTweet";
import TweetForm from "../../components/TweetForm";
import {Link, useNavigate} from "react-router-dom";

const Home = ({ userObj, setTweetPath }) => {
    const [tweets, setTweets] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        dbService
            .collection("tweets")
            .orderBy("toDBAt", "desc")
            .onSnapshot((snapshot) => {
                const tweetArray = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTweets(tweetArray);
            });
    }, []);

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

    return (
        <div className="container">
            <WriteTweet userObj={userObj} mention={false}/>
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
};
export default Home;