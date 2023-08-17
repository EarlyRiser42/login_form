import React from 'react';
import Modal from '../BF_login/Signups/Modal';
import {useNavigate} from "react-router-dom";
import WriteTweetForModal from "../../components/WriteTweetForModal";

const WriteTweetModal = ({userObj, modals}) => {
    const navigate = useNavigate();

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