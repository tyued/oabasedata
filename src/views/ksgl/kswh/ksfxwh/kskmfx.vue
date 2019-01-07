<template>
  <el-row id="kssz-kskmfx">
    <div ref="left" class="left">
      <div class="title">选择班级</div>
      <el-tree class='pkbjtree tree smallscroll' :accordion="true" :highlight-current="true" :data="treeData" node-key="id" @node-click="handleCheckClick">
      </el-tree>
    </div>
    <div ref="right" class="right">
      <div class="setKCtime">
        <div class="title circle-title">设置课程</div>
        <el-card class="box-card" shadow="never" style="margin: 10px 0;" :body-style="{'padding-bottom': '10px'}">
          <el-button
            style="margin-top: 4px;"
            type="primary"
            v-for="(item,index) in classCourseList"
            :key="index"
            @click="courseTabChange(item.kcdm,index)"
            :plain="item.courseClass">{{item.eachClass}}</el-button>
        </el-card>
        <el-card class="box-card" shadow="never">
          <el-form label-position="left" label-width="100px">
            <div class="clearfix" style="margin-bottom:-22px;">
              <el-form-item label="录入方式" style="float:left;">
                <el-select v-model="valueLeft"  placeholder="请选择" @change="selectChange">
                  <el-option v-for="item in optionsLeft" :key="item.value" :label="item.label" :value="item.value" >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="科目满分值" style="float:left;margin-left:40px;">
                <div v-show="valueLeft == 2">
                  <el-select v-model="valueRight"  placeholder="请选择" >
                    <el-option v-for="item in optionsRight" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div v-show="valueLeft == 1">
                  <el-input-number
                     v-model="fxmfz"
                     controls-position="right"
                     :min="1" :max="999" label=""
                     style="width: 217px;"></el-input-number>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </el-card>
        <el-alert style="margin: 10px 0;" title="分项满分之和需等于科目满分值" type="error">
        </el-alert>
        <el-row>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
             <el-button
                style="margin-top: 4px;"
                type="primary"
                v-for="(item,index) in bjArr"
                :key="index"
                @click="classTabChange(item.bjdm,index)"
                :plain="item.ksClass">{{item.eachClass}}</el-button>
            </div>
            <div class="formbox">
              <div class="tip" v-show="currentKcmc">
                {{currentKcmc}}
              </div>
              <el-form label-position="left" label-width="100px" :model="formLabelAlign" ref="ruleForm"  v-show="valueLeft == 1">
                <div v-for="(item,index) in formLabelAlign.rowList" class="clearfix" >
                  <el-form-item label="分项名称"  style="float:left;" :prop="'rowList.' + index + '.fxmc'" :rules="fxmcsz">
                    <el-input clearable v-model.trim="item.fxmc" style="width: 217px;"></el-input>
                  </el-form-item>
                  <div v-if="item.lrfs == 2 ">
                  </div>
                  <div v-else>
                    <el-form-item label="分项分值" style="float:left;margin-left:40px;" :prop="'rowList.' + index + '.fxfz'" :rules="fxfzsz" >
                      <el-input clearable v-model="item.fxfz" style="width: 217px;" ></el-input>
                    </el-form-item>
                  </div>
                  <el-button type="text" style="margin-left:40px;color:#F56C6C;" @click="delFx(index)">
                    <i class="el-icon-remove-outline"></i> 删除</el-button>
                </div>
              </el-form>
              <el-form label-position="left" label-width="100px" :model="formLabelAlign" ref="ruleForm2"  v-show="valueLeft == 2">
                <div v-for="(item,index) in formLabelAlign.rowList" class="clearfix" >
                  <el-form-item label="分项名称"  style="float:left;" :prop="'rowList.' + index + '.fxmc'" :rules="fxmcsz">
                    <el-input clearable v-model.trim="item.fxmc" style="width: 217px;"></el-input>
                  </el-form-item>
                  <el-button type="text" style="margin-left:40px;color:#F56C6C;" @click="delFx(index)">
                    <i class="el-icon-remove-outline"></i> 删除</el-button>
                </div>
              </el-form>
              <div>
                <el-button type="text" style="color:#F56C6C;float:right; margin-right: 20px" @click="clearFx()">
                  <i class="el-icon-delete"></i> 清空</el-button>
                <el-button type="text" style="color:#67C23A;float:right;  margin-right: 20px" @click="savaFx()">
                  <i class="el-icon-circle-check"></i> 保存</el-button>
                <el-button  type="text" style="color:#67C23A;float:right; margin-right: 20px" @click="addFx()">
                  <i class="el-icon-circle-plus-outline"></i> 增加</el-button>
              </div>
            </div>
          </el-card>
        </el-row>
      </div>
    </div>
  </el-row>
