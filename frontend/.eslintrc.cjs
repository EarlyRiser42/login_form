module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    // 들여쓰기를 탭으로 2번만 하도록 설정
    'indent': ['error', 'tab'],
  },
};
