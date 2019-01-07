<template>
  <div class="pk-container smallscroll ksxt_kctz">
    <el-alert class="pk-alert" title="提示：1.可将考场中的考生拖入暂存区；2.可将暂存取得学生拖入考场"
              type="error" close-text="知道了">
    </el-alert>
    <el-row class="table-container smallscroll clearfix">
      <div class="pk-card">
        <el-row class="pk-title">选择考场</el-row>
        <div class="pk-title-down smallscroll">
          <el-tabs tab-position="right" v-model="dqKcid" @tab-click="handleTabClick">
            <el-tab-pane :name="item.uuid" v-for="(item, index) in kcList" :key="item.uuid">
              <span slot="label">{{item.kskcmc}}({{item.kchm}})</span>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="pk-card">
        <el-row class="pk-title">
          {{dqNjmc}}{{dqKcdx.kskcmc}}&nbsp;&nbsp;考场号：{{dqKcdx.kchm}}
        </el-row>
        <el-row class="pk-title-down pk-content smallscroll" >
          <div class="pk-border pkbox left-item"
               draggable="true"  @dragstart='drag($event, item)' @drop="drop($event, item)" @dragover="allowDrop($event)"
               v-for="(item, index) in kcxszwArr" :key="item.uuid" :class="item.classObject2" v-if="item.kskcid === dqKcid">
            <div class="idbox" :class="item.classObject1">
              <span>{{item.zwh}}</span>
            </div>
            <template v-if="item.xszt === '0'">
              <div class="contentbox">
                <p>{{item.xsxm}}</p>
                <span>{{item.bjmc}}</span>
              </div>
            </template>
          </div>
        </el-row>
      </div>
      <div class="pk-card">
        <el-row class="pk-title">暂存区</el-row>
        <div class="pk-title-down pk-content smallscroll" >
          <div class="pk-border pkbox left-item"
               draggable="true" @dragstart='drag($event, item)' @drop="drop($event, item)" @dragover="allowDrop($event)"
               v-for="(item, index) in temporayKcxsxxArr" :key="item.uuid" :class="item.classObject3" >
            <template>
              <div class="contentbox">
                <p>{{item.xsxm}}</p>
                <span>{{item.bjmc}}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
  import { getKcxsxxByKskcid, getTemporaryKcxsxx, replaceKcxsxx, saveKcxsxx } from '@/api/znpk/examination/pktz/index';
  import { getKskc } from '@/api/znpk/examination/ckpk/index';
  import jcsj from '@/api/jcsj';
  export default {
    data() {
      return {
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,  // 当前考试代码
        dqNjdm: '', // 当前年级代码
        dqNjmc: '', // 当前年级名称
        kcList: [], // 考场对象数组
        dqKcid: '', // 当前考场代码
        dqKcdx: {}, // 当前考场对象
        dragData: {}, // 当前拖动对象
        kcxszwArr: [], // 当前年级考生座位对象数组
        temporayKcxsxxArr: [] // 当前年级暂存考生对象数组
      };
    },
    methods: {
      handleTabClick() {
        this.dqKcdx = _.find(this.kcList, { uuid: this.dqKcid });
        // this.getNormalKcxsxx();
      },
      drag(event, data) {
        this.dragData = data;
      },
      drop(event, data) {
        event.preventDefault();
        // 排除无意义拖拽: 空座位，暂存学生的空座位，暂存区空位
        if (!this.dragData.xh || (this.dragData.xh && this.dragData.xszt === '1' && this.dragData.normal)) {
          // alert('无意义的拖拽');
          return false;
        }
        if (this.dragData.xszt === '0') { // 拖动对象是正常学生
          if (!data.normal && data.xszt === '1') { // 目标是暂存区但不是空位
            // alert('该位置已被占用');
            this.$notify({ message: '该位置已被占用', type: 'error', duration: 2000 });
            return false;
          }
          if (data.normal) { // 1.与正常学生替换 2.与空座位替换 3.与暂存学生的空座位替换
            if (this.dragData.zwh === data.zwh) {
              return false;
            }
            const params = {
              sourceUUid: this.dragData.uuid,
              sourceZwh: this.dragData.zwh,
              targetUUid: data.uuid,
              targetZwh: data.zwh };
            replaceKcxsxx(params).then(res => {
              if (res.status === 200) {
                // 更新学生座位列表
                const sourceZwh = this.dragData.zwh;
                const targetZwh = data.zwh;
                const arr = this.kcxszwArr;
                for (const item of arr) {
                  if (item.uuid === this.dragData.uuid) {
                    item.zwh = targetZwh;
                  }
                  if (item.uuid === data.uuid) {
                    item.zwh = sourceZwh;
                  }
                }
                this.kcxszwArr = _.sortBy(arr, item => item.zwh);
                if (data.xszt === '1') { // 如果目标是暂存学生的空座位
                  for (const item of this.temporayKcxsxxArr) {
                    if (item.uuid === data.uuid) {
                      item.zwh = sourceZwh;
                    }
                  }
                }
                // this.getNormalKcxsxx();
                // this.getTemporaryKcxsxx();
              }
            });
          } else { // 目标是暂存区的空位，更改暂存状态
            const params = {
              uuid: this.dragData.uuid,
              xszt: '1' };
            saveKcxsxx(params).then(res => {
              if (res.status === 200) {
                // 更新学生座位列表
                for (const item of this.kcxszwArr) {
                  if (item.uuid === this.dragData.uuid) {
                    item.xszt = '1';
                    item.classObject1.empty1 = true;
                    item.classObject2.empty2 = true;
                    // 更新暂存区学生列表，添加该暂存学生
                    const tempo = JSON.parse(JSON.stringify(item)); // 深拷贝
                    delete tempo.classObject1;
                    delete tempo.classObject2;
                    tempo.classObject3 = { tempo: true };
                    tempo.normal = false;
                    let tempoArr = this.temporayKcxsxxArr;
                    tempoArr.unshift(tempo);
                    // 按班级名称排序
                    // this.temporayKcxsxxArr = _.sortBy(tempoArr, item => item.bjmc);
                    tempoArr = _.remove(tempoArr, item => item.classObject3.tempo === true);
                    tempoArr = jcsj.sortObjectByStr(tempoArr, 'bjmc');
                    for (let i = 0; i < 12; i++) {
                      tempoArr.push({ normal: false, classObject3: { tempo: false } });
                    }
                    this.temporayKcxsxxArr = tempoArr;
                  }
                }
                // this.getNormalKcxsxx();
                // this.getTemporaryKcxsxx();
              }
            });
          }
        } else { // 拖动对象是暂存学生
          if (!data.normal) { // 与暂存学生或暂存区空位替换
            // alert('暂存区之间的对象拖拽无意义');
            return false;
          }
          if (data.xh && data.xszt === '0') { // 与正常学生替换
            // alert('该位置已被占用');
            this.$notify({ message: '该位置已被占用', type: 'error', duration: 2000 });
            return false;
          } else { // 与空座位或暂存学生的空座位替换
            const params = {
              sourceUUid: this.dragData.uuid,
              sourceZwh: this.dragData.zwh,
              sourceKskcid: this.dragData.kskcid,
              targetUUid: data.uuid,
              targetZwh: data.zwh,
              targetKskcid: data.kskcid,
              targetXszt: '0' };
            replaceKcxsxx(params).then(res => {
              if (res.status === 200) {
                // 更新学生座位列表
                const sourceZwh = this.dragData.zwh;
                const sourceKskcid = this.dragData.kskcid;
                const targetZwh = data.zwh;
                const targetKskcid = data.kskcid;
                const arr = this.kcxszwArr;
                for (const item of arr) {
                  if (item.uuid === this.dragData.uuid) {
                    item.zwh = targetZwh;
                    item.kskcid = targetKskcid;
                    item.xszt = '0';
                    item.classObject1.empty1 = false;
                    item.classObject2.empty2 = false;
                    // 更新暂存区学生列表，删除该暂存学生
                    const tempoArr = this.temporayKcxsxxArr;
                    for (let i = 0; i < tempoArr.length; i++) {
                      if (tempoArr[i].uuid === this.dragData.uuid) {
                        tempoArr.splice(i, 1);
                      }
                    }
                    this.temporayKcxsxxArr = tempoArr;
                  }
                  if (item.uuid === data.uuid) {
                    item.zwh = sourceZwh;
                    item.kskcid = sourceKskcid;
                  }
                }
                this.kcxszwArr = _.sortBy(arr, item => item.zwh);
                if (data.xszt === '1') { // 如果目标是暂存学生的空座位
                  for (const item of this.temporayKcxsxxArr) {
                    if (item.uuid === data.uuid) {
                      item.zwh = sourceZwh;
                      item.kskcid = sourceKskcid;
                    }
                  }
                }
                // this.getNormalKcxsxx();
                // this.getTemporaryKcxsxx();
              }
            });
          }
        }
      },
      allowDrop(event) {
        event.preventDefault();
      },
      cxkcxsByNj(dqNjdm) {
        this.dqNjdm = dqNjdm;
        if (this.dqNjdm !== '') {
          this.dqNjmc = _.find(this.njList, { njdm: this.dqNjdm }).njmc;
          const params = { ksid: this.ksid, njdm: this.dqNjdm };
          getKskc(params).then(res => {
            if (res.length > 0) {
              this.kcList = res;
              // 初始化默认选中考场
              this.dqKcdx = res[0];
              this.dqKcid = res[0].uuid;
              // 查询考生信息
              this.getNormalKcxsxx();
              this.getTemporaryKcxsxx();
            } else {
              this.kcList = [];
              this.kcxszwArr = [];
              this.temporayKcxsxxArr = [];
            }
          })
        }
      },
      getNormalKcxsxx() {
        // this.kcxszwArr = [];
        const params = { ksid: this.ksid, njdm: this.dqNjdm };
        getKcxsxxByKskcid(params).then(res => {
          if (res.data.length > 0) {
            for (const kcxsxx of res.data) {
              kcxsxx.bjmc = jcsj.hqbjmcByid(this.bjList, kcxsxx.bjdm);
              kcxsxx.normal = true; // 表示出现在非暂存区
              if (kcxsxx.xh && kcxsxx.xszt === '0') { // 样式控制
                kcxsxx.classObject1 = { empty1: false };
                kcxsxx.classObject2 = { empty2: false };
              } else {
                kcxsxx.classObject1 = { empty1: true };
                kcxsxx.classObject2 = { empty2: true };
              }
            }
            this.kcxszwArr = res.data;
            // console.log('学生座位列表');
            // console.log(this.kcxszwArr);
          } else {
            this.kcxszwArr = [];
          }
        });
      },
      getTemporaryKcxsxx() {
        // this.temporayKcxsxxArr = [];
        const params = { ksid: this.ksid, njdm: this.dqNjdm };
        getTemporaryKcxsxx(params).then(res => {
          let arr = res.data;
          for (const obj of arr) {
            obj.bjmc = jcsj.hqbjmcByid(this.bjList, obj.bjdm);
            obj.normal = false;// 表示出现在暂存区
            obj.classObject3 = { tempo: true }; // 样式控制
          }
          // 按班级名称排序
          // arr = _.sortBy(arr, item => item.bjmc);
          arr = jcsj.sortObjectByStr(arr, 'bjmc');
          // 添加预留暂存区空位
          for (let i = 0; i < 12; i++) {
            arr.push({ normal: false, classObject3: { tempo: false } });
          }
          this.temporayKcxsxxArr = arr;
          // console.log('暂存区学生列表');
          // console.log(this.temporayKcxsxxArr);
        });
      }
    },
    props: {
      njList: {
        /** 年级列表数据**/
        type: Array,
        required: true
      },
      bjList: {
        /** 班级列表数据**/
        type: Array,
        required: true
      }
    }
  };
