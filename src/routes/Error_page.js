import React from 'react';
import { Link } from "react-router-dom"
const Error_page = () => {
    return (
        <div>
            <div>
                <h1>무언가 잘못 됐습니다.</h1>
            </div>
            <Link to={"/"}> <button >확인</button> </Link>
        </div>
    );
};

export default Error_page;