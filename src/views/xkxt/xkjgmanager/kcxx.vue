<template>
    <div class="app-container calendar-list-container">
        <!--搜索控件-->
        <search-app ref="searchbar" :search-input-select="searchInputSelect"
                    :search-placeholder="searchPlaceholder"
                    :search-types="searchTypes"
                    :condition-items="conditionItems" @searchClick="kcGoSerch" shadow="never"></search-app>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="margin-top: 10px;">
          <el-form :inline="true">
            <el-form-item>
              <el-button type="info" plain @click="handleExportXkmd">导出课程选课名单</el-button>
              <el-button type="warning" plain @click="handleCopy">复制上学期选课结果</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
          <el-table-column prop="kcmc" label="课程名称" align="center"></el-table-column>
          <el-table-column prop="lbmc" label="课程类别" width="180" align="center"></el-table-column>
          <el-table-column prop="skrxm" align="center" label="授课教师" width="180"> </el-table-column>
          <el-table-column prop="sksj" align="center" label="授课时间" width="280"></el-table-column>
          <el-table-column prop="xzrs" align="center" label="人数限制" width="140"> </el-table-column>
          <el-table-column prop="xsrs" align="center" label="学生人数"  width="140"></el-table-column>
          <el-table-column prop="xmys"  align="center" label="选满用时" width="140"></el-table-column>
          <el-table-column prop="djl"  align="center" label="点击量" width="140"></el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
                  <el-button slot="reference" type="success" @click="ckXkjgxx(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="kcHandleSizeChange" @current-change="kcHandleCurrentChange" :current-page.sync="listQuery.query.kcpage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.query.limit" layout="total, sizes, prev, pager, next, jumper" :total="kctotal"> </el-pagination>
        </div>
         <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="1000px" >
            <el-form  ref="form" label-width="110px" name="myform">
                <span  :v-model="formTitle">
                    课程名称：{{formTitle.kcmc}}
                    限制人数：{{formTitle.xzrs}}
                    已选人数：{{formTitle.xsrs}}
                </span>
                <el-table  v-if="tableindex == 0"  :key='tableKey' :data="xkjglist" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                      <el-table-column align="center" label="学号"  width="180"  prop="xh"></el-table-column>
                      <el-table-column align="center" label="姓名" width="140" prop="xm"></el-table-column>
                      <el-table-column align="center" label="年级" width="140"  prop="njmc"></el-table-column>
                      <el-table-column align="center" label="班级" width="140"  prop="bjmc"></el-table-column>
                      <el-table-column align="center" label="是否为预分配学生" width="140"  prop="xm">
                          <template slot-scope="scope">
                              <span>{{(scope.row.sjly == 0) ? "否":"是"}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column align="center" label="加入时间"  prop="sqsj"></el-table-column>
                  </el-table>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">关 闭</el-button>
            </div>
          </el-dialog>
    </div>
</template>
<script>
import { kcxxPage, ckxkjg, copyXkxx, getXkmdUrl } from 'api/xkxt/xkjgmanager/index';
import { page } from 'api/xkxt/courseTypeManager/index';
import searchApp from '@/views/components/searchbar';
import { dqxnxqObj } from 'api/admin/acadyear/index';
import { getxqList, getxnList } from 'api/components/searchbar';
const messageTypeOptions = ['短信推送', '微信推送'];
export default {
  name: 'xkjgmanager',
  components: {
    searchApp
  },
  data() {
    return {
      /** *搜索配置开始**/
      searchInputSelect: false,
      searchPlaceholder: '请输入课程名称或开课人',
      searchTypes: [],
      conditionItems: [{
        key: 'KKSJ',
        type: 'Checkbox', /** 类型 :单选Radio或者多选CheckBox；**/
        label: '开课时间',
        values: [
          { value: '1', text: '周一' },
          { value: '2', text: '周二' },
          { value: '3', text: '周三' },
          { value: '4', text: '周四' },
          { value: '5', text: '周五' },
          { value: '6', text: '周六' },
          { value: '7', text: '周日' }]
      }, {
        key: 'kcXnList',
        type: 'Checkbox',
        selected: {}, // 默认选中制定元素
        label: '所在学年',
        values: []
      }, {
        key: 'xsXqList',
        type: 'Checkbox',
        selected: {}, // 默认选中制定元素
        label: '所在学期',
        values: []
      }, {
        key: 'kclbList',
        type: 'Checkbox',
        label: '课程类别',
        values: []
      }], /** 条件配置结束**/
      xxdm: '',
      dqxn: '', // 当前学年
      dqxqmc: '',
      dqxq: '', // 当前学期
      usercode: '', // 当前用户
      tableKey: 0,
      listLoading: false,
      xstotal: 0,
      kctotal: 0,
      list: [],
      xkjglist: [],
      dictMap: {},
      form: {},
      remindForm: {},
      listQuery: {
        query: {
          page: 1,
          limit: 10
        },
        xxdm: '',
        cxlx: '',
        kcXnGroup: [],
        kcXqGroup: [],
        zsGroup: [],
        kclbGroup: []
      },
      kcsearchsel: 'all',
      dialogFormVisible: false,
      remindFormVisible: false,
      dialogStatus: '',
      tabPosition: 'top',
      textMap: {
        ckxkjg: '查看'
      },
      formTitle: {}, // 查看页面题标
      tableindex: '', // 页签标识
      sendMessageText: '', // 发送选课消息推送标识
      changeSure: false, // 防止重复提交
      checkedMessageType: [0],
      messageType: [],
      allXsgxArr: [],
      messageTypes: messageTypeOptions
    };
  },
  created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.usercode = window.localStorage.getItem('usercode');
  },
  mounted() {
    this.getKcSearchCriteria();
    dqxnxqObj({ xxdm: this.xxdm }).then(response => {
      this.dqxn = response.data.xn;
      this.dqxq = response.data.xq;
      this.dqxqmc = response.data.xqmc;
      this.conditionItems[1].selected.value = response.data.xn;
      this.conditionItems[1].selected.text = response.data.xn;
      this.conditionItems[2].selected.value = response.data.xq;
      this.conditionItems[2].selected.text = response.data.xqmc;
      this.$refs.searchbar.setChecked();
      this.listQuery.kcXnGroup = [response.data.xn];
      this.listQuery.kcXqGroup = [response.data.xq];
      this.getList();
    });
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.xxdm = this.xxdm;
      this.listQuery.ssxn = this.dqxn;
      this.listQuery.ssxq = this.dqxq;
      kcxxPage(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.kctotal = response.data.total;
        this.listLoading = false;
      });
    },
    // 查看学生选课结果
    ckXkjgxx(row) {
      this.listQuery.xxdm = this.xxdm;
      this.listQuery.ssxn = this.dqxn;
      this.listQuery.ssxq = this.dqxq;
      this.listQuery.kcdm = row.kcdm;
      this.listQuery.xh = row.xh;
      this.formTitle = row;
      ckxkjg(this.listQuery).then(response => {
        this.xkjglist = response.data.rows;
        this.dialogFormVisible = true;
        this.dialogStatus = 'ckxkjg';
      });
    },
    // 复制上学期选课结果
    handleCopy() {
      this.$confirm('确定复制上学期的选课结果吗？（复制成功后将不可撤销哦）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listQuery.ssxn = this.dqxn;
        this.listQuery.ssxq = this.dqxq;
        console.log(this.listQuery)
        copyXkxx(this.listQuery).then(res => {
          if (res.status == '200') {
            this.$notify({
              title: '成功',
              message: '复制成功',
              type: 'success',
              duration: 2000
            });
          } else {
            this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
          }
        });
        const that = this;
        setTimeout(() => {
          that.changeSure = false;
        }, 1500);
      });
    },
    // 导出课程选课名单
    handleExportXkmd() {
      getXkmdUrl(this.listQuery).then(res => {
        let url = res + '/xkjg/static/exportKcxkmd?ssxn=' + this.dqxn + '&xxdm=' + this.xxdm + '&ssxq=' + this.dqxq;
        url += '&kcXnGroup=' + this.listQuery.kcXnGroup + '&kcXqGroup=' + this.listQuery.kcXqGroup;
        url += '&zsGroup=' + this.listQuery.zsGroup + '&kclbGroup=' + this.listQuery.kclbGroup;
        window.open(url);
      });
    },
    kcHandleSizeChange(val) {
      this.listQuery.query.limit = val;
      this.getList();
    },
    kcHandleCurrentChange(val) {
      this.listQuery.query.page = val;
      this.getList();
    },
    cancel() {
      // 关闭查看选课结果弹窗
      this.dialogFormVisible = false;
    },
    getValue(type, key) {
      const data = this.dictMap[type];
      return _.find(data, { id: key }).text;
    }, kcGoSerch(data) {
      this.listQuery.cxmc = data.curValue;
      this.listQuery.cxlx = data.type;
      this.listQuery.zsGroup = data.temp[0];
      this.listQuery.kcXnGroup = data.temp[1];
      this.listQuery.kcXqGroup = data.temp[2];
      this.listQuery.kclbGroup = data.temp[3];
      this.getList();
    }, getKcSearchCriteria() { /** 搜索条件接口调用方法**/
      /** 查询学年列表**/
      getxnList({ xxdm: this.xxdm }).then(response => {
        if (response.length === 0) {
          response = [{ xn: this.dqxn }]
        }
        let model, a;
        this.conditionItems[1].values = [];
        for (a of response) {
          model = {};
          model.value = a.xn;
          model.text = a.xn;
          this.conditionItems[1].values.push(model);
        }
      });
      /** 查询学期列表*/
      getxqList({ xxdm: this.xxdm }).then(response => {
        if (response.length === 0) {
          response = [{ xq: '01', xqmc: '上学期' }, { xq: '02', xqmc: '下学期' }]
        }
        let model, a;
        this.conditionItems[2].values = [];
        for (a of response) {
          model = {};
          model.value = a.xq;
          model.text = a.xqmc;
          this.conditionItems[2].values.push(model);
        }
      });
      page({ xxdm: this.xxdm }).then(response => {
        let model, a;
        this.conditionItems[3].values = [];
        for (a of response.data.rows) {
          model = {};
          model.value = a.lbid;
          model.text = a.lbmc;
          this.conditionItems[3].values.push(model);
        }
      });
    }
  }
};
</script>

