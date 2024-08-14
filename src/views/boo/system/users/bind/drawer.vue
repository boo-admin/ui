<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${title}用户`">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="绑定已有用户" name="bind">
        <UserBindForm ref="userBindFormRef" />
      </el-tab-pane>
      <el-tab-pane label="新建用户" name="create">
        <UserCreateForm ref="userCreateFormRef" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="BindOrCreateUserDrawer">
import { nextTick, ref } from "vue";
import UserCreateForm from "@/views/boo/system/users/bind/create.vue";
import UserBindForm from "@/views/boo/system/users/bind/bind.vue";
import { CreateUserFromEmployeeFormProps } from "@/views/boo/system/users/interface";

const userCreateFormRef = ref<InstanceType<typeof UserCreateForm> | null>(null);
const userBindFormRef = ref<InstanceType<typeof UserBindForm> | null>(null);

const title = ref("同步");
const drawerVisible = ref(false);
const activeTabName = ref<"bind" | "create">("bind");

// 接收父组件传过来的参数
const acceptParams = (params: CreateUserFromEmployeeFormProps) => {
  const updateCallback = params.update;
  params.update = id => {
    if (updateCallback) {
      return updateCallback(id);
    }
    return Promise.resolve();
  };
  drawerVisible.value = true;
  nextTick(() => {
    userCreateFormRef.value!.acceptParams(params);
    userBindFormRef.value!.acceptParams({
      department_id: params.row.department_id ?? null,
      employee_id: params.row.id!,
      user_id: null,
      username: params.row.name!,
      departmentTree: params.departmentTree,
      update: params.update
    });
  });
};

const handleSubmit = () => {
  if (activeTabName.value === "bind") {
    userBindFormRef.value!.handleSubmit().then((valid: boolean) => {
      if (!valid) return;
      drawerVisible.value = false;
    });
  } else {
    userCreateFormRef.value!.handleSubmit().then((valid: boolean | undefined) => {
      if (!valid) return;
      drawerVisible.value = false;
    });
  }
};

defineExpose({
  acceptParams,
  handleSubmit
});
</script>
