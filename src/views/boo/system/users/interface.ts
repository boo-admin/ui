import { boo } from "@/api/interface";
import { ref } from "vue";

export interface UserFormProps {
  title: string;
  isCreate: boolean;
  isView: boolean;
  row: Partial<boo.User>;
  departmentTree?: boo.Department[];
  api?: (params: any) => Promise<number>;
  update?: (id: number) => Promise<void>;
}

export interface CreateUserFromEmployeeFormProps {
  departmentTree?: boo.Department[];
  row: Partial<boo.Employee>;
  api?: (id: number, params: { password: string; [keyof: string]: any }) => Promise<number>;
  update?: (id: number) => Promise<void>;
}

export interface UserPasswordFormProps {
  row: Partial<boo.User>;
  api?: (params: any) => Promise<any>;
  update?: (id: number) => Promise<void>;
}

// nocheckConfirmPwd 用于控制是否确认密码是否显示校验提示
const nocheckConfirmPwd = true;
export let avoidLoopCheck = ref<boolean>(true);

/**
 * 新密码项目的校验规则
 * 1，先判断是否为空，
 * 2，再验证是否符合正则校验，
 * 3，随后校验【当确认密码项不为空时】新旧密码是否相同
 * @param form
 * @param confirmPwdName
 */
export const getNewPwdValidator = (form, confirmPwdName, formRef) => {
  return (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback("请输入新密码");
      if (!avoidLoopCheck.value) {
        avoidLoopCheck.value = true;
      }
    } else if (form.value.row[confirmPwdName] !== value /* && form.value.row[confirmPwdName] !== "" */) {
      callback("新密码与确认密码不一致");
      if (!avoidLoopCheck.value) {
        avoidLoopCheck.value = true;
      }
    } else {
      callback();
      if (!nocheckConfirmPwd && avoidLoopCheck) {
        avoidLoopCheck.value = !avoidLoopCheck.value;

        // 触发一次确认密码项的校验。
        formRef.value.validateField(confirmPwdName);
      }
    }
  };
};

/**
 * 确认密码项的校验规则
 * 1，先判断是否为空，
 * 2，再验证是否符合正则校验，
 * 3，随后校验新旧密码是否相同
 * @param form
 * @param newPwdName
 * @param formRef
 */
export const getConfirmPwdValidator = (form, newPwdName, formRef) => {
  if (nocheckConfirmPwd) {
    return (rule: any, value: any, callback: any) => {
      callback();
      // 触发一次新密码项的校验。
      formRef.value.validateField(newPwdName);
    };
  }
  return (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback("确认密码不可为空");
      if (!avoidLoopCheck.value) {
        avoidLoopCheck.value = true;
      }
    } else if (form.value.row[newPwdName] !== value) {
      callback("新密码与确认密码不一致");
      if (!avoidLoopCheck.value) {
        avoidLoopCheck.value = true;
      }
    } else {
      callback();
      if (avoidLoopCheck.value) {
        avoidLoopCheck.value = !avoidLoopCheck.value;
        // 触发一次新密码项的校验。
        formRef.value.validateField(newPwdName);
      }
    }
  };
};
