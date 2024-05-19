import http, { deleteObject, updateObject } from "@/api";
import { User, boo } from "@/api/interface/index";
import { isNumber } from "@/utils/is";

// 用户退出登录
export const getCurrentUser = () => {
  return http.get<User.CurrentUser>(`/sessions/current`);
};

export const getUsersByRoleName = (roleName: string) => {
  return http.get<User.UserRecord[]>(`/users/by_roles?role_name[]=${encodeURI(roleName)}`);
};

export let getDepartmentTreeList = () => {
  return http.get<boo.Department[]>(`/v1/boo/departments/tree`);
};

// 新增部门
export const addDepartment = (params: { id: any; [key: string]: any }) => {
  if (params.parent_id == "") {
    params.parent_id = null;
  } else if (params.parent_id && !isNumber(params.parent_id)) {
    params.parent_id = params.parent_id.toFixed(0);
  }
  return http.post(`/v1/boo/departments`, params);
};

// 编辑部门
export const editDepartment = (params: { id: any; [key: string]: any }) => {
  if (params.parent_id == "") {
    params.parent_id = null;
  } else if (params.parent_id && !isNumber(params.parent_id)) {
    params.parent_id = params.parent_id.toFixed(0);
  }
  return updateObject(`/v1/boo/departments`, params);
};

// 删除部门
export const deleteDepartment = (params: { id: any }) => {
  return deleteObject(`/v1/boo/departments`, params);
};

export const getEmployeeList = params => {
  return http.get<boo.Employee[]>(`/v1/boo/employees`, params);
};

export const getEmployeeCount = params => {
  return http.get<number>(`/v1/boo/employees/count`, params);
};

export const deleteEmployee = (params: { id: any }) => {
  return deleteObject(`/v1/boo/employees`, params);
};

export const updateEmployee = (params: { id: any; [key: string]: any }) => {
  if (params.parent_id == "") {
    params.parent_id = null;
  } else if (params.parent_id && !isNumber(params.parent_id)) {
    params.parent_id = params.parent_id.toFixed(0);
  }
  return updateObject(`/v1/boo/employees`, params);
};

export const addEmployee = (params: { id: any; [key: string]: any }) => {
  if (params.department_id == "") {
    params.department_id = null;
  } else if (params.department_id && !isNumber(params.department_id)) {
    params.department_id = params.department_id.toFixed(0);
  }
  return http.post(`/v1/boo/employees`, params);
};

export const exportEmployeeURL = (params): string => {
  return http.getUri("get", "/v1/boo/employees/export/xlsx", params);
};

export const importEmployees = params => {
  return http.post(`/v1/boo/employees/import`, params);
};

export const getEmployeeDepartment = () => {
  return getDepartmentTreeList();
};
