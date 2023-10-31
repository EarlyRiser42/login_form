module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "indent": ["error", 2],
    "linebreak-style": 0,
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-tabs": 0
  },
};
