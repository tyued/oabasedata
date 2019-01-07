<template>
  <section class="content-container tcswh">
    <!--搜索控件-->
    <search-app ref="searchApp" :search-input-select="searchInputSelect"
                :search-placeholder="searchPlaceholder"
                :search-types="searchTypes"
                :condition-items="conditionItems" @searchClick="goSerch"></search-app>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button @click="handleAdd" type="primary" icon="icon iconfont icon-el-icon-yhsz">设置特长生</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" highlight-current-row style="width: 100%;">
      <!--<el-table-column type="selection" width="55">
      </el-table-column>-->
      <el-table-column type="index" width="100"></el-table-column>
      <el-table-column prop="xh" label="学号" width="200"></el-table-column>
      <el-table-column prop="xm" label="姓名" width="180"></el-table-column>
      <el-table-column prop="njmc" label="年级名称" width="180"></el-table-column>
      <el-table-column prop="bj" label="班级名称" width="180"></el-table-column>
      <el-table-column prop="lxmc" label="类型名称" min-width="300"></el-table-column>

    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="special.query.page" :page-sizes="[10,20,30, 50]"
                     :page-size="special.query.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-col>
    <!--新增界面-->
    <el-dialog title="设置特长生" :visible.sync="dialogFormVisible" @close="colseDialog">
      <el-form label-width="80px" ref="addForm">
        <el-tabs type="border-card" @tab-click="speciaTypeChange">
          <!--特长生类别-->
          <el-tab-pane v-for="(type,type_index) in specialTypeList" :key="type.lxid" :label="type.lxmc">
            <!--已选学生-->
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item title="已选学生:" name="1">
                <div>
                  <el-tag
                    type="success"
                    size="small"
                    v-for="(tag,index) in type.specialsList"
                    :key="(index+type_index)"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(index,tag,type_index)">
                    {{tag.xm}}
                  </el-tag>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div style="margin-top:10px;">
              <el-row :gutter="12">
                <el-col :span="6">
                  <el-card shadow="never">
                    <!--年级班级展示-->
                    <el-tree
                      :typeKey="type_index"
                      :data="treeData[type_index]"
                      show-checkbox
                      node-key="id"
                      ref="tree"
                      check-strictly
                      accordion
                      :highlight-current="true"
                      :default-expanded-keys="[expandedOne[type_index]]"
                      @node-click="handleCheckClick"
                      @check-change="handleCheckChange"
                      :props="defaultProps"
                    >
                      <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>({{node.data.checkCount}}/{{ node.data.count }})</span>
                      </span>
                    </el-tree>
                  </el-card>
                </el-col>
                <el-col :span="18">
                  <el-card shadow="hover">
                    <!--班级学生展示-->
                    <el-checkbox-group v-model="checkboxGroup5[type_index]" size="small">
                      <el-checkbox
                        v-for="(student,index) in studentArry[type_index]"
                        :key="student.xh"
                        :label="student.xh" :name="student.xm"
                        :typeKey="type_index"
                        :lxid="type.lxid"
                        @change="handleCheckedCitiesChange"
                        size="small"
                        border>{{student.xm}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-card>
                </el-col>

              </el-row>
            </div>

          </el-tab-pane>

        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="colseDialog">取消</el-button>
        <el-button type="primary" @click="saveClick">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  import searchApp from '@/views/components/searchbar'
  import { dqxnxqObj, getNj, getBj } from 'api/components/searchbar'
  import {
    getTcsLxList,
    getBjSdunt,
    getPageList,
    getTcsLx,
    getTreeNode,
    saveSpecialInfo
  } from 'api/xkxt/specialRaw/index'

  export default {
    components: {
      searchApp
    },
    data() {
      return {
      /** *搜索配置开始**/
        searchInputSelect: true, /** 显示搜索类型**/
        searchPlaceholder: '请输入学生姓名和学号',
        searchTypes: [{
        /** 配置搜索框** 列如：<option value="1">名称</option>**/
          label: '全部',
          value: 0
        }],
        conditionItems: [{
        /** 搜索条件配置 values:年级列表数组**/
          key: 'njList',
          type: 'Checkbox', /** 类型 :单选Radio或者多选CheckBox；**/
        // selected:{value:'11',text:'一年级'},//默认选中制定元素
          label: '年级',
          values: []
        }, {
          key: 'bjList',
          type: 'Checkbox',
          label: '班级',
          values: []
        }, {
          key: 'LX',
          type: 'Checkbox',
          label: '类型',
          values: []
        }], /** 条件配置结束**/
        special: {
          cxmc: '',
          cxlx: '',
          njGroup: [],
          bjGroup: [],
          tcsGroup: [],
          query: {
            page: 1,
            limit: 10
          }
        },
        tableData: [],
        total: 0,
        listLoading: false,
        dialogFormVisible: false, // 定义新增弹框默认关闭
        activeName: '1',  // 设置折叠板
        specialTypeList: [],
        xxdm: '',
        dqxn: '',
        dqxq: '',
        treeData: [],
        expandedOne: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        studentArry: [], // 学生
        inputVisible: false,
        checkboxGroup5: [],
        dynamicTagsList: {}, // tab 标签
        treeTemp: [], // 树临时遍历
        lxid: [] // 类型id

      }
  },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        this.dqxn = response.data.xn;
        this.dqxq = response.data.xq;
        this.getSpecialRawList()// 特长生列表
        this.getSearchCriteria();// 搜索条件
        this.getTypeList();// 特长生类型
      })
    },
    mounted() {
      this.$refs.searchApp.setChecked();
    },
    methods: {
      getSpecialRawList(v) {
      /** @获取特长生维护列表**/
        const para = this.special;
        para.xxdm = this.xxdm;
        para.dqxn = this.dqxn;
        this.listLoading = true;
        getPageList(para).then(res => {
          this.total = res.data.total;
          this.tableData = res.data.rows;
          this.listLoading = false;
        });
      },
      getTypeList() {
      /** @获取特长生类型信息数据**/
        const para = {
          xxdm: this.xxdm,
          dqxn: this.dqxn
        };
        getTcsLx(para).then(res => {   // 获取特长生类型接口返回的值
          this.specialTypeList = res.data;
          for (let i = 0, j = this.specialTypeList.length; i < j; i++) {
            const vv = [];
            if (!this.lxid.includes(this.specialTypeList[i].lxid)) {
              this.lxid.push(this.specialTypeList[i].lxid);
            }
            this.studentArry.push(vv);
            this.checkboxGroup5.push(vv);
            this.treeTemp.push(vv);
          }
          this.loadTree();
        /** 加载树**/
        });
      },
      loadTree() {
      /** @获取年级班级树形数据**/
        const para = {
          xxdm: this.xxdm,
          dqxn: this.dqxn,
          lxid: JSON.stringify(this.lxid)
        }
        getTreeNode(para).then(res => { // 获取树形插件数据接口
          this.treeData = res.data;
          for (const i in this.treeData) {
            if (this.treeData[i][0]) {
                this.expandedOne.push(this.treeData[i][0].id);
            }
          }
        });
      },
      handleAdd() {        /** @弹框操作方法**/
        if (this.specialTypeList.length > 0) {
        /** 设置默认第一个班级选中**/
          let [node, bool] = [this.$refs, false];
          if (!bool) {
            setTimeout(() => {
              if (node) {
              /** 渲染未完成继续请求获取对象**/
                bool = true;
                for (const i in this.treeData) {
                  const [tree, key] = [node.tree[i], this.treeData[i][0].children[0].id];   // 获取当前树
                  if (tree) {
                    $(tree.$el).find('div[role=\'treeitem\']').each((e, i) => {
                      if (e == 0) {
                        $(i).find('div:first label[role=\'checkbox\']').remove();
                      } else {
                        $(i).parents('div[role=\'treeitem\']').siblings().eq(e - 1).find('div:first label[role=\'checkbox\']').remove();
                      }
                    });
                  }
                  try {
                    tree.setCheckedKeys([key]);// 设置选中
                  } catch (e) {
                  }
                }
              }
            }, 10);
          }
          this.dialogFormVisible = true;// 打开新增页面弹框
        } else {
          this.$alert('<strong>抱歉！没有设置特长生,请先设置特长生类型。</strong>', '温馨提示', {
            type: 'warning',
            dangerouslyUseHTMLString: true
          });
        }
      },
      handleCheckChange(data, checked) {  /** @树形插件勾选触发事件方法**/
        try {
          if (data.level === 1) {
            this.expandedOne[data.checkIndex] = data.id;
          }// 设置默认展开
          if (checked && data.level === 2) {
            this.$refs.tree[data.checkIndex].setCheckedKeys([]);
            this.$refs.tree[data.checkIndex].setCheckedKeys([data.id]);
            const [v, index] = [{ bjid: data.id, xxdm: this.xxdm, xn: this.dqxn }, data.checkIndex];
          /** 记录班级id**/
            this.treeTemp[index] = [];
            this.treeTemp[index].push(data.id);
            getBjSdunt(v).then(res => {
            /** 获取班级学生接口**/
              this.studentArry.splice(index, 1, res.data);
            /** 点击班级设置已选学生在班级选中**/
              let [list, xs_yx, xs_bj] = [this.specialTypeList[index].specialsList, null, null]
              for (const a of list) { // 遍历已选学生
                xs_yx = a;
                for (const b of res.data) { // 遍历班级学生
                  xs_bj = b;
                /** 已选学生是否存在当前班级中,存在则选中**/
                  if (xs_yx.xh == xs_bj.xh) {
                    this.checkboxGroup5[index].push(xs_yx.xh);
                  }
                }
              }
            });
          }
        } catch (e) {
        }
      },
      handleCheckClick(data, node, e) {
      /** @树形插件班级点击事件显示学生方法**/
        try {
          this.$refs.tree[data.checkIndex].setCheckedKeys([]);
          this.$refs.tree[data.checkIndex].setCheckedKeys([data.id]);
        } catch (e) {
        }
      },
      handleClose(index, tag, i) {
      /** @已选学生标签删除方法**/
        let num = -1;
        this.specialTypeList[i].specialsList.splice(index, 1);// 删除已选的学生
        $(this.checkboxGroup5[i]).each((i_, e) => { // 得到删除元素的下标
          if (e == tag.xh) {
            num = i_;
            return false;
          }
        });
        if (num >= 0) { // 已选元素已经删除，班级学生取消选中
          this.checkboxGroup5[i].splice(num, 1);
        }
        this.updateTreeStudenCount(false, i);
      },
      handleInputConfirm(v, i) { /** @班级学生选中增加已选学生方法**/
        if (v.xh) {
          let obj = this.specialTypeList[i].specialsList;
          if (typeof obj == 'undefined') {
            obj = [];
          }// 为空定义一个空数组
          obj.push(v);
          this.specialTypeList[i].specialsList = obj;
        }
        this.inputVisible = false;
      },
      handleCheckedCitiesChange(check, e) {
      /** @班级学生点击事件**/
        let json = e.target,
          em = $(json).parents('label'),
          index = em.attr('typeKey'),
          lxid = em.attr('lxid'),
          map = { xh: json.defaultValue, xm: json.name, xxdm: this.xxdm, lxid };
      /** 点击的学生集合数据**/
        if (check) {
        /** 选中学生**/
          this.handleInputConfirm(map, index);
          this.updateTreeStudenCount(true, index);
        } else {
        /** 取消选中**/
          let num = -1;
          $(this.specialTypeList[index].specialsList).each((i, e) => { //
            if (e.xh == map.xh) {
              num = i;
              return false;
            }
          });
          if (num >= 0) {
            this.specialTypeList[index].specialsList.splice(num, 1);
          }
          this.updateTreeStudenCount(false, index);
        }
      },
      speciaTypeChange() { /** @tab页切换事件**/

      },
      saveClick() {
      /** @保存数据**/
        this.$confirm('确认要保存吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          const pram = { xxdm: this.xxdm, xkxtXslxList: this.specialTypeList }
          saveSpecialInfo(pram).then(res => {
            this.listLoading = false;
            this.$message({ message: res.status > 0 ? '保存成功' : '保存失败', type: 'success' });
            this.dialogFormVisible = false;
            this.getSpecialRawList(null);
          });
        })
      },
      colseDialog() {
      /** @关闭弹框**/
        this.$refs.addForm.resetFields();
        this.dialogFormVisible = false;
        this.specialTypeList = [];
        this.studentArry = [];
        this.checkboxGroup5 = [];
        this.getTypeList();
      },
      handleSizeChange(val) {
      /** 跳转到某页**/
        this.special.query.limit = val;
        this.getSpecialRawList(null);
      },
      handleCurrentChange(val) {
      /** 跳转到某页**/
        this.special.query.page = val;
        this.getSpecialRawList(null);
      },
      updateTreeStudenCount(v, index) {
      /** @更新学生所属班级的树节点数量**/
        let node = this.$refs.tree[index].getNode(this.treeTemp[index][0]), /** 得到学生所属班级节点数组**/
          t_index = node.data.index, /** 当前需要修改班级节点索引**/
          nodeData = node.parent.data;
      /** 当前班级节点的父节点数据**/
      /** 更新年级班级树学生已选个数**/
        if (v) {
          nodeData.children[index].checkCount = nodeData.children[index].checkCount + 1;
          nodeData.checkCount = nodeData.checkCount + 1;
          this.treeData[index].splice(nodeData.index, 1, nodeData);
        } else {
          nodeData.children[index].checkCount = nodeData.children[index].checkCount - 1;
          nodeData.checkCount = nodeData.checkCount - 1;
          this.treeData[index].splice(nodeData.index, 1, nodeData);
        }
      }, goSerch(data) {
      /** 查询搜索按钮调用**/
        this.special.cxmc = data.curValue;
        this.special.cxlx = data.type;
        this.special.njGroup = data.temp[0];
        this.special.bjGroup = data.temp[1];
        this.special.tcsGroup = data.temp[2];
        this.getSpecialRawList()// 特长生列表
      }, getSearchCriteria() { /** 搜索条件接口调用方法**/
        /** 查询年级列表**/
        getNj({ xxdm: this.xxdm }).then(response => {
          let model, a;
          for (a of response.data.rows) {
            model = {};
            model.value = a.njdm;
            model.text = a.njmc;
            this.conditionItems[0].values.push(model);
          }
        });
        /** 查询班级列表**/
        getBj({ xxdm: this.xxdm, dqxn: this.dqxn }).then(response => {
          let model, a;
          for (a of response.data) {
            model = {};
            model.value = a.uuid;
            model.text = a.bj;
            this.conditionItems[1].values.push(model);
          }
        });
        /** 特长生类型列表**/
        getTcsLxList({ xxdm: this.xxdm }).then(response => {
          let model, a;
          for (a of response.data) {
            model = {};
            model.value = a.lxid;
            model.text = a.lxmc;
            this.conditionItems[2].values.push(model);
          }
        });
      }
    }
  }
