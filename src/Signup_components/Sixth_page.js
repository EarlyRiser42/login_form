import React, { useState} from 'react';
import { Link } from "react-router-dom"
const Sixth_page = ({ user_data, setSinging }) => {
    const [name, setName] = useState(user_data.name);
    const initial = user_data.name;
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setName(value);
    };

    return (
        <div>
            <div>
                <h2>이름을 가르쳐 주시겠어요?</h2>
                <h4>@사용자 아이디는 고유한 나만의 아이디입니다. 나중에 언제든 바꿀 수 있습니다.</h4>
            </div>
            <div>
                <div>
                    <h5>사용자 아이디</h5>
                    <input
                        name="name"
                        type="text"
                        placeholder="사용자 아이디"
                        value={name}
                        onChange={onChange}
                    />
                    <img src={"img/greencheck.png"} alt={"greencheck"} width={20} />
                </div>
            </div>
            <div>
                {initial === name && <Link to={"/"}><button onClick={() => {setSinging(false)}}>지금은 넘어가기</button></Link>}
                {initial !== name && <Link to={"/"}><button onClick={() => {setSinging(false)}}>완료</button></Link>}
            </div>
        </div>
    );
};

export default Sixth_page