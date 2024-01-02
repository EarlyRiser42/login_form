import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setCookie = (name, value, options) =>
  cookies.set(name, value, { ...options });

export const getCookie = (name) => cookies.get(name);

export const deleteCookie = (name) => {
  cookies.remove(name, { path: '/' });
};

export const setExpiryCookie = (name, value, expiryDuration, expiryType) => {
  const expiryDate = new Date();
  if (expiryType === 'minutes') {
    expiryDate.setMinutes(expiryDate.getMinutes() + expiryDuration);
  } else if (expiryType === 'hours') {
    expiryDate.setHours(expiryDate.getHours() + expiryDuration);
  }

  setCookie(name, value, {
    path: '/',
    secure: false,
    expires: expiryDate,
  });
};
