<template>
  <!-- <el-tabs type="card"> -->
      <!-- <el-tab-pane :label="item.bjmc" v-for="(item,index) in dataList" :key="index"> -->
        <!--           tooltip-effect="dark" -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%" height="700">
          <el-table-column
            prop="xh"
            align="center" width="120"
            label="学号" fixed>
            <!-- <template slot-scope="scope">
              <span>{{scope.row}}</span>
            </template> -->
          </el-table-column>
          <el-table-column
            prop="xm"
            align="center" width="100"
            label="学生姓名" fixed>
          </el-table-column>
          <el-table-column :label="item2.mc" v-for="(item2,index2) in tableHeader" :key="index2" align="center">
            <el-table-column :label="item3.mc" v-if="item2.ywzx" v-for="(item3, index3) in item2.zxmList" :key="index3" align="center">
                <el-table-column :label="item4.mc" v-if="item4.sfggrw === 1" v-for="(item4, index4) in item3.rwList" :key="index4" align="center">
                  <template slot-scope="scope">
                      <span>{{[scope.row.xmReportList,item4.uuid,'fz'] | scorefilter2}}</span><span>;{{[scope.row.xmReportList,item4.uuid, 'py'] | scorefilter2}}</span><span><img style="width: 50px;height: 50px;" :src="[scope.row.xmReportList,item4.uuid, 'tp'] | scorefilter2" alt=""></span>
                  </template>
                </el-table-column>
                <el-table-column :label="item4.mc + '(不计入总分)'" v-if="item4.sfggrw === 0" v-for="(item4, index4) in item3.rwList" :key="index4" align="center">
                  <template slot-scope="scope">
                    <span>{{[scope.row.xmReportList,item4.uuid,'fz'] | scorefilter2}}</span><span>;{{[scope.row.xmReportList,item4.uuid, 'py'] | scorefilter2}}</span><span><img style="width: 50px;height: 50px;" :src="[scope.row.xmReportList,item4.uuid, 'tp'] | scorefilter2" alt=""></span>
                  </template>
                </el-table-column>
                <el-table-column label="子项目等级" align="center" v-if="item3.zhdj === 1">
                  <template slot-scope="scope">
                    <span>{{[scope.row.xmReportList,item3.uuid, 'dj'] | scorefilter3}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="子项目积分" align="center" v-if="item3.zhdj === 0">
                  <template slot-scope="scope">
                    <span>{{[scope.row.xmReportList,item3.uuid, 'jf'] | scorefilter3}}</span>
                  </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="项目等级" align="center" v-if="item2.zhdj === 1">
              <template slot-scope="scope">
                <span>{{[scope.row.xmReportList,item2.uuid, 'xm'] | scorefilter3}}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目积分" align="center" v-if="item2.zhdj === 0">
              <template slot-scope="scope">
                <span>{{[scope.row.xmReportList,item2.uuid, 'xm'] | scorefilter3}}</span>
              </template>
            </el-table-column>
            
            <el-table-column :label="item5.mc" v-if="!item2.ywzx&&item5.sfggrw === 1" v-for="(item5, index5) in item2.rwList" :key="index5" align="center">
                <template slot-scope="scope">
                    <span>{{[scope.row.xmReportList,item5.uuid, 'fz'] | scorefilter}}</span><span>;{{[scope.row.xmReportList,item5.uuid, 'py'] | scorefilter}}</span><span><img style="width: 50px;height: 50px;" :src="[scope.row.xmReportList,item5.uuid, 'tp'] | scorefilter" alt=""></span>
                </template>
            </el-table-column>
            <el-table-column :label="item5.mc + '(不计入总分)'" v-if="!item2.ywzx&&item5.sfggrw === 0" v-for="(item5, index5) in item2.rwList" :key="index5" align="center">
              <template slot-scope="scope">
                  <span>{{[scope.row.xmReportList,item5.uuid, 'fz'] | scorefilter}}</span><span>;{{[scope.row.xmReportList,item5.uuid, 'py'] | scorefilter}}</span><span><img style="width: 50px;height: 50px;" :src="[scope.row.xmReportList,item5.uuid, 'tp'] | scorefilter" alt=""></span>
              </template>
          </el-table-column>
          </el-table-column>
          <el-table-column
            prop="zf"
            align="center"
            label="总计">
          </el-table-column>
        </el-table>
      <!-- </el-tab-pane> -->
    <!-- </el-tabs> -->
</template> 
<script>
export default {
  props: {
    // 表格的数据
    tableData: {
      type: Array,
      required: true
    },
    // 多级表头的数据
    tableHeader: {
      type: Array,
      required: true
    },
    // 表格的高度
    height: {
      type: String,
      default: '800'
    }
  },
  components: {
  },
  filters: {
    // 表格数据处理，图文评语，分值
    scorefilter([rwList,xmid,str]) {
      // console.log(str)
      // console.log(rwList)
      // console.log(xmid)
      // let finallyScore = 0;
      var tup = []
      let finallyScore = {
        twnr: '',// 评语
        tpdz:'',// 图片路径
        fz: 0 // 分值
      };
      for(let i = 0; i < rwList.length; i++) {
        if (!rwList[i].ywzx) {
          if (rwList[i].jflx === 0) { // 成绩换算
            for(let j = 0; j < rwList[i].rwList.length; j++) {
              if(rwList[i].rwList[j].uuid == xmid) {
                if (rwList[i].zhdj === 0) {
                  finallyScore.fz = rwList[i].rwList[j].cjXF;
                } else {
                  finallyScore.fz = rwList[i].rwList[j].djz;
                }
              }
            }
          } else if (rwList[i].jflx === 1) { // 累积量换算
            for(let j = 0; j < rwList[i].rwList.length; j++) {
              if(rwList[i].rwList[j].uuid == xmid) {
                if (rwList[i].zhdj === 0) {
                  finallyScore.fz = rwList[i].rwList[j].sz;
                } else {
                  if (rwList[i].ywzx) {
                    finallyScore.fz = rwList[i].rwList[j].djz;
                  } else {
                    finallyScore.fz = rwList[i].rwList[j].sz;
                  }
                }
              }
            }
          } else if (rwList[i].jflx === 2) { // 学分
            
          } else if (rwList[i].jflx === 3) { // 等级
            for(let j = 0; j < rwList[i].rwList.length; j++) {
              if(rwList[i].rwList[j].uuid == xmid) {
                finallyScore.fz = rwList[i].rwList[j].djz
              }
            }
          } else if (rwList[i].jflx === 4) { // 图文类型
            for(let j = 0; j < rwList[i].rwList.length; j++) {
              if(rwList[i].rwList[j].uuid == xmid) {
                for(let k = 0; k< rwList[i].rwList[j].xmcjInfo.twInfo.length; k++) {
                  finallyScore.fz = rwList[i].rwList[j].xmcjInfo.twInfo[k].fz
                  finallyScore.twnr = rwList[i].rwList[j].xmcjInfo.twInfo[k].twnr
                  tup = rwList[i].rwList[j].xmcjInfo.twInfo[k].tpdz.split('|')
                  finallyScore.tpdz = tup[0]
                }
              }
            }
          } else if (rwList[i].jflx === 5) { // 健康
            for(let j = 0; j < rwList[i].rwList.length; j++) {
              if(rwList[i].rwList[j].uuid == xmid) {
                finallyScore.fz = rwList[i].rwList[j].sz
              }
            }
          } else if (rwList[i].jflx === 6) { // 阅读
            
          } else if (rwList[i].jflx === 7) { // 加减分
            for(let j = 0; j < rwList[i].rwList.length; j++) {
              if(rwList[i].rwList[j].uuid == xmid) {
                finallyScore.fz = rwList[i].rwList[j].sz
              }
            }
          }
          // for(let j = 0; j < rwList[i].rwList.length; j++) {
            // if(rwList[i].rwList[j].uuid == xmid) {
            //   finallyScore = rwList[i].rwList[j].sz;
            // }
          // }
        }
        
      }
      // console.log(finallyScore)
      if (str === 'fz') {
        return finallyScore.fz
      } else if (str === 'py') {
        return finallyScore.twnr
      } else if (str === 'tp') {
        return finallyScore.tpdz
      }
      
    },
    scorefilter3([zxmList,uuid,str]) { // 有子项，转换等表格级数据处理
      // console.log(zxmList)
      // console.log(uuid)
      // console.log(str)
      let finallyScore = '';
      for(let i = 0; i < zxmList.length; i++) {
        if (zxmList[i].ywzx) {
          for(let j = 0; j<zxmList[i].zxmList.length; j++){
            if (zxmList[i].zxmList[j].uuid === uuid) {
              if (str === 'dj') {
                finallyScore = zxmList[i].zxmList[j].djz
              } else {
                finallyScore = zxmList[i].zxmList[j].xf
              }
            }
          }
        } else {
          if (zxmList[i].uuid === uuid) {
            
            if(str === 'dj'){
              finallyScore = zxmList[i].djz
            } else {
              finallyScore = zxmList[i].xf
            }
          }
        }
        
      }
      // console.log(finallyScore)
      return finallyScore
    },
    scorefilter2([zxmList,uuid,str]) { // 二级表头任务数据处理
      // console.log(uuid)
      // console.log(zxmList)
      let finallyScore = {
        twnr: '',// 评语
        tpdz:'',// 图片路径
        fz: 0 // 分值
      };
      for(let i = 0; i < zxmList.length; i++) {
        if (zxmList[i].ywzx) {
          for(let j = 0; j < zxmList[i].zxmList.length; j++) {
            for(let k = 0; k < zxmList[i].zxmList[j].rwList.length; k++) {
              if (zxmList[i].zxmList[j].rwList[k].uuid === uuid) {
                if (zxmList[i].zxmList[j].jflx === 3) {
                  finallyScore.fz = zxmList[i].zxmList[j].rwList[k].djz;
                } else if (zxmList[i].zxmList[j].jflx === 4) {
                  for(let l = 0; l<zxmList[i].zxmList[j].rwList[k].xmcjInfo.twInfo.length; l++){
                    finallyScore.fz = zxmList[i].zxmList[j].rwList[k].xmcjInfo.twInfo[l].fz
                    finallyScore.twnr = zxmList[i].zxmList[j].rwList[k].xmcjInfo.twInfo[l].twnr
                    finallyScore.tpdz = zxmList[i].zxmList[j].rwList[k].xmcjInfo.twInfo[l].tpdz
                  }
                } else {
                  finallyScore.fz = zxmList[i].zxmList[j].rwList[k].sz;
                }
              }
            }
          }
        }
      }
      if (str === 'fz') {
        return finallyScore.fz
      } else if (str === 'py') {
        return finallyScore.twnr
      } else if (str === 'tp') {
        return finallyScore.tpdz
      }
    }
  },
}
</script>
<style scoped>
 
</style>