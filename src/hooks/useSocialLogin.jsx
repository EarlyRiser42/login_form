import { useMutation } from 'react-query';
import axios from 'axios';
import { setExpiryCookie } from '../util/cookie.jsx';
import { useRecoilState } from 'recoil';
import { toastTextState, loginState, userObjState } from '../util/recoil.jsx';
import { useNavigate } from 'react-router-dom';

export const useSocialLogin = () => {
  // 전역 변수 recoil
  const [toastText, setToastText] = useRecoilState(toastTextState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const [userObj, setUserObj] = useRecoilState(userObjState);

  const navigate = useNavigate();

  const { mutate, isLoading, isError, error } = useMutation(
    async (user) => {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/socialLogin`,
        user,
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
        console.log(error);
        setToastText({
          type: 'error',
          text: '서버 오류가 발생했습니다.',
        });
      },
    },
  );
  return { mutate, isLoading, isError, error };
};
