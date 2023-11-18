import { useMutation } from 'react-query';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { isSigning } from '../util/recoil.jsx';

const useUpdateProfile = () => {
  const [signing, setSigning] = useRecoilState(isSigning);

  return useMutation(async ({ uid, photoURL, name }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/updateProfile`,
      { uid: uid, name: name, photoURL: photoURL },
    );
    if (response.status !== 200) {
      throw new Error(
        response.data.message || '프로필 업데이트 중 오류가 발생했습니다.',
      );
    } else {
      setSigning(false);
      return response.data;
    }
  });
};

export default useUpdateProfile;
