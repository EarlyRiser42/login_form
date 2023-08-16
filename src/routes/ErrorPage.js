import React from 'react';
import {Link, useLocation} from "react-router-dom"
const ErrorPage = () => {
    return (
        <div>
            <div>
                <h3>무언가 잘못 됐습니다.</h3>
            </div>
            <Link to={"/"}> <button >확인</button> </Link>
        </div>
    );
};

export default ErrorPage;