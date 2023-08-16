import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
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
                const documents = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
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
                    documents.push({ id: doc.id, ...doc.data() });
                });
                setWriteObjs(documents); // writeObj 업데이트
            })
            .catch((error) => {
                console.error('Error getting mention documents:', error);
            });
    },[]);

    return (
        <div className="container">
            <div>
                {writeObjs.map((writeObj) => (
                        <TweetForm
                            userObj={userObj}
                            writeObj={writeObj} // 최신 writeObj를 전달
                            isOwner={writeObj.creatorId === userObj.uid}
                            tweetPage={true}
                        />
                    )
                )}
            </div>
            <div>
                <img src={userObj.photoURL} style={{ width: '40px', height: '40px' }}/>
                <span>답글을 게시하세요</span>
            </div>
            <div>
                {mentions.map((mention) => (
                    <TweetForm
                        userObj={userObj}
                        writeObj={mention} // 최신 writeObj를 전달
                        isOwner={mention.creatorId === userObj.uid}
                        tweetPage={false}
                    />
                ))}
            </div>
        </div>
    );
};
export default TweetPage;