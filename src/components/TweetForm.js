import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fbase";
import {collection, doc, getDoc, arrayUnion, arrayRemove, onSnapshot, query, where, updateDoc} from "firebase/firestore";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const TweetForm = ({userObj, writeObj, isOwner, tweetPage}) => {
    // for modal
    const location = useLocation();
    const navigate = useNavigate();
    // 트윗 작성자 displayName, id, photoURL from profile DB
    const [id, setId] = useState(""); // 상태로 id를 관리합니다
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    // 리트윗 한사람 정보
    const [retweetName, setRetweetName] = useState('');

    // like, retweet, mention
    const [mention_cnt, setMention_cnt] = useState(0);
    const [like, setLike] = useState(false);
    const [like_cnt, setLike_cnt] = useState(writeObj.like_cnt);
    const [retweet, setRetweet] = useState(writeObj.retweeted || writeObj.retweet);
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
        if(tweetPage){
            navigate(-1);
        }
    };

    const getWriterInfo = async (id) => {
        const docRef = doc(dbService, "profile", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setId(docSnap.data().id);
            setDisplayName(docSnap.data().displayName);
            setPhotoURL(docSnap.data().photoURL);
            if(docSnap.data().likes.indexOf(writeObj.tweetId) !== -1){
                setLike(true);
            }
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document! failed to load tweet writer id");
        }
    };

    const getRetweetName = async () => {
        const docRef = doc(dbService, "profile", writeObj.retweet_id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setRetweetName(docSnap.data().displayName);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document! failed to load tweet writer id");
        }
    }
    // tweet 작성자 정보 가져오는 함수
    useEffect(() => {
        // 컴포넌트가 마운트될 때 writeObj.creatorId를 이용하여 getId를 호출하고 결과를 상태에 저장합니다
        getWriterInfo(writeObj.creatorId);
        getRetweetName();
    }, [writeObj]);

    // 멘션 갯수 count
    useEffect( () => {
        dbService.collection('mentions')
            .where('mentionTo', '==', writeObj.tweetId)
            .get()
            .then((querySnapshot) => {
                const documents = [];
                querySnapshot.forEach((doc) => {
                    documents.push({ id: doc.id, data: doc.data() });
                });
                setMention_cnt(querySnapshot.size);
            })
            .catch((error) => {
                console.error('Error getting mention documents:', error);
            });
    },[]);


   // retweet 된 게시물을 삭제했을 때 원래 게시물의 리트윗 개수를 줄이고, retweet변수 값을 false로 바꾸는 부분
    useEffect( () => {
        const q = query(collection(dbService, "tweets"), where("tweetId", "==", writeObj.tweetId), where("retweeted", "==", true));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tweetArray = querySnapshot.docs;
            if(retweet && tweetArray.length === 0){
                setRetweet(false);
                setRetweet_cnt(retweet_cnt-1);
                console.log('working')
            }
        });

        // 컴포넌트 언마운트 시 리스너 해제
        return () => unsubscribe();
    },[retweet]);

    const onLike = async () => {
        if(like){
            const profileRef = doc(dbService, "profile", userObj.uid);
            // 프로필에 좋아한 트윗 id 삭제
            await updateDoc(profileRef, {
                likes: arrayRemove(writeObj.tweetId)
            });

            const tweetRef = doc(dbService, "tweets", writeObj.id);
            // 트윗에 내 uid 삭제
            await updateDoc(tweetRef, {
                like_id: arrayRemove(userObj.uid)
            });

            // tweet의 like cnt 감소
            dbService.collection('tweets')
                .where("tweetId", "==", writeObj.tweetId)
                .get()
                .then(async (querySnapshot) => {
                    for (const doc of querySnapshot.docs) {
                        const docRef = dbService.collection('tweets').doc(doc.id);
                        const docData = (await getDoc(docRef)).data();
                        const likeCount = docData.like_cnt;
                        await updateDoc(docRef, { like_cnt: likeCount-1 });
                    }
                })
                .catch((error) => {
                    console.error(`Error getting documents: ${error}`);
                });
            setLike(false);
            setLike_cnt(like_cnt-1);
        }
        else{
            const profileRef = doc(dbService, "profile", userObj.uid);
            // 프로필에 좋아한 트윗 id 추가
            await updateDoc(profileRef, {
                likes: arrayUnion(writeObj.tweetId)
            });

            const tweetRef = doc(dbService, "tweets", writeObj.id);
            // 트윗에 내 uid 삭제
            await updateDoc(tweetRef, {
                like_id: arrayUnion(userObj.uid)
            });

            // tweet의 like cnt 증가
            dbService.collection('tweets')
                .where("tweetId", "==", writeObj.tweetId)
                .get()
                .then(async (querySnapshot) => {
                    for (const doc of querySnapshot.docs) {
                        const docRef = dbService.collection('tweets').doc(doc.id);
                        const docData = (await getDoc(docRef)).data();
                        const likeCount = docData.like_cnt;
                        await updateDoc(docRef, { like_cnt: likeCount+1 });
                    }
                })
                .catch((error) => {
                    console.error(`Error getting documents: ${error}`);
                });

            setLike(true);
            setLike_cnt(like_cnt+1);
        }
    };

    const onRetweet = async () => {
        if(!retweet){
            const docRef = doc(dbService, "tweets", writeObj.id);
            await updateDoc(docRef, {
                retweet: true
            });

            const cnt = (await getDoc(docRef)).data().retweet_cnt;

            const tweetObj = {
                tweetId: uuidv4(),
                text: writeObj.text,
                createdAt: writeObj.createdAt,
                creatorId: writeObj.creatorId,
                toDBAt: Date.now(),
                retweet: false, // 다른 사람이 리트윗 했는지
                retweeted: true, // 리트윗으로 작성됐는지
                retweet_id:  userObj.uid,
                retweeted_from : writeObj.tweetId, // 원 게시글 tweetId
                retweet_cnt: cnt+1,
                like_id : writeObj.like_id,
                like_cnt: writeObj.like_cnt,
                attachmentUrl: writeObj.attachmentUrl
            };
            await dbService.collection("tweets").add(tweetObj);

            // retweet 개수 모두 증가
            const tweetsRef = dbService.collection("tweets");
            const querySnapshot = await tweetsRef.where("retweeted_from", "==", writeObj.tweetId).get();
            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    const tweetRef = tweetsRef.doc(doc.id);
                    // 기존 리트윗 개수를 가져와서 1을 더한 값을 업데이트합니다.
                    const currentRetweetCount = doc.data().retweet_cnt || 0; // 기존 리트윗 개수 또는 0으로 초기화
                    const updatedRetweetCount = currentRetweetCount + 1;
                    await updateDoc(tweetRef, {
                        retweet_cnt: updatedRetweetCount, // 'retweet_cnt' 필드로 업데이트
                    });
                });
            }

            setRetweet_cnt(retweet_cnt+1);
            setRetweet(true);
        }
        else{
            // 리트윗한 트윗 삭제
            dbService.collection('tweets')
                .where('retweeted', '==', true)
                .where('retweet_id', '==', userObj.uid)
                .get()
                .then((querySnapshot) => {
                    // 찾은 문서들을 순회하면서 삭제합니다.
                    querySnapshot.forEach((doc) => {
                        // 문서 삭제
                        dbService.collection('tweets').doc(doc.id).delete()
                            .then(() => {
                                console.log(`Document with ID ${doc.id} successfully deleted.`);
                            })
                            .catch((error) => {
                                console.error(`Error deleting document: ${error}`);
                            });
                    });
                })
                .catch((error) => {
                    console.error(`Error getting documents: ${error}`);
                });

            // 원래 트윗 retweet false로 변경
            dbService.collection('tweets')
                .where("tweetId", "==", writeObj.tweetId)
                .where("creatorId", "==", writeObj.creatorId)
                .get()
                .then(async (querySnapshot) => {
                    for (const doc of querySnapshot.docs) {
                        const docRef = dbService.collection('tweets').doc(doc.id);
                        await updateDoc(docRef, { retweet: false });
                    }
                })
                .catch((error) => {
                    console.error(`Error getting documents: ${error}`);
                });

            // retweet 개수 모두 감소
            const tweetsRef = dbService.collection("tweets");
            const querySnapshot = await tweetsRef.where("retweeted_from", "==", writeObj.tweetId).get();

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    const tweetRef = tweetsRef.doc(doc.id);

                    // 기존 리트윗 개수를 가져와서 1을 더한 값을 업데이트합니다.
                    const currentRetweetCount = doc.data().retweet_cnt || 0; // 기존 리트윗 개수 또는 0으로 초기화
                    const updatedRetweetCount = currentRetweetCount - 1;

                    await updateDoc(tweetRef, {
                        retweet_cnt: updatedRetweetCount, // 'retweet_cnt' 필드로 업데이트
                    });
                });
            }

            // 원래 트윗 변수값 변경
            setRetweet_cnt(retweet_cnt-1);
            setRetweet(false);
        }
    };

    const onShare = async () => {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
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

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const day = date.getDate();
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
        const year = date.getFullYear();

        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${ampm} ${formattedHours}:${formattedMinutes} · ${year}년 ${month}월 ${day}일`;
    }

    return (
        <div>
            {retweeted && <span>{retweetName}님이 리트윗했습니다</span>}
            <div>
                <Link to={`/profile/${writeObj.creatorId}`}>
                    <img src={photoURL} style={{ width: '40px', height: '40px' }}/>
                </Link>
            </div>
            <div>
                <div>
                    <span>{displayName}</span>
                    <span>{id}</span>
                    {!tweetPage && <span>{elapsedTime(writeObj.createdAt)}</span>}
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
                {tweetPage &&
                    <div>
                        <span>{formatTimestamp(writeObj.createdAt)}</span>
                    </div>
                }
                {tweetPage && (retweet_cnt > 0 || like_cnt > 0) && (
                    <div>
                        {retweet_cnt > 0 && <span>{retweet_cnt} 재게시</span>}
                        {like_cnt > 0 && <span>{like_cnt} 마음에 들어요</span>}
                    </div>
                )}
                <div>
                    <Link to={`/compose/mention`} state={{background: location, writeObj:writeObj}}><img src={"/img/mention.png"} alt={"mention"} style={{width: "18.75px", height: "18.75px"}}/></Link>
                    {mention_cnt > 0 && !tweetPage && <span>{mention_cnt}</span>}
                    {retweet && <img onClick={onRetweet} src={"/img/retweet_color.png"} alt={"retweet"} style={{width: "18.75px", height: "18.75px"}}/>}
                    {!retweet && <img onClick={onRetweet} src={"/img/retweet.png"} alt={"retweet"} style={{width: "18.75px", height: "18.75px"}}/>}
                    {retweet_cnt > 0 && !tweetPage && <span>{retweet_cnt}</span>}
                    {like && <img onClick={onLike} src={"/img/like_color.png"} alt={"like"} style={{width: "18.75px", height: "18.75px"}}/>}
                    {!like && <img onClick={onLike} src={"/img/like.png"} alt={"like"} style={{width: "18.75px", height: "18.75px"}}/>}
                    {like_cnt > 0 && !tweetPage && <span>{like_cnt}</span>}
                    <img onClick={onShare} src={"/img/share.png"} alt={"share"} style={{width: "18.75px", height: "18.75px"}}/>
                </div>
            </div>
        </div>
    );
};

export default TweetForm;