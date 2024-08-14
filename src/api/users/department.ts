import http, { deleteObject, updateObject } from "@/api";
import { boo } from "@/api/interface/index";
import { isNumber } from "@/utils/is";

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
