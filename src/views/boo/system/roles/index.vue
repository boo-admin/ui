<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        row-key="id"
        :indent="20"
        :columns="columns"
        :request-api="readRoleList"
        :request-auto="true"
        :pagination="false"
        :init-param="initParam"
        :request-error="requestError"
        :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <!-- <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增部门</el-button> -->
        </template>
        <!-- 表格操作 -->
        <!-- <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteObject(scope.row)">删除</el-button>
        </template> -->
      </ProTable>
      <RoleDrawer ref="drawerRef" />
      <ImportExcel ref="dialogRef" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="departmentTable">
import { reactive, ref } from "vue";
import { wrapArrayResultWithFunc } from "@/api";
import { boo } from "@/api/interface";
// import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import RoleDrawer from "@/views/boo/system/roles/drawer.vue";
// import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { getRoleList } from "@/api/users/role";

const readRoleList = wrapArrayResultWithFunc(getRoleList);

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// 表格配置项
const columns = reactive<ColumnProps<boo.Department>[]>([
  { type: "index", label: "#", width: 80 },
  { prop: "uuid", label: "UUID", align: "" },
  { prop: "name", label: "角色名称", align: "" },
  { prop: "created_at", label: "创建时间", width: 180 },
  { prop: "operation", label: "操作", width: 300, fixed: "right" }
]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
const requestError = (error: any) => {};

// // 删除角色信息
// const deleteObject = async (params: boo.Role) => {
//   await useHandleData(deleteRole, { id: [params.id] }, `删除【${params.name}】角色`);
//   proTable.value?.getTableList();
// };

// // 打开 drawer(新增、查看、编辑)
// const drawerRef = ref<InstanceType<typeof RoleDrawer> | null>(null);
// const openDrawer = (title: string, row: Partial<boo.Role> = {}) => {
//   const params = {
//     title,
//     row: { ...row },
//     departmentTree: proTable.value?.tableData,
//     isView: title === "查看",
//     api: title === "新增" ? addRole : title === "编辑" ? editRole : undefined,
//     getTableList: proTable.value?.getTableList
//   };
//   drawerRef.value?.acceptParams(params);
// };
</script>
