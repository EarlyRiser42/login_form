import React, {useEffect, useState} from "react";
import {authService, dbService} from "fbase";
import {useParams, Link, useLocation} from "react-router-dom";
import {getAuth} from "firebase/auth";
import {doc, onSnapshot} from "firebase/firestore";

export default ({ userObj }) => {
    // for modal
    const location = useLocation();
    // 동적 라우팅
    const profile_id = useParams().profile;
    // 본인 계정인지 아닌지 확인
    const [owner, setOwner] = useState(false);

    // Auth에 있지않은, DB에 담겨있는 값 -> Auth에 있는 값은 App.js의 userobj로 확인
    const [backgroundiamge, setBackgroundimage] = useState('');
    const [id, setId] = useState('');
    const [intro, setIntro] = useState('');
    const [SignupAt, setSignupAt] = useState('');

    useEffect(()=>{
        if(userObj.uid === profile_id){
            setOwner(true);
        }
        else{
            setOwner(false);
        }
    });

    useEffect( () => {
        const auth = getAuth();
        const docRef = doc(dbService, "profile", auth.currentUser.uid);

        // Firestore 리스너 등록
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                // 데이터베이스의 값이 변경될 때마다 새로운 값을 가져와서 id를 업데이트
                setId(docSnap.data().id);
                setBackgroundimage(docSnap.data().backgroundimage);
                setSignupAt(docSnap.data().SignupAt);
                setIntro(docSnap.data().intro);
            }
        });

        // 컴포넌트 언마운트 시 리스너 해제
        return () => unsubscribe();
    },[]);

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

    const follow = () => {

    };

    return (
        <div>
            <div>
                {!backgroundiamge && <img src={"/img/backgroundimage.png"} width="100px" height="50px"/>}
                {backgroundiamge && <img src={backgroundiamge} width="100px" height="50px"/>}
            </div>
            <div>
                <img src={userObj.photoURL} width="50px" height="50px"/>
            </div>
            <div>
                {owner && <Link to={"/editprofile"} state={{background: location}}><button>프로필 수정</button></Link>}
                {!owner && <button onClick={follow}>팔로우</button>}
            </div>
            <div>
                <span>{id}</span>
                <span>{userObj.displayName}</span>
            </div>
            <div>
                <span>{intro}</span>
            </div>
            <div>
                <span>{elapsedTime(SignupAt)}</span>
            </div>
        </div>
    );
};