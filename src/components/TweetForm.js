import React, { useState } from "react";
import { dbService, storageService } from "fbase";

const TweetForm = ({ writeObj, isOwner }) => {
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this write?");
        if (ok) {
            await dbService.doc(`tweets/${writeObj.id}`).delete();
            await storageService.refFromURL(writeObj.attachmentUrl).delete();
        }
    };

    return (
        <div>
            <h4>{writeObj.text}</h4>
            {writeObj.attachmentUrl && (
                <img src={writeObj.attachmentUrl} width="50px" height="50px" />
            )}
            {isOwner && (
                <>
                    <button onClick={onDeleteClick}>Delete write</button>
                </>
            )}
        </div>
    );
};

export default TweetForm;