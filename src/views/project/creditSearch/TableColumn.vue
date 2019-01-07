<template>
  <el-table-column :label="coloumnHeader.mc" :prop="coloumnHeader.mc" align="center">
    <template v-for="item in coloumnHeader.rwList">
      <tableColumn v-if="coloumnHeader.ywzx" :key="item.uuid" :coloumn-header="item"></tableColumn>
      <el-table-column v-else :key="item.mc" :label="item.mc" :prop="item.mc" align="center"></el-table-column>
    </template>
    <template v-for="item in coloumnHeader.zxmList">
        <tableColumn v-if="coloumnHeader.ywzx" :key="item.uuid" :coloumn-header="item"></tableColumn>
        <el-table-column v-else :key="item.mc" :label="item.mc" :prop="item.mc" align="center"></el-table-column>
      </template>
  </el-table-column>
</template>

<script>
export default {
  data () {
    return {
      heheh: 'heheheh',
    }
  },
  name: 'tableColumn',
  props: {
    coloumnHeader: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>