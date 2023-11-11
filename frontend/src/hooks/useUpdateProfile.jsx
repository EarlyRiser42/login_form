import { useMutation } from 'react-query';
import axios from 'axios';

const useUpdateProfile = () =>
  useMutation((userData) =>
    axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/updateProfile`,
      userData,
    ),
  );

export default useUpdateProfile;
