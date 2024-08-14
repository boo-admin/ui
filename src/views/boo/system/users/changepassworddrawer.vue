<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`修改密码`">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :model="formProps.row">
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="formProps.row.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="password_confirmation">
        <el-input v-model="formProps.row.password_confirmation" placeholder="请再输入密码" show-password></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="ChangePasswordDrawer">
import { reactive, ref } from "vue";
import { avoidLoopCheck, getConfirmPwdValidator, getNewPwdValidator, UserPasswordFormProps } from "./interface";
import { ElMessage, FormInstance } from "element-plus";

interface FormProps {
  row: {
    id: number | null | undefined;
    password: string;
    password_confirmation: string;
  };
}
const formProps = ref<FormProps>({
  row: {
    id: null,
    password: "",
    password_confirmation: ""
  }
});
const drawerVisible = ref(false);

let userPasswordFormProps: UserPasswordFormProps | null = null;

// 接收父组件传过来的参数
const acceptParams = (params: UserPasswordFormProps) => {
  userPasswordFormProps = params;
  formProps.value.row.id = params.row!.id;
  drawerVisible.value = true;
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
      if (userPasswordFormProps) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return userPasswordFormProps.api!(formProps.value.row).then(res => {
          if (userPasswordFormProps && userPasswordFormProps.update) {
            return userPasswordFormProps.update(formProps.value.row.id).then(() => {
              ElMessage.success({ message: `修改密码成功！` });
              return true;
            });
          }
        });
      }
      return false;
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
