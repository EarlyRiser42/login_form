import React, { useState } from "react";
import { dbService, storageService } from "fbase";

const Writes = ({ writeObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [NewWrite, setNewWrite] = useState(writeObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this write?");
        if (ok) {
            await dbService.doc(`nweets/${writeObj.id}`).delete();
            await storageService.refFromURL(writeObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`nweets/${writeObj.id}`).update({
            text: writeObj,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewWrite(value);
    };
    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Edit your nweet"
                            value={NewWrite}
                            required
                            onChange={onChange}
                        />
                        <input type="submit" value="Update Nweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{writeObj.text}</h4>
                    {writeObj.attachmentUrl && (
                        <img src={writeObj.attachmentUrl} width="50px" height="50px" />
                    )}
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete write</button>
                            <button onClick={toggleEditing}>Edit write</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Writes;