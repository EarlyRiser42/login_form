import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import WriteTweet from "../../components/WriteTweet";
import TweetForm from "../../components/TweetForm";
import {Link, useNavigate, useLocation} from "react-router-dom";

const Home = ({ userObj, setTweetPath }) => {
    const [tweets, setTweets] = useState([]);
    const navigate = useNavigate()
    const locationState = useLocation().state;
    const followingPage = locationState ? locationState.followingPage : true;

    useEffect(() => {
        setTweets([]);
        if(followingPage){
            // profile 컬렉션의 userObj.uid 문서 가져오기
            dbService.collection('profile').doc(userObj.uid).get().then((doc) => {
                if (doc.exists) {
                    const followingList = doc.data().following;

                    // tweets 컬렉션에서 가져온 데이터를 필터링
                    dbService
                        .collection('tweets')
                        .where('creatorId', 'in', followingList) // following 배열에 포함된 경우만 가져오기
                        .orderBy('toDBAt', 'desc')
                        .onSnapshot((snapshot) => {
                            const tweetArray = snapshot.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }));
                            setTweets(tweetArray);
                        });
                }
            });
        }
        else{
            dbService
                .collection("tweets")
                .orderBy("toDBAt", "desc")
                .onSnapshot((snapshot) => {
                    const tweetArray = snapshot.docs
                        .filter(doc => doc.data().creatorId !== userObj.uid) // 조건을 만족하는 문서만 필터링
                        .map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                    setTweets(tweetArray);
                });
        }
    }, [followingPage]);

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
            <div>
                <Link to='/' state={{ followingPage: false}}>
                    <div>
                        <span>추천</span>
                    </div>
                </Link>
                <Link to='/' state={{ followingPage: true}}>
                    <div>
                        <span>팔로우 중</span>
                    </div>
                </Link>
            </div>
            <WriteTweet userObj={userObj} mention={false}/>
            {!followingPage &&
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
            }
            {followingPage &&
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
            }
        </div>
    );
};
export default Home;