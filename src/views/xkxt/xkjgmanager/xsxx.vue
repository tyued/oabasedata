<template>
    <div class="app-container calendar-list-container">
      <!--搜索控件-->
      <search-app ref="searchbar" :search-input-select="searchInputSelect"
                  :search-placeholder="searchPlaceholder"
                  :search-types="searchTypes"
                  :condition-items="conditionItems" @searchClick="xsGoSerch"></search-app>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="margin-top: 10px;">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="info" plain @click="handleExportXsmd">导出学生选课名单</el-button>
            <el-tooltip class="item" effect="dark" content="点击该按钮可以提醒未选课的学生家长进行选课" placement="top">
              <el-button type="warning" style="float:right" @click="sendXkRemind">发送选课提醒<i class="el-icon-question"></i></el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="学号" width="170" prop="xh"></el-table-column>
        <el-table-column align="center" label="姓名" width="120" prop="xm"></el-table-column>
        <el-table-column align="center" label="年级" width="140" prop="njmc"></el-table-column>
        <el-table-column align="center" label="班级" width="140" prop="bjmc"></el-table-column>
        <el-table-column align="center" label="特长生类型"  prop="tcslx"></el-table-column>
        <el-table-column align="center" label="学生选课数" width="140" prop="xkCount"></el-table-column>
        <el-table-column align="center" label="操作" width="150" >
          <template slot-scope="scope">
            <el-button slot="reference" type="success" @click="ckXkjgxx(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="xsHandleSizeChange" @current-change="xsHandleCurrentChange" :current-page.sync="listQuery.query.xspage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.query.limit" layout="total, sizes, prev, pager, next, jumper" :total="xstotal"> </el-pagination>
      </div>
         <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="1000px" >
            <el-form  ref="form" label-width="110px" name="myform">
                <span  :v-model="formTitle">
                    学生姓名：{{formTitle.xm}}
                    年级：{{formTitle.njmc}}
                    班级：{{formTitle.bjmc}}
                </span>
                  <el-table :key='tableKey' :data="xkjglist" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                        <el-table-column align="center" label="课程名称"  width="250"  prop="kcmc"></el-table-column>
                        <el-table-column align="center" label="课程类别" width="200"  prop="lbmc"></el-table-column>
                        <el-table-column align="center" label="授课教师" width="180"  prop="skrxm"></el-table-column>
                        <el-table-column align="center" label="授课时间"  prop="sksj"></el-table-column>
                  </el-table>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">关 闭</el-button>
            </div>
          </el-dialog>
           <el-dialog :title="remindMap[dialogStatus]"  :visible.sync="remindFormVisible" width="1000px" >
            <el-form  ref="remindForm" label-width="110px" name="remindForm">
                <el-form-item label="消息内容">
                        <el-input  type="textarea" :autosize="{ minRows: 4, maxRows: 6}"  v-model="sendMessageInfo"></el-input>
                </el-form-item>
                 <el-form-item label="状态">
                    <el-checkbox-group  v-model="checkedMessageType" :min="1" :max="2">
                        <el-checkbox v-for="(message,index) in messageTypes" :label="index"  :key="index">{{message}}</el-checkbox>
                    </el-checkbox-group>
                 </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sendXkMessage('remindForm')" :disabled="changeSure">确 定</el-button>
                <el-button @click="cancel('remindForm')">关 闭</el-button>
            </div>
          </el-dialog>
    </div>
