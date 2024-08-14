<template>
  <div class="main-box">
    <TreeFilter
      ref="userDepartments"
      label="name"
      title="部门列表"
      :request-api="getUserDepartmentWithResultData"
      :default-value="initParam.department_id"
      @change="changeTreeFilter"
    />
    <div class="table-box">
      <ProTable
        ref="proTable"
        :columns="columns"
        :request-api="getUserListWithResultData"
        :init-param="initParam"
        :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
          <el-button type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button>
          <el-button type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openChangePasswordDrawer(scope.row)">修改密码</el-button>
          <el-button v-if="!scope.row.is_default" type="primary" :icon="Delete" @click="deleteAccount(scope.row)" link>
            删除
          </el-button>
        </template>
      </ProTable>
      <UserDrawer ref="drawerRef" />
      <ChangePasswordDrawer ref="changepasswordDrawerRef" />
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
<script setup lang="ts" name="useTreeFilter">
import { ref, reactive } from "vue";
import { boo } from "@/api/interface";
import { ElMessageBox } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import ProTable from "@/components/ProTable/index.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/boo/system/users/drawer.vue";
import ChangePasswordDrawer from "@/views/boo/system/users/changepassworddrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, View } from "@element-plus/icons-vue";
import { fetchOffsetLimitListWithFunc, wrapArrayResultWithFunc } from "@/api";
import {
  getUserList,
  getUserCount,
  deleteUser,
  updateUser,
  updateUserPassword,
  addUser,
  exportUserURL,
  importUsers,
  getUserDepartment
} from "@/api/users/user";
import dateformat from "dateformat";

const getUserDepartmentWithResultData = wrapArrayResultWithFunc(getUserDepartment);
const getUserListWithResultData = fetchOffsetLimitListWithFunc(getUserList, getUserCount);

// ProTable 实例
const userDepartments = ref();

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

// 表格配置项
const columns = reactive<ColumnProps<boo.User>[]>([
  { type: "index", label: "#", width: 80 },
  { prop: "name", label: "用户名", width: 120, search: { el: "input" } },
  { prop: "nickname", label: "昵称" },
  { prop: "fields.number", label: "工号" },
  { prop: "fields.email", label: "邮箱" },
  { prop: "updated_at", label: "更新时间", width: 180, render: scope => dateformat(scope.row.updated_at, "yyyy-MM-dd HH:mm:ss") },
  { prop: "operation", label: "操作", width: 330, fixed: "right" }
]);

// 删除用户信息
const deleteAccount = async (params: boo.User) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.nickname}】用户`);
  proTable.value?.getTableList();
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportUserURL(proTable.value?.searchParam), "用户列表", proTable.value?.searchParam)
  );
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "用户",
    templateApi: exportUserURL({}),
    importApi: data => importUsers(data, uploadOptions.value),
    getTableList: proTable.value?.getTableList,
    customOptions: uploadOptions
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<boo.User> = {}) => {
  let fields = row != null && row.fields != null ? { ...row.fields } : {};
  const params = {
    title,
    isCreate: title === "新增",
    isView: title === "查看",
    row: { ...row, fields: fields },
    departmentTree: userDepartments.value?.treeData,
    api: title === "新增" ? addUser : title === "编辑" ? updateUser : undefined,
    update: () => proTable.value?.getTableList()
  };
  drawerRef.value?.acceptParams(params);
};

let changepasswordDrawerRef = ref<InstanceType<typeof ChangePasswordDrawer> | null>(null);
const openChangePasswordDrawer = (row: any) => {
  let fields = row != null && row.fields != null ? { ...row.fields } : {};
  const params = {
    row: { ...row, fields: fields },
    api: updateUserPassword,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    update: (): Promise<boolean | undefined> => {
      return Promise.resolve(true);
    }
  };
  changepasswordDrawerRef.value?.acceptParams(params);
};
</script>
