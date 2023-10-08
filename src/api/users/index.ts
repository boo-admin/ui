import http from "@/api";
import { User } from "@/api/interface/index";

// 用户退出登录
export const getCurrentUser = () => {
  return http.get<User.CurrentUser>(`/sessions/current`);
};

export const getUsersByRoleName = (roleName: string) => {
  return http.get<User.UserRecord[]>(`/users/by_roles?role_name[]=${encodeURI(roleName)}`);
};
