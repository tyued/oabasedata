<template>
  <div>
    <ul class="list_box">
      <li class="list" v-for="(item, index) in treelist" @click.stop="checkdetail(item)">{{item.xm}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      
    }
  },
  props: {
    treelist: Array
  },
  methods: {
    checkdetail(item) {
      this.$emit('checkdetail',item)
    }
  }
}
</script>
<style lang="scss" scoped>
  .list_box{
    margin-bottom: 5px;
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: scroll;
    .list{
      padding-left: 25px;
      background-color: #fefefe;
      cursor: pointer;
    }
    .list:hover{
      background-color: rgb(163, 216, 240)
    }
  }
</style>