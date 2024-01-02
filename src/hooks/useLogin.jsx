import { useMutation } from 'react-query';
import axios from 'axios';
import { setExpiryCookie } from '../util/cookie.jsx';
import { useRecoilState } from 'recoil';
import { toastTextState, loginState, userObjState } from '../util/recoil.jsx';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  // 전역 변수 recoil
  const [toastText, setToastText] = useRecoilState(toastTextState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const [userObj, setUserObj] = useRecoilState(userObjState);

  const navigate = useNavigate();

  return useMutation(
    async (queryParam) => {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/login`,
        queryParam,
      );
      if (response.status !== 200) {
        throw new Error('서버 오류가 발생했습니다.');
      }
      return response.data;
    },
    {
      onSuccess: (data) => {
        setExpiryCookie('accessToken', data.accessToken, 5, 'minutes');
        setExpiryCookie('refreshTokenId', data.refreshTokenId, 30, 'minutes');
        setUserObj(data.userObj);
        setIsLoggedIn({ login: true, social: false });
        navigate('/');
      },
      onError: (error) => {
        if (error.response?.status === 201) {
          setToastText({
            type: 'error',
            text: '잘못된 비밀번호입니다.',
          });
        } else {
          setToastText({
            type: 'error',
            text: '서버 오류가 발생했습니다.',
          });
        }
      },
    },
  );
};
