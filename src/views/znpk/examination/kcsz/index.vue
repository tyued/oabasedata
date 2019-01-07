<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-radio-group v-model="kcCurrentNjmc" @change="changeNj">
        <el-radio-button :label="item.njmc" :key="item.njdm" v-for="item in njArr">{{item.njmc}}</el-radio-button>
      </el-radio-group>
    </el-row>
    <div class="pk-kcsz-container">
      <div class="pk-kcsz-container-room pk-kcsz-box">
        <div class="clearfix pk-kcsz-title">
          <span>选择考场</span>
        </div>
        <div class="pk-kcsz-down">
          <div style="height: 580px;overflow-y: auto" class="smallscroll">
            <div v-for=" kcxx in kcArr" class="kcsz-pkbox" :style="{'background-color': kcxx.cdFlag ==='2' ? '#f5f7fa' : 'white'}" @click="selectingKc(kcxx)">
              <!-- 考场处于占用状态-->
              <div v-if="kcxx.cdFlag ==='2'" class="kcsz-idbox">
                <span>占</span>
              </div>
              <!--该考场该年级已经设置过-->
              <div v-if="kcxx.cdFlag ==='0'" class="kcsz-classbox">
                <i class="el-icon-check"></i>
              </div>
              <!-- 该考场处于空闲状态-->
              <div v-else-if="kcxx.cdFlag ==='1'" class="kcsz-classbox-empty"> </div>
              <!--根据考场状态不同显示不同提示信息-->
              <div v-if="kcxx.cdFlag ==='1'">
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">可容纳人数(位):{{kcxx.zws}}</div>
                  <div class="kcsz-contentbox">
                    <p>{{kcxx.kchm}}</p>
                  </div>
                </el-tooltip>
              </div>
              <!--显示该考场被占用的年级-->
              <div v-else-if="kcxx.cdFlag ==='2'">
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">占用年级:{{kcxx.syNjmc}}</div>
                  <div class="kcsz-contentbox">
                    <p>{{kcxx.kchm}}</p>
                  </div>
                </el-tooltip>
              </div>
              <!-- 已设置的考场不添加任何提示 -->
              <div v-else>
                <div class="kcsz-contentbox">
                  <p>{{kcxx.kchm}}</p>
                </div>
              </div>
            </div>
            <div class="dialog-footer" style="text-align: center;padding-top: 20px">
              <el-button style="margin-bottom:6px;" type="primary" @click="saveKc">确认生成考场</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="pk-kcsz-box">
        <div class="clearfix pk-kcsz-title">
          <!-- 如果考场总人数小于学生人数标记为红色 -->
          <span v-if="allStuNum - kcZws > 0 " style="color: red">学生人数/座位总数：{{allStuNum}}/{{kcZws}}</span>
          <span v-else>学生人数/座位总数：{{allStuNum}}/{{kcZws}}</span>
        </div>
        <div class="pk-kcsz-down">
          <div v-if="allStuNum - kcZws > 0 ">
            <el-alert style="margin: 4px 0 !important;" :closable="false" title=" 温馨提示：座位总数如果小于学生人数，会导致学生安排不到座位" type="warning" show-icon>
            </el-alert>
          </div>
          <el-table header-cell-class-name="dark-th" :data="yxKcArr" align="center" height="570" border style="width: 100%">
            <el-table-column prop="kskcmc" label="考场" align="center">
              <template slot-scope="scope">
                  <span v-if="scope.row.edit">
                    <el-input class="edit-input" size="small" v-model="scope.row.kskcmc" ref="inputRef" @blur="saveExaminationRoomName(scope.row)"></el-input>
                  </span>
                  <span v-else @click="changeExaminationRoomName(scope.row)">{{scope.row.kskcmc}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="kchm" label="考场号" align="center"></el-table-column>
            <el-table-column align="center" label="可容纳考生(位)">
              <template slot-scope="scope">
                <el-input-number size="mini" :min="0" :max="99999" v-model="scope.row.zws" @change="zwsChange"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getKsnj } from '@/api/znpk/examination/kssz/index';
