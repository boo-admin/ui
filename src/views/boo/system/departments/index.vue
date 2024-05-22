<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        row-key="id"
        :indent="20"
        :columns="columns"
        :request-api="getDepartmentList"
        :request-auto="true"
        :pagination="false"
        :init-param="initParam"
        :request-error="requestError"
        :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
        default-expand-all
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增部门</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteObject(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <DepartmentDrawer ref="drawerRef" />
      <ImportExcel ref="dialogRef" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="departmentTable">
import { reactive, ref } from "vue";
import { wrapArrayResultWithFunc } from "@/api";
import { boo } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import DepartmentDrawer from "@/views/boo/system/departments/drawer.vue";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { deleteDepartment, editDepartment, addDepartment, getDepartmentTreeList } from "@/api/users";

const getDepartmentList = wrapArrayResultWithFunc(getDepartmentTreeList);

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// 表格配置项
const columns = reactive<ColumnProps<boo.Department>[]>([
  { type: "index", label: "#", width: 80 },
  { prop: "name", label: "部门名称", align: "" },
  { prop: "order_num", label: "位置序号" },
  { prop: "created_at", label: "创建时间", width: 180 },
  { prop: "operation", label: "操作", width: 300, fixed: "right" }
]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
const requestError = (error: any) => {};

// 删除用户信息
const deleteObject = async (params: boo.Department) => {
  await useHandleData(deleteDepartment, { id: [params.id] }, `删除【${params.name}】部门`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof DepartmentDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<boo.Department> = {}) => {
  const params = {
    title,
    row: { ...row },
    departmentTree: proTable.value?.tableData,
    isView: title === "查看",
    api: title === "新增" ? addDepartment : title === "编辑" ? editDepartment : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
