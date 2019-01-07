<template>
  <div class="content-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/examManager/examination' }">我的排考</el-breadcrumb-item>
      <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pkprocess">
      <div class="pkprocessMain">
        <div class="pkprocessLine"></div>
        <div class="pkstep" v-for="(item,index) in moduleSet" :key="index" @click="handleClick(index)"
             :class="{ activ: item.className }">
          <div :class="'pkstepicon pkicon-'+ (index+1)"></div>
          <div class="pksteptit">{{item.moduleName}}</div>
        </div>
      </div>
    </div>
    <el-card shadow="hover">
      <keep-alive>
        <component
          ref="childs"
          :is="curComponent"
          v-bind:nj-list="njList"
          v-bind:bj-list="bjList"
          v-bind:kc-list="kcList"
          v-bind:js-list="jsList"
          v-bind:jsz-list="jszList"
          @ee="handleClick">
        </component>
      </keep-alive>
    </el-card>
  </div>
</template>
<script>
  /* eslint-disable array-callback-return,object-curly-spacing */
  import jcsj from '@/api/jcsj'
  import kssz from '@/views/znpk/examination/kssz/index';
  import kcsz from '@/views/znpk/examination/kcsz/index';
  import khsz from '@/views/znpk/examination/khsz/index';
  import jksz from '@/views/znpk/examination/jksz/index';
  import znpk from '@/views/znpk/examination/znpk/index';
  import pktz from '@/views/znpk/examination/pktz/index';
  import pkjg from '@/views/znpk/examination/ckpk/index';
  import {dqxnxqObj} from '@/api/pkxt/arrangingTask/index';
  import { synchronousStuData, getModuleUp } from '@/api/znpk/examination/index';

  export default {
    components: { kssz, kcsz, khsz, jksz, znpk, pktz, pkjg },
    data() {
      return {
        index: 0,
        name: this.$route.query.ksmc,
        xxdm: this.$route.query.xxdm,
        dqxn: this.$route.query.dqxn,
        ksid: this.$route.query.ksid,
        curComponent: 'kssz', // 默认点亮加载基础设置模块
        activeIndex: 0, // 当前激活模块索引
        activClass: '', // 模块点亮选中样式
        moduleSet: [
          {
            index: 0,
            moduleName: '考试设置',
            className: true,
            subComponentName: 'kssz'
          },
          {
            index: 1,
            moduleName: '考场设置',
            className: false,
            subComponentName: 'kcsz'
          },
          {
            index: 2,
            moduleName: '考号设置',
            className: false,
            subComponentName: 'khsz'
          },
          {
            index: 3,
            moduleName: '监考设置',
            className: false,
            subComponentName: 'jksz'
          },
          {
            index: 4,
            moduleName: '智能排考',
            className: false,
            subComponentName: 'znpk'
          },
          {
            index: 5,
            moduleName: '排考调整',
            className: false,
            subComponentName: 'pktz'
          }, {
            index: 6,
            moduleName: '排考结果',
            className: false,
            subComponentName: 'pkjg'
          }
        ],
        njList: [],
        bjList: [],
        kcList: [],
        jsList: [],
        jszList: [],
        njArr: []
      }
    },
    created() {
      /** 初始化基础数据**/
      jcsj.remove(jcsj.BJ_KEY);
      jcsj.remove(jcsj.NJ_KEY);
      jcsj.remove(jcsj.KC_KEY);
      jcsj.remove(jcsj.JS_KEY);
      jcsj.remove(jcsj.JSZ_KEY);
      this.xxdm = window.localStorage.getItem('xxdm');
      this.abc();
      this.whXsxxData();
    },
    methods: {
      async abc() {
        await dqxnxqObj({ xxdm: this.xxdm }).then(response => {
          this.dqxn = response.xn;
          this.dqxq = response.xq;
        })
        const parm = { xxdm: this.xxdm, xn: this.dqxn }
        /** 获取年级**/
        jcsj.hqnjlb(parm).then(res => {
          this.njList = res;
        })
        /** 获取班级**/
        jcsj.hqbjlb(parm).then(res => {
          this.bjList = res;
        })
        /** 获取课程**/
        jcsj.hqkclb(parm).then(res => {
          this.kcList = res;
        })
        /** 获取教师**/
        jcsj.hqjslb(parm).then(res => {
          this.jsList = res;
        })
        /** 获取教师组**/
        const v = { xxdm: this.xxdm };
        jcsj.hqjszlb(v).then(res => {
          this.jszList = res;
        })
        this.handleClick(this.index);
      },
      handleClick(i) {
        const index = parseInt(i);
        if (index === 0 || index === 2) {
          /** 点亮样式方法**/
          this.lightClassModule(index);
        } else {
          /** 点亮验证**/
          this.handleValidateButton(index);
        }
      },
      handleValidateButton(index) {
        // 不开启点亮验证
        // this.lightClassModule(index);
        // 开启点亮验证
        getModuleUp({ index, ksid: this.ksid }).then(res => {
          if (res.data) { // 通过验证
            this.lightClassModule(index);
          } else { // 没有通过验证
            let message = '';
            if (index === 5 || index === 6) {
              message = '请先完成智能排考模块后再点亮该模块';
            }
            if (index === 3 || index === 4) {
              message = '请先完成考场设置模块后再点亮该模块';
            }
            if (index === 1) {
              message = '请先完成考试时间模块后再点亮该模块';
            }
            this.$alert('<strong>' + message + '</strong>', '温馨提示', {
              type: 'warning',
              dangerouslyUseHTMLString: true
            });
          }
        });
      },
      lightClassModule(index) { // 点亮指定模块
        this.moduleSet.map(item => {
          if (item.index === index) {
            item.className = true;
            this.curComponent = item.subComponentName;
          } else {
            item.className = false;
          }
        });
        /** 默认初始化到模块的第一个子页面 **/
        this.$nextTick(() => {
          if (index === 2) { /** 考号设置 **/
            this.$refs.childs.getKhszList();
          }
          if (index === 3) { /** 监考设置 **/
            this.$refs.childs.handleClick();
          }
          if (index === 5) { /** 排考调整 **/
            this.$refs.childs.handleClick();
          }
          if (index === 6) { /** 排考结果 **/
            this.$refs.childs.handleClick();
          }
        });
      },
      // 同步参加考试的学生数据
      whXsxxData() {
        synchronousStuData({ksid: this.ksid}).then(() => {
          console.log('success');
        });
      }
    }
  };
