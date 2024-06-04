<template>
  <BooTableLayout ref="layoutInst" list-title="对象管理" :stat-visible="false">
    <template #header>
      <el-button type="primary" icon="el-icon-plus">添加</el-button>
      <el-button type="success" icon="el-icon-edit">编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" style="margin-right: 10px">删除</el-button>
      <el-input
        v-model="input3"
        style="max-width: 400px; margin-right: 10px"
        placeholder="请输入进行快速查询"
        class="input-with-select"
      >
        <template #prepend>
          <el-select v-model="select" placeholder="名称" style="width: 95px">
            <el-option label="名称" value="1" />
            <el-option label="部门" value="2" />
            <el-option label="备注" value="3" />
          </el-select>
        </template>
        <template #append>
          <el-button icon="search" />
        </template>
      </el-input>
    </template>
    <template #list>
      <el-row :gutter="10" style="margin-right: -5px; margin-left: -5px">
        <el-col :span="8" style="margin-bottom: 10px">
          <el-alert effect="dark" title="运行状况正常的对象" description="10" type="success" :closable="false" show-icon />
        </el-col>
        <el-col :span="8" style="margin-bottom: 10px">
          <el-alert effect="dark" title="有未处理完告警的对象" description="2" type="info" :closable="false" show-icon />
        </el-col>
        <el-col :span="8" style="margin-bottom: 10px">
          <el-alert effect="dark" title="失联的对象" description="1" type="warning" :closable="false" show-icon />
        </el-col>
      </el-row>
      <el-table :data="tableData" border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="position" label="职位"></el-table-column>
        <el-table-column prop="department" label="部门"></el-table-column>
        <el-table-column prop="no" label="编号"></el-table-column>
        <el-table-column prop="description" label="备注"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"> 编辑 </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #side>
      <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-right: 20px">
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
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import BooTableLayout from "@/components/BooTableLayout/TableLayout.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { BooTableLayoutInstance } from "@/components/BooTableLayout/interface";

const input3 = ref("");
const select = ref("");

const layoutInst = ref<BooTableLayoutInstance>();
const tableData = [
  { name: "梅先森", age: 30, position: "研发", department: "研发部", no: 10, description: "测试" },
  { name: "梅先森", age: 30, position: "研发", department: "研发部", no: 10, description: "测试" },
  { name: "梅先森", age: 30, position: "研发", department: "研发部", no: 10, description: "测试" }
];

const handleDelete = (index, row) => {
  const deleteData = async params => {
    console.log(index, row, params.id);
    return "ok";
  };
  useHandleData(deleteData, { id: [row.id] }, `删除【${row.name}】用户`);
};
const handleEdit = (index, row) => {
  console.log(index, row);
};

onMounted(() => {
  layoutInst.value!.advanceVisible = true;
});
</script>
