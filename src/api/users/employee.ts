import http, { deleteObject, updateObject } from "@/api";
import { RequestOffsetLimit, boo } from "@/api/interface/index";
import { isNumber } from "@/utils/is";
import { getDepartmentTreeList } from "@/api/users/department";

export const getEmployeeList = <T extends RequestOffsetLimit>(params: T) => {
  return http.get<boo.Employee[]>(`/v1/boo/employees`, params);
};

export const searchEmployeeList = (params: { department_id: number | null; keyword: string; limit: number | null }) => {
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

export const addEmployee = (params: { id: any; [key: string]: any }): Promise<number> => {
  if (params.department_id == "") {
    params.department_id = null;
  } else if (params.department_id && !isNumber(params.department_id)) {
    params.department_id = params.department_id.toFixed(0);
  }
  return http.post<number>(`/v1/boo/employees`, params);
};

export const exportEmployeeURL = (params): string => {
  return http.getUri("get", "/v1/boo/employees/export/xlsx", params);
};

export const importEmployees = (params, queryOpts) => {
  let pa = `/v1/boo/employees/import`;
  if (queryOpts) {
    let sep = "?";
    for (let key in queryOpts) {
      pa += `${sep}${key}=${queryOpts[key]}`;
      sep = "&";
    }
  }
  return http.post(pa, params);
};

export const getEmployeeDepartment = () => {
  return getDepartmentTreeList();
};

export const pushToUser = (
  employee_id: number,
  params: {
    password: string;
    [keyof: string]: any;
  }
): Promise<number> => {
  return http.post<number>("/v1/boo/employees/" + employee_id.toFixed(0).toString() + "/users", params);
};

export const bindUser = (employee_id: number, user_id: number): Promise<string> => {
  return http.put("/v1/boo/employees/" + employee_id.toFixed(0).toString() + "/users/" + user_id.toFixed(0).toString(), {});
};
