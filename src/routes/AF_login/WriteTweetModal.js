import React, {useEffect, useState} from 'react';
import Modal from '../BF_login/Signups/Modal';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {dbService} from "../../fbase";
import WriteTweetForModal from "../../components/WriteTweetForModal";

const WriteTweetModal = ({userObj, modals}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const writeObj = location.state.writeObj ? location.state.writeObj : null;


    // 트윗 작성자 displayName, id, photoURL from profile DB
    const [id, setId] = useState(""); // 상태로 id를 관리합니다
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');

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
        getWriterInfo(userObj.uid);
    }, [userObj]); // writeObj가 변경될 때마다 호출합니다

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
            <Modal modals={modals}>
                <div>
                    <button onClick={() => navigate(-1)}>X</button>
                </div>
                <div>
                    <WriteTweetForModal userObj={userObj} />
                </div>
            </Modal>
        </div>
    );
};

export default WriteTweetModal