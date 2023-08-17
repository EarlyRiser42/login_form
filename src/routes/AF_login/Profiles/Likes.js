import React, {useEffect, useState} from "react";
import {authService, dbService} from "fbase";
import {useParams, Link, useLocation} from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Information from "./Information";
import TweetForm from "../../../components/TweetForm";
import SearchBar from "../../../components/SearchBar";

const Likes = ({userObj}) => {
    const [tweets, setTweets] = useState([]);
    useEffect( () => {
        const fetchLikes = async () => {
            try {
                const profileRef = dbService.collection('profile').doc(userObj.uid);
                const profileSnapshot = await profileRef.get();

                if (profileSnapshot.exists) {
                    const profileData = profileSnapshot.data();
                    const likesData = profileData.likes || [];

                    // Fetch matching tweets from 'tweets' collection
                    const tweetDocs = await dbService.collection('tweets')
                        .where('tweetId', 'in', likesData)
                        .get();

                    const likedTweetsData = tweetDocs.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setTweets(likedTweetsData);
                }
            } catch (error) {
                console.error('Error fetching likes and tweets:', error);
            }
        };

        fetchLikes();
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
                        userObj={userObj}
                        writeObj={tweet}
                        isOwner={tweet.creatorId === userObj.uid}
                        tweetPage={false}
                    />
                ))}
            </div>
            <SearchBar userObj={userObj}/>
        </div>
    );
}

export default Likes;