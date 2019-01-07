<template>
  <div>
    <div id="tableview" ref="tablevew" style="page-break-after:always">
      <div class="preview_main">
        <el-row class="nsturow">
          <el-col :span="5"><div class="preview-content">
              学生姓名
          </div></el-col>
          <el-col :span="19"><div class="preview-content">
              {{dataSource.name}}
          </div></el-col>
        </el-row>
        <el-row class="nsturow">
          <el-col :span="5"><div class="preview-content">
              入学成绩
          </div></el-col>
          <el-col :span="19"><div class="preview-content">
              {{dataSource.totalScore}}分
          </div></el-col>
        </el-row>
        <el-row class="nsturow" v-if="dataSource.scores">
          <el-row class="nsturow" v-for="(item, index) in dataSource.scores" :key="index">
            <el-col :span="5"><div class="preview-content">
              {{item.courseName}}
            </div></el-col>
            <el-col :span="19"><div class="preview-content">
              {{item.score}}
            </div></el-col>
          </el-row>
        </el-row>
        <el-row class="nsturow">
          <el-col :span="5"><div class="preview-content">
              入学班级
          </div></el-col>
          <el-col :span="19"><div class="preview-content">
              {{classintroduce.msg}}
          </div></el-col>
        </el-row>
        <el-row class="nsturow">
          <el-col :span="5"><div class="preview-content">
              入学说明
          </div></el-col>
          <el-col :span="19"><div class="introduce" style="padding-top: 15px;">
            {{classintroduce.textarea}}
        </div></el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        show: false,
        ischose: false,
        // msg: '',
        // dialogFormVisible:false,
      }
    },
    props: {
      // dialogFormVisible: Boolean,
      classlist: Array,
      dataSource: Object,
      classintroduce: Object
    },
    mounted () {
    },
    methods: {
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.preview_tit{
    font-size:20px;
    width:100%;
    text-align: center;
}
.preview_main{
    margin-top:20px;
    padding:30px;
    background:#f0f0f0;
}
.preview_main2{
    padding:10px 30px;
    background:#FFF;
}
.preview-content{
    line-height:50px;
    font-size:16px;
    padding-right:10px;
}
.selectionbox{
    position: relative;
    /* width: 216px;
    height: 38px; */
    ul{
        margin: 0;
        padding: 0;
        background: #fff;
        position: absolute;
        width: 216px;
        bottom: 30px;
        border-radius: 5px;
        border: 1px solid #eee;
        margin-bottom: 20px;
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
    }
    ul::after{
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #eee;
        content: "";  
        position: relative;      
        width: 0; 
        top: 21px;
        left: 20px;
    }
}
.simulationinput{
    background: #ffffff;
    text-align: start;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 5px;
    min-height: 100px;
    padding: 10px;
}
.simulationinput:empty::before {  
    content: attr(placeholder);
    color: #ccc;
}
.selection{
    /* position: absolute; */
    width: 216px;
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
.selection::after{
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
}
.avtive::after{
    transform: rotate(-45deg)
}
</style>