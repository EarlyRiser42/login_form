import React, { useState, useRef, useEffect } from 'react';
import '../../style/Signup/SignupFifthPage.css';

const FifthPage = ({ onNext }) => {
  const [photo, setPhoto] = useState('');

  const fileRef = useRef(null);
  const handleNext = () => {
    // Step1 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
    onNext({ photo });
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
    <div className={'SignupFifthPageDiv'}>
      <div className={'SignupFifthPageLogoDiv'}>
        <img className={'LoginXLogo'} src="/X_logo.svg" alt="X logo" />
      </div>
      <div>
        <h1>프로필 사진 선택하기</h1>
        <h4>마음에 드는 셀카 사진이 있나요? 지금 업로드하세요.</h4>
      </div>
      <div>
        {!photo && (
          <div className="container">
            <div
              className="profile-img"
              style={{
                backgroundImage: `url(../../public/basic_profile.png)`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="add-photo-icon-Div">
                <img
                  src="/add-photo.svg"
                  className="add-photo-icon"
                  onClick={() => {
                    fileRef.current.click();
                  }}
                />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              className="file-input"
              ref={fileRef}
              onChange={onFileChange}
            />
          </div>
        )}

        {photo && (
          <div className="container">
            <div
              className="profile-img"
              style={{
                backgroundImage: `url(${photo})`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="add-photo-icon-Div">
                <img
                  src="/add-photo.svg"
                  className="add-photo-icon"
                  onClick={() => {
                    fileRef.current.click();
                  }}
                />
              </div>
              <div className="add-photo-icon-Div">
                <img
                  onClick={() => {
                    setPhoto('');
                  }}
                  className="close-icon"
                  src={'/close.svg'}
                />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              className="file-input"
              ref={fileRef}
              onChange={onFileChange}
            />
          </div>
        )}
      </div>
      <div className={'SignupFifthPageButtonDiv'}>
        {!photo && (
          <button
            className={'SignupNextButtonWhite'}
            onClick={() => {
              onNext();
            }}
          >
            지금은 넘어가기
          </button>
        )}
        {photo && (
          <button className={'SignupNextButtonBlack'} onClick={handleNext}>
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default FifthPage;
