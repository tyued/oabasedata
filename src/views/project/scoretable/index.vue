<template>
<div class="score-table">
  <div class="col-sm-12">
      <button @click="addItem" class="btn btn-primary"><i class="glyphicon glyphicon-plus-sign"></i> 添加一条记录</button>
  </div>
  <br/><br/>
  <vue-bootstrap-table
              :columns="columns"   
              :values="values"      
              :sortable="true"     
              :paginated="true"    
              :multi-column-sortable="true" 
              :pageSize=15
  >
  </vue-bootstrap-table> 
  <div class="score-table-tips">
       <p>*温馨提示：</p>
       <p>2.性别：男/女/未知;</p>
       <p>3.考试状态：正常/补考/缺考;</p> 
  </div>
</div>
  
</template>

<script>

import VueBootstrapTable from './VueBootstrapTable.vue'
import './css/bootstrap.min.css'

import {GetScoreList} from 'api/project/projectDetail/index'
 
//传参
// var xxdm='1438'                                   //学校
// var xmid='8ce6b873-ba4c-4fe9-bdb7-1d4da7bac1f2'   //项目
// var rwid='1b65f349-46b1-4968-9e1b-15ce25de3a05'   //任务
// var bjid='11592a16aa024622abd0702fcdrfge778'      //班级


var renderfu = function (colname, entry) {
    return '<div class="btn-group" role="group">'+
        '<span>'+JSON.stringify(entry)+'</span></div>';
};
  export default {
    name: 'score-table',
    components: {
        VueBootstrapTable: VueBootstrapTable
    },
    data() {
      return {
        xxdm: localStorage.getItem("xxdm"),       //学校
        xmid: localStorage.getItem("xmid"),       //项目
        rwid: localStorage.getItem("rwid"),       //任务
        bjid: localStorage.getItem("bjid"),       //班级  
        columns: [
              {
                  title:"学号",
                  visible: true,
                  editable: true,
              },
              {
                  title:"姓名",
                  visible: true,
                  editable: true,
              },
              {
                  title:"性别",
                  visible: true,
                  editable: true,
              },
              {
                  title:"考试状态",
                  visible: true,
                  editable: true,
              },
              {
                  title:"成绩",
                  visible: true,
                  editable: true,
              },
              {
                title: "保存",
                visible: true,
                renderfunction: renderfu
              }
          ],
          values: [
                // {
                //     "序号": 3,
                //     "姓名": 333,
                //     "成绩": 30,
                // },
                // {
                //     "序号": 4,
                //     "姓名": 444,
                //     "成绩": 40,
                // },
          ],
      }
    },
    computed: {

    },
    created () {
        GetScoreList({
            version: 1,
            xxdm:'1438',  //学校
            xmid:'0ab06e83-714d-4b9d-b9e1-b2ec51c6315a',  //项目
            rwid:'6587cfb2-49e5-4e03-9814-0d4ac62af61d',  //任务
            bjid:'2018143810101'  //班级                         
        }).then(response => {
            // console.log(response);
            let resList=response;
            for(let i=0;i<resList.length;i++){
                let xb='';
                if(resList[i].xb==1){
                    xb='男';
                }else if(resList[i].xb==2){
                    xb='女';
                }else{
                   xb='未知'; 
                }
                let kszt='';
                if(resList[i].kszt==0){
                    kszt='正常';
                }else if(resList[i].kszt==1){
                    kszt='补考';
                }else{
                    kszt='缺考';
                }
                let item={
                    "学号": resList[i].xh,
                    "姓名": resList[i].xm,
                    "性别": xb,
                    "考试状态":kszt,
                    "成绩": resList[i].sz,
                }
                this.values.push(item); 
            }                
        })
    },
    methods: {
       addItem: function () {
            let self = this;
            let item = {
                "学号": "",
                "姓名": "",
                "性别": "",
                "考试状态": "",
                "成绩": "",
            };
            this.values.unshift(item);
        },
       

    }
  };
</script>
<style>
    .colstyletest {
        background-color: #000066;
    }

    .cellstyletest {
        background-color: #a94442;
    }
    .btn-toolbar{
        padding-bottom: 30px;
    }
    .score-table{
        padding: 30px 10px;
    }
    .score-table-tips{
        color: #a94442;
        font-size: 12px;
        line-height: 12px;
        padding: 0 10px 30px 10px;
    }
</style>