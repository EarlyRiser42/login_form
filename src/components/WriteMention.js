import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "fbase";
import {useNavigate} from "react-router-dom";

const WriteMention = ({ userObj, writeObj }) => {
    const [tweet, setTweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        const uuid = uuidv4();
        if (attachment !== "") {
            const attachmentRef = storageService
                .ref()
                .child(`mentions/${uuid}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            mentionTo: writeObj.tweetId,
            tweetId: uuid,
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            toDBAt: Date.now(),
            retweet: false,
            retweeted: false,
            retweet_id:  userObj.uid,
            retweet_cnt: 0,
            like_id: [],
            like_cnt: 0,
            attachmentUrl: attachmentUrl
        };
        await dbService.collection("mentions").add(tweetObj);

        setTweet("");
        setAttachment("");
        navigate(-1);
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
        const theFile = files[0]
        const readers = new FileReader();

        readers.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        readers.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment(null);

    return (
        <div>
            <div>
                <img src={userObj.photoURL} width="50px" height="50px"/>
            </div>
            <form onSubmit={onSubmit}>
                <input
                    value={tweet}
                    onChange={onChange}
                    type="text"
                    placeholder="답글을 게시하세요"
                    maxLength={120}
                />
                <label htmlFor="fileInputs" style={{ cursor: 'pointer' }}>
                    <img
                        src="/img/tweet_add_photo.png"
                        alt="이미지 추가"
                        style={{ width: '20px', height: '20px' }} // 이미지 스타일을 정의
                    />
                </label>
                <input id="fileInputs" type="file" accept="image/*" onChange={onFileChange} style={{display:"none"}}/>
                <input type="submit" value="답글" />
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
export default WriteMention;