import {
  getAllKc,
  bcKcSettings,
  getKcxxByKsidAndNjdm,
  getKsStuNum,
  delKcsz,
  checkDataByKsid,
  clearDataByKsid,
  updateExamRoomName
} from '@/api/znpk/examination/kcsz/index';
import jcsj from '@/api/jcsj.js';
export default {
  data() {
    return {
      xxdm: this.$route.query.xxdm,
      ksid: this.$route.query.ksid,  // 当前考试代码
      njArr: [], // 年级数组
      kcArr: [], // 所有考场信息
      yxKcArr: [], // 已选则的考场
      kcCurrentNjmc: '', // 当前年级名称
      kcCurrentNjdm: '', // 当前年级代码
      kcZws: 0, // 考场总座位数
      allStuNum: 0, // 考试学生总人数
      originalExameRoomName: '' // 原始考场名称
    };
  },
  created() {
    getKsnj({ ksdxid: this.ksid }).then(res => {
      if (!res) {
        return;
      } else {
        const njmcArr = [];
        // 封装年级数据
        for (const nj of res) {
          const njxx = {};
          const njmc = jcsj.hqnjmcByid(this.njList, nj);
          njxx.njdm = nj;
          njxx.njmc = njmc;
          njmcArr.push(njxx);
        }
        this.njArr = njmcArr;
        // 设置第一个年级为默认选中状态,并查询该年级的考试科目明细
        this.kcCurrentNjmc = this.njArr[0].njmc;
        this.kcCurrentNjdm = this.njArr[0].njdm;
        // 获取考场数据
        this.getKcsj();
        // 获取所有考试学生数量
        this.getAllStuNum();
      }
    });
  },
  methods: {
    // 改变年级重新获取考试科目信息
    changeNj() {
      // 获取当前年级名称
      this.kcCurrentNjdm = jcsj.hqnjdmBymc(this.njList, this.kcCurrentNjmc);
      // 获取考场数据
      this.getKcsj();
      // 获取所有考试学生数量
      this.getAllStuNum();
    },
    // 获取考场数据
    getKcsj() {
      getAllKc({
        ksid: this.ksid,
        xxdm: this.xxdm,
        njdm: this.kcCurrentNjdm
      }).then(res => {
        // 为占用状态的考场添加使用年级属性
        for (const kcxx of res) {
          let syNjmc = '';
          if (kcxx.cdFlag === '2') {
            // 循环处理年级名称
            for (const useNjdm of kcxx.njdm.split(',')) {
              if (syNjmc.length > 0) {
                // 拼接年级名称
                syNjmc = syNjmc + ',' + jcsj.hqnjmcByid(this.njList, useNjdm)
              } else {
                // 根据年级代码获取年级名称
                syNjmc = jcsj.hqnjmcByid(this.njList, useNjdm);
              }
            }
          }
          // 设置占用年级属性
          kcxx.syNjmc = syNjmc;
        }
        // 按考场状态排序
        const arrSortResult = _.sortBy(res, item => item.cdFlag);
        this.kcArr = arrSortResult;
        // 获取已设置的考场数据
        this.getYszKcxx();
      });
    },
    // 选择考场
    selectingKc(item) {
      // 如果是选中状态状态,改为取消状态
      if (item.cdFlag === '0') {
        item.cdFlag = '1';
        // 如果是空闲状态，则变为选中状态
      } else if (item.cdFlag === '1') {
        item.cdFlag = '0';
      }
    },
    // 确认生成考场信息
    saveKc() {
      // 筛选出已经选择的考场数据
      const selectedArr = _.filter(this.kcArr, { cdFlag: '0' });
      const that = this;
      // 清空考场座位数
      this.kcZws = 0;
      // 为选中的考场循环添加
      for (let i = 0; i < selectedArr.length; i++) {
        // 添加考场名称属性
        selectedArr[i].kskcmc = '第 ' + (i + 1) + ' 考场';
        // 添加年级代码为当前选择年级代码
        selectedArr[i].njdm = that.kcCurrentNjdm;
        // 设置考试id 为本次考试考试id
        selectedArr[i].ksid = that.ksid;
        // 设置学校代码
        selectedArr[i].xxdm = that.xxdm;
        // 设置默认监考老师数量
        selectedArr[i].jklssl = '1';
        // 设置默认分配方式
        selectedArr[i].fpfs = '0';
        // 选择考场总座位累加器
        that.kcZws += selectedArr[i].zws;
      }
      // 填充已选择考场数据数组
      this.yxKcArr = selectedArr;
      // 根据选择的考场数量判断执行逻辑
      if (selectedArr.length === 0) {
        // 删除历史数据
        delKcsz({ ksid: this.ksid, njdm: this.kcCurrentNjdm }).then(() => {
          // 刷新考场选择列表
          this.getKcsj();
        });
      } else {
        checkDataByKsid({ ksid: this.ksid }).then(res => {
          if (res) {
            this.$confirm('确定对座位数进行修改,并且清空监考设置和排考结果历史数据？（数据清空后无法恢复哦）', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              clearDataByKsid({ ksid: this.ksid }).then(() => {
                this.$notify({ title: '成功', message: '监考设置和排考结果数据已清空', type: 'success', duration: 2000 });
                bcKcSettings(this.yxKcArr).then(() => {
                  // 刷新已设置的考场数据
                  this.getKcsj();
                });
              });
            }).catch(() => {
                // nothing
            });
          } else {
            bcKcSettings(this.yxKcArr).then(() => {
              // 刷新已设置的考场数据
              this.getKcsj();
            });
          }
        });
      }
    },
    // 获取该年级设置的考场信息
    getYszKcxx() {
      getKcxxByKsidAndNjdm({ ksid: this.ksid, njdm: this.kcCurrentNjdm }).then(
        res => {
          // 计算考场总座位数
          this.calculateKcZws(res);
          // 填充已选择考场数据数组
          this.yxKcArr = res;
        }
      );
    },
    // 座位数改变事件
    zwsChange() {
      // 重新计算已设置的考场总座位数
      this.calculateKcZws(this.yxKcArr);
      checkDataByKsid({ ksid: this.ksid }).then(res => {
        if (res) {
          this.$confirm('确定对座位数进行修改,并且清空监考设置和排考结果历史数据？（规则条件清空后无法恢复哦）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            clearDataByKsid({ ksid: this.ksid }).then(() => {
              this.$notify({ title: '成功', message: '监考设置和排考结果数据已清空', type: 'success', duration: 2000 });
              bcKcSettings(this.yxKcArr).then(() => {
                // 刷新已设置的考场数据
                this.getYszKcxx();
              });
            });
          }).catch(() => {
            // 刷新已设置的考场数据
            this.getYszKcxx();
          });
        } else {
          bcKcSettings(this.yxKcArr).then(() => {
            // 刷新已设置的考场数据
            this.getYszKcxx();
          });
        }
      });
    },
    // 计算考场总座位数
    calculateKcZws(yszKcArr) {
      const that = this;
      that.kcZws = 0;
      for (const yszKc of yszKcArr) {
        that.kcZws += yszKc.zws;
      }
    },
    // 获取所有考试学生数量
    getAllStuNum() {
      // 请求获取学生总人数
      getKsStuNum({ ksid: this.ksid, njdm: this.kcCurrentNjdm }).then(res => {
        // 给学生总人数赋值
        this.allStuNum = res;
      });
    },
    // 修改考场名称
    changeExaminationRoomName(row) {
      // 添加edit 属性并赋值（解决视图不刷新的问题）
      this.$set(row, 'edit', true);
      // 原始考场名称用来判断是否更新的标志
      this.originalExameRoomName = row.kskcmc;
      // 设置延迟
      setTimeout(() => {
        // 让input 获得焦点
        this.$refs.inputRef.focus()
      }, 500)
    },
    // 保存考场名称
    saveExaminationRoomName(row) {
      if (row.kskcmc !== this.originalExameRoomName) {
        // 筛选出同名的考场数组
        const sameNameArr = _.filter(this.yxKcArr, { kskcmc: row.kskcmc });
        // 判断设置考场名称是否重复,重复则提示重复,不重复保存数据修改信息
        if (sameNameArr.length > 1) {
          // 让input 获得焦点
          this.$refs.inputRef.focus();
          this.$notify({ title: '警告', message: '考场名称冲突', type: 'warning', duration: 2000 });
        } else if (row.kskcmc.trim().length === 0) {
          // 让input 获得焦点
          this.$refs.inputRef.focus();
          this.$notify({ title: '警告', message: '考场名称不能为空', type: 'warning', duration: 2000 });
        } else if (row.kskcmc.length > 50) {
          // 让input 获得焦点
          this.$refs.inputRef.focus();
          this.$notify({ title: '警告', message: '考场名称过长', type: 'warning', duration: 2000 });
        } else {
          // 更新考场设置信息
          updateExamRoomName(row).then(res => {
            console.log(res);
            if (res.status === 200) {
              // 刷新输入框状态
              this.$set(row, 'edit', false);
              this.$notify({ title: '成功', message: '考场名称修改成功', type: 'success', duration: 2000 });
            } else {
              this.$notify({ title: '失败', message: res.message, type: 'warning', duration: 2000 });
            }
          })
        }
      } else {
        // 刷新输入框状态
        this.$set(row, 'edit', false);
      }
    }
  },
  props: {
    kcList: {
      /** 课程级类型列表数据**/
      type: Array,
      required: true
    },
    njList: {
      /** 课程级类型列表数据**/
      type: Array,
      required: true
    }
  }
};
</script>
<style>
.pk-kcsz-container .dark-th {
  background-color: #f5f7fa;
}
.pk-kcsz-container {
  position: relative;
  padding-left: 824px;
}
.pk-kcsz-container-room {
  position: absolute;
  left: 0;
  top: 0;
  width: 802px;
}
.pk-kcsz-title {
  padding: 0 21px;
  height: 34px;
  background-color: #f5f7fa;
  line-height: 34px;
}
.pk-kcsz-down {
  /* padding: 10px 0 10px 10px; */
}
.pk-kcsz-box {
  /* border-radius: 6px; */
  border-radius: 6px 6px 0 0;
  overflow: hidden;
  /* border: 1px solid #f5f7fa; */
}
.pk-kcsz-box:first-child {
  border: 1px solid #ebeef5;
}
.pk-kcsz-box:nth-child(2) .pk-kcsz-title {
  border: 1px solid #ebeef5;
  border-bottom: none;
}
.kcsz-pkbox {
  display: inline-block;
  vertical-align: middle;
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
  margin-top: 10px;
  margin-left: 10px;
  background-color: #f5f7fa;
}
.kcsz-pkbox:after {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 8px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 1px solid #ebeef5;
  border-bottom: none;
}
/* 一行六个。用来控制每行第一个左边距为0 */
.kcsz-idbox {
  position: absolute;
  top: 0;
  left: 0;
  width: 25%;
  padding: 2px;
  border-bottom-right-radius: 6px;
  background-color: #fff;
}
.kcsz-classbox {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 18px;
  padding: 2px;
  font-weight: normal;
  color: #fff;
  background-color: #409eff;
  border-radius: 50%;
}
.kcsz-classbox-empty {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 18px;
  padding: 2px;
  font-weight: normal;
  color: #409eff;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #409eff;
}
.kcsz-classbox-empty-gray {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 18px;
  padding: 2px;
  font-weight: normal;
  color: #fff;
  background-color: #eee;
  border-radius: 50%;
  border: 1px solid #999;
}
.kcsz-classbox i,
.kcsz-classbox-empty i,
.kcsz-classbox-empty-gray i {
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  line-height: 18px;
}
.kcsz-contentbox {
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  line-height: 18px;
}
.kcsz-contentbox p {
  word-wrap: break-word;
}
</style>
