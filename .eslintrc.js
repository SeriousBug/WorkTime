module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@babel/eslint-parser',
  rules: {
    'prettier/prettier': 'warn',
    'max-len': ['warn', {code: 120}],
    'no-unused-vars': 'warn',
  },
};
