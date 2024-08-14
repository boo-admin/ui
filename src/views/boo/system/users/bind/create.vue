<template>
  <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :model="formProps.row">
    <el-form-item label="部门名称" prop="department_id">
      <el-tree-select
        v-model="formProps.row!.department_id"
        node-key="id"
        value-key="id"
        clearable
        :data="formProps.departmentTree"
        :props="departmentTreeProps"
      />
    </el-form-item>
    <el-form-item label="用户名称" prop="name">
      <el-input v-model="createUserFromEmployeeFormProps.row.name" disabled></el-input>
    </el-form-item>
    <el-form-item label="用户呢称" prop="nickname">
      <el-input v-model="createUserFromEmployeeFormProps.row.nickname" disabled></el-input>
    </el-form-item>
    <el-form-item label="用户密码" prop="password">
      <el-input v-model="formProps.row.password" placeholder="请输入密码" show-password></el-input>
    </el-form-item>
    <el-form-item label="重复密码" prop="password_confirmation">
      <el-input v-model="formProps.row.password_confirmation" placeholder="请再输入密码" show-password></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="UserCreateForm">
import { reactive, ref } from "vue";
import { avoidLoopCheck, getConfirmPwdValidator, getNewPwdValidator, CreateUserFromEmployeeFormProps } from "../interface";
import { ElMessage, FormInstance } from "element-plus";
import { boo } from "@/api/interface";

const departmentTreeProps = ref({
  label: "name"
});

interface FormProps {
  departmentTree?: boo.Department[];
  row: {
    department_id: number | null | undefined;
    password: string;
    password_confirmation: string;
  };
}
const formProps = ref<FormProps>({
  row: {
    department_id: null,
    password: "",
    password_confirmation: ""
  }
});

let createUserFromEmployeeFormProps = ref<CreateUserFromEmployeeFormProps>({
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: CreateUserFromEmployeeFormProps) => {
  createUserFromEmployeeFormProps.value = params;
  formProps.value.departmentTree = params.departmentTree;
  formProps.value.row.department_id = params.row!.department_id;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();

const newPwdVal = getNewPwdValidator(formProps, "password_confirmation", ruleFormRef);
const conPwdVal = getConfirmPwdValidator(formProps, "password", ruleFormRef);

const validateConfig = {
  password: [
    { required: true, message: "请输入密码" },
    { required: true, validator: newPwdVal, trigger: "blur" }
  ],
  password_confirmation: [
    { required: true, message: "请输入密码" },
    { required: true, validator: conPwdVal, trigger: "blur" }
  ]
};

let rules = reactive(validateConfig);

const handleSubmit = (): Promise<boolean | undefined> => {
  avoidLoopCheck.value = true;
  return ruleFormRef.value!.validate().then(async valid => {
    if (!valid) return false;
    try {
      return createUserFromEmployeeFormProps.value.api!(createUserFromEmployeeFormProps.value.row.id!, formProps.value.row).then(
        res => {
          if (createUserFromEmployeeFormProps.value.update) {
            return createUserFromEmployeeFormProps.value.update(res).then(() => {
              ElMessage.success({ message: `新建用户成功！` });
              return true;
            });
          } else {
            ElMessage.success({ message: `新建用户成功！` });
            return true;
          }
        }
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  });
};

defineExpose({
  acceptParams,
  handleSubmit
});
</script>
