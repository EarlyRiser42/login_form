import { useMutation } from 'react-query';
import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  toastTextState,
  loginState,
  ModalBackgroundGrayState,
  userObjState,
} from '../util/recoil';
import { setCookie } from '../util/cookie.jsx'; // Adjust the path to your actual recoil state

export const useSignUp = () => {
  // 전역 상태 recoil
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const [modalBackground, setModalBackground] = useRecoilState(
    ModalBackgroundGrayState,
  );
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const setToastText = useSetRecoilState(toastTextState);

  return useMutation(
    async ({ queryParam }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/signUp`,
        { userObj: queryParam },
      );
      if (response.status === 200) {
        setUserObj(queryParam);
      } else {
        throw new Error(
          response.data.message || '회원가입 중 오류가 발생했습니다.',
        );
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
        setIsLoggedIn({ login: true, social: false });
        setModalBackground(true);
      },
      onError: (error) => {
        setToastText(
          error.response?.data.message || '회원가입 중 오류가 발생했습니다.',
        );
      },
    },
  );
};
