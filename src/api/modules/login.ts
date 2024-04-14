import { Login } from "@/api/interface/index";
import * as custom from "@/config/custom";
import { PORT1 } from "@/api/config/servicePort";
import customMenuList from "@/assets/json/customMenuList.json";
import customButtonList from "@/assets/json/customButtonList.json";
import { mock as http } from "@/api";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(custom.CUSTOM_LOGIN_URL, params, { loading: false }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { loading: false }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(PORT1 + `/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
};

// 获取菜单列表
export const getAuthMenuListApi = () => {
  if (custom.ENABLE_CUSTOM_AUTH_MENUS) {
    return http.get<Menu.MenuOptions[]>(custom.CUSTOM_AUTH_MENUS_URL, {}, { loading: false });
  }
  // 如果想让菜单变为本地数据，注释上一行代码，并引入本地 authMenuList.json 数据
  return customMenuList;
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  if (custom.ENABLE_CUSTOM_AUTH_BUTTONS) {
    return http.get<Login.ResAuthButtons>(custom.CUSTOM_AUTH_BUTTONS_URL, {}, { loading: false });
  }
  // return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { loading: false });
  // 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtonList.json 数据
  return customButtonList;
};

// 用户退出登录
export const logoutApi = () => {
  return http.post(PORT1 + `/logout`);
};
