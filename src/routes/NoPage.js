import React from 'react';
import {Link, useLocation} from "react-router-dom"
const NoPage = () => {
    return (
        <div>
            <div>
                <span>이 페이지는 존재하지 않습니다. 다른 페이지를 검색해 보세요</span>
            </div>
            <Link to={"/"}> <button >확인</button> </Link>
        </div>
    );
};

export default NoPage;