<template>
  <div id="viewWrap" class="main-box view-wrap">
    <div id="listView" :class="{ 'list-view': true, 'panel-shadow2': true, shrink: advanceVisible }" style="">
      <div class="view-header">
        <h1 class="title">{{ title }}</h1>
        <div class="tools">
          <slot name="header"></slot>
        </div>
      </div>
      <div :class="{ 'view-content': true }" style="overflow-y: auto">
        <div class="row" v-if="statVisible" style="margin-right: -5px; margin-left: -5px">
          <slot name="stat"></slot>
        </div>
        <div :style="{ position: 'absolute', top: statVisible ? '130px' : '20px', left: '10px', right: '10px', bottom: '20px' }">
          <slot name="list"></slot>
        </div>
      </div>
    </div>
    <div class="list-side panel-shadow2" style="">
      <div class="view-header">
        <h1 class="title">组合查询</h1>
        <div class="tools">
          <el-button icon="close" @click="advanceVisible = false" size="small"></el-button>
        </div>
      </div>
      <div class="view-content">
        <slot name="side"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="BooTableLayout">
import { defineProps, defineExpose, ref, Ref } from "vue";

interface Layout {
  advanceVisible: Ref<boolean>;
}

const advanceVisible = ref(false);
defineProps({
  title: { type: String, required: true, default: "" },
  statVisible: { type: Boolean, required: false, default: false }
});

defineExpose<Layout>({
  advanceVisible
});
</script>
<style scoped lang="scss">
@import "./tablelayout.scss";
</style>
