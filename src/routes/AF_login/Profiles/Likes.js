import React, {useEffect, useState} from "react";
import {authService, dbService} from "fbase";
import {useParams, Link, useLocation} from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Information from "./Information";
import TweetForm from "../../../components/TweetForm";

const Likes = ({userObj, setTweetPath}) => {
    const [tweets, setTweets] = useState([]);

    useEffect( () => {
        const q = query(collection(dbService, "tweets"), where("creatorId", "==", userObj.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let tweetArray = [];
            querySnapshot.docs.map((doc) => {
                    if(doc.attachmentUrl !== ''){
                        tweetArray.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    }
                }
            );
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
                    <TweetForm
                        key={tweet.id}
                        writeObj={tweet}
                        isOwner={tweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
}

export default Likes;