import React from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

export const errorState = atom({
  key: 'errorState',
  default: '', // initial value
});

export const loginState = atom({
  key: 'loginState',
  default: { login: false, social: false },
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
