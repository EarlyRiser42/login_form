import { useMutation } from 'react-query';
import axios from 'axios';

const useUpdateProfile = () =>
  useMutation((userData) => {
    axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/updateProfile`,{ uid: userData.uid, name: userData.name, photoURL: userData.photoURL }
    );
  });

export default useUpdateProfile;