</template>
<script>
import {
  getKsnj,
  getKskmxx,
  getKsClass,
  getKskmfx,
  saveKmfx,
  clearKmfx
} from '@/api/ksgl/kswh/kmfx/index';
import jcsj from '@/api/jcsj.js';
export default {
  data() {
    // 验证科目分项名称
    const validafxmc = (rule, value, callback) => {
      // 筛选同名分项数组
      const rowlist = this.formLabelAlign.rowList;
      const repertFxmc = _.filter(rowlist, { fxmc: value });
      if (value.length === 0 && rowlist.length > 1) {
        callback(new Error('分项名称不能为空！'));
      } else if (value.length > 20) {
        callback(new Error('分项名称只能0到20个字符！'));
      } else if (repertFxmc.length > 1) {
        callback(new Error('分项名称不能重复'));
      } else {
        callback();
      }
    };
    // 验证科目分项分值
    const validafxfz = (rule, value, callback) => {
      const rowlist = this.formLabelAlign.rowList;
      const g = /^[1-9]*[1-9][0-9]*$/;
      const flag = g.test(value);
      if (this.valueLeft === 1) {
        if (value.length === 0 && rowlist.length > 1) {
          callback(new Error('分项分值不能为空！'));
        } else if (!flag && rowlist.length > 1) {
          callback(new Error('分项分值只能是正整数！！'));
        } else if (parseInt(value) > this.fxmfz) {
          callback(new Error('分项分值不能大于科目满分值 ！'));
        } else {
          callback();
        }
      }
    };
    return {
      ksid: this.$route.query.ksid,
      xxdm: window.localStorage.getItem('xxdm'),
      fxmfz: 100,
      courseClass: [],
      ksClass: [],
      njArr: [], // 年级数组
      bjArr: [], // 班级数据
      classCourseList: [], // 班级课程数据数组
      treeData: [], // 年级树
      currentNjmc: '', // 当前年级名称
      currentNjdm: '', // 当前年级代码
      currentBjdm: '', // 当前班级代码
      currentBjmc: '', // 当前班级名称
      currentKcdm: '', // 当前课程代码
      currentKcmc: '', // 当前课程名称
      allStuNum: 0, // 考试学生总人数
      tjArr: [], // 统计分项数组
      // 录入方式
      optionsLeft: [
        {
          value: 1,
          label: '按分数录入'
        },
        {
          value: 2,
          label: '按等级录入'
        }
      ],
      valueLeft: 1,
      optionsRight: [
        {
          value: 1,
          label: 'A,B,C,D'
        },
        {
          value: 2,
          label: '优秀,良好,合格,不合格'
        }
      ],
      valueRight: 1,
      formLabelAlign: {
        fxmc: '',
        fxfz: '',
        type: '',
        rowList: [{ fxmc: '', fxfz: '' }]
      },
      // 分项数组
      fxmcsz: [
        { validator: validafxmc, trigger: 'change' }
      ],
      fxfzsz: [
        { validator: validafxfz, trigger: 'change' }
      ]
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
        this.loadnjBjData();
      }
    });
  },
  methods: {
    handleCheckClick(data) {
       // 获取考试科目信息
      const ksidParam = this.ksid;
      // 获取年级代码
      this.currentNjdm = data.id;
      this.currentKcdm = '';
      this.currentBjdm = '';
      this.currentNjmc = jcsj.hqnjmcByid(this.njList, this.currentNjdm);
      getKskmxx({ ksdxid: ksidParam, njdm: this.currentNjdm }).then(res => {
        getKsClass({ ksid: ksidParam }).then(classList => {
          this.loadCourse(res.data.rows, classList);
        });
      });
    },
    // 处理课程数据
    loadCourse(kcList, classList) {
      const tmpArr = [];
      const classArr = [];
      // 获取课程信息
      kcList.forEach(item => {
        const eachClass = jcsj.hqkcmcByid(this.kcList, item.kcdm);
        tmpArr.push({ eachClass, kcdm: item.kcdm });
      });
      tmpArr.forEach(res => {
        res.courseClass = true;
      });
      // 获取班级信息
      const bjArr = _.filter(classList, { njdm: this.currentNjdm });
      classArr.push({ eachClass: '全部班级', bjdm: '' });
      bjArr.forEach(item => {
        const eachClass = jcsj.hqbjmcByid(this.bjList, item.bjdm);
        classArr.push({ eachClass, bjdm: item.bjdm });
      });
      classArr.forEach(res => {
        res.ksClass = true;
      });
      this.bjArr = classArr;
      this.classCourseList = tmpArr;
    },
    // 拼装年级班级树形结构
    loadnjBjData() {
      if (this.treeData.length === 0) {
        this.treeData = [];
        for (let j = 0; j < this.njArr.length; j++) {
          const njdata = this.njArr[j];
          const njmap = {};
          njmap.label = njdata.njmc;
          njmap.id = njdata.njdm;
          njmap.disabled = true;
          this.treeData.push(njmap);
        }
      }
    },
    // 课程点击事件
    courseTabChange(kcdm) {
      const kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
      // 处理按钮选中状态
      const newClassCourseList = [];
      for (const kcclass of this.classCourseList) {
        if (kcdm === kcclass.kcdm) {
          kcclass.courseClass = false;
        } else {
          kcclass.courseClass = true;
        }
        newClassCourseList.push(kcclass);
      }
      this.classCourseList = newClassCourseList;
      this.currentKcdm = kcdm;
      this.currentKcmc = kcmc;
      getKskmfx({ ksid: this.ksid, njdm: this.currentNjdm, kmdm: kcdm }).then(kmfxList => {
        if (kmfxList.length === 0) {
          this.valueLeft = 1;
          this.valueRight = 1;
          this.fxmfz = 100;
          this.formLabelAlign.rowList = [{ fxmc: '', fxfz: '' }];
        } else {
          const lrfs = kmfxList[0].lrfs;
          this.valueLeft = parseInt(lrfs);
          if (lrfs === 2) {
            const djlx = parseInt(kmfxList[0].djlx);
            this.valueRight = djlx
          } else {
            kmfxList.forEach(item => {
              if (!item.fxfz) {
                item.fxfz = '';
              }
              debugger;
              if (!item.mfz) {
                this.fxmfz = 100;
              } else {
                this.fxmfz = item.mfz;
              }
            })
          }
          this.formLabelAlign.rowList = kmfxList;
        }
      });
    },
    // 班级点击事件
    classTabChange(bjdm) {
      const bjmc = jcsj.hqbjmcByid(this.bjList, bjdm);
      // 处理按钮选中状态
      const newClassList = [];
      for (const ksClass of this.bjArr) {
        if (bjdm === ksClass.bjdm) {
          ksClass.ksClass = false;
        } else {
          ksClass.ksClass = true;
        }
        newClassList.push(ksClass);
      }
      this.bjArr = newClassList;
      this.currentBjdm = bjdm;
      this.currentBjmc = bjmc;
      getKskmfx({ ksid: this.ksid, njdm: this.currentNjdm, kmdm: this.currentKcdm, bjdm: this.currentBjdm }).then(kmfxList => {
        if (kmfxList.length === 0) {
          this.valueLeft = 1;
          this.valueRight = 1;
          this.fxmfz = 100;
          this.formLabelAlign.rowList = [{ fxmc: '', fxfz: '' }];
        } else {
          const lrfs = kmfxList[0].lrfs;
          this.valueLeft = parseInt(lrfs);
          if (lrfs === 2) {
            const djlx = parseInt(kmfxList[0].djlx);
            this.valueRight = djlx
          } else {
            kmfxList.forEach(item => {
              if (!item.fxfz) {
                item.fxfz = '';
              }
              if (!item.mfz) {
                this.fxmfz = 100;
              } else {
                this.fxmfz = item.mfz;
              }
            })
          }
          this.formLabelAlign.rowList = kmfxList;
        }
      });
    },
    // 增加分项
    addFx() {
      const subOption = { fxmc: '', fxfz: '' };
      this.formLabelAlign.rowList.push(subOption);
    },
    // 删除分项
    delFx(index) {
      this.formLabelAlign.rowList.splice(index, 1);
    },
    // 清空所有分项
    clearFx() {
      this.formLabelAlign.rowList = [{ fxmc: '', fxfz: '' }];
      clearKmfx({ ksid: this.ksid, njdm: this.currentNjdm, kmdm: this.currentKcdm, bjdm: this.currentBjdm }).then(() => {
          //
      });
    },
    // 保存科目分项
    savaFx() {
      if (this.valueLeft === 1) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            // 分项为空不做验证
            if (this.formLabelAlign.rowList.length > 1) {
              let sumFxfz = 0;
              this.formLabelAlign.rowList.forEach(item => {
                sumFxfz = sumFxfz + parseInt(item.fxfz);
              });
              if (sumFxfz !== this.fxmfz) {
                this.$message({ title: '保存失败', message: '分项满分之和需等于科目满分值', type: 'error', duration: 2000 });
              } else {
                this.saveKmfxData();
              }
            } else {
              this.saveKmfxData();
            }
          }
        });
      } else {
        this.$refs.ruleForm2.validate(valid => {
          if (valid) {
            this.saveKmfxData();
          }
        })
      }
    },
    saveKmfxData() {
      if (this.checkBlak(this.currentNjdm)) {
        this.$message({ title: '温馨提示', message: '请选择年级', type: 'warning', duration: 2000 });
        return;
      } else if (this.checkBlak(this.currentKcdm)) {
        this.$message({ title: '温馨提示', message: '请选择课程', type: 'warning', duration: 2000 });
        return;
      } else {
        const kmfxArr = [];
        this.formLabelAlign.rowList.forEach(item => {
          const kmfx = { xxdm: this.xxdm, ksid: this.ksid, njdm: this.currentNjdm, kmdm: this.currentKcdm, lrfs: this.valueLeft };
          if (this.currentBjdm) {
            kmfx.bjdm = this.currentBjdm;
          }
          console.log(kmfx);
          kmfx.mfz = this.fxmfz;
          kmfx.fxmc = item.fxmc;
          // 根据录入方式赋值
          if (this.valueLeft === 1) {
            kmfx.fxfz = item.fxfz;
          } else {
            kmfx.fxfz = '';
            kmfx.djlx = this.valueRight;
          }
          kmfxArr.push(kmfx);
          let successMsg = ' 科目分项保存成功';
          if (this.checkBlak(this.currentBjdm)) {
            successMsg = this.currentNjmc + ' ' + this.currentKcmc + successMsg;
          } else {
            successMsg = this.currentBjmc + ' ' + this.currentKcmc + successMsg;
          }
          // 保存科目分项数据
          saveKmfx(kmfxArr).then(() => {
            console.log(kmfxArr);
            this.$message({ title: '保存成功', message: successMsg, type: 'success', duration: 2000 });
          });
        });
      }
    },
    // 检验对像是否为空
    checkBlak(val) {
      return Object.keys(val).length === 0;
    },
    selectChange() {
      this.formLabelAlign.rowList = [{ fxmc: '', fxfz: '' }]
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
    }
  },
  computed: {
    //
  },
  updated() {
    this.$refs.left.style.height = this.$refs.right.offsetHeight + 'px';
  }
};
</script>

<style lang="scss" scoped>
.left {
  width: 200px;
  border: 1px solid #eaedf4;
  border-radius: 2px;
  float: left;
}
.right {
  margin-left: 210px;
}
.title {
  background: #f5f7fa;
  border-bottom: 1px solid #eaedf4;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #333;
  text-indent: 20px;
}
.circle-title {
  height: 41px;
  line-height: 41px;
  border: 1px solid #eaedf4;
  border-radius: 2px;
}
.tree {
  // height: 600px;
  // overflow: auto;
}
.formbox {
  position: relative;
  .tip {
    position: absolute;
    right: -19px;
    top: -19px;
    padding: 0px 20px;
    height: 30px;
    line-height: 30px;
    border-bottom-left-radius: 14px;
    background-color: #fdf6ec;
    color: #e6a23c;
    // border: 1px solid #E6A23C;
  }
}
</style>
