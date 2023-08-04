import React, {useEffect, useState, useRef} from 'react';

const Third_page = ({ onNext, onPrev, user_data}) => {
    const [password, setPassword] = useState("");

    // 비밀번호 보이기 안보이기
    const [isShowPwChecked, setShowPwChecked] = useState(false)
    const passwordRef = useRef(null)

    useEffect(() => {
        if(user_data.password){
            setPassword(user_data.password);
        }
    }, []);

    const handleShowPwChecked = async () => {
        const password = await passwordRef.current
        if (password === null) return

        await setShowPwChecked(!isShowPwChecked)
        if(!isShowPwChecked) {
            password.type = 'text';
        } else {
            password.type = 'password';
        }
    }

    const handleNext = () => {
        // Step2 페이지에서 입력한 데이터를 저장하고 다음 페이지로 이동
        onNext({password});
    };

    const handlePrev = () => {
        onPrev();
    }

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setPassword(value);
    };

    return (
        <div>
            <div>
                <button onClick={handlePrev}>←</button>
                <h4>4단계 중 3단계</h4>
            </div>
            <div>
                <h3>비밀번호가 필요합니다</h3>
                <h4>8자 이상이어야 합니다.</h4>
            </div>
            <div>
                <input
                    name="password"
                    type="password"
                    placeholder="비밀번호"
                    maxLength={16}
                    required
                    value={password}
                    ref={passwordRef}
                    onChange={onChange}
                />
                <button onClick={handleShowPwChecked} >
                    {!isShowPwChecked && <img src={"/img/show.png"} alt={"비밀번호 보기"} height={30}/>}
                    {isShowPwChecked && <img src={"/img/hide.png"} alt={"비밀번호 숨기기"} height={30}/>}
                </button>
                {password.length < 8 && <h5>비밀번호는 최소 8자 이상이어야 합니다. 더 긴 비밀번호를 입력하세요.</h5>}
            </div>

            <button disabled={password.length < 8}  onClick={handleNext}>다음</button>

        </div>
    );
};

export default Third_page