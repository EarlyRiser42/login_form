import React, {useEffect, useState} from 'react';
import Modal from '../BF_login/Signups/Modal';
import WriteTweet from "../../components/WriteTweet";
import {Link, useNavigate} from "react-router-dom";

const Write = ({userObj, modals}) => {
    // 유저 정보 전체
    const navigate = useNavigate();

    return (
        <div>
            <Modal modals={modals}>
                <div>
                    <button onClick={() => navigate(-1)}>X</button>
                </div>
                <div className="write-modal">
                    <WriteTweet userObj={userObj}/>
                </div>
            </Modal>
        </div>
    );
};

export default Write