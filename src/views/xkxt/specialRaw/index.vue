<template>
  <section class="content-container">
    <!--搜索控件-->
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card shadow="always">
          <el-collapse accordion :span="12">
            <el-collapse-item>

              <template slot="title">
                条件查询：
                <el-input placeholder="请输入学生姓名和学号" v-model="special.cxmc" class="input-with-select" size="medium">
                  <el-select v-model="special.cxlx" slot="prepend" placeholder="全部">
                    <el-option label="全部" value="1"></el-option>
                  </el-select>
                  <el-button type="primary" icon="el-icon-search" slot="append" @click="goSerch"></el-button>
                </el-input>

              </template>
              <el-form ref="form" :model="special" label-width="80px" size="mini">
                <el-form-item class="el-border-button border-y " label="年级:">
                  <el-checkbox-group v-model="special.njGroup" size="mini">
                    <el-checkbox border v-for="(item,index) in njArry" :label="item.njdm" :key="index">
                      {{item.njmc}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item class="el-border-button border-y" label="班级:">
                  <el-checkbox-group v-model="special.bjGroup" size="mini">
                    <el-checkbox border v-for="(item,index) in bjArry" :label="item.uuid" :key="index">
                      {{item.bj}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item class="el-border-button" label="类型:">
                  <el-checkbox-group v-model="special.tcsGroup" size="mini">
                    <el-checkbox border v-for="(item,index) in tcsArry" :label="item.lxid" :key="index">
                      {{item.lxmc}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

              </el-form>

            </el-collapse-item>

          </el-collapse>
        </el-card>
      </el-col>

    </el-row>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button @click="handleAdd" type="primary" icon="icon-el-icon-yhsz">设置特长生</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="tableData" v-loading="listLoading" highlight-current-row style="width: 100%;">
      <!--<el-table-column type="selection" width="55">
      </el-table-column>-->
      <el-table-column type="index" width="100"></el-table-column>
      <el-table-column prop="xh" label="学号" width="300"></el-table-column>
      <el-table-column prop="xm" label="姓名" width="300"></el-table-column>
      <el-table-column prop="njmc" label="年级名称" width="300"></el-table-column>
      <el-table-column prop="bj" label="班级名称" width="300"></el-table-column>
      <el-table-column prop="lxmc" label="类型名称" min-width="300"></el-table-column>

    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
       <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
         </el-pagination>-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="special.query.page" :page-sizes="[10,20,30, 50]" :page-size="special.query.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

    </el-col>
    <!--新增界面-->
    <el-dialog title="设置特长生" :visible.sync="dialogFormVisible" @close="colseDialog">
      <el-form label-width="80px" ref="addForm">
        <el-tabs type="border-card" @tab-click="speciaTypeChange">
          <!--特长生类别-->
          <el-tab-pane v-for="(type,type_index) in specialTypeList" :key="type_index" :label="type.lxmc">
            <!--已选学生-->
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item title="已选学生:" name="1">
                <div>
                  <el-tag
                    type="success"
                    size="small"
                    :key="index"
                    v-for="(tag,index) in type.specialsList"
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
                      :default-expanded-keys="['11']"
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
                        :key="index"
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
  import {
    dqxnxqObj,
    getNj,
    getBj,
    getTcsLxList,
    getBjSdunt,
    getPageList,
    getTcsLx,
    getTreeNode,
    saveSpecialInfo
  } from 'api/xkxt/specialRaw/index'

  export default {
    data: function () {
      return {
        njArry: [],
        bjArry: [],
        tcsArry: [],
        special: {
          cxmc: '',
          cxlx: '',
          njGroup: [],
          bjGroup: [],
          tcsGroup: [],
          query: {
            page: 1,
            limit: 20
          }
        },
        tableData: [],
        total: 0,
        listLoading: false,
        dialogFormVisible: false, //定义新增弹框默认关闭
        activeName: '1',  //设置折叠板
        specialTypeList: [],
        xxdm: '',
        dqxn: '',
        dqxq: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        studentArry: [], //学生
        inputVisible: false,
        checkboxGroup5: [],
        dynamicTagsList: {},//tab 标签
        treeTemp: [], //树临时遍历
        lxid: [] //类型id

      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.dqxn = '2017-2018';
      this.dqxq = '02';
      this.getSpecialRawList(null)//特长生列表
      this.getTypeList();//特长生类型
      /**查询年级列表**/
      getNj({xxdm: this.xxdm}).then(response => {
        this.njArry = response.data.rows;
      })
      /**查询班级列表**/
      getBj({xxdm: this.xxdm, dqxn: this.dqxn}).then(response => {
        this.bjArry = response.data;
      })
      /**特长生类型列表**/
      getTcsLxList({xxdm: this.xxdm}).then(response => {
        this.tcsArry = response.data;
      })
      /* dqxnxqObj({xxdm: this.xxdm}).then(response => {
         this.dqxn = response.xn;
         this.dqxq = response.xq;
         this.getSpecialRawList()//特长生列表
         this.getTypeList();//特长生类型
       })*/
    },
    methods: {
      getSpecialRawList: function (v) {
        /**@获取特长生维护列表**/
        let para = this.special;
        para.xxdm = this.xxdm;
        para.dqxn = this.dqxn;
        this.listLoading = true;
        getPageList(para).then((res) => {
          this.total = res.data.total;
          this.tableData = res.data.rows;
          this.listLoading = false;
        });
      },
      getTypeList: function () {
        /**@获取特长生类型信息数据**/
        let para = {
          xxdm: this.xxdm,
          dqxn: this.dqxn
        };
        getTcsLx(para).then((res) => {   //获取特长生类型接口返回的值
          this.specialTypeList = res.data;
          for (let i = 0, j = this.specialTypeList.length; i < j; i++) {
            let vv = [];
            this.lxid.push(this.specialTypeList[i].lxid);
            this.studentArry.push(vv);
            this.checkboxGroup5.push(vv);
            this.treeTemp.push(vv);
          }
          this.loadTree();
          /**加载树**/
        });
      },
      loadTree: function () {
        /**@获取年级班级树形数据**/
        let para = {
          xxdm: this.xxdm,
          dqxn: this.dqxn,
          lxid: JSON.stringify(this.lxid)
        }
        getTreeNode(para).then((res) => { //获取树形插件数据接口
          this.treeData = res.data;
        });
      },
      handleAdd: function () {        /**@弹框操作方法**/
        /**设置默认第一个班级选中**/
        let [node, bool] = [this.$refs, false];
        if (!bool) {
          setTimeout(() => {
            if (node) {
              /**渲染未完成继续请求获取对象**/
              bool = true;
              for (let i in this.treeData) {
                let [tree, key] = [node.tree[i], this.treeData[i][0].children[0].id];   //获取当前树
                $(tree.$el).find("div[role='treeitem']").each(function (e, i) {
                  if (e == 0) {
                    $(i).find("div:first label[role='checkbox']").remove();
                  } else {
                    $(i).parents("div[role='treeitem']").siblings().eq(e - 1).find("div:first label[role='checkbox']").remove();
                  }
                });
                tree.setCheckedKeys([key]);//设置选中

              }
            }
          }, 10);
        }
        this.dialogFormVisible = true;//打开新增页面弹框
      },
      handleCheckChange: function (data, checked) {  /**@树形插件勾选触发事件方法**/
        if (checked && data.level == 2) {
          this.$refs.tree[data.checkIndex].setCheckedKeys([]);
          this.$refs.tree[data.checkIndex].setCheckedKeys([data.id]);
          let [v, index] = [{bjid: data.id, xxdm: this.xxdm, xn: this.dqxn}, data.checkIndex];
          /**记录班级id**/
          this.treeTemp[index] = [];
          this.treeTemp[index].push(data.id);
          getBjSdunt(v).then((res) => {
            /**获取班级学生接口**/
            this.studentArry.splice(index, 1, res.data);
            /**点击班级设置已选学生在班级选中**/
            let [list, xs_yx, xs_bj] = [this.specialTypeList[index].specialsList, null, null]
            for (let a of list) {//遍历已选学生
              xs_yx = a;
              for (let b of res.data) {//遍历班级学生
                xs_bj = b;
                /**已选学生是否存在当前班级中,存在则选中**/
                if (xs_yx.xh == xs_bj.xh) {
                  this.checkboxGroup5[index].push(xs_yx.xh);
                }
              }
            }
          });

        }
      },
      handleCheckClick: function (data, node, e) {
        /**@树形插件班级点击事件显示学生方法**/
        this.$refs.tree[data.checkIndex].setCheckedKeys([]);
        this.$refs.tree[data.checkIndex].setCheckedKeys([data.id]);
      },
      handleClose: function (index, tag, i) {
        /**@已选学生标签删除方法**/
        let num = -1;
        this.specialTypeList[i].specialsList.splice(index, 1);//删除已选的学生
        $(this.checkboxGroup5[i]).each(function (i_, e) { //得到删除元素的下标
          if (e == tag.xh) {
            num = i_;
            return false;
          }
        });
        if (num >= 0) {//已选元素已经删除，班级学生取消选中
          this.checkboxGroup5[i].splice(num, 1);
        }
        this.updateTreeStudenCount(false, i);
      },
      handleInputConfirm: function (v, i) { /**@班级学生选中增加已选学生方法**/
        if (v.xh) {
          let obj = this.specialTypeList[i].specialsList;
          if (typeof(obj) == "undefined") {
            obj = [];
          }//为空定义一个空数组
          obj.push(v);
          this.specialTypeList[i].specialsList = obj;
        }
        this.inputVisible = false;
      },
      handleCheckedCitiesChange: function (check, e) {
        /**@班级学生点击事件**/
        let json = e.target,
          em = $(json).parents("label"),
          index = em.attr("typeKey"),
          lxid = em.attr("lxid"),
          map = {xh: json.defaultValue, xm: json.name, xxdm: this.xxdm, lxid: lxid};
        /**点击的学生集合数据**/
        if (check) {
          /**选中学生**/
          this.handleInputConfirm(map, index);
          this.updateTreeStudenCount(true, index);

        } else {
          /**取消选中**/
          let num = -1;
          $(this.specialTypeList[index].specialsList).each(function (i, e) { //
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
      speciaTypeChange: function () { /**@tab页切换事件**/

      },
      saveClick: function () {
        /**@保存数据**/
        this.$confirm('确认要保存吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let pram = {xxdm: this.xxdm, xkxtXslxList: this.specialTypeList}
          saveSpecialInfo(pram).then((res) => {
            console.log("===========");
            this.listLoading = false;
            this.$message({message: res.status > 0 ? '保存成功' : "保存失败", type: 'success'});
            this.$refs['addForm'].resetFields();
            this.dialogFormVisible = false;
            this.getSpecialRawList(null);
          });
        }).catch(() => {
          this.$message.error('抱歉，系统操作异常请重试！');
        });
      },
      colseDialog: function () {
        /**@关闭弹框**/
        this.$refs['addForm'].resetFields();
        this.dialogFormVisible = false;
        this.specialTypeList = [];
        this.studentArry = [];
        this.checkboxGroup5 = [],
          this.getTypeList();
      },
      handleSizeChange: function (val) {
        /**跳转到某页**/
        this.special.query.limit = val;
        this.getSpecialRawList(null);
      },
      handleCurrentChange: function (val) {
        /**跳转到某页**/
        this.special.query.page = val;
        this.getSpecialRawList(null);
      },
      updateTreeStudenCount: function (v, index) {
        /**@更新学生所属班级的树节点数量**/
        let node = this.$refs.tree[index].getNode(this.treeTemp[index][0]), /**得到学生所属班级节点数组**/
        t_index = node.data.index, /**当前需要修改班级节点索引**/
        nodeData = node.parent.data;
        /**当前班级节点的父节点数据**/
        /**更新年级班级树学生已选个数**/
        if (v) {
          nodeData.children[t_index].checkCount = nodeData.children[t_index].checkCount + 1;
          nodeData.checkCount = nodeData.checkCount + 1;
          this.treeData[index].splice(nodeData.index, 1, nodeData);
        } else {
          nodeData.children[t_index].checkCount = nodeData.children[t_index].checkCount - 1;
          nodeData.checkCount = nodeData.checkCount - 1;
          this.treeData[index].splice(nodeData.index, 1, nodeData);
        }
      }, goSerch: function () {
        this.getSpecialRawList()//特长生列表
      }
    }
  }
</script>
<style lang="scss">
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

  .el-table {
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    background-color: #fff;
    border: 1px solid #dfe6ec;
    font-size: 14px;
    color: #1f2d3d;
  }

  .el-table, .el-table td, .el-table th {
    box-sizing: border-box;
    position: relative;
  }

  .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #dfe6ec;
  }

  .el-table th {
    overflow: hidden;
    background-color: #eef1f6;
    text-align: left;
  }

  .el-table td, .el-table th {
    height: 40px;
    min-width: 0;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .el-dialog__body {
    padding: 10px 20px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #e5e5e5;
  }

  .el-select .el-input {
    width: 80px;
  }

  .el-input-group {
    width: 42%;
  }

  .el-collapse-item__content {
    padding-bottom: 0px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .el-border-button {
    margin: 10px 10px 10px 20px;
    padding: 5px;
  }
  .border-y {
    border-bottom: 1px solid #ebeef5;
  }
</style>
