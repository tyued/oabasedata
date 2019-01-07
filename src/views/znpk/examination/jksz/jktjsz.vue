<template>
  <div>
    <el-container class="jktjsz">
      <el-aside width="200px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix pk-title">
            <span>选择监考老师</span>
          </div>
          <div>
            <div style="padding: 10px;">
              <el-input
              placeholder="输入关键字过滤" size="medium"
              v-model="filterText">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            </div>
            <el-tree
              class="smallscroll"
              style="height: 600px;overflow:auto;"
              ref="tree"
              :data="data2"
              show-checkbox
              node-key="id"
              default-expand-all
              @check-change="handleCheckChange"
              :filter-node-method="filterNode"
              :props="defaultProps">
            </el-tree>
          </div>
        </el-card>
      </el-aside>
      <el-main style="margin-top: -20px;">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix pk-title">
            <span>监考条件设置</span>
          </div>
          <div class="el-jktjsz">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="labelPosition" label-width="1000px" class="demo-ruleForm">
              <el-form-item prop="kcjssl">
                <span class="label_slot" slot="label">已选的监考老师（<span style="color: #2aabd2">{{ruleForm.tags.length}}位</span>）</span>
                  本次考试共计<span>{{kcs}}</span>个考场，每个考场教师人数&nbsp;&nbsp;
                  <el-input-number size="small" v-model="ruleForm.kcjssl" @change="handleNumChange"  :min="1" :max="4" label="描述文字"></el-input-number>
                 <div>
                  <el-tag v-if="ruleForm.tags.length>0" style="margin-bottom: 10px;margin-right: 10px;"
                          v-for="tag in ruleForm.tags"
                          :key="tag.id"
                          closable

                          @close="handleYxJsClose(tag)">
                    {{tag.label}}
                  </el-tag>
                 </div>
              </el-form-item>
              <hr>
              <el-form-item>
                <span class="label_slot" slot="label">监考场次区间设置</span>
                <el-row><el-button icon="el-icon-plus" size="medium" type="text"  @click="addJsQj">新增区间</el-button></el-row>
                <el-card shadow="never" class="box-card"  v-for='(item,index) in ruleForm.children' :key='index'>
                  <div>
                    <el-button plain size="small" @click="showInput(index,item)">+ 添加教师</el-button>
                    <el-tag
                      style="margin-left: 10px;"
                      v-for="tag in item.dynamicTags"
                      :key="tag.id"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(index,tag)">
                      {{tag.label}}
                    </el-tag>
                    <br>
                    <el-col :span="4">
                        <el-form-item
                          :prop="'children.' + index + '.zdcs'"
                          :rules="ruleszd">
                        最多场次&nbsp;
                        <el-input-number
                          size="small"
                          v-model="item.zdcs"
                          @change="handleNumChange(item,$event)"
                          :min="1"
                          :max="jszdcs"
                          label="最多场次"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item
                        :prop="'children.' + index + '.zscs'"
                        :rules="ruleszs">
                        &nbsp;最少场次&nbsp;
                        <el-input-number
                          size="small"
                          v-model="item.zscs"
                          @change="handleNumChange(item,$event)"
                          :min="0"
                          :max="jszdcs"
                          label="最少场次"></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-button v-if="ruleForm.children.length>1" style="float:right;" type="text" class="button" @click="deleteJsQj(index,item.dynamicTags)">删除</el-button>
                     <p>&nbsp;</p>
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm">保存条件</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card></el-main>
    </el-container>
    <el-dialog class="jktjsz-dialog" title="添加教师" center :visible.sync="dialogAddVisible"  width="40%">
      <!--<el-input
        placeholder="输入关键字过滤" size="medium"
        v-model="filterText1" style="width: 400px;margin-bottom: 2px" v-on:keyup="fileterShowInput">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>-->
      <el-collapse v-model="activeNameV" accordion>
        <el-collapse-item v-for="(item,index) in jsCheckList" :key="item.zdm" :title="toNumStr(item,index)" :name="(index+1)">
          <el-checkbox-group
          v-model="item.checkedCities" >
            <el-checkbox v-for="e in item.children" :label="e" :key="(e.id+index)" @change="handleCheckedAddJs(e,item.zdm,$event)" >{{e.label}}</el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
      </el-collapse>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="getAddJs">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import jcsj from '@/api/jcsj'
  import * as api from '@/api/znpk/examination/jksz/index'
  export default {
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
      const validaZdcs = (rule, value, callback) => {
        const arry = rule.field.split('.');
        const num = parseInt(arry[1]);
        const zscs = this.ruleForm.children[num].zscs;
        if (value < zscs) {
          callback(new Error('最多场次不能小于最少场次'));
        } else {
          callback();
        }
      };
      const validaZscs = (rule, value, callback) => {
        const arry = rule.field.split('.');
        const num = parseInt(arry[1]);
        const zdcs = this.ruleForm.children[num].zdcs;
        if (value > zdcs) {
          callback(new Error('最少场次不能大于最多场次'));
        } else {
          callback();
        }
      };
      return {
        activeNameV: '1',
        labelPosition: 'top',
        filterText: '',
        filterText1: '',
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,  // 当前考试代码
        data2: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        activeNames: ['1', '2'],
        inputVisible: false,
        inputValue: '',
        kcs: 0, // 考场数
        jszdcs: null,
        ruleForm: {
          tempzgh: [],
          kcjssl: 0, // 考场教师数量
          tags: [], // 已选教师
          checkTags: [], // 可添加教师
          children: [{
            zdcs: '',
            zscs: 0,
            dynamicTags: [] }] // 教师区间
        },
        tepmQjbs: null,  // 存取临时区间位置
        dialogAddVisible: false,
        jsCheckList: [],
        checkedCities: [],
        rules: {
          kcjssl: [
            { required: true, message: '请设置教师数量', trigger: 'blur' }
          ]
        },
        ruleszd: [
          { required: true, message: '最多场次不能为空', trigger: 'blur' },
          { validator: validaZdcs, trigger: 'blur' }
        ],
        ruleszs: [
          { required: true, message: '最少场次不能为空', trigger: 'blur' },
          { validator: validaZscs, trigger: 'blur' }
        ]
      };
    }, filters: {
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }, initJktjsz() { /** 巡考条件设置 **/
      /** 教师组**/
        api.getJszjsgxList({ xxdm: this.xxdm }).then(res => {
          if (res.length > 0) {
            const jszArry = [];
            for (const o of this.jszList) {
              const map = { level: 1, id: o.zdm, label: o.zmc, children: [] }
              /** 教师组教师**/
              const jsz_js_list = _.filter(res, e => e.zdm === o.zdm);
              map.children = jsz_js_list.map(e => ({ level: 2, id: o.zdm + e.zgh, zgh: e.zgh, label: jcsj.hqjsmcByid(this.jsList, e.zgh) }))
              jszArry.push(map);
            }
            this.data2 = jszArry;
          } else {
            this.data2 = [];
          }
        })
      /** 当前年级考试考场数据信息 **/
        api.getKcxxByKsidAndNjdm({ njdm: this.dqNjdm, ksid: this.ksid }).then(res => {
          this.kcs = res.length; // 设置考场数
          this.ruleForm.kcjssl = res.length > 0 ? res[0].jklssl : 0;
        })
        /** 获取考试科目 **/
        api.getKskmxx({ njdm: this.dqNjdm, ksdxid: this.ksid }).then(res => {
          this.jszdcs = res.data.rows.length;
        });
      /** 监考条件数据 **/
        this.ruleForm = {
          tempzgh: [],
          kcjssl: 0, // 考场教师数量
          tags: [], // 已选教师
          checkTags: [], // 可添加教师
          children: [{
            zdcs: this.jszdcs,
            zscs: 0,
            dynamicTags: [] }] // 教师区间
        }
        api.getselectJklsList({ njdm: this.dqNjdm, ksid: this.ksid, xxdm: this.xxdm }).then(res => {
          const [checkTree, list] = [[], []];
          if (res.length > 0) {
            res.forEach(item => {
              if (item.zscs >= 0) { // 区间
                list.push({
                  xxdm: item.xxdm,
                  ksid: item.ksid,
                  njdm: item.njdm,
                  zdcs: item.zdcs,
                  zscs: item.zscs,
                  dynamicTags: item.dynamicTags ? item.dynamicTags.map(e => {
                    const map = { id: e.zgh, label: jcsj.hqjsmcByid(this.jsList, e.zgh) }
                    checkTree.push(map);
                    return map;
                  }) : []
                })
              } else { // 默认
                if (item.dynamicTags && item.dynamicTags.length > 0) {
                  item.dynamicTags.forEach(z => {
                    const map = { id: z.zgh, label: jcsj.hqjsmcByid(this.jsList, z.zgh) }
                    checkTree.push(map);
                  })
                }
              }
            })
            if (list.length > 0) {
              this.ruleForm.children = list;
            }
            this.$refs.tree.setCheckedKeys(this.findTreeID(checkTree));
          } else {
            this.ruleForm.children[0].zdcs = this.jszdcs;
            this.$refs.tree.setCheckedKeys([]);
          }
          this.ruleForm.tags = checkTree;
          // this.handleCheckChange();// 已选教师默认选中
        })
      },
      findTreeID(arr) { /** 根据职工号查询树id **/
        const [$this, list] = [this, []];
        arr.forEach(item => {
          $this.data2.forEach(f => {
            f.children.forEach(e => {
              if (item.id === e.zgh) {
                list.push(e.id);
              }
            })
          })
        });
        return list;
      },
      showInput(index) { /** 打开添加教师弹框 **/
        this.activeNameV = 1;
        // 教师验证
        if (this.ruleForm.tags.length > 0) {
          /** 获取可用教师 **/
          this.getKyJs();
          /** 打开模态框 **/
          this.tepmQjbs = index; // 定位某个区间位置
          if (this.jsCheckList.length > 0) {
            this.dialogAddVisible = true // 打开添加教师弹框
          } else {
            this.$alert('<strong>没有可用教师，请先选择监考教师</strong>', '温馨提示', {
              type: 'warning',
              dangerouslyUseHTMLString: true
            });
          }
        } else {
          this.$alert('<strong>请先选择监考教师</strong>', '温馨提示', {
            type: 'warning',
            dangerouslyUseHTMLString: true
          });
        }
      },
      getKyJs() {
        /** 获取可用教师 **/
        this.checkedCities = [];
        /** 获取已选教师**/
        const checkJsArry = [];
        for (const o of this.ruleForm.tags) {
          // const map = { id: o.id, label: o.label }
          checkJsArry.push(o.id);
        }
        // this.jsCheckList = checkJsArry;
        /** 获取已用教师 **/
        const cities = [];
        for (const o of this.ruleForm.children) {
          if (o.dynamicTags) {
            for (const e of o.dynamicTags) {
              // const map = { id: e.zgh, label: jcsj.hqjsmcByid(this.jsList, e.zgh) }
              cities.push(e.id);
            }
          }
        }
        // this.checkedCities = cities;
        /** 获取可用教师**/
        const [temp_js, temp_js_dm] = [[], []];
        if (checkJsArry) {
          checkJsArry.forEach(item => {
            if (!cities.includes(item)) {
              const map = { id: item, label: jcsj.hqjsmcByid(this.jsList, item) }
              temp_js.push(map);
              temp_js_dm.push(item);
            }
          })
         /** 获取已选教师 **/
          const arry = []
          this.data2.forEach(o => {
            const map = { zdm: o.id, zmc: o.label, children: [], checkedCities: [] };
            o.children.forEach(e => {
              if (temp_js_dm.includes(e.zgh)) {
                const c = { id: e.zgh, label: e.label }
                map.children.push(c);
              }
            })
            if (map.children.length > 0) {
              arry.push(map);
            }
          })
          this.jsCheckList = arry;
        }
      },
      getAddJs() { /** 添加教师 **/
        const $this = this;
        this.jsCheckList.forEach(item => {
          item.checkedCities.forEach(e => {
            if (!$this.ruleForm.tempzgh.includes(e.id)) { // 教师不存在则添加
              $this.ruleForm.children[this.tepmQjbs].dynamicTags.push(e);
              /** 记录修改场次的教师 **/
              $this.ruleForm.tempzgh.push(e.id);
            }
          })
        })
      /*  if (this.checkedCities) {
          this.checkedCities.forEach(item => {
            $this.ruleForm.children[this.tepmQjbs].dynamicTags.push(item);
            /!** 记录修改场次的教师 **!/
            $this.ruleForm.tempzgh.push(item.id);
          })
        }*/
        this.dialogAddVisible = false;
      },
      handleCheckedAddJs(v, d, c) {
        if (c) {
          this.jsCheckList.forEach(item => {
            if (item.zdm !== d) {
              item.children.forEach(e => {
                if (e.id === v.id) { // 教师不存在则添加
                  item.checkedCities.push(e);
                }
              })
            }
          })
        } else {
          this.jsCheckList.forEach(item => {
            if (item.zdm !== d) {
              item.children.forEach(e => {
                if (e.id === v.id) { // 教师不存在则添加
                  item.checkedCities.splice(e, 1);
                }
              })
            }
          })
        }
      },
      handleClose(index, tag) { /** 删除教师 **/
        const $this = this.ruleForm.children[index].dynamicTags;
        $this.splice($this.indexOf(tag), 1);
        /** 记录修改场次的教师 **/
        this.ruleForm.tempzgh.push(tag.id);
      },
      handleInputConfirm() {
        const inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      handleClick() {
        const i = parseInt(this.activeName);
        if (i === 0) {
          this.getXksz();
        }
        if (i === 1) {
          this.getJktjSz();
        }
      },
      handleCheckChange(data, checked) {  /** @树形插件勾选触发事件方法 **/
        /** 获取重复教师 **/
        this.data2.forEach(o => {
          o.children.forEach(item => {
            if (data.id !== item.id && data.zgh === item.zgh) {
              this.$refs.tree.setChecked(item.id, !!checked);
            }
          })
        })
        if (checked === false) {
          this.ruleForm.tempzgh.push(data.zgh);
          /** 删除已设置的区间教师 **/
          const $this = this;
          if (this.ruleForm.children) {
            this.ruleForm.children.forEach((item, i) => {
              const tags = _.filter(item.dynamicTags, e => e.id !== data.zgh); // 区间过滤掉删的教师
              $this.ruleForm.children[i].dynamicTags = tags;
            });
          }
        } else {
          const index = this.ruleForm.tempzgh.indexOf(data.zgh);
          if (index > -1) {
            this.ruleForm.tempzgh.splice(index, 1);
          }
        }
        /** 设置已选教师 **/
        this.setIsJs();
      },
      setIsJs() { /** 设置已选教师**/
        const list = this.$refs.tree.getCheckedNodes(true);
        const [treeList, zghArry] = [[], []];
        list.forEach(o => {
          if (o.level === 2 && !zghArry.includes(o.zgh)) {
            const map = { id: o.zgh, label: o.label }
            treeList.push(map);
            zghArry.push(o.zgh);
          }
        })
        this.ruleForm.tags = treeList; // 设置已选教师
      },
      handleYxJsClose(tag) { /** 选择的教师删除方法 **/
        this.ruleForm.tags.splice(this.ruleForm.tags.indexOf(tag), 1); /** 删除选择的教师 **/
        /** 根据删除的zgh从树中找到id取消勾选 **/
        const [list, treeId] = [this.$refs.tree.getCheckedNodes(), []];
        list.forEach(o => {
          if (o.level === 2 && o.zgh !== tag.id) {
            treeId.push(o.id);
          }
        })
        /** 记录修改场次的教师 **/
        this.ruleForm.tempzgh.push(tag.id);
        this.$refs.tree.setCheckedKeys(treeId);
      }, handleNumChange(items, value) { /** 记录修改场次的教师 **/
        if (items.dynamicTags && items.dynamicTags.length > 0) {
          for (const o of items.dynamicTags) {
            this.ruleForm.tempzgh.push(o.id);
          }
        }
      },
      addJsQj() { /** 点击增加区间方法 **/
        const num = this.ruleForm.kcjssl * this.kcs * this.jszdcs;
        const map = {
          dynamicTags: [],
          zdcs: num,
          zscs: null,
          xxdm: this.xxdm,
          ksid: this.ksid,
          njdm: this.dqnj
        }
        this.ruleForm.children.push(map);
      },
      deleteJsQj(i, data) { /** 删除某个区间 **/
        this.ruleForm.children.splice(i, 1);
        if (data && data.length > 0) { /** 清空不排时间段 **/
          for (const o of items.dynamicTags) {
            this.ruleForm.tempzgh.push(o.id);
          }
        }
      },
      submitForm() { /** 保存监考教师信息方法**/
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            if (this.ruleForm.tags.length === 0) {
              this.$message({ message: '抱歉，请选择监考教师', type: 'warning' });
              return false;
            } else if (this.ruleForm.tags.length < (this.ruleForm.kcjssl * this.kcs)) {
              this.$message({ message: '抱歉，已选教师数不能小于' + this.ruleForm.kcjssl * this.kcs + '人', type: 'warning' });
              return false;
            } else {
              this.getSaveApi();
            }
          } else {
            return false;
          }
        });
      }, getSaveApi() {
        const list = [];
        /** 处理区间数据 **/
        if (this.ruleForm && this.ruleForm.children.length > 0) {
          for (const item of this.ruleForm.children) {
            for (const e of item.dynamicTags) {
              const map = {
                tempzgh: this.ruleForm.tempzgh, // 记录修改场次的教师
                jklssl: this.ruleForm.kcjssl,
                xxdm: this.xxdm,
                ksid: this.ksid,
                njdm: this.dqNjdm,
                zdcs: item.zdcs,
                zscs: item.zscs,
                zgh: e.id
              }
              list.push(map);
            }
          }
        }
        /** 处理默认数据 **/
        this.getKyJs();
        this.jsCheckList.forEach(z => {
          if (z.children.length > 0) {
            for (const o of z.children) {
              const map = {
                tempzgh: this.ruleForm.tempzgh,
                zgh: o.id,
                jklssl: this.ruleForm.kcjssl,
                xxdm: this.xxdm,
                ksid: this.ksid,
                njdm: this.dqNjdm,
                zdcs: this.jszdcs,
                zscs: ''
              }
              list.push(map);
            }
          }
        })
        const listArry = _.uniqBy(list, 'zgh')
        /** 调用保存接口 **/
        api.getSaveJklsxx(listArry).then(() => {
          this.initJktjsz();
          this.$notify({ title: '成功', message: '保存成功', type: 'success', duration: 2000 })
        })
      },
      toNumStr(v, i) {
        const checkNum = this.jsCheckList[i].checkedCities.length;
        const str = v.zmc + ' （' + checkNum + '/' + v.children.length + '）';
        return str;
      },
      fileterShowInput() {
        alert(this.filterText1)
      }
    },
    mounted() {
      $('.el-form-item__label').css('width', '100%');
    },
    props: {
      dqNjdm: {
        /** 年级类型列表数据**/
        type: String,
        required: true
      },
      njList: {
        /** 年级类型列表数据**/
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
      },
      jszList: {
        /** 教师组列表数据**/
        type: Array,
        required: true
      }
    }
  };
</script>
<style scoped>
  .demo-ruleForm .label_slot{
    padding: 0px 0px 3px;
    margin-bottom: -12px;
   /* padding: 18px 20px;border-bottom: 1px solid #ebeef5;*/
  }
</style>
