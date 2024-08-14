import http, { deleteObject, runMethodForObject, updateObject } from "@/api";
import { RequestOffsetLimit, boo } from "@/api/interface/index";
import { isNumber } from "@/utils/is";
import { getDepartmentTreeList } from "@/api/users/department";

export const getUserList = <T extends RequestOffsetLimit>(params: T) => {
  return http.get<boo.User[]>(`/v1/boo/users`, params);
};

export const searchUserList = (params: { department_id: number | null; keyword: string; limit: number | null }) => {
  return http.get<boo.User[]>(`/v1/boo/users`, params);
};

export const getUserCount = params => {
  return http.get<number>(`/v1/boo/users/count`, params);
};

export const deleteUser = (params: { id: any }) => {
  return deleteObject(`/v1/boo/users`, params);
};

export const updateUser = (params: { id: any; [key: string]: any }) => {
  if (params.parent_id == "") {
    params.parent_id = null;
  } else if (params.parent_id && !isNumber(params.parent_id)) {
    params.parent_id = params.parent_id.toFixed(0);
  }
  return updateObject(`/v1/boo/users`, params);
};

export const updateUserPassword = (params: { id: any; password: string; [key: string]: any }) => {
  return runMethodForObject(`/v1/boo/users`, `/change_password`, params);
};

export const addUser = (params: { id: any; [key: string]: any }): Promise<number> => {
  if (params.department_id == "") {
    params.department_id = null;
  } else if (params.department_id && !isNumber(params.department_id)) {
    params.department_id = params.department_id.toFixed(0);
  }
  return http.post<number>(`/v1/boo/users`, params);
};

export const exportUserURL = (params): string => {
  return http.getUri("get", "/v1/boo/users/export/xlsx", params);
};

export const importUsers = (params, queryOpts) => {
  let pa = `/v1/boo/users/import`;
  if (queryOpts) {
    let sep = "?";
    for (let key in queryOpts) {
      pa += `${sep}${key}=${queryOpts[key]}`;
      sep = "&";
    }
  }
  return http.post(pa, params);
};

export const getUserDepartment = () => {
  return getDepartmentTreeList();
};
