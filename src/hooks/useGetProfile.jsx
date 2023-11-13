import { useMutation } from 'react-query';
import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { errorState, userObjState } from '../util/recoil';

export const useGetProfile = () => {
  // 전역 상태 recoil
  const [userObj, setUserObj] = useRecoilState(userObjState);
  const setError = useSetRecoilState(errorState);

  return useMutation(
    async ({ accessToken }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/getProfile`,
        { accessToken: accessToken },
      );
      if (response.status !== 200) {
        throw new Error(
          response.data.message || '프로필을 불러올 수 없습니다.',
        );
      }
      return response.data;
    },
    {
      onSuccess: (data) => {
        setUserObj({ ...data.user });
      },
      onError: (error) => {
        setError(
          error.response?.data.message ||
            '프로필을 불러오는 중 오류가 발생했습니다.',
        );
      },
    },
  );
};