</script>
<style scoped>
  .content-container {
    padding: 20px;
  }

  .pkprocess {
    width: 100%;
    height: 100px;
    padding: 0 50px;
    position: relative;
  }

  .pkprocessMain {
    margin-top: 4px;
    width: 100%;
    height: 100px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .pkprocessMain .pkstep {
    cursor: pointer;
    width: 75px;
    display: block;
    text-align: center;
    color: #666;
    font-size: 16px;
    color: #666;
    position: relative;
    z-index: 10;
  }

  .pkprocessLine {
    width: 95%;
    height: 2px;
    background: #bfc2ca;
    margin-top: 30px;
    position: absolute;
    left: 2.5%;
  }

  .pkstepicon {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: #c0c4cc;
    border: 10px solid #fff;
    margin: 0 auto;
  }

  .pksteptit {
    font-size: 16px;
    color: #c0c4cc;
  }

  .pkicon-1 {
    background: url("/static/img/dot-pkxt-1.png") #c0c4cc no-repeat center;
  }

  .pkicon-2 {
    background: url("/static/img/dot-pkxt-map.png") #c0c4cc no-repeat center;
  }

  .pkicon-3 {
    background: url("/static/img/dot-pkxt-number.png") #c0c4cc no-repeat center;
    background-size: 20px;
  }

  .pkicon-4 {
    background: url("/static/img/dot-pkxt-eye.png") #c0c4cc no-repeat center;
    background-size: 20px;
  }

  .pkicon-5 {
    background: url("/static/img/dot-pkxt-3.png") #c0c4cc no-repeat center;
  }

  .pkicon-6 {
    background: url("/static/img/dot-pkxt-4.png") #c0c4cc no-repeat center;
  }

  .pkicon-7 {
    background: url("/static/img/dot-pkxt-2.png") #c0c4cc no-repeat center;
  }

  .pkprocessMain .pkstep.activ .pksteptit {
    font-size: 16px;
    color: #449afc;
  }

  .pkprocessMain .pkstep.activ .pkstepicon {
    background-color: #449afc;
  }
</style>
