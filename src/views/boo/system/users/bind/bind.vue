<template>
  <el-form
    ref="ruleFormRef"
    label-width="100px"
    label-suffix=" :"
    :rules="rules"
    :disabled="formProps.isView"
    :model="formProps"
    :hide-required-asterisk="formProps.isView"
  >
    <el-form-item label="部门名称" prop="departmentname">
      <el-tree-select
        v-model="formProps.department_id"
        node-key="id"
        value-key="id"
        clearable
        :data="formProps.departmentTree"
        :props="departmentTreeProps"
      />
    </el-form-item>
    <el-form-item label="用户名" prop="user_id">
      <el-select
        v-model="formProps.user_id"
        filterable
        remote
        reserve-keyword
        placeholder="请输入用户名，选择用户"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 240px"
      >
        <el-option v-for="item in userList" :key="item.id" :label="item.nickname" :value="item.id">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: var(--el-text-color-secondary)">
            {{ item.nickname }}
          </span>
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="EmployeeBindForm">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { boo } from "@/api/interface";
import { searchUserList } from "@/api/users/user";
import { bindUser } from "@/api/users/employee";

interface UserBindProps {
  department_id: number | null;
  employee_id: number | null;
  user_id: number | null;
  username: string;
  departmentTree?: boo.Department[];
  update?: (id: any) => Promise<void>;
}

const rules = reactive<FormRules<UserBindProps>>({
  user_id: [{ required: true, message: "请等选择一个用户" }]
});

const formProps = ref<UserBindProps>({
  department_id: null,
  employee_id: null,
  user_id: null,
  username: "",
  departmentTree: []
});

const loading = ref(false);
const userList = ref<boo.User[]>([]);
const departmentTreeProps = ref({
  label: "name"
});

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true;
    searchUserList({ department_id: formProps.value.department_id, keyword: query, limit: 50 }).then(res => {
      loading.value = false;
      if (res == null) {
        res = [];
      }
      console.log(res);
      userList.value = res;
      if (userList.value.length > 0) {
        formProps.value.user_id = userList.value[0].id;
      }
    }, 200);
  } else {
    userList.value = [];
  }
};

// 接收父组件传过来的参数
const acceptParams = (params: UserBindProps) => {
  formProps.value = params;
  if (params.username) {
    remoteMethod(params.username);
  }
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = (): Promise<boolean> => {
  return ruleFormRef.value!.validate(async valid => {
    if (!valid) return false;
    try {
      return bindUser(formProps.value.employee_id!, formProps.value.user_id!).then(() => {
        return formProps.value.update!(formProps.value.user_id!).then(() => {
          ElMessage.success({ message: `用户绑定成功！` });
          return true;
        });
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
