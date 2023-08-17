import React, {useEffect, useState} from "react";
import {collection, query, where, getDocs} from "firebase/firestore";
import {dbService} from "../fbase";
import RecommendFollow from "./RecommendFollow";

const SearchBar = ({userObj}) => {
    const [users, setUsers] = useState([]);

    useEffect( () => {
        const getUsers = async () => {
            // 유저의 uid
            const userUid = userObj.uid;

            // 해당 유저의 following 리스트에 있는 userUid 가져오기
            const followingSnapshot = await getDocs(collection(dbService, 'profile'));
            const followingList = followingSnapshot.docs
                .filter(doc => doc.data().uid === userUid)
                .map(doc => doc.data().following);

            // 쿼리 생성
            const q = query(
                collection(dbService, 'profile'),
                where('uid', '!=', userUid), // userUid가 userObj.uid와 다른 문서
            );

            // 문서 가져오기
            const querySnapshot = await getDocs(q);

            const documents = querySnapshot.docs
                .filter(doc => !followingList.includes(doc.data().uid)) // following 리스트에 없는 문서 필터링
                .map((doc) => doc.data())
                .slice(0, 3); // 최대 3개 문서만 가져오기

            setUsers(documents);
        }
    getUsers();
    },[]);


    return (
      <div>
        <div>
            <span>검색</span>
        </div>
        <div>
            <div>
                <span>팔로우 추천</span>
            </div>
            {users.map((user)=>(
                <RecommendFollow
                    key={user.uid}
                    userObj={userObj}
                    user={user}
                />
            ))}
        </div>
      </div>
    );
}

export default SearchBar