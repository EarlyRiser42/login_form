import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import WriteFactory from "../components/WriteFactory";
import Writes from "../components/writes";

const Home = ({ userObj }) => {
    const [nweets, setNweets] = useState([]);
    useEffect(() => {
        dbService
            .collection("nweets")
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                const nweetArray = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNweets(nweetArray);
            });
    }, []);
    return (
        <div className="container">
            <WriteFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => (
                    <Writes
                        key={nweet.id}
                        writeObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};
export default Home;