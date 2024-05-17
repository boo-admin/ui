<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}部门`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="部门名称" prop="name">
        <el-tree-select
          v-model="drawerProps.row!.parent_id"
          node-key="id"
          value-key="id"
          clearable
          :data="drawerProps.departmentTree"
          :props="departmentTreeProps"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写部门名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="位置序号" prop="order_num">
        <el-input-number v-model="drawerProps.row!.order_num" placeholder="位置序号" clearable></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="DepartmentDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { boo } from "@/api/interface";
import { mapTree } from "@/utils/tree";

const rules = reactive({
  name: [{ required: true, message: "请填写部门名称" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<boo.Department>;
  departmentTree?: boo.Department[];
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  departmentTree: []
});

const departmentTreeProps = ref({
  label: "name"
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  if (drawerProps.value.row && drawerProps.value.row.id && drawerProps.value.row.id > 0) {
    if (drawerProps.value.departmentTree) {
      drawerProps.value.departmentTree = mapTree<boo.Department, boo.Department>(drawerProps.value.departmentTree, item => {
        if (item.id === drawerProps.value.row!.id) {
          return null;
        }
        return item;
      });
    }
  }
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