</script>

<style scoped>
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    padding: 1px 0;
    list-style: none;
  }
  .pk-container {
    width: 100%;
    overflow-x: auto;
  }
  .table-container {
    /* width: 1500px; */
    overflow-x: auto;
  }
  .pk-card {
    float: left;
    vertical-align: middle;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #ebeef5;
  }
  .pk-card:nth-child(1) {
    width: 12%;
  }
  .pk-card:nth-child(2) {
    width: 53%;
    max-width: 824px;
    margin-left: 18px;
  }
  .pk-card:nth-child(3) {
    float: right;
    width: 33%;
    max-width: 432px;
  }
  .pk-alert {
    /* margin-top: 10px; */
    margin-bottom: 15px;
  }
  .pk-title {
    padding: 0 21px;
    height: 34px;
    background-color: #f5f7fa;
    line-height: 34px;
  }
  .pk-title-down {
    padding: 10px;
    height: 695px;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .pkbox {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    display: inline-block;
    position: relative;
    width: 120px;
    height: 120px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    overflow: hidden;
    color: #666666;
    font-weight: bold;
    text-align: center;
    font-size: 14px;
    vertical-align: middle;
  }
  .idbox {
    position: absolute;
    top: 0;
    left: 0;
    width: 25%;
    padding: 2px;
    border-bottom-right-radius: 6px;
    background-color: #f5f7fa;
  }
  /*.classbox {
    position: absolute;
    top: 0;
    right: 0;
    padding: 2px;
    font-weight: normal;
  }*/
  .contentbox {
    position: absolute;
    width: 100%;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    line-height: 1em;
  }
  .contentbox p {
    word-wrap:break-word;
  }
  .pk-border{
    color: #666666;
    border-color: #ebeef5;
    margin: 5px;
  }
  .pk-content{
    padding-left: 15px;
    padding-right: 15px;
  }
  .empty1{
    color: #63c249;
    background-color: #eff9ec;
  }
  .empty2{
    border: 1px dashed #d3eecc;
  }
  .tempo{
    background-color: #f4f4f4;
    border: 1px solid #ebeef5;
  }

</style>
