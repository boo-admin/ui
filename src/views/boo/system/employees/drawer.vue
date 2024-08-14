<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${title}用户`">
    <EmployeeForm ref="employeeFormRef" />
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="EmployeeDrawer">
import { nextTick, ref } from "vue";
import EmployeeForm from "@/views/boo/system/employees/form.vue";
import { EmployeeFormProps } from "./interface";

const employeeFormRef = ref<InstanceType<typeof EmployeeForm> | null>(null);

const title = ref("");
const drawerVisible = ref(false);
const isView = ref(false);

// 接收父组件传过来的参数
const acceptParams = (params: EmployeeFormProps) => {
  isView.value = params.isView;
  title.value = params.title;
  const updateCallback = params.update;
  params.update = id => {
    if (updateCallback) {
      return updateCallback(id);
    }
    return Promise.resolve();
  };
  drawerVisible.value = true;
  nextTick(() => {
    employeeFormRef.value!.acceptParams(params);
  });
};

const handleSubmit = () => {
  return employeeFormRef.value!.handleSubmit();
};

defineExpose({
  acceptParams,
  handleSubmit
});
</script>