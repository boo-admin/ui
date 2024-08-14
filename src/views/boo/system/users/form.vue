<template>
  <el-form
    ref="ruleFormRef"
    label-width="100px"
    label-suffix=" :"
    :rules="rules"
    :disabled="formProps.isView"
    :model="formProps.row"
    :hide-required-asterisk="formProps.isView"
  >
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
    <el-form-item label="用户名" prop="name">
      <el-input v-model="formProps.row!.name" placeholder="请填写用户姓名" clearable :disabled="!formProps.isCreate"></el-input>
    </el-form-item>
    <el-form-item label="用户昵称" prop="nickname">
      <el-input v-model="formProps.row!.nickname" placeholder="请填写用户姓名" clearable></el-input>
    </el-form-item>
    <el-form-item v-if="formProps.isCreate" label="用户密码" prop="password">
      <el-input v-model="formProps.row!.password" placeholder="请输入密码" show-password></el-input>
    </el-form-item>
    <el-form-item v-if="formProps.isCreate" label="重复密码" prop="password_confirmation">
      <el-input v-model="formProps.row!.password_confirmation" placeholder="请再输入密码" show-password></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="fields.email">
      <el-input v-model="formProps.row!.fields!.email" placeholder="请填写邮箱" clearable></el-input>
    </el-form-item>
    <el-form-item label="工号" prop="fields.number">
      <el-input v-model="formProps.row!.fields!.number" placeholder="请填写居住地址" clearable></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="UserForm">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { avoidLoopCheck, getConfirmPwdValidator, getNewPwdValidator, UserFormProps } from "./interface";

const departmentTreeProps = ref({
  label: "name"
});

const formProps = ref<UserFormProps>({
  isCreate: false,
  isView: false,
  title: "",
  row: {
    fields: {}
  },
  departmentTree: []
});

// 接收父组件传过来的参数
const acceptParams = (params: UserFormProps) => {
  formProps.value = params;
  if (formProps.value.row && !formProps.value.row.fields) {
    formProps.value.row.fields = {};
  }
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();

const newPwdVal = getNewPwdValidator(formProps, "password_confirmation", ruleFormRef);
const conPwdVal = getConfirmPwdValidator(formProps, "password", ruleFormRef);

const validateConfig = {
  name: [{ required: true, message: "请填写用户名" }],
  nickname: [{ required: true, message: "请填写用户昵称" }],
  // "fields.email": [{ required: true, message: "请填写邮箱" }],
  // "fields.number": [{ required: true, message: "请填写工号" }]
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

const handleSubmit = (): Promise<boolean> => {
  avoidLoopCheck.value = true;
  return ruleFormRef.value!.validate().then(async valid => {
    if (!valid) return false;
    try {
      let id = await formProps.value.api!(formProps.value.row);
      return formProps.value.update!(id).then(() => {
        ElMessage.success({ message: `${formProps.value.title}用户成功！` });
        return true;
      });
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
