<template>
  <div>
    <div class="selectionbox">
      <ul v-if="scores.isselected" style="max-height: 300px">
        <li v-for="(item, courseindex) in dataSource" :key="courseindex" @click.stop="selectclass(item, scoreindex)">{{item.kcmc}}</li>
      </ul>
      <div class="selection" :class="{avtive: ischose}" placeholder="请选择" @click.stop="choseclass(scores,scoreindex)">{{scores.courseName? scores.courseName : ''}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        show: false,
        ischose: false,
        msg: '',
      }
    },
    props: {
     dataSource: Array,
     scoreindex: Number,
     scores: Object
    },
    methods: {
      // 选择课程
      choseclass (scores, index) {
        // this.scores.isselected = true
        // this.show = !this.show
        this.$emit('choseclass', scores, index)
      },
        // select选中事件
      selectclass (data, index) {
        this.$emit('selectclass', data, index)
        this.scores.courseName = data.kcmc
        this.show = false
      },
    }
  }
</script>
<style lang="scss" scoped rel="stylesheet/scss">
.selectionbox{
  position: relative;
  /* width: 216px;
  height: 38px; */
  ul{
    margin: 0;
    padding: 0;
    background: #fff;
    position: absolute;
    width: 150px;
    bottom: 30px;
    border-radius: 5px;
    border: 1px solid #eee;
    margin-bottom: 20px;
    overflow-x: hidden;
    overflow-y: scroll;
    li{
      height: 30px;
      width: 100%;
      list-style: none;
      line-height: 30px;
      padding-left: 5px;
      border-bottom: solid 1px #eee;
      cursor: pointer;
    }
    li:last-child{
      border-bottom: none;
    }
    li:hover{
      background-color: darkgrey;
      color: #fff;
    }
  }
}
.selection{
  /* position: absolute; */
  width: 110px;
  height: 38px;
  background-color: #ffff;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  padding-left: 15px;
  line-height: 40px;
  transition: all .5s ease-in-out;
}
.selection:empty::before {  
  content: attr(placeholder);
  color: #ccc;
}
.selection:hover{
  border: 1px solid #ccc;
}
/* .selection::after{
  content: '';
  width: 8px;
  height: 8px;
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
  position: absolute;
  transform: rotate(135deg);
  right: 11px;
  top: 13px;
  transition: all .5s ease-in-out;
} */
.avtive::after{
  transform: rotate(-45deg)
}
</style>