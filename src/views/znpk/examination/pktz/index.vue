<template>
  <div class="pk-pktz">
    <div>
      <el-radio-group v-model="currentNjdm" @change="refresh">
        <el-radio-button v-for="item in njArr" :label="item.njdm" :key="item.njdm" >{{item.njmc}}</el-radio-button>
      </el-radio-group>
    </div>
    <div style="margin-top: 10px;">
      <el-tabs v-model="activeName" @tab-click="refresh">
        <el-tab-pane label="考场调整" name="0">
          <page-kctz ref="pageKctz"
                    v-bind:nj-list="njList"
                    v-bind:bj-list="bjList"
                    v-bind:kc-list="kcList"
                    v-bind:js-list="jsList">
          </page-kctz>
        </el-tab-pane>
        <el-tab-pane label="监考调整" name="1">
          <page-jktz ref="pageJktz"
                    v-bind:dq-njdm="currentNjdm"
                    v-bind:nj-list="njList"
                    v-bind:bj-list="bjList"
                    v-bind:kc-list="kcList"
                    v-bind:js-list="jsList">
          </page-jktz>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<script>
  import pageKctz from '@/views/znpk/examination/pktz/kctz';
  import pageJktz from '@/views/znpk/examination/pktz/jktz';
  import { getCknj } from '@/api/znpk/examination/ckpk/index';
  import jcsj from '@/api/jcsj';
  export default {
    components: { pageKctz, pageJktz },
    data() {
      return {
        njArr: [],
        currentNjdm: '',
        activeName: '0',
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid  // 当前考试代码
      }
    },
    methods: {
      handleClick() {
        this.njArr = [];
        getCknj({ ksdxid: this.ksid }).then(res => {
          if (res.length > 0) {
            res.forEach(njdm => {
              const obj = {};
              obj.njdm = njdm;
              obj.njmc = jcsj.hqnjmcByid(this.njList, njdm);
              this.njArr.push(obj);
            });
            // 初始化默认选中年级
            this.currentNjdm = this.njArr[0].njdm;
            if (this.activeName === '0') {
              this.$refs.pageKctz.cxkcxsByNj(this.currentNjdm);
            } else if (this.activeName === '1') {
              this.$refs.pageJktz.cxkclsByNj();
            }
          }
        });
      },
      refresh() {
        if (this.activeName === '0') {
          this.$refs.pageKctz.cxkcxsByNj(this.currentNjdm);
        } else if (this.activeName === '1') {
          this.$refs.pageJktz.cxkclsByNj();
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
  }
</script>

