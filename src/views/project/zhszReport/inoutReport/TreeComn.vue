<template>
  <div>
    <div class="box_f_f">
      <div class="box_f" @click.stop="open(treelist.bjdm)">{{treelist.bjmc}}</div>
      <tree-son :treelist="dataSource.students" v-if="treeid === treelist.bjdm" @checkdetail="checkdetail"></tree-son>
      <!-- treeOpen &&  -->
    </div>
  </div>
</template>
<script>
import TreeSon from './TreeSon'
export default {
  components: {
    TreeSon
  },
  data () {
    return {
      isshow: false, //
      treelist: {}, // 数据暂存
      // isshows: false,
    }
  },
  props: {
    dataSource: Object,
    treeOpen: Boolean,
    treeid: String
  },
  mounted () {
    this.treelist = this.dataSource
  },
  methods: {
    open(datas) {
      this.$emit('open', datas)
    },
    checkdetail(item){
      this.$emit('checkdetail', item, this.dataSource)
    }
  }
}
</script>
<style lang="scss" scoped>
  .box_f{
    line-height: 25px;
    padding-left: 15px;
    background-color: #eee;
    position:relative;
    cursor: pointer;
  }
  .box_f::before{
    content: '';
    width:0;
    height:0;
    border-width:5px 0 5px 5px;
    border-style:solid;
    border-color:transparent transparent transparent #333;/*透明 透明 透明 灰*/
    top: 8px;
    left: 5px;
    position: absolute;
  }
</style>