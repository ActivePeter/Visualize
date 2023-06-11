import { Notification } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import router from "@/router";
import store from "@/store";

NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
  if (window._axiosPromiseArr) {
    window._axiosPromiseArr.forEach(cancel => {
      cancel();
    });
    window._axiosPromiseArr = [];
  }
  NProgress.start();
  const hasToken = store.getters.token;
  if (hasToken) {
    const hasUserInfo = store.getters.userinfo;
    if (hasUserInfo) {
      next();
    } else {
      const res = await store.dispatch("user/getUserinfo");
      if (res) {
        next();
      } else {
        // 这里应该清除token，不过因为该请求失败已经被请求拦截器清除了，所以这里不用清除了
        //   await store.dispatch("user/resetStatus");
        if (to.matched.some(record => record.meta.requireAuth)) {
          Notification.error({
            title: "提示",
            message: "登陆后才能进行查看～"
          });
          next("/bbs");
        } else {
          next();
        }
      }
    }
  } else {
    if (to.matched.some(record => record.meta.requireAuth)) {
      Notification.error({
        title: "提示",
        message: "登陆后才能进行查看～"
      });
      next("/bbs");
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
