import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "fbase";

const WriteTweet = ({ userObj, mention }) => {
    const [tweet, setTweet] = useState("");
    const [attachment, setAttachment] = useState("");
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
            retweet: false,
            retweeted: false,
            retweet_id:  userObj.uid,
            retweet_cnt: 0,
            likes: 0,
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
        const {
            target: { files },
        } = event;
        const theFile = files[0];
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
                <img src={userObj.photoURL} width="50px" height="50px"/>
            </div>
            <form onSubmit={onSubmit}>
                {!mention && <input
                    value={tweet}
                    onChange={onChange}
                    type="text"
                    placeholder="무슨 일이 일어나고 있나요?"
                    maxLength={120}
                />}
                {mention && <input
                    value={tweet}
                    onChange={onChange}
                    type="text"
                    placeholder="답글을 게시하세요"
                    maxLength={120}
                />}
                <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                    <img
                        src="/img/tweet_add_photo.png"
                        alt="이미지 추가"
                        style={{ width: '20px', height: '20px' }} // 이미지 스타일을 정의
                    />
                </label>
                <input id="fileInput" type="file" accept="image/*" onChange={onFileChange} style={{display:"none"}}/>
                {mention && <input type="submit" value="답글" />}
                {!mention && <input type="submit" value="게시하기" />}
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
export default WriteTweet;