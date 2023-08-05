import React, { useState, useRef, useEffect } from 'react';

const Fifth_page = ({onNext }) => {
    const [photo, setPhoto] = useState('');

    const fileRef = useRef(null);
    const handleNext = () => {
        // Step1 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
        onNext();
    };

    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setPhoto(result);
        };
        reader.readAsDataURL(theFile);
    };

    return (
        <div>
            <div>
                <h2>프로필 사진 선택하기</h2>
                <h4>마음에 드는 셀카 사진이 있나요? 지금 업로드하세요.</h4>
            </div>
            <div>
                {!photo &&
                    <div>
                        <img src={"/img/basic_profile.png"} alt={"사진 업로드"} width={200} height={200}/>
                        <img onClick={()=>{fileRef.current.click();}} src={"/img/add_photo.png"}/>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={fileRef}
                            onChange={onFileChange}
                        />
                    </div>}

                {photo && (
                    <div>
                        <img  src={photo} width="200px" height="200px" />
                        <img onClick={()=>{fileRef.current.click();}} src={"/img/add_photo.png"}/>
                        <img onClick={()=>{setPhoto(null);}} src={"/img/close_cross.png"}/>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={fileRef}
                            onChange={onFileChange}
                        />
                    </div>
                )}
            </div>
            <div>
                {!photo &&<button onClick={handleNext}>지금은 넘어가기</button>}
                {photo && <button onClick={handleNext}>다음</button>}
            </div>
        </div>
    );
};

export default Fifth_page