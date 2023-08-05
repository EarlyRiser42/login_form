import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import WriteFactory from "../../components/WriteFactory";
import Writes from "../../components/writes";

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
            <WriteFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {tweets.map((tweet) => (
                    <Writes
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