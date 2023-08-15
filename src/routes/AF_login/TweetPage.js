import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import WriteTweet from "../../components/WriteTweet";
import TweetForm from "../../components/TweetForm";
import {Link, useParams} from "react-router-dom";

const TweetPage = ({userObj}) => {
    const parm = useParams();
    const tweetId = parm.tweetPath;

    const [mentions, setMentions] = useState([]);
    const [writeObjs, setWriteObjs] = useState([]);

    useEffect( () => {
        dbService.collection('mentions')
            .where('mentionTo', '==', tweetId)
            .get()
            .then((querySnapshot) => {
                const documents = [];
                querySnapshot.forEach((doc) => {
                    documents.push({ id: doc.id, data: doc.data() });
                });
                setMentions(documents);
            })
            .catch((error) => {
                console.error('Error getting mention documents:', error);
            });

        dbService.collection('tweets')
            .where('tweetId', '==', tweetId)
            .get()
            .then((querySnapshot) => {
                const documents = [];
                querySnapshot.forEach((doc) => {
                    documents.push({ id: doc.id, data: doc.data() });
                });
                setWriteObjs(documents); // writeObj 업데이트
            })
            .catch((error) => {
                console.error('Error getting mention documents:', error);
            });
    },[]);

    return (
        <div className="container">
            {writeObjs.map((writeObj) => (
                <TweetForm
                    userObj={userObj}
                    writeObj={writeObj.data} // 최신 writeObj를 전달
                    isOwner={writeObj.data.creatorId === userObj.uid}
                    tweetPage={true}
                />
                )
            )}
        </div>
    );
};
export default TweetPage;