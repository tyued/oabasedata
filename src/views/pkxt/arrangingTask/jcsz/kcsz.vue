<template>
  <el-row :gutter="12">
  <el-col :span="4" >
    <el-card shadow="always" style="height:660px;overflow:auto;" class="smallscroll">
      <el-tree style="height:100%;" width="20%" :data="treeData"  node-key="id" :highlight-current="true"  :accordion="true" :props="defaultProps" @node-click="handleCheckClick"></el-tree>
    </el-card>
  </el-col>
    <el-col :span="20">
      <el-card shadow="never" style="height:660px;">
        <div style="padding-bottom: 10px">
        <el-alert
          style="margin: 4px 0 !important;"
          title=" 温馨提示，如果对课节数进行修改,会清空规则条件历史数据"
          type="warning"  show-icon>
        </el-alert>
        </div>
          <el-table :data="list" height="535" border fit highlight-current-row  style="width: 100%;">
            <el-table-column prop="kcmc"  label="课程名称" width="350" align="center" ></el-table-column>
            <el-table-column label="课程类型" width="350" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.kclx == 0" size="small" slot="reference" type="info">
                   <span>选修课</span>
                </el-tag>
                <el-tag v-if="scope.row.kclx == 1" size="small" slot="reference" type="success">
                   <span>必修课</span>
                </el-tag>
                <el-tag  v-if="scope.row.kclx ==2" size="small" slot="reference" type="warning">
                  <span>活动课</span>
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column  label="每周上课数" width="350" align="center" >
              <template slot-scope="scope" >
                <el-input-number v-if="scope.row.zt == 1" size="mini"  :min="0" :max="35" v-model ="scope.row.zxs" :disabled="true" ></el-input-number>
                <el-input-number v-else size="mini" :min="0" :max="35"  v-model ="scope.row.zxs" @change="HandleChange"
                                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态" v-if="isShow">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.zxsStr" placement="top-start" >
                  <span v-if="scope.row.zt == 1" style="color:red">各班级不一致</span>
                  <span v-else="scope.row.zt == 0" style="color:dodgerblue">各班级一致</span>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="calculateProcess()"  :show-text="true" :color=colors></el-progress>
        <div class='totalkc'>节数合计/课程容量：<span>{{num}}/{{totalZxs}}</span></div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
  import { getKcsz, getNjkc, getAdd, getUpdate, getTotalZxs, checkGzsz, initGzsz, getBsks } from 'api/pkxt/arrangingTask/jcsz/kcsz';
  import jcsj from '@/api/jcsj.js';
  export default {
    data() {
      return {
        num1: '',
        xxdm: '', // 学校代码
        list: [], // 课程数据
        treeData: [], // 年级树
        currentNjdm: '', // 当前年级代码
        total: '',
        currentNode: {},
        currentData: {},
        rwid: this.$route.query.rwid,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        num: 0,
        zxs: {},
        isShow: true,
        colors: '',
        totalZxs: 0,
        allTotalZxs: 0
      };
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
    },
    methods: {
      // 获取年级数据
      getList(data) {
        this.listLoading = true;
        this.isShow = true;
        const queryObj = { xxdm: this.xxdm, njdm: data.id, rwid: this.rwid };
        getBsks(queryObj).then(res => {
          let bskNum = 0;
          if (res.data === undefined || res.data === '') {
            bskNum = 0;
          } else {
            bskNum = res.data;
          }
          this.totalZxs = (this.allTotalZxs - bskNum) > 0 ? this.allTotalZxs - bskNum : 0;
        });
        getNjkc(queryObj).then(response => {
          this.list = response.data.rows;
          response.data.rows.forEach(item => {
            try {
            // 根据课程状态来设置不同的提示语
              if (item.zt > 0) {
                let zxsString = '';
                const zxsArr = item.zxsStr.split(';');
                zxsArr.forEach((zxsStr, index) => {
                  if (index < zxsArr.length - 1) {
                    const bjdm = zxsStr.substr(0, zxsStr.indexOf(' : '));
                    const zxs = zxsStr.substr(zxsStr.indexOf(' : ') + 3, zxsStr.length);
                    const bjmc = jcsj.hqbjmcByid(this.bjList, bjdm);
                    zxsString += bjmc + ' : ' + zxs + ' 节 ;  ';
                  }
                });
                item.zxsStr = zxsString;
              } else if (item.zt === 0 && item.zxsStr === '') {
                item.zxsStr = '该年级还未进行课程设置';
              } else {
                item.zxsStr = '所有班级课程设置均为 ' + item.zxsStr + ' 节';
              }
            } catch (e) {
              console.error('基础数据取值error');
            }
          });
          this.listLoading = false;
          this.countZxs();
        });
      },
      // 获取班级数据
      getKcList(data) {
        this.isShow = false;
        const queryObj = { xxdm: this.xxdm, bjdm: data.id, rwid: this.rwid };
        getBsks(queryObj).then(res => {
          let bskNum = 0;
          if (res.data === undefined || res.data === '') {
            bskNum = 0;
          } else {
            bskNum = res.data;
          }
          this.totalZxs = this.allTotalZxs - bskNum;
        });
        getKcsz(queryObj).then(response => {
          response.data.rows.forEach(item => {
            try {
              const kcmc = jcsj.hqkcmcByid(this.kcList, item.kcdm);
              const kclx = jcsj.hqkclxByid(this.kcList, item.kcdm);
              item.kcmc = kcmc;
              item.kclx = kclx;
            } catch (e) {
              console.error('基础数据取值error');
            }
          });
          this.list = response.data.rows;
          this.countZxs();
        });
      },
      loadnjBjData() { // 处理年级和班级树结构
        if (this.treeData.length === 0) {
          this.treeData = [];
          for (let j = 0; j < this.njList.length; j++) {
            const njdata = this.njList[j];
            const njmap = {};
            njmap.label = njdata.njmc;
            njmap.id = njdata.njdm;
            njmap.disabled = true;
            njmap.children = [];
            const bjdata = _.filter(this.bjList, { njdm: njdata.njdm });
            for (let i = 0; i < bjdata.length; i++) {
              njmap.children.push({ label: bjdata[i].bj, id: bjdata[i].uuid });
            }
            this.treeData.push(njmap);
          }
        }
      },
      /** @树形插件班级点击事件显示学生方法**/
      handleCheckClick(data, node) {
        if ($.isEmptyObject(this.currentNjdm)) {
          this.currentNjdm = data.id;
          this.currentNode = node;
          this.currentData = data;
        }
        this.getAllList(node, data);
        this.currentNode = node;
        this.currentData = data;
      },
      // 保存课程设置信息
      HandleChange() {
        checkGzsz({ rwid: this.rwid, xxdm: this.xxdm }).then(res => {
          if (res.data) {
            this.$confirm('确定对课节数进行修改,并且清空规则条件历史数据？（规则条件清空后无法恢复哦）', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              initGzsz({ rwid: this.rwid, xxdm: this.xxdm }).then(() => {
                this.$notify({ title: '成功', message: '规则条件历史数据已清空', type: 'success', duration: 2000 });
              });
              this.saveKcszData();
            }).catch(() => {
              this.getAllList(this.currentNode, this.currentData);
            });
          } else {
            this.saveKcszData();
          }
        });
      },
      // 进度条计算
      countZxs() {
        this.num = 0;
        for (this.zxs of this.list) {
          this.num += this.zxs.zxs;
        }
      },
      // 获取全校上课总节数
      getZxs() {
        getTotalZxs({ xxdm: this.xxdm, rwid: this.rwid }).then(response => {
          if (response.data == 0) {
            this.allTotalZxs = response.data;
            this.$notify({ title: '提示', message: '请检查课时设置是否已设置', type: 'warning', duration: 2000 });
          } else {
            this.allTotalZxs = response.data;
          }
        });
      },
      // 进度条计算保留整数
      calculateProcess() {
        let percent = 0;
        if (this.totalZxs !== 0) {
          percent = this.num / this.totalZxs * 100;
        }
        if (percent === 100) {
          this.colors = '#67c23a';
        } else if (percent > 100) {
          this.colors = '#EE2C2C';
        } else {
          this.colors = '#409EFF';
        }
        const maxPerson = percent > 100 ? 100 : percent;
        return parseInt(maxPerson.toFixed(0));
      },
      // 查询课程设置信息
      getAllList(node, data) {
        if (node.level == '2') {
          this.getKcList(data);
        } else {
          this.getList(data);
        }
      },
      // 保存课程设置数据
      saveKcszData() {
        this.countZxs();
        if (this.num > this.totalZxs) {
          this.$notify({ title: '温馨提示', message: '上课节数不能大于全校上课节数,请重新填写', type: 'warning', duration: 2000 });
          this.getAllList(this.currentNode, this.currentData);
          return;
        }
        // 保存课程设置信息
        if (this.currentNode.level == '2') {
          getUpdate(this.rwid, { kcszList: this.list }).then(() => {
            this.getAllList(this.currentNode, this.currentData);
          });
        } else if (this.currentNode.level == '1') {
          const bjdata = _.filter(this.bjList, { njdm: this.currentData.id });
          getAdd({ kcszList: this.list, rwid: this.rwid, bjList: bjdata }).then(() => {
            this.getAllList(this.currentNode, this.currentData);
          });
        } else {
          return;
        }
      }
  },
    props: {
      njList: {
        /** 年级类型列表数据**/
        type: Array,
        required: true
      },
      bjList: {
        /** 班级级类型列表数据**/
        type: Array,
        required: true
      },
      kcList: {
        /** 课程级类型列表数据**/
        type: Array,
        required: true
      },
      jsList: {
        /** 教师级类型列表数据**/
        type: Array,
        required: true
      }
    }
  };

</script>
<style scoped>
  .totalkc{width:100%; height:40px; line-height:40px; color:#449afc; text-align:right;}
  .bg-red{ background:#f00;}
</style>
