import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "fbase";
import {getAuth} from "firebase/auth";
import {doc, onSnapshot} from "firebase/firestore";

const WriteTweetForModal = ({ userObj }) => {
    const [tweet, setTweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const [pfp, setPfp] = useState(userObj.photoURL);

    useEffect( () => {
        const auth = getAuth();
        const docRef = doc(dbService, "profile", auth.currentUser.uid);

        // Firestore 리스너 등록
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setPfp(docSnap.data().photoURL);
            }
        });

        // 컴포넌트 언마운트 시 리스너 해제
        return () => unsubscribe();
    },[]);

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        const uuid = uuidv4();
        if (attachment !== "") {
            const attachmentRef = storageService
                .ref()
                .child(`tweets/${uuid}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            tweetId: uuid,
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            toDBAt: Date.now(),
            retweetList: [], // 다른 사람이 리트윗 했는지
            likeList: [],
            attachmentUrl: attachmentUrl
        };
        await dbService.collection("tweets").add(tweetObj);

        setTweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setTweet(value);
    };

    const onFileChange = (event) => {
        console.log('ss')
        const {
            target: { files },
        } = event;
        const theFile = files[0]
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);

    };

    const onClearAttachment = () => setAttachment(null);

    return (
        <div>
            <div>
                <img src={pfp} width="50px" height="50px"/>
            </div>
            <form onSubmit={onSubmit}>
                <input
                    value={tweet}
                    onChange={onChange}
                    type="text"
                    placeholder="무슨 일이 일어나고 있나요?"
                    maxLength={120}
                />
                <label htmlFor="fileInput_forModal" style={{ cursor: 'pointer' }}>
                    <img
                        src="/img/tweet_add_photo.png"
                        alt="이미지 추가"
                        style={{ width: '20px', height: '20px' }} // 이미지 스타일을 정의
                    />
                </label>
                <input id="fileInput_forModal" type="file" accept="image/*" onChange={onFileChange} style={{display:"none"}}/>
                <input type="submit" value="게시하기" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
        </div>

    );
};
export default WriteTweetForModal;