<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${title}用户`">
    <UserForm ref="userFormRef" />
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { nextTick, ref } from "vue";
import UserForm from "@/views/boo/system/users/form.vue";
import { UserFormProps } from "./interface";

const userFormRef = ref<InstanceType<typeof UserForm> | null>(null);

const title = ref("");
const drawerVisible = ref(false);
const isView = ref(false);

// 接收父组件传过来的参数
const acceptParams = (params: UserFormProps) => {
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
    userFormRef.value!.acceptParams(params);
  });
};

const handleSubmit = () => {
  userFormRef.value!.handleSubmit();
};

defineExpose({
  acceptParams,
  handleSubmit
});
</script>
