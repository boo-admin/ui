import http from "@/api";
import { boo } from "@/api/interface/index";

export let getRoleList = () => {
  return http.get<boo.Role[]>(`/v1/boo/roles`);
};
