<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
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
          v-model="drawerProps.row!.department_id"
          node-key="id"
          value-key="id"
          clearable
          :data="drawerProps.departmentTree"
          :props="departmentTreeProps"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写用户姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="drawerProps.row!.nickname" placeholder="请填写用户姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row!.fields!.email" placeholder="请填写邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="number">
        <el-input v-model="drawerProps.row!.fields!.number" placeholder="请填写居住地址" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="EmployeeDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { boo } from "@/api/interface";

const rules = reactive({
  name: [{ required: true, message: "请填写用户名" }],
  nickname: [{ required: true, message: "请填写用户昵称" }],
  "fields.email": [{ required: true, message: "请填写邮箱" }],
  fields: {
    email: [{ required: true, message: "请填写邮箱" }],
    number: [{ required: true, message: "请填写工号" }]
  }
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<boo.Employee>;
  departmentTree?: boo.Department[];
  api?: (params: any) => Promise<any>;
  update?: (id: any) => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
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
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  if (drawerProps.value.row && !drawerProps.value.row.fields) {
    drawerProps.value.row.fields = {};
  }
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let { id } = await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
      drawerProps.value.update!(id);
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
