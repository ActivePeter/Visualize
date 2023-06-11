export default {
  token: state => state.user.token,
  userinfo: state => state.user.userinfo,
  isLogin: state => !!state.user.userinfo
};
