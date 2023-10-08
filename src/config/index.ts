// ? 全局默认配置项

// 首页地址（默认）
export const HOME_URL: string = "/home/index";

// 是否用外部登录页面
export const UseSSO: boolean = (window as any).useSSO;

// 登录页地址（默认）
export const LOGIN_URL: string = "/login";

// 登录页地址（默认）
export const LOGOUT_URL: string = "/logout";

// 使用外部登录页时，进入登录跳转的 url
export const LOGIN_REDIRECT_URL: string = (window as any).loginRedirectURL;

// 使用外部登录页时，进入登出跳转的 url
export const LOGOUT_REDIRECT_URL: string = (window as any).logoutRedirectURL;

// 默认主题颜色
export const DEFAULT_PRIMARY: string = "#009688";

// 路由白名单地址（本地存在的路由 staticRouter.ts 中）
export const ROUTER_WHITE_LIST: string[] = ["/500"];

// 高德地图 key
export const AMAP_MAP_KEY: string = "";

// 百度地图 key
export const BAIDU_MAP_KEY: string = "";
