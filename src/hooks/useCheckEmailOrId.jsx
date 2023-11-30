import { useMutation } from 'react-query';
import axios from 'axios';

export const useCheckEmailOrId = () => {
  return useMutation(async (value) => {
    const isEmail = value.includes('@');
    const requestData = isEmail ? { email: value } : { id: value };
    const response = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/checkEmailOrId`,
      requestData,
    );
    return response.data;
  });
};
