import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fbase";
import { doc, getDoc } from "firebase/firestore";
import {Link, useLocation} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const TweetForm = ({userObj, writeObj, isOwner }) => {
    // for modal
    const location = useLocation();

    // 트윗 작성자 displayName, id, photoURL from profile DB
    const [id, setId] = useState(""); // 상태로 id를 관리합니다
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');

    // like, retweet
    const [like, setLike] = useState(false);
    const [retweet, setRetweet] = useState(writeObj.retweeted);
    const [retweet_cnt, setRetweet_cnt] = useState(writeObj.retweet_cnt);
    const retweeted = writeObj.retweeted;

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this write?");
        if (ok) {
            await dbService.doc(`tweets/${writeObj.id}`).delete();
            if(writeObj.attachmentUrl){
                await storageService.refFromURL(writeObj.attachmentUrl).delete();
            }
        }
    };

    const getWriterInfo = async (id) => {
        const docRef = doc(dbService, "profile", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setId(docSnap.data().id);
            setDisplayName(docSnap.data().displayName);
            setPhotoURL(docSnap.data().photoURL);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document! failed to load tweet writer id");
        }
    };

    useEffect(() => {
        // 컴포넌트가 마운트될 때 writeObj.creatorId를 이용하여 getId를 호출하고 결과를 상태에 저장합니다
        getWriterInfo(writeObj.creatorId);
    }, [writeObj]);

    const Retweet = async () => {
        if(!retweet){
            const docRef = doc(dbService, "tweets", writeObj.id);
            const cnt = (await getDoc(docRef)).data().retweet;
            const tweetObj = {
                tweetId: writeObj.tweetId,
                text: writeObj.text,
                createdAt: writeObj.createdAt,
                creatorId: writeObj.creatorId,
                toDBAt: Date.now(),
                retweeted: true,
                retweet_id:  userObj.uid,
                retweet_cnt: cnt+1,
                likes: writeObj.likes,
                attachmentUrl: writeObj.attachmentUrl
            };
            await dbService.collection("tweets").add(tweetObj);

            // retweet 개수 모두 증가
            const tweetsRef = dbService.collection("tweets");
            const querySnapshot = await tweetsRef.where("tweetId", "==", writeObj.tweetId).get();

            const batch = dbService.batch();

            querySnapshot.forEach((doc) => {
                const tweetRef = tweetsRef.doc(doc.id);
                batch.update(tweetRef, {
                    retweet: cnt+1,
                });
            });

            setRetweet(true);
        }
        else{
            const tweetsRef = dbService.collection("tweets");
            const querySnapshot = await tweetsRef
                .where("retweeted", "==", true)
                .where("retweet_id", "==", userObj.uid)
            console.log(querySnapshot.docs)
            const doc = querySnapshot.docs[0];
            await tweetsRef.doc(doc.id).delete();
            setRetweet(false);
        }
    };

    const elapsedTime = (date) => {
        const start = new Date(date);
        const end = new Date();

        const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
        if (seconds < 60) return '방금 전';

        const minutes = seconds / 60;
        if (minutes < 60) return `${Math.floor(minutes)}분 전`;

        const hours = minutes / 60;
        if (hours < 24) return `${Math.floor(hours)}시간 전`;

        const days = hours / 24;
        if (days < 7) return `${Math.floor(days)}일 전`;

        return `${start.toLocaleDateString()}`;
    };

    return (
        <div>
            {retweeted && <span>{displayName}님이 리트윗했습니다</span>}
            <div>
                <img src={photoURL} style={{ width: '40px', height: '40px' }}/>
            </div>
            <div>
                <div>
                    <span>{displayName}</span>
                    <span>{id}</span>
                    <span>{elapsedTime(writeObj.createdAt)}</span>
                    {isOwner && (
                        <>
                            <img src={"/img/delete.png"} onClick={onDeleteClick} style={{ width: '15px', height: '20px' }}/>
                        </>
                    )}

                </div>
                <div>
                    <span>{writeObj.text}</span>
                </div>
                <div>
                    {writeObj.attachmentUrl && (
                        <img src={writeObj.attachmentUrl} width="50px" height="50px" />
                    )}
                </div>
                <div>
                    <Link to={`/compose/tweet`} state={{background: location, writeObj:writeObj}}><img src={"/img/mention.png"} alt={"mention"} style={{width: "18.75px", height: "18.75px"}}/></Link>
                    {retweet && <img onClick={Retweet} src={"/img/retweet_color.png"} alt={"retweet"} style={{width: "18.75px", height: "18.75px"}}/>}
                    {!retweet && <img onClick={Retweet} src={"/img/retweet.png"} alt={"retweet"} style={{width: "18.75px", height: "18.75px"}}/>}
                    {retweet_cnt > 0 && <span>{retweet_cnt}</span>}
                    {like && <img src={"/img/like_color.png"} alt={"like"} style={{width: "18.75px", height: "18.75px"}}/>}
                    {!like && <img src={"/img/like.png"} alt={"like"} style={{width: "18.75px", height: "18.75px"}}/>}
                    <img src={"/img/share.png"} alt={"share"} style={{width: "18.75px", height: "18.75px"}}/>
                </div>
            </div>
        </div>
    );
};

export default TweetForm;