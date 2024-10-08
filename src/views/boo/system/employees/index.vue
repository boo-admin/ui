<template>
  <div class="main-box">
    <TreeFilter
      ref="employeeDepartments"
      label="name"
      title="部门列表"
      :request-api="getEmployeeDepartmentWithResultData"
      :default-value="initParam.department_id"
      @change="changeTreeFilter"
    />
    <div class="table-box">
      <ProTable
        ref="proTable"
        :columns="columns"
        :request-api="getEmployeeListWithResultData"
        :init-param="initParam"
        :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增员工</el-button>
          <el-button type="primary" :icon="Upload" plain @click="batchAdd">批量添加员工</el-button>
          <el-button type="primary" :icon="Download" plain @click="downloadFile">导出员工数据</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <EmployeeDrawer ref="drawerRef" />
      <BindOrCreateUserDrawer ref="bindOrCreateUserDrawerRef" />
      <ImportExcel ref="dialogRef">
        <template #options>
          <el-form-item label="数据覆盖 :">
            <el-switch v-model="uploadOptions.overvide" />
          </el-form-item>
          <el-form-item label="创建部门 :">
            <el-switch v-model="uploadOptions.department_auto_create" />
          </el-form-item>
        </template>
      </ImportExcel>
    </div>
  </div>
</template>
<script setup lang="tsx" name="employee">
import { ref, reactive } from "vue";
import { boo } from "@/api/interface";
import { ElMessageBox } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import ProTable from "@/components/ProTable/index.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import EmployeeDrawer from "@/views/boo/system/employees/drawer.vue";
import BindOrCreateUserDrawer from "@/views/boo/system/users/bind/drawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, View } from "@element-plus/icons-vue";
import { fetchOffsetLimitListWithFunc, wrapArrayResultWithFunc } from "@/api";
import {
  getEmployeeList,
  getEmployeeCount,
  deleteEmployee,
  updateEmployee,
  addEmployee,
  exportEmployeeURL,
  importEmployees,
  getEmployeeDepartment,
  pushToUser
} from "@/api/users/employee";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { CreateUserFromEmployeeFormProps } from "../users/interface";
import dateformat from "dateformat";

const getEmployeeDepartmentWithResultData = wrapArrayResultWithFunc(getEmployeeDepartment);
const getEmployeeListWithResultData = fetchOffsetLimitListWithFunc(getEmployeeList, getEmployeeCount);

// ProTable 实例
const employeeDepartments = ref();

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ department_id: "0" });

const uploadOptions = ref({
  overvide: false,
  department_auto_create: false
});

// 树形筛选切换
const changeTreeFilter = (val: string) => {
  proTable.value!.pageable.pageNum = 1;
  initParam.department_id = val;
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns = reactive<ColumnProps<boo.Employee>[]>([
  { type: "index", label: "#", width: 80 },
  { prop: "name", label: "员工名", width: 120, search: { el: "input" } },
  { prop: "nickname", label: "昵称" },
  { prop: "fields.number", label: "工号" },
  { prop: "fields.email", label: "邮箱" },
  {
    prop: "user_id",
    label: "能否登录",
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.user_id && scope.row.user_id > 0}
              active-text={scope.row.user_id && scope.row.user_id > 0 ? "可以" : "禁用"}
              active-value={true}
              inactive-value={false}
              disabled={scope.row.user_id && scope.row.user_id > 0}
              onClick={() => openbindOrCreateUserDrawer(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.user_id && scope.row.user_id ? "success" : "danger"}>
              {scope.row.user_id && scope.row.user_id > 0 ? "可以" : "禁用"}
            </el-tag>
          )}
        </>
      );
    }
  },
  { prop: "updated_at", label: "更新时间", width: 180, render: scope => dateformat(scope.row.updated_at, "yyyy-MM-dd HH:mm:ss") },
  { prop: "operation", label: "操作", width: 330, fixed: "right" }
]);

// 删除用户信息
const deleteAccount = async (params: boo.Employee) => {
  await useHandleData(deleteEmployee, { id: [params.id] }, `删除【${params.nickname}】用户`);
  proTable.value?.getTableList();
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportEmployeeURL(proTable.value?.searchParam), "用户列表", proTable.value?.searchParam)
  );
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "用户",
    templateApi: exportEmployeeURL({}),
    importApi: data => importEmployees(data, uploadOptions.value),
    getTableList: proTable.value?.getTableList,
    customOptions: uploadOptions
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof EmployeeDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<boo.Employee> = {}) => {
  let fields = row != null && row.fields != null ? { ...row.fields } : {};

  const params = {
    title,
    isView: title === "查看",
    row: { ...row, fields: fields },
    departmentTree: employeeDepartments.value?.treeData,
    api: title === "新增" ? addEmployee : title === "编辑" ? updateEmployee : undefined,
    update: () => proTable.value?.getTableList()
  };
  drawerRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const bindOrCreateUserDrawerRef = ref<InstanceType<typeof BindOrCreateUserDrawer> | null>(null);
const openbindOrCreateUserDrawer = (row: Partial<boo.Employee> = {}) => {
  let fields = row != null && row.fields != null ? { ...row.fields } : {};

  const params: CreateUserFromEmployeeFormProps = {
    row: { ...row, fields: fields },
    departmentTree: employeeDepartments.value?.treeData,
    api: pushToUser,
    update: (user_id: number): Promise<void> => {
      //proTable.value?.getTableList()
      row.user_id = user_id;

      return Promise.resolve();
    }
  };
  bindOrCreateUserDrawerRef.value?.acceptParams(params);
};
</script>
