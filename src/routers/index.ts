import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { useAuthStore } from "@/stores/modules/auth";
// import { useTabsStore } from "@/stores/modules/tabs";
// import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { UseSSO, LOGIN_URL, LOGIN_REDIRECT_URL, LOGOUT_URL, LOGOUT_REDIRECT_URL, ROUTER_WHITE_LIST } from "@/config";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import customRoutes from "@/routers/custom";

import NProgress from "@/config/nprogress";
import { getCurrentUser } from "@/api/users";

const mode = import.meta.env.VITE_ROUTER_MODE;

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory()
};

/**
 * @description 📚 路由参数配置简介
 * @param path ==> 路由菜单访问路径
 * @param name ==> 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
 * @param redirect ==> 路由重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 路由菜单元信息
 * @param meta.icon ==> 菜单和面包屑对应的图标
 * @param meta.title ==> 路由标题 (用作 document.title || 菜单的名称)
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @param meta.isLink ==> 路由外链时填写的访问地址
 * @param meta.isHide ==> 是否在菜单中隐藏 (通常列表详情页需要隐藏)
 * @param meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
 * @param meta.isAffix ==> 菜单是否固定在标签页中 (首页通常是固定项)
 * @param meta.isKeepAlive ==> 当前路由是否缓存
 * */
const router = createRouter({
  history: routerMode[mode](),
  routes: [...customRoutes],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

const jumpToSSO = to => {
  let toPath = "/";
  if (!!to.query && !!to.query.service) {
    toPath = to.query.service;
  }
  window.location.href = LOGIN_REDIRECT_URL + "?service=" + encodeURIComponent((window as any).appPrefixWithHash + toPath);
};

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  if (UseSSO) {
    if (to.path.toLocaleLowerCase() === LOGIN_URL) {
      jumpToSSO(to);
      next(false);
      return;
    }
    if (to.path.toLocaleLowerCase() === LOGOUT_URL) {
      window.location.href = LOGOUT_REDIRECT_URL;
      next(false);
      return;
    }
  }
  const userStore = useUserStore();
  const authStore = useAuthStore();

  // 1.NProgress 开始
  NProgress.start();

  // 2.动态设置标题
  const title = import.meta.env.VITE_APP_HEAD_TITLE;
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

  // 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
  if (to.path.toLocaleLowerCase() === LOGIN_URL) {
    if (userStore.isLogined) return next(from.fullPath);
    resetRouter();
    return next();
  }

  // 4.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) return next();

  // 5.判断是否有 Token，没有重定向到 login 页面
  if (!userStore.isLogined) return checkLogined(to, from, next);

  // 6.如果没有菜单列表，就重新请求菜单列表并添加动态路由
  if (!authStore.authMenuListGet.length) {
    await initDynamicRouter();
    return next({ ...to, replace: true });
  }

  // 7.存储 routerName 做按钮权限筛选
  authStore.setRouteName(to.name as string);

  // 8.正常访问页面
  return next();
});

const checkLogined = async (to, from, next) => {
  const userStore = useUserStore();
  // const tabsStore = useTabsStore();
  // const keepAliveStore = useKeepAliveStore();

  try {
    // 1.执行登录接口
    const data = await getCurrentUser();
    userStore.setUserInfo({ isLogined: true, userInfo: data });

    // 2.添加动态路由
    await initDynamicRouter();

    // 3.清空 tabs、keepAlive 数据
    // tabsStore.setTabs([]);
    // keepAliveStore.setKeepAliveName([]);

    // 4.跳转到首页
    return next({ ...to, replace: true });
  } catch (e) {
    userStore.logout();
    return next({ path: LOGIN_URL, replace: true, query: { service: to.fullPath } });
  }
};

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
  const authStore = useAuthStore();
  authStore.flatMenuListGet.forEach(route => {
    const { name } = route;
    if (name && router.hasRoute(name)) router.removeRoute(name);
  });
};

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
  NProgress.done();
  console.warn("路由错误", error.message);
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  NProgress.done();
});

export default router;