</template>
<script>
import { xsxxPage, ckxkjg, getXkmdUrl, sendXktz, getAllXsgx, tcsPage } from 'api/xkxt/xkjgmanager/index';
import searchApp from '@/views/components/searchbar';
import { dqxnxqObj } from 'api/admin/acadyear/index';
import { getxqList, getxnList, getNj, getBj } from 'api/components/searchbar';
const messageTypeOptions = ['短信推送', '微信推送'];
export default {
  name: 'xkjgmanager',
  components: {
    searchApp
  },
  data() {
    return {
      /** 条件配置结束**/
      searchInputSelect: false,
      searchPlaceholder: '请输入学号或姓名',
      searchTypes: [],
      conditionItems: [{
        key: 'njLIst',
        type: 'Checkbox',
        label: '年级',
        values: []
      }, {
        key: 'bjList',
        type: 'Checkbox',
        label: '班级',
        values: []
      }, {
        key: 'xsXnList',
        type: 'Checkbox',
        selected: {},
        label: '所在学年',
        values: []
      }, {
        key: 'xsXqList',
        type: 'Checkbox',
        selected: {},
        label: '所在学期',
        values: []
      }, {
        key: 'xkzt',
        type: 'Radio',
        label: '选课状态',
        values: [
          { value: 'wx', text: '未选课学生' },
          { value: 'yx', text: '已选课学生' }]
      }], /** 条件配置结束**/
      xxdm: '',
      dqxn: '', // 当前学年
      dqxqmc: '',
      dqxq: '', // 当前学期
      usercode: '', // 当前用户
      tableKey: 0,
      listLoading: false,
      xstotal: 0,
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
        xsXnGroup: [],
        xsXqGroup: [],
        zsGroup: [],
        njGroup: [],
        bjGroup: [],
        conditionData: [],
        xkztGroup: ''
      },
      xssearchsel: 'all',
      dialogFormVisible: false,
      remindFormVisible: false,
      dialogStatus: '',
      tabPosition: 'top',
      textMap: {
        ckxkjg: '查看'
      },
      remindMap: {
        sendXkMessage: '发送选课提醒'
      },
      formTitle: {}, // 查看页面题标
      sendMessageText: '', // 发送选课消息推送标识
      changeSure: false, // 防止重复提交
      checkedMessageType: [0],
      sendMessageInfo: '亲爱的家长您好！您的孩子本学期还未报名任何兴趣班课程，请留意学校选课通知，踊跃报名参选！',
      messageType: [],
      allXsgxArr: [],
      messageTypes: messageTypeOptions
    };
  },
  created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.usercode = window.localStorage.getItem('usercode');
    this.getTcslx();
  },
  mounted() {
    dqxnxqObj({ xxdm: this.xxdm }).then(response => {
      this.dqxn = response.data.xn;
      this.dqxq = response.data.xq;
      this.dqxqmc = response.data.xqmc;
      this.getXsSearchCriteria();
      this.conditionItems[2].selected.value = response.data.xn;
      this.conditionItems[2].selected.text = response.data.xn;
      this.conditionItems[3].selected.value = response.data.xq;
      this.conditionItems[3].selected.text = response.data.xqmc;
      this.$refs.searchbar.setChecked();
      this.listQuery.xsXnGroup = [response.data.xn];
      this.listQuery.xsXqGroup = [response.data.xq];
      this.getXsxxList();
    });
  },
  methods: {
    getTcslx() {
      getAllXsgx({ xxdm: this.xxdm }).then(res => {
        const xsgxArr = res.data.rows
        tcsPage({ xxdm: this.xxdm, page: '1', limit: '200' }).then(tcslxRes => {
          for (const o of xsgxArr) {
            const tcslx = _.find(tcslxRes.data.rows, { lxid: o.lxid });
            if (tcslx) {
              o.lxmc = tcslx.lxmc;
            }
          }
        });
        this.allXsgxArr = xsgxArr;
      });
    },
    getXsxxList() {
      this.listLoading = true;
      this.listQuery.xxdm = this.xxdm;
      this.listQuery.ssxn = this.dqxn;
      this.listQuery.ssxq = this.dqxq;
      xsxxPage(this.listQuery).then(response => {
        this.getTcslx();
        const xsxxArr = response.data.rows;
          // 处理特长生类型信息
        for (const xsxx of xsxxArr) {
          const tcslxArr = _.filter(this.allXsgxArr, { xh: xsxx.xh });
          let tcslx = '';
          for (const tcsxx of tcslxArr) {
            if (tcslx.length > 0) {
              tcslx += ',' + tcsxx.lxmc;
            } else {
              tcslx += tcsxx.lxmc;
            }
            xsxx.tcslx = tcslx;
          }
        }
        this.list = xsxxArr;
        this.xstotal = response.data.total;
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
    // 导出学生选课名单
    handleExportXsmd() {
      getXkmdUrl(this.listQuery).then(res => {
        let url = res + '/xkjg/static/exportXsxkmd?ssxn=' + this.dqxn + '&xxdm=' + this.xxdm + '&ssxq=' + this.dqxq;
        url += '&xsXnGroup=' + this.listQuery.xsXnGroup + '&xsXqGroup=' + this.listQuery.xsXqGroup;
        url += '&njGroup=' + this.listQuery.njGroup + '&bjGroup=' + this.listQuery.bjGroup + '&xkztGroup' + this.listQuery.xkztGroup;
        window.open(url);
        // const url = res + '/xkjg/static/exportXsxkmd?ssxn=' + this.dqxn + '&xxdm=' + this.xxdm + '&ssxq=' + this.dqxq;
      });
    },
    // 发送选课消息提醒
    sendXkRemind() {
      this.remindFormVisible = true;
      this.dialogStatus = 'sendXkMessage';
    },
    // 选课消息提醒推送
    sendXkMessage() {
      this.listQuery.sendMessageInfo = this.sendMessageInfo;
      const tsfs = this.checkedMessageType;
      this.listQuery.tsfs = tsfs;
      this.listQuery.xndm = this.xndm;
      this.listQuery.xqdm = this.xqdm;
      this.listQuery.usercode = this.usercode;
      sendXktz(this.listQuery).then(res => {
        if (res.status == '200') {
          this.$notify({
            title: '成功',
            message: '发送成功',
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
      this.remindFormVisible = false;
    },
    xsHandleSizeChange(val) {
      this.listQuery.query.limit = val;
      this.getXsxxList();
    },
    xsHandleCurrentChange(val) {
      this.listQuery.query.page = val;
      this.getXsxxList();
    },
    cancel() {
      // 关闭查看选课结果弹窗
      this.dialogFormVisible = false;
      // 关闭选课消息推送弹窗
      this.remindFormVisible = false;
    },
    getValue(type, key) {
      const data = this.dictMap[type];
      return _.find(data, { id: key }).text;
    }, xsGoSerch(data) {
      this.listQuery.cxmc = data.curValue;
      this.listQuery.cxlx = data.type;
      this.listQuery.njGroup = data.temp[0];
      this.listQuery.bjGroup = data.temp[1];
      this.listQuery.xsXnGroup = data.temp[2];
      this.listQuery.xsXqGroup = data.temp[3];
      if (data.temp.length < 5 || data.temp[4].length === 0) {
        this.listQuery.xkztGroup = '';
      } else {
        this.listQuery.xkztGroup = data.temp[4];
      }
      this.getXsxxList();
    }, getXsSearchCriteria() {
      /** 查询年级列表**/
      getNj({ xxdm: this.xxdm }).then(response => {
        let model, a;
        this.conditionItems[0].values = [];
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
        this.conditionItems[1].values = [];
        for (a of response.data) {
          model = {};
          model.value = a.uuid;
          model.text = a.bj;
          this.conditionItems[1].values.push(model);
        }
      });
      /** 查询学年列表 */
      getxnList({ xxdm: this.xxdm }).then(response => {
        if (response.length === 0) {
          response = [{ xn: this.dqxn }]
        }
        let model, a;
        this.conditionItems[2].values = [];
        for (a of response) {
          model = {};
          model.value = a.xn;
          model.text = a.xn;
          this.conditionItems[2].values.push(model);
        }
      });
      /** 查询学期列表 */
      getxqList({ xxdm: this.xxdm }).then(response => {
        if (response.length === 0) {
          response = [{ xq: '01', xqmc: '上学期' }, { xq: '02', xqmc: '下学期' }]
        }
        let model, a;
        this.conditionItems[3].values = [];
        for (a of response) {
          model = {};
          model.value = a.xq;
          model.text = a.xqmc;
          this.conditionItems[3].values.push(model);
        }
      });
    }
  }
};
</script>

