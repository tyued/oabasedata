<template>
  <div class="content-container pkxt-pksz">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/arrangingManager/arrangingTask' }">我的任务</el-breadcrumb-item>
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
          ref="child"
          :is="curComponent"
          v-bind:nj-list="njList"
          v-bind:bj-list="bjList"
          v-bind:kc-list="kcList"
          v-bind:js-list="jsList"
          v-bind:jsz-list="jszList"
          @ee="handleClick"
        ></component>
      </keep-alive>
    </el-card>
  </div>
</template>
<script>
  /* eslint-disable array-callback-return,object-curly-spacing */
  import { getModuleUp } from '@/api/pkxt/arrangingTask/pksz';
  import jcsz from '@/views/pkxt/arrangingTask/jcsz/index';
  import gztj from '@/views/pkxt/arrangingTask/gztj/index';
  import zdpk from '@/views/pkxt/arrangingTask/zdpk/index';
  import pktz from '@/views/pkxt/arrangingTask/pktz/index';
  import ckkb from '@/views/pkxt/arrangingTask/ckkb/index';
  import jcsj from '@/api/jcsj'

  export default {
    components: { jcsz, gztj, zdpk, pktz, ckkb },
    data() {
      return {
        name: this.$route.query.name,
        index: this.$route.query.index,
        rwid: this.$route.query.rwid,
        xxdm: this.$route.query.xxdm,
        dqxn: this.$route.query.dqxn,
        curComponent: 'jcsz', // 默认点亮加载基础设置模块
        activeIndex: 0, // 当前激活模块索引
        query: this.$route.query,
        activClass: '',
        moduleSet: [
          {
            index: 0,
            moduleName: '基础设置',
            className: true,
            subComponentName: 'jcsz'
          },
          {
            index: 1,
            moduleName: '规则条件',
            className: false,
            subComponentName: 'gztj'
          },
          {
            index: 2,
            moduleName: '自动排课',
            className: false,
            subComponentName: 'zdpk'
          },
          {
            index: 3,
            moduleName: '排课调整',
            className: false,
            subComponentName: 'pktz'
          },
          {
            index: 4,
            moduleName: '查看课表',
            className: false,
            subComponentName: 'ckkb'
          }
        ],
        njList: [],
        bjList: [],
        kcList: [],
        jsList: [],
        jszList: []
      }
    },
    created() {
      /** 初始化基础数据**/
      jcsj.remove(jcsj.BJ_KEY);
      jcsj.remove(jcsj.NJ_KEY);
      jcsj.remove(jcsj.KC_KEY);
      jcsj.remove(jcsj.JS_KEY);
      jcsj.remove(jcsj.JSZ_KEY);
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
    methods: {
      handleClick(v) {
        const index = parseInt(v);
        if (index !== 0) { // 非第一个模块都要验证
          /** 点亮验证**/
          this.handleValidateButton(index);
        } else {
          /** 点亮样式方法**/
          this.lightClassModule(index);
        }
      },
      handleValidateButton(index) {
        /** 模块点亮验证接口调用方法**/
        getModuleUp({ index, xxdm: this.xxdm, rwid: this.rwid }).then(res => {
          if (res.data) { // 验证成功
            this.lightClassModule(index);
          } else { // 验证错误
            let [message, i] = ['', 0];
            if (index === 1 || index === 2) {
              i = 0;
              message = '抱歉,先完成基础设置才能点亮当前模块。';
            } else {
              i = 2;
              message = '抱歉,先完成自动排课才能点亮此模块。';
            }
            this.$alert('<strong>' + message + '</strong>', '温馨提示', {
              type: 'warning',
              dangerouslyUseHTMLString: true
            });
            this.lightClassModule(i);
          }
        })
      }, lightClassModule(index) { // 点亮指定模块
        this.moduleSet.map(item => {
          if (item.index === index) {
            item.className = true;
            this.curComponent = item.subComponentName;
          } else {
            item.className = false;
          }
        })
        try {
          /** 默认初始化到模块的第一个子页面 **/
          this.$nextTick(() => {
            // this.$refs.child.activeName = '0';
            this.$refs.child.handleClick();
          })
        } catch (e) {
        }
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
    background: url("/static/img/dot-pkxt-2.png") #c0c4cc no-repeat center;
  }

  .pkicon-3 {
    background: url("/static/img/dot-pkxt-3.png") #c0c4cc no-repeat center;
  }

  .pkicon-4 {
    background: url("/static/img/dot-pkxt-4.png") #c0c4cc no-repeat center;
  }

  .pkicon-5 {
    background: url("/static/img/dot-pkxt-5.png") #c0c4cc no-repeat center;
  }

  .pkprocessMain .pkstep.activ .pksteptit {
    font-size: 16px;
    color: #449afc;
  }

  .pkprocessMain .pkstep.activ .pkstepicon {
    background-color: #449afc;
  }
</style>
