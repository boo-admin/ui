<template>
  <div id="viewWrap" class="main-box">
    <div class="table-box">
      <div class="card table-main">
        <div class="table-header2">
          <div class="header-button-lf">
            <slot name="tableHeader" />
          </div>
          <div class="header-button-ri">
            <slot name="tableTools">
              <!-- <el-button v-if="showToolButton('refresh')" :icon="Refresh" circle @click="getTableList" />
            <el-button v-if="showToolButton('setting') && columns.length" :icon="Operation" circle @click="openColSetting" />
            <el-button
              v-if="showToolButton('search') && searchColumns?.length"
              :icon="Search"
              circle
              @click="isShowSearch = !isShowSearch"
            /> -->
            </slot>
          </div>
        </div>

        <div class="card mb0 pl0 pr0 pt0 pb0" v-if="statVisible">
          <slot name="stat"></slot>
        </div>

        <div class="card mb0 pl0 pr0 pt0 pb0">
          <slot name="list"></slot>
        </div>
      </div>
    </div>

    <div class="card filter mb0 pl5 pr5 pt0 pb0" v-if="advSearchVisible">
      <div class="view-header">
        <h4 v-if="advSearchTitle" class="title sle">
          {{ advSearchTitle }}
        </h4>
        <div class="tools">
          <el-button icon="close" @click="updateAdvSearchVisible(false)" size="small"></el-button>
        </div>
      </div>
      <div class="view-content">
        <slot name="side"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="BooTableLayout">
defineProps({
  title: { type: String, required: true, default: "" },
  statVisible: { type: Boolean, required: false, default: false },
  advSearchVisible: { type: Boolean, required: false, default: false },
  advSearchTitle: { type: String, required: true, default: "高级查询" }
});
const emit = defineEmits(["update:advSearchVisible", "update:statVisible"]);

const updateAdvSearchVisible = value => {
  emit("update:advSearchVisible", value);
};

const updateStatVisible = value => {
  emit("update:statVisible", value);
};

interface Layout {
  // advanceVisible: Ref<boolean>;
  updateStatVisible: (value: boolean) => void;
}

defineExpose<Layout>({
  updateStatVisible
});
</script>
<style scoped lang="scss">
@import "./tablelayout.scss";
</style>
