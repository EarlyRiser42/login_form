import React, {useEffect, useState} from "react";
import {authService, dbService} from "fbase";
import {useParams, Link, useLocation} from "react-router-dom";
import {getAuth} from "firebase/auth";
import {doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import './information.css';

const Information = ({ userObj }) => {
    // for modal
    const location = useLocation();
    // 동적 라우팅
    const profile_id = useParams().profile;
    // 본인 계정인지 아닌지 확인
    const [owner, setOwner] = useState(false);
    const [following, setFollowing] = useState(true);

    // Auth에 있지않은, DB에 담겨있는 값 -> Auth에 있는 값은 App.js의 userobj로 확인
    const [backgroundiamge, setBackgroundimage] = useState('');

    const [id, setId] = useState('');
    const [intro, setIntro] = useState('');
    const [SignupAt, setSignupAt] = useState('');

    // 팔로잉/ 언팔로잉 버튼
    const [isHovered, setIsHovered] = useState(false);
    const [follow_cnt, setFollow_cnt] = useState(0);
    const [follower_cnt, setFollower_cnt] = useState(0);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const buttonText = isHovered ? '언팔로잉' : '팔로잉'; // 버튼 텍스트 선택
    const buttonStyle = isHovered ? 'button hovered' : 'button'; // 버튼 스타일 선택


    useEffect(()=>{
        if(userObj.uid === profile_id){
            setOwner(true);
        }
        else{
            setOwner(false);
        }
    }, []);

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
                setFollow_cnt(docSnap.data().following.length);
                setFollower_cnt(docSnap.data().follower.length);
            }
        });

        // 컴포넌트 언마운트 시 리스너 해제
        return () => unsubscribe();
    },[]);

    const elapsedTime = (date) => {
        const start = new Date(date);
        return '가입일: '+ String(start.getFullYear()) + '년 ' + String(start.getMonth()+1) + '월'
    };

    const follow = async () => {
        const docRef = doc(dbService, "profile", userObj.uid);
        await updateDoc(docRef, {
            following: arrayUnion(profile_id)
        });
        setFollowing(true);
    };

    const unfollow = async () => {
        const docRef = doc(dbService, "profile", userObj.uid);
        await updateDoc(docRef, {
            following: arrayRemove(profile_id)
        });
        setFollowing(false);
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
                {(!owner && !following) && <button onClick={follow}>팔로우</button>}
                {(!owner && following) && <button
                    onClick={unfollow}
                                  className={buttonStyle}
                                  onMouseEnter={handleMouseEnter}
                                  onMouseLeave={handleMouseLeave}>{buttonText}
                    </button>}
            </div>
            <div>
                <span>{userObj.displayName}</span>
                <span>{'@'+id}</span>
            </div>
            <div>
                <span>{intro}</span>
            </div>
            <div>
                <span>{elapsedTime(SignupAt)}</span>
            </div>
            <div>
                <Link>
                    <div>
                        <span>{follow_cnt} 팔로우 중</span>
                    </div>
                </Link>
                <Link>
                    <div>
                        <span>{follower_cnt} 팔로워</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Information;