</script>
<style lang="scss" >
  .content-container {
    padding: 20px;
  }

  .toolbar {
    background: #fff;
    padding: 10px;
    //border:1px solid #dfe6ec;
    margin: 10px 0px;
    .el-form-item {
      margin-bottom: 10px;
    }
  }

  .content-container .el-table {
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    background-color: #fff;
    border: 1px solid #dfe6ec;
    font-size: 14px;
    color: #1f2d3d;
  }

  .tcswh .el-table, .el-table td, .el-table th {
    box-sizing: border-box;
    position: relative;
  }

  .tcswh .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #dfe6ec;
  }

  .tcswh .el-table th {
    overflow: hidden;
    background-color: #eef1f6;
    text-align: left;
  }

  .tcswh .el-table td, .el-table th {
    height: 40px;
    min-width: 0;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .tcswh .el-dialog__body {
    padding: 10px 20px;
  }

  .tcswh .el-dialog__header {
    border-bottom: 1px solid #e5e5e5;
  }

  .tcswh .el-select .el-input {
    width: 80px;
  }

  .tcswh .el-input-group {
    width: 42%;
  }

  .tcswh .el-collapse-item__content {
    padding-bottom: 0px;
  }

  .tcswh .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .tcswh .el-border-button {
    margin: 10px 10px 10px 20px;
    padding: 5px;
  }

  .tcswh .border-y {
    border-bottom: 1px solid #ebeef5;
  }
</style>
