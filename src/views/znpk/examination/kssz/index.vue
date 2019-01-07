<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-radio-group v-model="currentNjmc" @change="changeNj">
        <el-radio-button :label="item.njmc" :key="item.njdm" v-for="item in njArr">{{item.njmc}}</el-radio-button>
      </el-radio-group>
    </el-row>
    <div style="padding-bottom: 10px">
      <el-alert
        style="margin: 4px 0 !important;"
        title=" 温馨提示，请合理安排考试时间，避免同年级各科目考试时间冲突的情况"
        type="warning"  show-icon>
      </el-alert>
    </div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>设置考试时间</span>
      </div>
      <div class="text item" style="text-align: center;height: 500px;overflow-y: auto">
        <el-form :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm"  >
          <el-form-item :label="item.kcmc" v-for="item in kcArr" :key="item.jlid">
            <el-row>
              <el-col :span="4">
                <el-form-item >
                  <el-date-picker  placeholder="选择日期" v-model="item.ksrq"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-time-select placeholder="考试开始时间" v-model="item.kmkssj" :editable="editableFlag" :picker-options="{ start: '07:00', step: '00:05', end: '20:00' ,maxTime: item.kmjssj}"></el-time-select>
              </el-col>
              <el-col :span="4">
                <el-time-select placeholder="考试结束时间" v-model="item.kmjssj" :editable="editableFlag" :picker-options="{start: '07:00',step: '00:05',end: '20:00',minTime: item.kmkssj}"></el-time-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="submitForm">保存考试设置</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import { getKskmxx,updateKskmxx,
            getKsnj, checkDataByKsid,
            clearDataByKsid} from '@/api/znpk/examination/kssz/index';
  import jcsj from '@/api/jcsj.js';
  import { dqxnxqObj } from '../../../../api/admin/acadyear';
  import { formatDate } from '@/utils';
  export default {
    data() {
      return {
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,  // 当前考试代码
        njArr: [],
        kcArr: [],
        njList: [],
        currentNjmc: '',
        currentNjdm: '',
        dqxn: '',
        dqxq: '',
        editableFlag: false,
        ruleForm: {
          date1: '',
          value4: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
        },
        rules: {
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ]
        }
      };
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        this.dqxn = response.xn;
        this.dqxq = response.xq;
      })
      const parm = { xxdm: this.xxdm, xn: this.dqxn }
      /** 获取年级**/
      jcsj.hqnjlb(parm).then(res => {
        this.njList = res;
        /** 获取课程**/
        jcsj.hqkclb({ xxdm: this.xxdm }).then(res => {
          this.kcList = res;
          this.getNjArr();
        });
      });
    },
    methods: {
      // 提交考试科目时间信息
      submitForm() {
        const that = this;
        // 格式化考试日期
        for (const kcxx of this.kcArr) {
          const ksrq = that.formatDate(kcxx.ksrq);
          kcxx.ksrq = ksrq;
        }
        checkDataByKsid({ ksid: this.ksid }).then(res => {
          if (res) {
            this.$confirm('确定对考试科目时间进行修改,并且清空考场设置、监考设置和排考结果历史数据？（数据清空后无法恢复哦）', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              clearDataByKsid({ ksid: this.ksid }).then(() => {
                this.$notify({ title: '成功', message: '考场设置、监考设置和排考结果数据已清空', type: 'success', duration: 2000 });
                that.saveKskmxx();
                that.getNjArr();
              });
            }).catch(() => {
              that.getNjArr();
            });
          } else {
            that.saveKskmxx();
          }
        });
      },
      // 保存考试科目时间信息
      saveKskmxx() {
        updateKskmxx(this.kcArr).then(res => {
          if (res.status === 200) {
            this.$notify({ title: '成功', message: this.currentNjmc + '考试时间保存成功', type: 'success', duration: 2000 });
          } else {
            this.$notify({ title: '失败', message: this.currentNjmc + '考试时间保存失败', type: 'error', duration: 2000 });
          }
        });
      },
      // 格式化时间
      formatDate(time) {
      /** 过滤时间格式**/
        const date = new Date(time);
        // 验证考试日期是否为空
        if (time) {
          return formatDate(date, 'yyyy-MM-dd');
        } else {
          return null;
        }
      },
      // 获取此次考试年级
      getNjArr() {
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
              njmcArr.push(njxx)
            }
            this.njArr = njmcArr;
          // 设置第一个年级为默认选中状态,并查询该年级的考试科目明细
            this.currentNjmc = this.njArr[0].njmc;
            this.currentNjdm = this.njArr[0].njdm;
            this.getKskmmx();
          }
        })
      },
      // 根据年级代码获取此次考试的科目信息
      getKskmmx() {
        getKskmxx({ njdm: this.currentNjdm, ksdxid: this.ksid }).then(res => {
          const kskmxxArr = [];
        // 封装考试科目信息(查询科目名称)
          for (const kskmxx of res.data.rows) {
            const kcmc = jcsj.hqkcmcByid(this.kcList, kskmxx.kcdm);
            kskmxx.kcmc = kcmc;
            kskmxxArr.push(kskmxx);
          }
          this.kcArr = kskmxxArr;
        });
      },
      // 改变年级重新获取考试科目信息
      changeNj() {
        this.currentNjdm = jcsj.hqnjdmBymc(this.njList, this.currentNjmc);
        this.getKskmmx();
      }
    }
  }
</script>
