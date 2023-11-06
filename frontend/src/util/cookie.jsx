import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setCookie = (name, value, options) =>
  cookies.set(name, value, { ...options });

export const getCookie = (name) => cookies.get(name);
