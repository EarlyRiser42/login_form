import { useMutation } from 'react-query';
import axios from 'axios';
import { setCookie } from '../util/cookie.jsx';
import { useRecoilState } from 'recoil';
import { errorState, loadingState, loginState } from '../util/recoil.jsx';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  // 전역 변수 recoil
  const [loading, setLoading] = useRecoilState(loadingState);
  const [recoilError, setRecoilError] = useRecoilState(errorState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);

  const navigate = useNavigate();

  return useMutation(
    async (queryParam) => {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/login`,
        queryParam,
      );
      if (response.status !== 200) {
        throw new Error('서버 오류가 발생했습니다.');
      }
      return response.data;
    },
    {
      onSuccess: (data) => {
        const currentDateTime = new Date();
        // accessToken 만료시간 30분
        const accessTokenExpiry = new Date(currentDateTime);
        accessTokenExpiry.setMinutes(currentDateTime.getMinutes() + 30);
        // refreshToken 만료시간 1시간
        const refreshTokenExpiry = new Date(currentDateTime);
        refreshTokenExpiry.setHours(currentDateTime.getHours() + 1);

        setCookie('accessToken', data.accessToken, {
          path: '/',
          secure: false,
          expires: accessTokenExpiry,
        });

        setCookie('refreshTokenId', data.refreshTokenId, {
          path: '/',
          secure: false,
          expires: refreshTokenExpiry,
        });

        setIsLoggedIn(true);
        navigate('/');
      },
      onError: (error) => {
        if (error.response?.status === 401) {
          setRecoilError('잘못된 비밀번호입니다.');
        } else {
          setRecoilError('서버 오류가 발생했습니다.');
        }
      },
    },
  );
};

export const useValidateToken = () => {
  // 전역 변수 recoil
  const [loading, setLoading] = useRecoilState(loadingState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const navigate = useNavigate();

  return useMutation(
    async ({ accessToken, refreshTokenId }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/validateToken`,
        {
          accessToken,
          refreshTokenId,
        },
      );

      if (response.status !== 200) {
        throw new Error(response.data);
      }

      return response.data;
    },
    {
      onSuccess: (data) => {
        setLoading(true);
        setIsLoggedIn(true);
        navigate('/');
        setLoading(false);
      },
      onError: (error) => {
        console.log(error);
      },
    },
  );
};
