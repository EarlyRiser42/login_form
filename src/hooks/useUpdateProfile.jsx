import { useMutation } from 'react-query';
import axios from 'axios';

const useUpdateProfile = () =>{
    return useMutation(async ({userData}) => {
        const response = await axios.post(
            `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/updateProfile`, { uid: userData.uid, name: userData.name, photoURL: userData.photoURL }
        );
        if (response.status !== 200) {
            throw new Error(
                response.data.message || '프로필 업데이트 중 오류가 발생했습니다.',
            );
        }
        return response.data;
    });

}


export default useUpdateProfile;
