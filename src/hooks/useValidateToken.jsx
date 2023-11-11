import { useMutation } from 'react-query';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { errorState, loadingState, loginState } from '../util/recoil.jsx';
import { useNavigate } from 'react-router-dom';

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
        setIsLoggedIn({ login: true, social: false });
        navigate('/');
        setLoading(false);
      },
      onError: (error) => {
        console.log(error);
      },
    },
  );
};
