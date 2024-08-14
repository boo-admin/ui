<template>
  <BooTableLayout ref="layoutInst" list-title="对象管理" v-model:adv-search-visible="advanceVisible" :stat-visible="false">
    <template #tableTools>
      <el-button type="primary" :icon="Plus" class="table-button">添加</el-button>
      <el-button type="primary" :icon="Edit" plain class="table-button">编辑</el-button>
      <el-button type="danger" :icon="Delete" plain class="table-button" style="margin-right: 10px">删除</el-button>
      <el-input style="width: 300px" class="table-input" placeholder="请输入进行快速查询">
        <template #prepend>
          <el-select v-model="select" placeholder="名称" style="width: 95px">
            <el-option label="名称" value="1" />
            <el-option label="部门" value="2" />
            <el-option label="备注" value="3" />
          </el-select>
        </template>
        <template #append>
          <el-dropdown split-button type="primary" @click="handleSearchClick" @command="handleSearchCommand" style="width: 40px">
            <el-icon><Search /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>高级查询</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-input>
    </template>
    <template #stat>
      <el-row :gutter="10">
        <el-col :span="8" style="margin-bottom: 20px">
          <el-alert effect="dark" title="运行状况正常的对象" description="10" type="success" :closable="false" show-icon />
        </el-col>
        <el-col :span="8" style="margin-bottom: 20px">
          <el-alert effect="dark" title="有未处理完告警的对象" description="2" type="info" :closable="false" show-icon />
        </el-col>
        <el-col :span="8" style="margin-bottom: 20px">
          <el-alert effect="dark" title="失联的对象" description="1" type="warning" :closable="false" show-icon />
        </el-col>
      </el-row>
    </template>
    <template #list>
      <el-table :data="tableData" border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="address" label="IP地址"></el-table-column>
        <el-table-column prop="hostname" label="主机名"></el-table-column>
        <el-table-column prop="updated_at" label="最后发现时间">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ dayjs(scope.row.updated_at).format("YYYY年MM月DD HH:mm:ss") }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="155">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"> 添加 </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"> 忽略 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :style="{ float: 'right', padding: '15px 0 0' }"
        :current-page="offset"
        :page-size="limit"
        :page-sizes="[10, 20, 30, 40]"
        :small="false"
        :disabled="false"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
    <template #side>
      <el-form ref="ruleForm" label-width="60px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="name">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="name">
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
  </BooTableLayout>
</template>
<script lang="ts" setup name="list_demo">
import { ref, onMounted } from "vue";
import BooTableLayout from "@/components/BooTableLayout/TableLayout.vue";
// import { useHandleData } from "@/hooks/useHandleData";
import { BooTableLayoutInstance } from "@/components/BooTableLayout/interface";
import { Delete, Edit, Plus, Search } from "@element-plus/icons-vue";
import { newDiscoveries, ignoreList } from "@/api/hw/index";
import dayjs from "dayjs";

// const input3 = ref("");
const select = ref("");

const offset = ref(1);
const limit = ref(10);
const total = ref(0);

const layoutInst = ref<BooTableLayoutInstance>();
const tableData = ref([]);

const handleDelete = (index, row) => {
  // const deleteData = async params => {
  //   console.log(index, row, params.id);
  //   return "ok";
  // };
  // useHandleData(deleteData, { id: [row.id] }, `删除【${row.name}】用户`);
  ignoreList(row.address).then(res => {
    console.log(res);
    getNewDiscoveries();
  });
};
const handleEdit = (index, row) => {
  console.log(index, row);
};

onMounted(() => {
  // layoutInst.value!.advanceVisible = true;
});

const advanceVisible = ref(false);

const handleSearchClick = () => {
  // layoutInst.value!.advanceVisible = !layoutInst.value!.advanceVisible;
};

const handleSearchCommand = () => {
  advanceVisible.value = !advanceVisible.value;
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  limit.value = val;
  getNewDiscoveries();
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  offset.value = val;
  getNewDiscoveries();
};
const getNewDiscoveries = () => {
  newDiscoveries({ offset: offset.value, limit: limit.value }).then((res: any) => {
    total.value = res.total;
    tableData.value = res.data;
  });
};
getNewDiscoveries();
</script>
