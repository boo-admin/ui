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
    <el-form-item label="部门名称" prop="name">
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
      <el-input v-model="formProps.row!.name" placeholder="请填写用户姓名" clearable></el-input>
    </el-form-item>
    <el-form-item label="用户昵称" prop="nickname">
      <el-input v-model="formProps.row!.nickname" placeholder="请填写用户姓名" clearable></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="fields.email">
      <el-input v-model="formProps.row!.fields!.email" placeholder="请填写邮箱" clearable></el-input>
    </el-form-item>
    <el-form-item label="工号" prop="fields.number">
      <el-input v-model="formProps.row!.fields!.number" placeholder="请填写居住地址" clearable></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="EmployeeForm">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { EmployeeFormProps } from "./interface";

const rules = reactive({
  name: [{ required: true, message: "请填写用户名" }],
  nickname: [{ required: true, message: "请填写用户昵称" }],
  "fields.email": [{ required: true, message: "请填写邮箱" }],
  "fields.number": [{ required: true, message: "请填写工号" }]
});

const formProps = ref<EmployeeFormProps>({
  isView: false,
  title: "",
  row: {
    fields: {}
  },
  departmentTree: []
});

const departmentTreeProps = ref({
  label: "name"
});

// 接收父组件传过来的参数
const acceptParams = (params: EmployeeFormProps) => {
  formProps.value = params;
  if (formProps.value.row && !formProps.value.row.fields) {
    formProps.value.row.fields = {};
  }
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = (): Promise<boolean> => {
  return ruleFormRef.value!.validate(async valid => {
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
