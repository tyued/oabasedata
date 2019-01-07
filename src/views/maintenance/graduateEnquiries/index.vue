<template>
  <div class="bysManaer">
    <el-row class="bysManaerwrapper">
      <el-col class="bysManaerleft" :span="4">
        <el-aside width="250px" style="margin-left: 20px;">
          <div style="width:250px;margin-bottom:20px;">
            <label style="font-size:15px;font-weight:300"> 毕业学年：</label>
            <el-select style="width: 160px;" @change="getNj" v-model="value" placeholder="请选择毕业学年">
              <el-option v-for="(item, index) in options" :key="'a' + index" :label="item.xn" :value="item.xn">
              </el-option>
            </el-select>
          </div>
          <TreePart class='screenfull' :treeData='njbjTree' :treeHeader="treeHeader" :defaultProps="defaultProps" @treeCClick="treeCClick"></TreePart>
        </el-aside>
      </el-col>
      <el-col class="bysManaerright" :span="18">
        <div class="app-container calendar-list-container studentpagestyle">
          <div class="studentpagestyletopdiv"  style="    padding-left: 20px;">
            <div class="studentpagestyletopbutton">
              <el-button class="filter-item marginleft10" @click="exportfunctresetsecretion" type="primary" icon="edit">导出</el-button>
            </div>
            <el-table @selection-change="handleSelectionChange"
                      ref="multipleTable" :key='tableKey'
                      :data="list" border fit highlight-current-row style="width: 100%;margin-top:50px;">
              <!-- v-loading.body="listLoading" -->
              <!--<el-table-column type="selection" width="40">-->
              <!--</el-table-column>-->
              <el-table-column align="center" label="学生姓名" width="170">
                <template slot-scope="scope">
                  <span>{{scope.row.xm}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="离校班级" width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.bjmc}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="性别" width="100">
                <template slot-scope="scope">
                  <span>{{(scope.row.xbm=='1')?'男':'女'}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="离校学年">
                <template slot-scope="scope">
                  <span>{{scope.row.bynd}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="离校学期">
                <template slot-scope="scope">
                  <span>下学期</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.page"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

</template>
<script>
import jcsj from '@/api/jcsj';
import Cookies from 'js-cookie';
import TreePart from 'components/TreePart';
import {
  getdnxq,
  getxnlb,
  getbjxs,
  njgetxs,
  getnj
} from 'api/maintenance/graduateEnquiries/index';
import { page } from 'api/admin/acadyear/index';
import { termpage } from 'api/admin/term/index';
import { gradepage } from 'api/admin/grade/index';
import { classpage } from 'api/admin/class/index';
import { mapGetters } from 'vuex';

export default {
  name: 'teach',
  components: {
    TreePart
  },
  data() {
    return {
      isNj:false,
      bjId: null,
      datapost: {},
      postparams: {}, // 传参
      temarray: [], // 数组缓存
      treeHeader: '选择毕业班级',
      defaultProps: {
        children: 'children',
        id: 'njdm',
        label: 'name'
      },
      njbjTree: [], //行政区域
      fileList: [],
      errData: [],
      dialogVisible: false, //显示隐藏
      importCjFormVisible: false, //显示隐藏
      xxdm: '',
      listLoading: true, //加载
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      searchsel: 'all', //查询条件                    //判断点击弹层是creat（添加）还是update（编辑）

      tableKey: 0, //表格
      list: null,
      total: null,

      dialogFormVisible: false, //弹层是否显示
      dialogStatus: '',
      textMap: {
        //判断弹层是添加还是编辑
        update: '编辑',
        create: '创建'
      },
      tabPosition: 'left',
      form: {}, //表单

      dictionary: {
        //通用字典表
        jg: [],
        mz: [],
        zjmc: [],
        zzmm: [],
        hyzk: [],
        campusdata: [],
        gwzw: [],
        js: [],
        bm: [] //部门----为了级联
      },
      form_pickerOp: {
        //出生日期
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      form_props: {
        value: 'id',
        label: 'text',
        children: 'children'
      },
      opation_jg: [], //籍贯--传参要求是字符串、所得是数组要转化
      opation_csdm: [], //出生地
      opation_lyd: [], //生源地
      opation_szd: [], //所在地
      xn_listQuery: {
        //学年
        page: 1,
        limit: 50
      },
      postdata: {},
      familyList: [], //家庭成员
      form_mm: '',
      opation_kp: {},
      importLoading: false,
      changeSure: false, //防止重复提交
      options: [],
      value: '',
      tempNjdm: '',
      tempBjdm: '',
    };
  },
  computed: {
    ...mapGetters(['dict']),
    headers: function() {
      return {
        Authorization: Cookies.get('Admin-Token'),
        ReturnResultCode: true
      };
    }
  },
  created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.getxnlbHd();
    this.listQuery.xxdm = this.xxdm;
    // this.getList(this.xn_listQuery, );
  },
  watch: {},
  methods: {
    // 所有学年
    getxnlbHd() {
      getxnlb({ xxdm: this.xxdm }).then(res => {
        this.options = res;
        this.getdnxqHd();
      });
    },
    // 当前学年
    getdnxqHd() {
      getdnxq({ xxdm: this.xxdm }).then(res => {
        this.options.forEach((item, index) => {
          if (item.xn == res.data.xn) {
            this.value = item.xn;
            this.getBjTreedata();
          }
        });
      });
    },
    // 选择时事件
    handleSelectionChange(val) {
      this.temarray = []; //；数组缓存
      val.forEach((item, index) => {
        this.temarray.push(item.xh);
      });
      this.postdata = {
        userCodes: this.temarray,
        xxdm: this.xxdm
      };
    },
    // 导出
    exportfunctresetsecretion() {
      if(!this.tempBjdm && !this.tempNjdm){
        this.$message.warning('请选择毕业班级或毕业年级后导出！');
        return
      }
      if(this.isNj){
        let params = Object;
            params.xxdm = this.xxdm;
            params.njdm = this.tempNjdm
            params.page = 1;
            params.limit = 999;
            params.xn = this.value;
        njgetxs(params)
          .then( response => {
            require.ensure([], () => {
              const { export_json_to_excel } = require('@/vendor/Export2Excel');
              const tHeader = ['学生姓名', '离班年级', '离校学年'];
              const filterVal = ['xm','bjmc', 'bynd'];
              const data = this.formatJson(filterVal, response.data.rows);
              export_json_to_excel(tHeader, data, '毕业信息导出');
            })

          });
      }else{
        let params = Object;
        params.xxdm = this.xxdm;
        params.page = 1;
        params.limit = 999;
        params.bjid = this.tempBjdm;
        getbjxs(params)
          .then( response => {
            require.ensure([], () => {
              const { export_json_to_excel } = require('@/vendor/Export2Excel');
              const tHeader = ['学生姓名', '离班年级', '离校学年'];
              const filterVal = ['xm','bjmc', 'bynd'];
              const data = this.formatJson(filterVal, response.data.rows);
              export_json_to_excel(tHeader, data, '毕业信息导出');
            })

          });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    njGetXs(listQuery, njdm){
      let params = Object;
      params.xxdm = this.xxdm;
      params.njdm = njdm
      params.page = this.listQuery.page;
      params.limit = this.listQuery.limit;
      params.xn = this.value;

      njgetxs(params)
        .then( r => {
          this.list = r.data.rows
          this.total = r.data.total
        });
    },
    getList(page,nodeid){
      let params = Object;
          params.xxdm = this.xxdm;
          params.page = this.listQuery.page;
          params.limit = this.listQuery.limit;
          params.bjid = '';
          params.bjid = nodeid;
          this.bjId = nodeid
      getbjxs(params)
        .then( r => {
          this.list = r.data.rows
          this.total = r.data.total
        });
    },
    // 树点击
    treeCClick(nodeData) {
      if(!nodeData.hasOwnProperty('bj')){
        this.isNj = true
        this.tempNjdm = nodeData.njdm
        this.njGetXs(this.xn_listQuery, nodeData.njdm);
        return
      }
      this.isNj = false
      this.tempBjdm = nodeData.uuid
      this.getList(this.xn_listQuery, nodeData.uuid);
    },
    // 获取年级
    getNj(value) {
      this.value = value;
      this.getBjTreedata();
    },
    // 获取树
    getBjTreedata() {
      let xxdm = this.xxdm;
      let obj = Object();
      obj.xxdm = xxdm;
      obj.bynd = this.value;
      getnj(obj)
        .then(r => {
          let treeData = jcsj.sjfz(r, 'njmc');
          this.njbjTree = this.handle(treeData);
          if(this.njbjTree.length){
            this.isNj = true
            this.tempNjdm = this.njbjTree[0].njdm
            this.njGetXs(this.xn_listQuery, this.njbjTree[0].njdm);
          }else{
            this.list = [];
            this.isNj = false
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 树处理
    handle(arr) {
      arr.forEach((item, index) => {
        if (!item.hasOwnProperty('bj')) {
          item.name = item.njmc;
          item.njdm = item.njdm;
        }
        item.children.forEach(itema => {
          if (itema.hasOwnProperty('bj')) {
            itema.name = itema.bj;
          }
        });
      });
      return arr;
    },
    // getList(data) {
      // if (typeof data != 'object') {
      //   this.listQuery.xxdm = this.xxdm;
      //   stuXspage(this.listQuery).then(response => {
      //     this.list = response.data.rows;
      //     this.total = response.data.total;
      //     this.listLoading = false;
      //   });
      //   return;
      // }
      // this.listLoading = true;
      // this.listQuery.xxdm = this.xxdm;
      // this.listQuery.bjid = data.bjid;
      // this.listQuery.njid = data.njid;
      // stuXspage(this.listQuery).then(response => {
      //   this.list = response.data.rows;
      //   this.total = response.data.total;
      //   this.listLoading = false;
      // });
    // },
    // 搜索
    handleFilter() {
      if (this.searchsel == 'all') {
        this.listQuery = { page: 1, limit: 20, name: undefined };
      }
      this.getList();
    },
    searchChange(val) {
      this.listQuery = {
        page: 1,
        limit: 20,
        xxdm: this.xxdm,
        name: undefined
      };
    },
    // 分页
    handleSizeChange(val) {
      this.listQuery.limit = val;
      if(this.isNj){
        this.njGetXs(this.xn_listQuery, this.tempNjdm);
        return
      }
      this.getList(this.xn_listQuery, this.tempBjdm);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      if(this.isNj){
        this.njGetXs(this.xn_listQuery, this.tempNjdm);
        return
      }
      this.getList(this.xn_listQuery, this.tempBjdm);
    },

    // 取消按钮
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped>
.marginleft10 {
  margin-left: 10px;
}
.flexa {
  display: flex;
}
.flexaline {
  flex-wrap: nowrap;
}
.studentpagestyletopbutton {
  float: left;
  mix-width: 370px;
  margin-bottom: 10px;
}
.filter-container .filter-item {
  vertical-align: inherit;
}
.el-input-group__append,
.el-input-group__prepend {
  padding: 0 10px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.el-checkbox {
  margin-right: 30px;
}
.studentpagestyle .studentpagestyletopdiv {
  width: 100%;
  margin-bottom: 20px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
}
.studentpagestyle .studentpagestyletopsearch {
  float: right;
  text-align: right;
}
.bysManaerwrapper {
  overflow: auto;
  display: flex;
  flex-wrap: nowrap;
}
.bysManaerleft {
  min-width: 250px;
  margin-top: 30px;
}
.bysManaerright {
  min-width: 900px;
}
.topsearchbutton {
  margin-left: 10px;
  height: 40px;
}
</style>
<style lang="scss" scoped>
.import_box {
  .import_body {
    overflow: hidden;
  }
  .import_desc {
    overflow: hidden;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
    text-align: left;
  }
}
</style>
