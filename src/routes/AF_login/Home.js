import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import WriteTweet from "../../components/WriteTweet";
import TweetForm from "../../components/TweetForm";

const Home = ({ userObj }) => {
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        dbService
            .collection("tweets")
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                const nweetArray = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTweets(nweetArray);
            });
    }, []);

    return (
        <div className="container">
            <WriteTweet userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {tweets.map((tweet) => (
                    <TweetForm
                        key={tweet.id}
                        writeObj={tweet}
                        isOwner={tweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};
export default Home;