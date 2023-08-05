import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";


const Third_page = ({setPage}) => {

    return(
        <div>
            <div>
                <Link to={"/"}><button>X</button></Link>
            </div>
            <div>
                <span>코드를 전송했습니다</span>
                <span>확인 코드를 받았는지 이메일을 확인해 주세요. 새 코드를 요청하려면 돌아가서 인증을 다시 선택하세요.</span>
            </div>
            <div>
                <button onClick={()=>{setPage(2);}}>돌아가기</button>
            </div>
        </div>
    );
}

export default Third_page