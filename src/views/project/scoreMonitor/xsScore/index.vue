<template>
  <div class="app-container calendar-list-container">

    <div class="mbottom">
      <el-input placeholder="请输入姓名" v-model="listQuery.xm" class="input-with-select mright" style="width:200px">
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input>
      <el-select v-model="listQuery.xn" class="mright mpbottom" @change="getList">
        <el-option
          v-for="(item,index) in xnList"
          :key="index"
          :value="item">
          {{item+'年'}}
        </el-option>
      </el-select>
      <el-select v-model="listQuery.xq" class="mright mpbottom" @change="getList">
        <el-option
          v-for="(item,index) in xqList"
          :key="index"
          :label="item.xqmc"
          :value="item.xq">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.njdm" class="mright mpbottom" @change="getList">
        <el-option
          v-for="(item,index) in njList"
          :key="index"
          :label="item.njmc"
          :value="item.njdm">
        </el-option>
      </el-select>
      <el-select v-model="kcIndex" @change="getList">
        <el-option
          v-for="(item,index) in kcList"
          :key="index"
          :label="item.kcmc"
          :value="index">
        </el-option>
      </el-select>
      <el-button type="primary" class="right" @click="exportFunc">导出</el-button>
    </div>

    <el-tabs type="card">
      <el-tab-pane :label="item.bjmc" v-for="(item,index) in dataList" :key="index">

        <el-table
          ref="multipleTable"
          :data="item.studentStatisticses"
          tooltip-effect="dark"
          style="width: 100%" height="700">
          <el-table-column
            align="center" width="120"
            label="序号" fixed>
            <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="xm"
            align="center" width="200"
            label="学生姓名" fixed>
          </el-table-column>
          <el-table-column :label="item2.xmmc" v-for="(item2,index2) in item.xmDetailInfos" :key="index2" align="center">
            <el-table-column  :label="item3.dfxmc" v-for="(item3,index3) in item2.scores" :key="index3" align="center">
              <template slot-scope="scope">
                <span>{{[scope.row.scores,item3.dfxId] | scorefilter}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="zf"
            align="center"
            label="总计">
          </el-table-column>

        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.right {
  float: right;
}
.mright {
  margin-right: 10px;
}
.mpbottom{
  margin-bottom: 10px; 
}
.mbottom {
  margin-bottom: 20px;
}


</style>

<script>
import { getToken } from "utils/auth";
import { mapGetters } from "vuex";

import {
    xs_page,
    xs_export,
    getXn,
    getXq,
    getNj,
    getXk,
    dqxnxqObj,
} from 'api/project/scoreMonitor/index'


export default {
  name: "xsScore",
  components: {

  },
  data() {
    return {
      listQuery:{
        xxdm: window.localStorage.getItem('xxdm'),
        xn: '',
        xq: '',
        njdm: '',
        kcmc: '',
        kcId: '',
        xm: '',
      },
      kcIndex: 0,
      xnList: [],
      xqList: [],
      njList: [],
      kcList: [],
      dataList: [],
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(["elements"])
  },
  directives: {

  },
  filters: {
    scorefilter([scores,xmid]) {
      // console.log(xmid)
      let finallyScore = 0;
      for(let i = 0; i < scores.length; i++) {
        for(let j = 0; j < scores[i].scores.length; j++) {
          if(scores[i].scores[j].dfxId == xmid) {
            finallyScore = scores[i].scores[j].score;
            // return finallyScore
          }
        }
      }
      return finallyScore
    }
  },
  methods: {
    init() {
      let _this = this;
      Promise.all([
        dqxnxqObj({
            xxdm: _this.listQuery.xxdm,
        }),
        getXn({
            xxdm: _this.listQuery.xxdm,
            page: 1,
            limit: 50,
        }),
        getXq({
            xxdm: _this.listQuery.xxdm,
            page: 1,
            limit: 50,
        }),
        getNj({
            xxdm: _this.listQuery.xxdm,
            page: 1,
            limit: 50,
        }),
        getXk({
            xxdm: _this.listQuery.xxdm,
            page: 1,
            limit: 50,
        })])
      .then(function (res) {
        let res0 = res[0];
        let res1 = res[1].data.rows;
        let res2 = res[2].data.rows;
        let res3 = res[3].data.rows;
        let res4 = res[4].data.rows;

        // 学年
        let xnList = [];
        if(res1) {
          for(let i = 0; i < res1.length; i++) {
            if(xnList.indexOf(res1[i].xn) < 0) {
              xnList.push(res1[i].xn)
            }
          }
        }
        _this.xnList = xnList;

        // 学期
        _this.xqList = res2;

        // 年级
        _this.njList = res3;

        // 课程
        _this.kcList = res4;

        //初始化请求数据
        let xnIndex = xnList.indexOf(res0.xn);
        if(xnIndex<0) {xnIndex = 0}

        let xqIndex = 0 ;
        for(let i = 0; i < res2.length; i++) {
          if(res0.xq == res2[i].xq) {
            xqIndex = i;
            break
          }
        }

        _this.listQuery.xn = xnList[xnIndex];
        _this.listQuery.xq = res2[xqIndex].xq;
        _this.listQuery.njdm = res3[0].njdm;
        _this.kcIndex = 0;

        _this.getList()

      });
    },
    getList() {
      this.listQuery.kcId = this.kcList[this.kcIndex].uuid;   //记得打开备注
      // this.listQuery.kcId = 'd9742200-2814-11e8-88b0-b82a72dc4c4d';  //测试数据

      this.listQuery.kcmc = this.kcList[this.kcIndex].kcmc;

      this.dataList = []
      xs_page(this.listQuery).then((response)=>{
        this.dataList = response.classStatisticses
        console.log(this.dataList)

      })

    },
    exportFunc() {
      xs_export(this.listQuery).then(response => {
            var blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
            var downloadElement = document.createElement('a');
        　　var href = window.URL.createObjectURL(blob); //创建下载的链接
        　　downloadElement.href = href;
        　　downloadElement.download = '学分监控_学生.xlsx'; //下载后文件名
        　　document.body.appendChild(downloadElement);
        　　downloadElement.click(); //点击下载
        　　document.body.removeChild(downloadElement); //下载完成移除元素
        　　window.URL.revokeObjectURL(href); //释放掉blob对象
      })
    },
  }
};
</script>


