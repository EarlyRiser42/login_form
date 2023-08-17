import React, {useEffect, useState} from "react";
import {arrayRemove, arrayUnion, doc, updateDoc} from "firebase/firestore";
import {dbService} from "../fbase";
import {Link} from "react-router-dom";

const RecommendFollow = ({userObj, user}) => {
    // 팔로잉/ 언팔로잉 버튼
    const [isHovered, setIsHovered] = useState(false);
    const [following, setFollowing] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const buttonText = isHovered ? '언팔로잉' : '팔로잉'; // 버튼 텍스트 선택
    const buttonStyle = isHovered ? 'button hovered' : 'button'; // 버튼 스타일 선택

    const follow = async () => {
        const docRef = doc(dbService, "profile", userObj.uid);
        await updateDoc(docRef, {
            following: arrayUnion(user.uid)
        });
        setFollowing(true);
    };

    const unfollow = async () => {
        const docRef = doc(dbService, "profile", userObj.uid);
        await updateDoc(docRef, {
            following: arrayRemove(user.uid)
        });
        setFollowing(false);
    };

    return (
        <div key={user.uid}>
            <div>
                <Link to={`/profile/${user.uid}`}>
                    <img src={user.photoURL} height="41px" width="41px"/>
                </Link>
            </div>
            <div>
                <span>{user.displayName}</span>
                <span>{user.id}</span>
            </div>
            <div>
                {!following && <button onClick={follow}>팔로우</button>}
                {following && <button
                    onClick={unfollow}
                    className={buttonStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>{buttonText}
                </button>}
            </div>
        </div>
    )
}

export default RecommendFollow