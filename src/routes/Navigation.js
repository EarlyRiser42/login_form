import React, {useEffect, useState} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService, dbService } from "fbase";
import {getAuth} from "firebase/auth";
import { doc, onSnapshot } from 'firebase/firestore';

const Navigation = ({userObj, setIsLoggedIn}) => {
    // for modal
    const navigate = useNavigate();
    const location = useLocation();

    const [pfp, setPfp] = useState('');
    const [id, setId] = useState('');
    const onLogOutClick = () => {
        authService.signOut();
        setIsLoggedIn(false);
        navigate('/');
    };

    useEffect( () => {
        const auth = getAuth();
        // 프로필 사진 설정
        setPfp(auth.currentUser.photoURL);
        const docRef = doc(dbService, "profile", auth.currentUser.uid);

        // Firestore 리스너 등록
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                // 데이터베이스의 값이 변경될 때마다 새로운 값을 가져와서 id를 업데이트
                setId(docSnap.data().id);
            }
        });

        // 컴포넌트 언마운트 시 리스너 해제
        return () => unsubscribe();
    },[]);

    return(
        <nav>
            <div>
                <Link to="/">홈</Link>
                <Link to={`/${userObj.uid}`}>프로필</Link>
            </div>
            <div>
                <Link to="/write" state={{background: location}}><button>게시하기</button></Link>
                <button onClick={onLogOutClick}>Log Out</button>
            </div>
            <div>
                <span>{userObj.displayName}</span>
                <span>{id}</span>
                <img src={pfp} width="50px" height="50px"/>
            </div>
        </nav>
    )

};
export default Navigation;