<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-radio-group v-model="kcCurrentNjmc" @change="changeNj">
        <el-radio-button :label="item.njmc" :key="item.njdm" v-for="item in njArr">{{item.njmc}}</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix pk-title">
        <span>设置人数统计</span>
      </div>
      <el-row>
        <span style="font-size: large">{{kcCurrentNjmc}}学生总人数为 {{allStuNum}} 人</span>
        <div style="margin-top: 20px;"  v-for='(item,index) in tjArr' >
          <el-select v-model="item.tjbj" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input-number v-model="item.tjbl" controls-position="right" :min="1" :max="100" label="" ></el-input-number><span>%人数</span>
            <span v-if="index !==0">
              <el-button size="medium"  @click="delTj(index)" plain >删除</el-button>
            </span>
        </div>
        <div style="margin-top: 10px">
          <el-button size="medium" type="primary"  @click="addTj" plain>新增</el-button>
          <el-button  size="medium" type="danger"  @click="clear" plain>清空</el-button>
          <el-button size="medium" type="success"  @click="saveTjsz" plain>保存</el-button>
        </div>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import { getKsnj } from '@/api/znpk/examination/kssz/index';
  import { getTjsz, saveTjsz } from '@/api/ksgl/kswh/kstj/index';
  import jcsj from '@/api/jcsj.js';
  import { getKsStuNum } from '@/api/znpk/examination/kcsz/index';
  export default {
    data() {
      return {
        ksid: this.$route.query.ksid,
        xxdm: window.localStorage.getItem('xxdm'),
        njArr: [], // 年级数组
        kcCurrentNjmc: '', // 当前年级名称
        kcCurrentNjdm: '', // 当前年级代码
        allStuNum: 0, // 考试学生总人数
        tjArr: [], // 统计分项数组
        options: [{
          value: 'before',
          label: '前'
        }, {
          value: 'after',
          label: '后'
        }],
        value: ''
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
          if (this.njArr.length > 0) {
            this.kcCurrentNjmc = this.njArr[0].njmc;
            this.kcCurrentNjdm = this.njArr[0].njdm;
          }
          // 获取本次考试该年级统计设置信息
          this.getKstjData();
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
        // 获取本次考试该年级统计设置信息
        this.getKstjData();
        // 获取所有考试学生数量
        this.getAllStuNum();
      },
      // 获取所有考试学生数量
      getAllStuNum() {
        // 请求获取学生总人数
        getKsStuNum({ ksid: this.ksid, njdm: this.kcCurrentNjdm }).then(res => {
          // 给学生总人数赋值
          this.allStuNum = res;
        });
      },
      // 获取考试统计信息
      getKstjData() {
        // 请求获取学生总人数
        getTjsz({ ksid: this.ksid, njdm: this.kcCurrentNjdm }).then(res => {
          this.tjArr = res;
        });
      },
      saveTjsz() {
        const that = this;
        if (that.tjArr.length === 0) {
        //
        } else {
          that.tjArr.forEach(item => {
            item.ksid = that.ksid;
            item.njdm = that.kcCurrentNjdm;
            item.xxdm = that.xxdm;
          });
          // 保存设置信息
          saveTjsz(that.tjArr).then(res => {
            console.log(res);
            if (res.status === 200) {
              this.$notify({ title: '成功', message: this.kcCurrentNjmc + '统计设置保存成功', type: 'success', duration: 2000 });
              this.getKstjData();
            } else {
              this.$notify({ title: '失败', message: this.kcCurrentNjmc + '统计设置保存失败', type: 'error', duration: 2000 });
            }
          });
        }
      },
      addTj() {
        this.tjArr.push({});
      },
      clear() {
        this.tjArr = [];
      },
      delTj(value) {
        this.tjArr.splice(value, 1);
      }
    },
    props: {
      njList: {
        /** 课程级类型列表数据**/
        type: Array,
        required: true
      }
    }
  };
</script>
<style scoped>

</style>

