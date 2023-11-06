import React from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

export const errorState = atom({
  key: 'errorState',
  default: '', // initial value
});

export const loginState = atom({
  key: 'loginState',
  default: false,
});
