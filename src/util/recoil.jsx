import React from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

export const errorState = atom({
  key: 'errorState',
  default: '',
});

export const loginState = atom({
  key: 'loginState',
  default: { login: false, social: false },
});

export const isSigning = atom({
  key: 'signingState',
  default: false,
});

export const profileImage = atom({
  key: 'profileImage',
  default:
    'https://firebasestorage.googleapis.com/v0/b/loginform-6747a.appspot.com/o/pfp%2Fbasic.png?alt=media&token=d2b2f037-ee93-4fad-a09d-733332ec28fc',
});

export const Tweets = atom({
  key: 'Tweets',
  default: [],
});

export const myTweets = atom({
  key: 'myTweets',
  default: [],
});

export const loadingState = atom({
  key: 'loadingState',
  default: false,
});

export const ModalOpenState = atom({
  key: 'ModalOpenState',
  default: false,
});

export const ModalBackgroundGrayState = atom({
  key: 'ModalBackgroundGrayState',
  default: false,
});

export const userObjState = atom({
  key: 'userObjState',
  default: {
    displayName: '',
    uid: '',
    photoURL: '',
    id: '',
  },
});
