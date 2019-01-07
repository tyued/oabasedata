<template>
  <section class="content-container stupreallocation">
      <search-app ref="searchApp" :search-input-select="searchInputSelect"
                  :search-placeholder="searchPlaceholder"
                  :search-types="searchTypes"
                  :condition-items="conditionItems" @searchClick="goSerch"></search-app>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-button type="primary" icon="el-icon-upload2" @click="drsj">导入</el-button>
    </el-col>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="课程名称">
                <template slot-scope="scope">
                    <span>{{scope.row.kcmc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="课程类别">
                <template slot-scope="scope">
                    <span>{{scope.row.lbmc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="授课教师">
                <template slot-scope="scope">
                    <span>{{scope.row.skr}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="授课时间">
                <template slot-scope="scope">
                    <span>{{scope.row.sksj}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="已分配人数 / 限制人数">
                <template slot-scope="scope">
                    <span>{{scope.row.yfprs}}/{{scope.row.xzrs}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="success" @click="handlefpxs(scope.row)">分配</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <!--导入界面-->
        <el-dialog title="导入数据" :visible.sync="dialog_1" width="560px">
            <el-row>
                <div>
                    <el-upload class="upload-demo"
                    :action="importUrl"
                    :name ="name"
                    :headers="importHeaders"
                    :multiple="false"
                    :data = "{xxdm:this.xxdm,code:code,userId:this.userId}"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-upload="beforeUpload"
                    :on-error="uploadFail"
                    :on-success="uploadSuccess"
                    :file-list="fileList"
                    :limit=1
                    ref="upload"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary" @click="xzwj">选取文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
                    </el-upload>
                </div>
            </el-row>
            <el-row>
                <el-button type="primary" @click="submitUpload">导入</el-button>
                <el-button type="primary" @click="download">模板下载</el-button>
            </el-row>
            <el-row>
                <span><h3>操作说明：</h3></span><br/>
                <span>1、请使用本页面提供的模板进行导入。</span><br/>
                <span>2、请勿修改模板Excel的表头内容。</span><br/>
                <span>3、模板提供的默认信息，请勿随意修改。</span><br/>
                <span>4、模板中显示<span style="color:#FF00FF">紫色</span>的项目不能为空，请注意。</span>
            </el-row>
        </el-dialog>
         <el-dialog title="导入数据" :visible.sync="dialog_2" @close="cancel_dr">
            <span style="font-weight:bold;">提示：</span><span>导入失败，请修改下列异常数据后再重新导入</span>
            <el-table :key='tableKey' :data="errlist" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="课程名称">
                    <template slot-scope="scope">
                        <input v-model="scope.row.zd0"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="学生姓名">
                    <template slot-scope="scope">
                        <input v-model="scope.row.zd1"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级">
                    <template slot-scope="scope">
                        <input v-model="scope.row.zd2"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="">
                    <template slot-scope="scope">
                        <span style="color:#FF0000">{{scope.row.bz}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-button type="primary" @click="againUpload">重新导入</el-button>
                <el-button type="primary" @click="cancel_dr">放弃导入</el-button>
            </el-row>
        </el-dialog>
        <!--新增界面-->
	    <el-dialog title="分配" :visible.sync="dialogFormVisible" @close="colseDialog">
		  <el-row>
	        <el-button type="primary" @click="bc">保存</el-button>
	      </el-row>

	      <el-row style="margin-top:20px;">
	        <span style="padding-right:10px;">筛选条件:</span> <el-button type="primary" @click="bjsubmit" >按班级</el-button> <el-button type="primary" @click="tcssubmit">按特长生类型</el-button>
	      </el-row>
	      <el-form label-width="80px" ref="addForm">
       		<!--已选学生-->
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item title="已选学生:" name="1">
                <div>
                  <el-tag
                    size="small"
                    :key="index"
                    v-for="(xsxx,index) in yfpXsList"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(index,xsxx)">
                    {{xsxx.xm}}
                  </el-tag>
                </div>
              </el-collapse-item>
            </el-collapse>
			<div style="margin-top:10px;" :class="show ? 'xs' : 'yc' ">
              <el-row :gutter="12">
                <el-col :span="6">
                  <el-card shadow="never">
                    <!--年级班级展示-->
                    <el-tree
                      :data="treeData"
                      show-checkbox
                      node-key="id"
                      check-strictly
                      accordion
                      ref="tree"
                      :highlight-current="true"

                      :default-expanded-keys="defaultExpanded"

                      @node-click="handleCheckClick"
                      @check-change="handleCheckChange">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>({{ node.data.checkCount }}/{{ node.data.count }})</span>
                    </span>
                    </el-tree>
                  </el-card>
                </el-col>
                <el-col :span="18">
                  <el-card shadow="hover">
                    <!--班级学生展示-->
                    <el-checkbox-group v-model="checkboxGroup5" size="small"  >
                      <el-checkbox
                        v-for="(student,index) in studentArry"
                        :key="index"
                        :label="student.xh" :name="student.xm"
                        @change="handleCheckedCitiesChange($event,student)"
                        size="small"
                        border>{{student.xm}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-card>
                </el-col>

              </el-row>
            </div>
            <div style="margin-top:10px;" :class="show ? 'yc' : 'xs' ">
              <el-tabs tab-position="left" v-model="activetcs" type="card" style="height: 300px;" @tab-click="tabclick" >
                <el-tab-pane
                    ref="tabs"
                    :key="item.lxid" :name="item.lxmc"
                    v-for="item in tcsList" >
                    <span slot="label">{{item.lxmc}}({{item.yxktcsrs}}/{{item.tcsrs}})</span>
                    <el-checkbox-group v-model="checkboxGroup5" size="small"  >
                      <el-checkbox
                        v-for="(student,index) in studentArry2"
                        :key="index"
                        :label="student.xh" :name="student.xm"
                        @change="handleCheckedtcsChange($event,student)"
                        size="small"
                        border>{{student.xm}}
                      </el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
              </el-tabs>
            </div>
	      </el-form>
	    </el-dialog>
  </section>
</template>
<script>
import { getToken } from 'utils/auth';
import searchApp from '@/views/components/searchbar'
import { getxqList, getxnList, getkclbList } from 'api/components/searchbar'
import { dqxnxqObj, page, xsyfpxq, getIstsdkc, getBjSduntByBjid, getTcsXs, saveXsxkInfo, getXsyfpMbUrl, againUp } from 'api/xkxt/stuPreallocation/index';
export default {
  name: 'stuPreallocation',
  components: {
    searchApp
  },
  data() {
    return {
             /** *搜索配置开始**/
      searchInputSelect: true, /** 显示搜索类型**/
      searchPlaceholder: '',
      searchTypes: [{ /** 配置搜索框** 列如：<option value="1">名称</option>**/
        label: '全部',
        value: 'all'
      }, {
        label: '课程名称',
        value: 'kcmc'
      }, {
        label: '开课人',
        value: 'skr'
      }],
      conditionItems: [{
        key: 'kclbList', /** 课程类别 */
        type: 'Checkbox', /** 类型 :单选Radio或者多选CheckBox；**/
        label: '课程类别',
        values: []
      }, {
        key: 'xnList', /** 学年 */
        type: 'Checkbox',
        label: '所在学年',
        values: []
      }, {
        key: 'xqList', /** 学期 */
        type: 'Checkbox',
        label: '所在学期',
        values: []
      }],
      defaultExpanded: [],
      xxdm: '',
      dqxn: '',
      dqxq: '',
      listLoading: true,                      // 加载
      listQuery: {
        query: {
          page: 1,
          limit: 10
        },
        xxdm: '',
        cxlx: '',
        cxmc: '',
        xnGroup: [],
        xqGroup: [],
        kclbGroup: []
      },
      searchsel: '',                             // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）
      show: true,
      tableKey: 0,                            // 表格
      list: null,
      total: null,
      tcsList: [],
      yfpXsList: [],                         // 已分配学生
      treeData: [],
      checkboxGroup5: [],
      dialogFormVisible: false,               // 弹层是否显示
      dialogStatus: '',
      tabPosition: 'left',
      form: {},                                // 表单
      activeName: '1',  // 设置折叠板
      studentArry: [],
      studentArry2: [],
      treeTemp: [],                    // 班级学生
      kcdm: '',
      week: '',
      section: '',
            // defnjid: '',
      activetcs: '',
      tcstabindex: 0,
      dialog_1: false,
      dialog_2: false,
      errlist: [],
      importUrl: 'api/admin/xkxtXsyfp/importExcel',
      importHeaders: {
        enctype: 'multipart/form-data',
        Authorization: getToken()
      },
      code: 'stuPreallocationManager',
      name: 'upfile',
      fileList: [],
      userId: '',
      changeSure: false                      // 防止重复提交
    }
  },
  created() {
    this.userId = window.localStorage.getItem('userid');
    this.xxdm = window.localStorage.getItem('xxdm');
    this.listQuery.xxdm = this.xxdm;
    this.getSearchCriteria();// 搜索条件
    dqxnxqObj({ xxdm: this.xxdm }).then(response => {
      this.dqxn = response.data.xn;
      this.dqxq = response.data.xq;
    })

    this.getList()
  },

  mounted() {
    this.$refs.searchApp.setChecked();
  },
  methods: {
    getList() {
      this.listLoading = true;
      let cxlx=this.listQuery.cxlx;
      if(cxlx==""){
        this.listQuery.cxlx="all";
      }
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
        // 搜索
    handleFilter() {
      if (this.searchsel === 'all') {
        this.listQuery = { page: 1, limit: 20, name: undefined }
        this.listQuery.xxdm = this.xxdm;
      }
      this.getList();
    },
        // 分页
    handleSizeChange(val) {
      this.listQuery.query.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.query.page = val;
      this.getList();
    },
    getSearchCriteria() { /** 搜索条件接口调用方法**/
            /** 查询课程类别 */
      getkclbList({ xxdm: this.xxdm }).then(response => {
        let model, a;
        for (a of response.data.rows) {
          model = {};
          model.value = a.lbid;
          model.text = a.lbmc;
          this.conditionItems[0].values.push(model);
        }
      });
            /** 查询学年列表**/
      getxnList({ xxdm: this.xxdm }).then(response => {
        let model, a;
        const data = response;
        for (a of data) {
          model = {};
          model.value = a.xn;
          model.text = a.xn;
          this.conditionItems[1].values.push(model);
        }
      });
            /** 查询学期列表 */
      getxqList({ xxdm: this.xxdm }).then(response => {
        let model, a;
        const data = response;
        for (a of data) {
          model = {};
          model.value = a.xq;
          model.text = a.xqmc;
          this.conditionItems[2].values.push(model);
        }
      });
    },
    goSerch(data) {
      this.listQuery.cxmc = data.curValue;
      this.listQuery.cxlx = data.type;
      this.listQuery.kclbGroup = data.temp[0];
      this.listQuery.xnGroup = data.temp[1];
      this.listQuery.xqGroup = data.temp[2];
      this.getList();
    },
        // 导入界面
    drsj() {
      this.dialog_1 = true;
    },
        // 跳转到分配页面
    handlefpxs(row) {
      row.xxdm = this.xxdm;
      this.kcdm = row.kcdm;
      this.week = row.week;
      this.section = row.section;
      this.dialogFormVisible = true;// 打开新增页面弹框
      this.checkboxGroup5 = [];
      this.studentArry = [];
      this.studentArry2 = [];
      xsyfpxq(row).then(response => {
        this.yfpXsList = response.data.yfpXsList;
        this.treeData = response.data.zNodesList;
              // const arr = [];
              // arr.push(this.treeData[0].id);
        if (typeof this.treeData[0] != undefined) {
          this.defaultExpanded.push(this.treeData[0].id);
          this.xgtree(this.treeData);
        }
        this.tcsList = response.data.tcsList;

        this.tcsxs(this.tcsList[0].lxid);
        this.activetcs = this.tcsList[0].lxmc;
      })
    },

    xgtree(treeData) {        /** @弹框操作方法**/
        /** 设置默认第一个班级选中**/
      let [node, bool] = [this.$refs, false];
      if (!bool) {
        setTimeout(() => {
          if (node) { /** 渲染未完成继续请求获取对象**/
            bool = true;
            if (this.treeData[0].children[0] !== undefined) {
              const [tree, key] = [node.tree, this.treeData[0].children[0].id];   // 获取当前树
              $(tree.$el).find('div[role=\'treeitem\']').each((e, i) => {
                if (e == 0) {
                  $(i).find('div:first label[role=\'checkbox\']').remove();
                } else {
                  $(i).parents('div[role=\'treeitem\']').siblings().eq(e - 1).find('div:first label[role=\'checkbox\']').remove();
                }
              });
              tree.setCheckedKeys([key]);// 设置选中
            }
          }
        }, 10);
      }
      this.dialogFormVisible = true;// 打开新增页面弹框
    },
    colseDialog() {       /** 关闭弹框**/
      this.$refs.addForm.resetFields();
      this.dialogFormVisible = false;
        // this.defnjid='';
      this.$refs.tree.setCheckedKeys([]);
    },
    handleCheckChange(data, checked) {  /** @树形插件勾选触发事件方法**/
      if (checked && data.level == 2) {
        this.$refs.tree.setCheckedKeys([]);
        this.$refs.tree.setCheckedKeys([data.id]);
        const v = { bjid: data.id, xxdm: this.xxdm, xn: this.dqxn };
                /** 记录班级id**/
        this.treeTemp = [];
        this.treeTemp.push(data.id);
        getBjSduntByBjid(v).then(res => {
                /** 获取班级学生接口**/
          this.studentArry = res.data;
                /** 点击班级设置已选学生在班级选中**/
          const list = this.yfpXsList;
          let xs_yx, xs_bj;
          for (const a of list) { // 遍历已选学生
            xs_yx = a;
            for (const b of res.data) { // 遍历班级学生
              xs_bj = b;
                    /** 已选学生是否存在当前班级中,存在则选中**/
              if (xs_yx.xh === xs_bj.xh) {
                this.checkboxGroup5.push(xs_yx.xh);
              }
            }
          }
        });
      }
    },
    handleClose(index, xsxx) {  /** @已选学生标签删除方法**/
      let num = -1;
      this.yfpXsList.splice(index, 1);// 删除已选的学生
      $(this.checkboxGroup5).each((i_, e) => { // 得到删除元素的下标
        if (e === xsxx.xh) {
          num = i_;
          return false;
        }
      });
      if (num >= 0) { // 已选元素已经删除，班级学生取消选中
        this.checkboxGroup5.splice(num, 1);
      }
      this.updateTreeStudenCount(false);
    },
      // 选择特长生类型后显示相应学生
    tabclick(tab) {
      const i = tab.index;
      this.tcstabindex = i;
      this.tcsxs(this.tcsList[i].lxid);
    },
      // 特长生学生
    tcsxs(lxid) {
      const v = { lxid, xxdm: this.xxdm };

      getTcsXs(v).then(res => {
              /** 获取特长生类型学生 **/
        this.studentArry2 = res.data;

              /** 点击特长生类型，已选学生在此特长生类型的学生中选中**/
        const list = this.yfpXsList;
        let xs_yx, xs_bj;
        for (let i = 0, j = list.length; i < j; i++) {
          xs_yx = list[i];
          for (let k = 0, g = res.data.length; k < g; k++) {
            xs_bj = res.data[k];
                /** 已选学生是否存在当前班级中,存在则选中**/
            if (xs_yx.xh === xs_bj.xh) {
              this.checkboxGroup5.push(xs_yx.xh);
            }
          }
        }
      });
    },
    handleCheckClick(data, node) {
        /** 树形插件班级点击事件**/

      if (node.level == 2) {
        const v = { bjid: data.id, xxdm: this.xxdm, xn: this.dqxn };
           /** 记录班级id**/
        this.treeTemp = [];
        this.treeTemp.push(data.id);
        getBjSduntByBjid(v).then(res => {
            /** 获取班级学生接口**/
          this.studentArry = res.data;
            /** 点击班级设置已选学生在班级选中**/
          const list = this.yfpXsList;
          let xs_yx, xs_bj;
          for (let i = 0, j = list.length; i < j; i++) {
            xs_yx = list[i];
            for (let k = 0, g = res.data.length; k < g; k++) {
              xs_bj = res.data[k];
                /** 已选学生是否存在当前班级中,存在则选中**/
              if (xs_yx.xh === xs_bj.xh) {
                this.checkboxGroup5.push(xs_yx.xh);
              }
            }
          }
        });
      }
    }, // 树形插件方法结束\

    handleCheckedCitiesChange(check, e) {  /** @班级学生点击事件**/
      const map = { xh: e.xh, xm: e.xm, bjid: e.bjid, lxidstr: e.lxidstr, xxdm: this.xxdm };
      if (check) {
        this.checkStudent(map, 'tree');
      } else {
        this.qxxs(map, 'tree');
      }
    },
    handleInputConfirm(v) { /** @班级学生选中增加已选学生方法**/
      if (v.xh) {
        const obj = this.yfpXsList;
        obj.push(v);
      }
      this.inputVisible = false;
    },
    checkStudent(v, a) {
      const params = { xh: v.xh, kcdm: this.kcdm, week: this.week, section: this.section, xxdm: this.xxdm, xn: this.dqxn, xq: this.dqxq };
      getIstsdkc(params).then(response => {
        if (response.data.istsdkc === 'false1') {
          this.$message({
            message: '此学生已经自己选择过此课程',
            type: 'warning'
          });
          for (const i in this.checkboxGroup5) {
            if (this.checkboxGroup5[i] === v.xh) {
              this.checkboxGroup5.splice(i, 1);
            }
          }
        } else if (response.data.istsdkc === 'false2') {
          this.$message({
            message: '上课时间冲突，相同开课时间的课程不能分配同一个学生',
            type: 'warning'
          });
          for (const i in this.checkboxGroup5) {
            if (this.checkboxGroup5[i] === v.xh) {
              this.checkboxGroup5.splice(i, 1);
            }
          }
        } else {
                     /** 选中学生**/
          this.handleInputConfirm(v);
          if (a === 'tree') {
            this.updateTreeStudenCount(true);
          } else if (a === 'tabs') {
            this.updateTabsStudenCount(true);
          }
        }
      })
    },

     // 取消学生
    qxxs(v, a) {
      for (const i in this.checkboxGroup5) {
        if (this.checkboxGroup5[i] === v.xh) {
          this.checkboxGroup5.splice(i, 1);
        }
      }
                     /** 取消选中**/
      let num = -1;
      $(this.yfpXsList).each((i, e) => { //
        if (e.xh === v.xh) {
          num = i;
          return false;
        }
      });
      if (num >= 0) {
        this.yfpXsList.splice(num, 1);
      }
      if (a === 'tree') {
        this.updateTreeStudenCount(false);
      } else if (a === 'tabs') {
        this.updateTabsStudenCount(false);
      }
    },
    updateTreeStudenCount(v) { /** @更新学生所属班级的树节点数量**/
      const node = this.$refs.tree.getNode(this.treeTemp[0]), /** 得到学生所属班级节点数组**/
        t_index = node.data.index, /** 当前需要修改班级节点索引**/
        nodeData = node.parent.data;
        /** 当前班级节点的父节点数据**/
        /** 更新年级班级树学生已选个数**/
      if (v) {
        nodeData.children[t_index].checkCount = nodeData.children[t_index].checkCount + 1;
        nodeData.checkCount = nodeData.checkCount + 1;
        this.treeData.splice(nodeData.index, 1, nodeData);
      } else {
        nodeData.children[t_index].checkCount = nodeData.children[t_index].checkCount - 1;
        nodeData.checkCount = nodeData.checkCount - 1;
        this.treeData.splice(nodeData.index, 1, nodeData);
      }
    },

    handleCheckedtcsChange(check, e) {
      const map = { xh: e.xh, xm: e.xm, bjid: e.bjid, lxidstr: e.lxidstr, xxdm: this.xxdm };
      if (check) {
        this.checkStudent(map, 'tabs');
      } else {
        this.qxxs(map, 'tabs');
      }
    },

     // 更新特长生类型label后已选人数
    updateTabsStudenCount(v) {
      if (v) {
        this.tcsList[this.tcstabindex].yxktcsrs += 1;
      } else {
        this.tcsList[this.tcstabindex].yxktcsrs -= 1;
      }
    },

    bc() {   /** @保存数据**/
      this.$confirm('确认要保存吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        const pram = { xxdm: this.xxdm, kcdm: this.kcdm, yfpXsList: this.yfpXsList }
        saveXsxkInfo(pram).then(res => {
          this.listLoading = false;
          this.$message({ message: res.status > 0 ? '保存成功' : '保存失败', type: 'success' });
          this.$refs.addForm.resetFields();
          this.dialogFormVisible = false;
          this.getList();
        });
      }).catch(() => {
        this.$message.error('抱歉，系统操作异常请重试！');
      });
    },
      // 导入文件移除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview() {
      // 可以通过 file.response 拿到服务端返回数据
    },
    clearFile() {
      // 清空选择的文件
      this.$refs.upload.clearFiles();
    },
      // 导入前
    beforeUpload(file) {
        // 上传前配置
      const excelfileExtend = '.xls,.xlsx';// 设置文件格式
      const fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (excelfileExtend.indexOf(fileExtend) <= -1) {
        this.$message.error('文件格式错误')
        return false
      }
      this.uploadTip = '正在处理中...'
      this.processing = true
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
        // 上传错误
    uploadFail(err, file) {
      const errmessage = JSON.parse(err.message);
      this.$message.error(errmessage.message);
    },
        // 上传成功
    uploadSuccess(response) {
      this.errlist = response.data;
      if (response.data.length > 0) {
        this.dialog_2 = true;
      } else {
        this.$message({
          message: '导入成功了！',
          type: 'success'
        });
        this.getList();
      }
    },
    againUpload() {
      for (let i = 0; i < this.errlist.length; i++) {
        this.errlist[i].code = this.code;
        this.errlist[i].czr = this.userId;
        this.errlist[i].xxdm = this.xxdm;
      }
      const param = { drlssj: this.errlist }
      againUp(param).then(response => {
        if (response.data.length > 0) {
          this.errlist = response.data;
        } else {
          this.dialog_2 = false;
          this.$message({
            message: '导入成功了！',
            type: 'success'
          });
          this.getList();
        }
      })
    },
    cancel_dr() {
      this.dialog_1 = false;
      this.dialog_2 = false;
      this.clearFile();
      this.getList();
    },
    xzwj() {
      this.clearFile();
    },
        // 下载模板
    download() {
        // 调用后台模板方法,和导出类似
      getXsyfpMbUrl().then(res => {
        const url = res + '/xkxtXsyfp/static/exportXsyfpmd';
        window.open(url);
      });
    },
    bjsubmit() {
      this.show = true;
      for (const nj of this.treeData) {
        let njyxrs = 0;
        for (const bj of nj.children) {
          const bjid = bj.id;
          let bjyxrs = 0;
          const list = this.yfpXsList;
          for (const a of list) {
            if (bjid === a.bjid) {
              bjyxrs += 1;
            }
          }
          bj.checkCount = bjyxrs;
          njyxrs += bjyxrs;
        }
        nj.checkCount = njyxrs;
      }
    },
    tcssubmit() {
      this.show = false;
      for (const item of this.tcsList) {
        const tcslxid = item.lxid;
        let yxrs = 0;
        const list = this.yfpXsList;
        for (const a of list) {
          for (const s of a.lxidstr) {
            if (tcslxid === s) {
              yxrs += 1;
            }
          }
        }
        item.yxktcsrs = yxrs;
      }
    }

  }
}
</script>
<style scoped>
    .app-container .filter-container .filter-item{ vertical-align: inherit;}
    .app-container .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
    .app-container .el-checkbox+.el-checkbox{margin-left: 0;}
    .app-container .el-checkbox{ margin-right: 30px;}
    .stupreallocation .yc{display:none}
    .stupreallocation .xs{display:block}
    .app-container .line{ text-align: center;}

    .content-container {
      padding: 20px;
    }

    .toolbar {
      background: #fff;
      padding: 10px;
      margin: 10px 0px;
    }
    .content-container .el-form-item {
      margin-bottom: 10px;
    }
</style>
