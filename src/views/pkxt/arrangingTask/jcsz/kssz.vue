<template>
  <el-container class="kssz">
    <el-aside width="200px">
      <el-card class="box-card-kssz">
        <div slot="header" class="clearfix">
          <span>设置排课年级</span>
        </div>
        <div>
          <el-scrollbar style="height: 210px" class="scro">
            <el-tree class='pkbjtree' ref="tree" :data="treeData" node-key="id" :default-expanded-keys="[100]" :props="defaultProps" :highlight-current="true" @node-click="handleTreeClick">
            </el-tree>
          </el-scrollbar>
        </div>
      </el-card>
      <el-card class="box-card-kssz">
        <div slot="header" class="clearfix">
          <span>上课天数</span>
        </div>
        <div>
          <el-checkbox-group @change="handleWeek" v-model="weekGroup" size="small">
            <el-checkbox v-for="(item, index) in weeks" :label="index+1" :key="index">
              {{item}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-card>
      <el-card class="box-card-kssz">
        <div slot="header" class="clearfix">
          <span>上课节数</span>
        </div>
        <div>
          <div class="pkset fl">
            <span class='kcspan'>上午</span>
            <el-input-number v-model="num1" :min="0" :max="10" label="上午节数" size="small"></el-input-number>
          </div>
          <div class="pkset fl">
            <span class='kcspan'>下午</span>
            <el-input-number v-model="num2" :min="0" :max="10" label="下午节数" size="small"></el-input-number>
          </div>
          <div class="pkset fl">
            <span class='kcspan'>晚上</span>
            <el-input-number v-model="num3" :min="0" :max="10" label="晚上节数" size="small"></el-input-number>
          </div>
        </div>
      </el-card>
    </el-aside>
    <el-main>
      <el-card shadow="never">
        <div class="view">
          <div class="rightitem">
            <div class="setKCtime">
              <div class="pkset fr">
                <el-button icon="el-icon-document" size="small" type="success" @click="createTableCheck">生成课表</el-button>
                <el-button icon="el-icon-time" @click="showTimeList" size="small" type="primary">节次时间</el-button>
                <el-button icon="el-icon-bell" @click="showPublicTime" size="small" type="primary">公共时段</el-button>
              </div>
            </div>
          </div>
          <div style="padding-bottom: 10px">
            <el-alert style="margin: 4px 0 !important;" title="温馨提示，请保持课节数数据与后续规则设置数据一致。" type="warning" show-icon>
            </el-alert>
          </div>
          <el-table id="KbMain-zhangzheng" :data="tableDataClass" :cell-class-name="handleTableItemClass" :span-method="handleClassTable" border style="width: 100%;" :row-class-name="tableRowClassName">
            <el-table-column align="center" label="星期/节次切换" width="180">
              <template slot-scope="scope">
                <div @click="editRow(scope.row.title, $event)">
                  <span :class="{'span-top': scope.row.title.qzsj}">{{ scope.row.title.jcmc }}</span>
                  <!-- <span :class="{bluetxt: scope.row.title.jcdm}">&nbsp;</span> -->
                  <span :class="{'span-bottom': scope.row.title.qzsj}" v-if="qzsjFlag">{{ scope.row.title.qzsj }}</span>
                  <div v-if="scope.row.title.close" @click="closeRow(scope.row.title)" class="close">
                    <i class="el-icon-close"></i>
                  </div>
                  <div v-if="scope.row.title.editState" class="input-box">
                    <span :class="{'span-top': scope.row.title.qzsj}">
                      <input ref="inp" @keyup="saveRow($event, scope.row.title)" @focus="handleFocus($event,scope.row.title)" @blur="handleInputBlur($event, scope.row.title)" type="text" v-model="scope.row.title.jcmc" v-focus="focusState">
                    </span>
                    <!-- <span class="span-top" :class="{bluetxt: scope.row.title.jcdm}">&nbsp;</span> -->
                    <span :class="{'span-bottom': scope.row.title.qzsj}" v-if="qzsjFlag">{{ scope.row.title.qzsj }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in copyWeekGroup" :key="index" align="center" :label="'星期' + formatWeek(item)">
              <template slot-scope="scope">
                <div class="content" :class="{isforbidden: scope.row['amount' + item].gray}" @click="handleChange(scope.row['amount' + item])">{{scope.row['amount' + item].name}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-main>

    <!--公共时段-->
    <el-dialog title="添加公共时间段" :visible.sync="selpublictime" width="500px">
      <el-form :model="publictimeCheck" ref="publictimeCheck2" label-width="90px">

        <el-form-item prop="selTime" resetField label="添加到" :rules="[{required: true,message: '时间段不能为空'}]">
          <el-select v-model="publictimeCheck.selTime" placeholder="请选择">
            <el-option v-for="item in publictimeInfoArr" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="selName" resetField label="名称" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-input v-model="publictimeCheck.selName" placeholder="请输入名称" style="width:250px;"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="selpublictime = false">取 消</el-button>
        <el-button type="primary" @click="submitPublicForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 节次时间安排 -->
    <el-dialog title="节次时间设置" :visible.sync="setkbtime" width="550px">
      <!-- <el-form :model="publictimeCheck" ref="publictimeCheck1" label-width="90px">
      </el-form> -->
      <div class='jcbox' v-for="(item, index) in jclist" :key="index">
        <span class="jctit">{{item.jcmc}}</span>
        <el-time-picker :clearable="false" @change="everyTimerChange(item, index)" value-format="HH:mm:ss" :arrow-control="true" is-range v-model="item.timerArr" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
        </el-time-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="qzsjFlag" @click="submitSetTime(0)">不显示</el-button>
        <el-button v-else type="primary" @click="submitSetTime(0)">不显示</el-button>
        <el-button v-if="!qzsjFlag" @click="submitSetTime(1)">显 示</el-button>
        <el-button v-else type="primary" @click="submitSetTime(1)">显 示</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>
<script>
import * as api from 'api/pkxt/arrangingTask/jcsz/kssz';
import { checkGzsz, initGzsz } from 'api/pkxt/arrangingTask/jcsz/kcsz';
import { fromatNum } from '@/utils/converNum';
import jcsj from '@/api/jcsj';
export default {
  name: 'home',
  directives: {
    focus: {
      inserted(el) {
        console.log('el insertedl');
        el.focus();
      }
    }
  },
  data() {
    return {
      njList: '',
      bjList: '',
      clickFlag: false, // 防止连续点击的开关
      njdm: '',
      bjdm: '',
      xxdm: this.$route.query.xxdm,
      dqxn: this.$route.query.dqxn,
      rwid: this.$route.query.rwid,
      treeData: [], // 班级树节点数组
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      num1: 0, // 上午节数
      num2: 0, // 下午节数
      num3: 0, // 晚上节数
      weekGroup: [], // 表格的星期数组
      copyWeekGroup: [], // 表格的星期数组的缓存
      weeks: [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期日'
      ],
      hxszFlag: false,
      tableDataClass: [], // 表格数据数组
      selpublictime: false, // 公共时间弹出层控制
      setkbtime: false, // 节次时间表弹出层
      publictimeInfoArr: [], // 公共时间信息 第*节 数组
      jclist: [], // 节次列表
      publictimeCheck: { selTime: '', selName: '' }, // 公共时间检查对象
      saveTimeList: [],
      bool: false,
      spanArr: [], // 合并表格的数组
      LENGTH: 0, // 用来判断班级年级是否一致
      clickBool: 1, // 班级树的点击状态 1 为全校 2 为年级 3 班级
      treeState: null,
      weekObj: {},
      editState: false, // 控制编辑input的显示
      n1: 0, // 上下午的分割位置
      n2: 1, // 下午晚上的分割位置
      focusState: false, // v-focus的控制开关
      len: null, // 统计
      oldJcmc: '',
      qzsjFlag: '',
      _tableDataClass: [], // 表格数据的缓存
      hello: false
    };
  },
  created() {
    this.hello = false;
  },
  methods: {
    async initKssz() {
      this.LENGTH = 0;
      const parm = { xxdm: this.xxdm, xn: this.dqxn };
      /** 获取年级**/
      this.njList = await jcsj.hqnjlb(parm);
      /** 获取班级**/
      this.bjList = await jcsj.hqbjlb(parm);
      const res = await api.querySection({
        rwid: this.rwid,
        xxdm: this.xxdm
      });
      const { data, status } = res;
      if (status == 200) {
        this.creatNjTree();
        if (data) {
          // 节次时间是否显示标志
          if (res.data.sfxs === '1') {
            this.qzsjFlag = true;
          } else {
            this.qzsjFlag = false;
          }
          const jsArr = data.pkzs.split(',');
          const tmpArr = [];
          jsArr.forEach(item => {
            tmpArr.push(parseInt(item));
            this.weekObj['day' + parseInt(item)] = true;
          });
          this.weekGroup = tmpArr;
          this.num1 = data.swjs;
          this.num2 = data.xwjs;
          this.num3 = data.wsjs;
        } else {
          this.weekGroup = [1, 2, 3, 4, 5];
          this.num1 = 4;
          this.num2 = 4;
          this.num3 = 4;
        }
        this.copyWeekGroup = this.weekGroup.map(item => item);
        this.len = this.weekGroup.length;
        window.localStorage.setItem(
          'numberArr',
          JSON.stringify([this.num1, this.num2, this.num3])
        );
        window.localStorage.setItem(
          'weekGroup',
          JSON.stringify(this.weekGroup)
        );
        if (this.treeData[0].children) {
          this.treeData[0].children.forEach(item => {
            if (item.children) {
              this.LENGTH = this.LENGTH + item.children.length;
            }
          });
        }
        // 一开始就走全校，刷新也是走全校
        this.handleTableState();

        this.checkHxsz();
      }
    },
    creatNjTree() {
      // 创建左侧班级树
      const tmpArr = [];
      const schoolObj = { label: '全校', id: '100', children: [] };
      for (const item of this.njList) {
        const njdx = {};
        njdx.id = item.njdm;
        njdx.label = item.njmc;
        njdx.children = [];
        for (const bj of this.bjList) {
          if (bj.njdm === item.njdm) {
            const bjdx = {};
            bjdx.id = item.njdm + '-' + bj.uuid;
            bjdx.label = bj.bj;
            njdx.children.push(bjdx);
          }
        }
        schoolObj.children.push(njdx);
      }
      tmpArr.push(schoolObj);
      this.treeData = tmpArr;
    },
    everyTimerChange(item, index) {
      // 提交节次时间列表
      if (item.timerArr) {
        if (typeof item.timerArr[0] == 'string') {
          item.qzsj = item.timerArr.join('~');
        }
        if (typeof item.timerArr[0] == 'object') {
          item.qzsj = item.timerArr;
        }
      }
      const query = {
        jcdm: item.jcdm,
        jcmc: item.jcmc,
        jcwz: item.jcwz,
        qzsj: item.qzsj,
        rwid: item.rwid,
        sfgs: item.sfgs,
        xh: item.xh,
        xxdm: item.xxdm
      };
      this.updateSectionTiming(query);
    },
    updateSectionTiming(query) {
      api.updateSectionTiming(query).then(res => {
        if (res.status == 200) {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          });
        }
      });
    },
    handleTreeClick(data, node) {
      // 树型列表点击方法
      const { level } = node;
      switch (level) {
        case 1: // 点击全校
          this.treeState = 1;
          this.clickBool = 1; // 点击状态
          this.LENGTH = 0; // 每次进来先初始化为0
          if (data.children) {
            data.children.forEach(item => {
              if (item.children) {
                this.LENGTH = this.LENGTH + item.children.length; // 算出有多少个班级 与cnt字段比较
              }
            });
            // schoolObj.children.push(njdx);
          }
          if (this.bool) {
            this.handleTableState();
          }
          break;
        case 2:
          this.treeState = 2;
          this.clickBool = 2;
          this.LENGTH = data.children.length;
          this.njdm = data.id;
          if (this.bool) {
            this.handleTableState(data.id); // 只传了年级代码
          }
          break;
        case 3:
          this.clickBool = 3;
          this.LENGTH = 0;
          const tmpArr = data.id.split('-');
          this.njdm = tmpArr[0];
          this.bjdm = tmpArr[1];
          if (this.bool) {
            this.handleTableState(tmpArr[0], tmpArr[1]); // 显示表格的方法，会判断传入参数来请求是年级还是班级
          }
          break;
      }
    },
    createTableCheck() {
      // 检测规则设置和课程设置是否已经设置
      if (this.hxszFlag) {
        // 是否清空课程设置和规则设置并重新生成课表
        this.$confirm(
          '确定重新生成课表,并且清空规则条件和课程设置历史数据？（规则条件清空后无法恢复哦）',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          const obj = { rwid: this.rwid, xxdm: this.xxdm };
          // 清空规则条件并且初始化课程设置
          api.initJxjh(obj).then(() => {
            this.$notify({
              title: '成功',
              message: '规则条件历史数据和课程数据已清空',
              type: 'success',
              duration: 2000
            });
            this.createTable();
            this.hxszFlag = false;
          });
        });
      } else {
        this.createTable();
      }
    },
    createTable() {
      // 生成表格
      // 批量保存节数时间列表
      const query = [];
      const length = this.num1 + this.num2 + this.num3; // 先把节数渲染出来，此时无公共时段
      for (let i = 0; i < length; i++) {
        query.push({
          jcdm: i + 1,
          jcmc: '第' + this.convertNum(i + 1) + '节',
          jcwz: '',
          qzsj: '',
          sfgs: 2,
          xxdm: this.xxdm,
          rwid: this.rwid
        });
      }
      api.saveSectionTiming(query).then(res => {
        if (res.status == 200) {
          // 保存节数
          const data = {};
          this.weekGroup = _.sortBy(this.weekGroup, item => item);
          this.copyWeekGroup = this.weekGroup.map(item => item);
          window.localStorage.setItem(
            'weekGroup',
            JSON.stringify(this.weekGroup)
          );

          data.pkzs = this.weekGroup.join(',');
          data.rwid = this.rwid;
          data.swjs = this.num1;
          data.xwjs = this.num2;
          data.wsjs = this.num3;
          data.xxdm = this.xxdm;
          this.len = this.weekGroup.length;
          api
            .deleteSection({
              // 先删后插
              rwid: this.rwid,
              xxdm: this.xxdm
            })
            .then(res => {
              if (res.status === 200) {
                api.saveSection(data).then(res => {
                  if (res.status == 200) {
                    this.$notify({
                      title: '成功',
                      message: '创建成功',
                      type: 'success',
                      duration: 2000
                    });
                    // 展示表格
                    this.bjdm = '';
                    this.njdm = '';
                    this.handleTableState();
                    this.weekObj = {};
                    this.weekGroup.forEach(n => {
                      this.weekObj['day' + n] = true;
                    });
                    window.localStorage.setItem(
                      // 也要存，固定排不排模块中需要用
                      'numberArr',
                      JSON.stringify([this.num1, this.num2, this.num3])
                    );
                  } else {
                    this.$notify.error({ title: '错误', message: '创建失败' });
                  }
                });
              }
            });
        }
      });
    },
    showTimeList() {
      // 时间节点弹出层
      this.setkbtime = true;
      this.querySectionTiming();
    },
    querySectionTiming() {
      // 先获取时间节点列表
      api
        .cxjcsj({
          rwid: this.rwid,
          xxdm: this.xxdm
        })
        .then(res => {
          // console.log(res, 'jcsj')
          const { data, status } = res;
          if (status === 200) {
            // this.saveTimeList = data
            this.jclist = data.map(item => {
              if (!item.qzsj || item.qzsj === '') {
                item.qzsj = '00:00:00~23:00:00'; // 给一个默认值
              }
              // item.timerArr = [new Date(2016, 9, 10, 8, 40, 23), new Date(2016, 9, 10, 9, 40)]
              item.timerArr = item.qzsj.split('~');
              // item.timerArr[0] = this.timePicker(item.timerArr[0]);
              // item.timerArr[1] = this.timePicker(item.timerArr[1]);
              return item;
            });
          }
        });
    },
    timePicker(str) {
      // 暂时没用
      const arr = str.split(':');
      return new Date(
        2018,
        7,
        6,
        parseInt(arr[0]),
        parseInt(arr[1]),
        parseInt(arr[2])
      );
    },
    submitSetTime(flag) {
      // 保存每个时间
      // 渲染一下表格
      this.updateJcsjFlag(flag);
    },
    showPublicTime() {
      // 公共时段弹出层
      this.selpublictime = true;
      const tmpArr = [];
      const sumrows = parseInt(this.num1 + this.num2 + this.num3);
      for (let i = 1; i <= sumrows; i++) {
        // 显示选择列表
        tmpArr.push({
          value: '+' + i,
          label: '第' + this.convertNum(i) + '节前'
        });
        tmpArr.push({
          value: '-' + i,
          label: '第' + this.convertNum(i) + '节后'
        });
      }
      this.publictimeInfoArr = tmpArr;
    },
    submitPublicForm() {
      // 提交公共时段表格
      this.$refs.publictimeCheck2.validate(valid => {
        if (valid) {
          const obj = {
            jcdm: '',
            jcmc: this.publictimeCheck.selName,
            jcwz: this.publictimeCheck.selTime,
            qzsj: '', // 00:00:00~00:00:00
            rwid: this.rwid,
            xxdm: this.xxdm,
            sfgs: 1
          };
          api.saveOneSectionTiming(obj).then(res => {
            if (res.status == 200) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              });

              // 渲染一下表格
              this.handleTableState();
            } else {
              this.$notify.error({ title: '错误', message: '保存失败' });
            }
          });
          this.selpublictime = false;
        }
      });
    },
    tableRowClassName({ row, rowIndex }) {
      // 组件自带控制样式的方法
      // 表格行样式
      for (let i = 0; i < this.spanArr.length; i++) {
        if (row.title.idx === this.spanArr[i]) {
          return 'span-item title-box'; // 黄色条的类名
        }
      }
      if (rowIndex === this.n1 || rowIndex === this.n2) {
        return 'bar-item'; // 灰色bar
      }
    },
    handleClassTable({ row, column, rowIndex, columnIndex }) {
      // 合并表格 设置bar
      if (columnIndex === 0) {
        for (let i = 0; i < this.spanArr.length; i++) {
          if (row.title.idx === this.spanArr[i]) {
            // 早读7:48~7:48     午休
            return {
              rowspan: 1,
              colspan: this.len + 1 // 合并的长度是动态的
            };
          }
        }
        if (rowIndex == this.n1 || rowIndex == this.n2) {
          return {
            rowspan: 1,
            colspan: this.len + 1
            // colspan: this.weekGroup.length + 1
          };
        }
      }
    },
    handleTableItemClass({ row, column, rowIndex, columnIndex }) {
      // 鼠标样式
      if (columnIndex !== 0) {
        return 'mouse-style';
      }
    },
    handleChange(obj) {
      // 点击表格，保存列表
      if (!this.clickFlag) {
        return;
      }
      this.clickFlag = false;
      // console.log(this.clickBool, 'bool')
      // console.log(obj);
      const { pkjs, pkzs, sfpk } = obj;

      switch (this.clickBool) {
        case 1: // 全校
          switch (sfpk) { // -1为可以保存 1为已有数据，要删除
            case -1:
              this.saveTd(null, null, pkjs, pkzs, -1);
              break;
            case 1:
              this.deleteTd(null, null, pkjs, pkzs);
              break;
          }
          break;
        case 2: // 年级
          switch (sfpk) {
            case -1:
              this.saveTd(this.njdm, null, pkjs, pkzs, -1); // 传-1是用来控制点击显示不排课
              break;
            case 1:
              this.deleteTd(this.njdm, null, pkjs, pkzs);
              break;
          }
          break;
        case 3:
          switch (sfpk) {
            case -1:
              this.saveTd(this.njdm, this.bjdm, pkjs, pkzs, -1);
              break;
            case 1:
              this.deleteTd(this.njdm, this.bjdm, pkjs, pkzs);
              break;
          }
          break;
      }
    },
    saveTd(njdm, bjdm, pkjs, pkzs, state) {
      // 保存表格
      this.treeState = null;
      const bjMap = []; // 要进行发送的对象
      if (!njdm && !bjdm) {
        // 无年级 无班级 = 全校
        const njList = this.njList;
        for (const njxx of njList) {
          const bjdata = _.filter(this.bjList, { njdm: njxx.njdm });
          for (const bjxx of bjdata) {
            const bjsj = {
              bpkjs: pkjs,
              bpkzs: pkzs,
              rwid: this.rwid,
              xxdm: this.xxdm,
              njdm: njxx.njdm,
              bjdm: bjxx.uuid
            };
            bjMap.push(bjsj);
          }
        }
      }
      if (njdm && !bjdm) {
        // 有年级 无班级时
        const bjList = this.bjList;
        const bjdata = _.filter(this.bjList, { njdm });
        for (const bjxx of bjdata) {
          const bjsj = {
            bpkjs: pkjs,
            bpkzs: pkzs,
            rwid: this.rwid,
            xxdm: this.xxdm,
            njdm,
            bjdm: bjxx.uuid
          };
          bjMap.push(bjsj);
        }
      }
      if (njdm && bjdm) {
        const query = {
          bpkjs: pkjs,
          bpkzs: pkzs,
          rwid: this.rwid,
          xxdm: this.xxdm,
          njdm,
          bjdm
        };
        bjMap.push(query);
      }
      // 检测规则设置和课程设置是否已经设置
      if (this.hxszFlag) {
        // 是否清空课程设置和规则设置并重新生成课表
        this.$confirm(
          '确定该操作,并且清空规则条件和课程设置历史数据？（规则条件清空后无法恢复哦）',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            const obj = { rwid: this.rwid, xxdm: this.xxdm };
            // 清空规则条件并且初始化课程设置
            api.initJxjh(obj).then(() => {
              this.$notify({
                title: '成功',
                message: '规则条件历史数据和课程数据已清空',
                type: 'success',
                duration: 2000
              });
              api.saveNoClass(bjMap).then(res => {
                if (res.status === 200) {
                  // 每次点击都获取一遍表格
                  this.handleTableState(njdm, bjdm);
                  this.$notify({
                    title: '成功',
                    message: '保存成功',
                    type: 'success',
                    duration: 2000
                  });
                }
              });
              this.hxszFlag = false;
            });
          })
          .catch(() => {
            this.handleTableState(njdm, bjdm);
          });
      } else {
        api.saveNoClass(bjMap).then(res => {
          if (res.status === 200) {
            // 每次点击都获取一遍表格
            if (state === -1) {
              // -1了，非正常显示：不排课，此时没有刷新整个表格
              this.tableDataClass.forEach((row, index) => {
                if (row.title.jcdm == pkjs) {
                  const _amount = 'amount' + pkzs;
                  this.$set(row[_amount], 'sfpk', 1); // 强制刷新
                  this.$set(row[_amount], 'name', '不排课');
                  this.$set(row[_amount], 'gray', true);
                }
              });
              this.clickFlag = true;
            } else {
              // 正常显示：一致/不一致   刷新了表格
              this.handleTableState(njdm, bjdm, pkzs, pkjs, state);
            }

            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            });
          }
        });
      }
    },
    deleteTd(njdm, bjdm, pkjs, pkzs) {
      this.treeState = null;
      const bjMap = [];
      if (!njdm && !bjdm) {
        const njList = this.njList;
        for (const njxx of njList) {
          const bjdata = _.filter(this.bjList, { njdm: njxx.njdm });
          for (const bjxx of bjdata) {
            const bjsj = {
              bpkjs: pkjs,
              bpkzs: pkzs,
              rwid: this.rwid,
              xxdm: this.xxdm,
              njdm: njxx.njdm,
              bjdm: bjxx.uuid
            };
            bjMap.push(bjsj);
          }
        }
      }

      if (njdm && !bjdm) {
        const bjdata = _.filter(this.bjList, { njdm });
        for (const bjxx of bjdata) {
          const bjsj = {
            bpkjs: pkjs,
            bpkzs: pkzs,
            rwid: this.rwid,
            xxdm: this.xxdm,
            njdm,
            bjdm: bjxx.uuid
          };
          bjMap.push(bjsj);
        }
      }
      if (njdm && bjdm) {
        // query.bjdm = this.bjdm;
        const query = {
          bpkjs: pkjs,
          bpkzs: pkzs,
          rwid: this.rwid,
          xxdm: this.xxdm,
          njdm,
          bjdm
        };
        bjMap.push(query);
      }
      api.deleteNoClass(bjMap).then(res => {
        if (res.status === 200) {
          this.handleTableState(njdm, bjdm);

          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        }
      });
    },
    handleShowTable() {},
    async handleTableState(njdm, bjdm, pkzs, pkjs, state) {
      // 获取时间列表信息
      this.spanArr = [];
      let table_Arr = [], // 缓存的表格总体数据的大数组，缓存是为了性能，否则会频繁刷新表格
        bar_obj1 = {},
        bar_obj2 = {};
      const res = await api.querySectionTiming({
        rwid: this.rwid,
        xxdm: this.xxdm
      });
      const { data, status } = res;
      if (status == 200) {
        // 组装对象

        data.forEach((item, index) => {
          const { jcdm, jcwz } = item;
          if (jcdm) {
            item.idx = jcdm;
          } else if (jcwz) {
            item.editState = false;
            if (parseInt(jcwz) > 0) {
              item.idx = Math.abs(parseInt(jcwz)) - 0.1;
            } else if (parseInt(jcwz) < 0) {
              item.idx = Math.abs(parseInt(jcwz)) + 0.1;
            }
          }

          const tmp_obj = {
            title: item
          };
          // 如果节数存在，定义进去
          const pkjs = jcdm || '';
          for (let i = 1; i <= 7; i++) {
            tmp_obj['amount' + i] = {
              // 自定义对象 为了获取 点击时当前行数，列数
              pkjs,
              pkzs: i,
              sfpk: -1
            };
          }

          table_Arr.push(tmp_obj);
        });
        // 已idx对数据进行排序
        table_Arr.sort(
          (idx => (a, b) => {
            const value1 = a.title[idx];
            const value2 = b.title[idx];
            if (value1 > value2) {
              return 1;
            } else if (value1 < value2) {
              return -1;
            } else {
              return 0;
            }
          })('idx')
        );

        this.n1 = 0;
        this.n2 = 1;
        table_Arr.forEach((item, index) => {
          if (item.title.idx < this.num1 + 0.5) {
            this.n1 = this.n1 + 1;
          }
          if (item.title.idx < this.num2 + this.num1 + 0.5) {
            this.n2 = this.n2 + 1;
          }
          if (!item.title.jcdm) {
            item.title.close = true;
            this.spanArr.push(item.title.idx);
          }
        });
        // 做两条空数据进去 为了加bar
        bar_obj1 = {
          title: {},
          amount1: {},
          amount2: {},
          amount3: {},
          amount4: {},
          amount5: {},
          amount6: {},
          amount7: {}
        };
        bar_obj2 = {
          title: {},
          amount1: {},
          amount2: {},
          amount3: {},
          amount4: {},
          amount5: {},
          amount6: {},
          amount7: {}
        };
        bar_obj1.title.idx = this.n1;
        bar_obj2.title.idx = this.n2;
        table_Arr.splice(this.n1, 0, bar_obj1); // 把bar塞进去
        table_Arr.splice(this.n2, 0, bar_obj2);
        // this.tableDataClass = table_Arr;
        // this._tableDataClass = table_Arr;
        this.bool = true;
      }
      // 数据框架已搭好，可以进行显示是否一致
      // 获取表格具体状态
      const query = {
        rwid: this.rwid,
        xxdm: this.xxdm
      };
      if (njdm) {
        query.njdm = njdm;
      }
      if (bjdm) {
        query.bjdm = bjdm;
      }
      api
        .queryNoClass(query)
        .then(res => {
          // console.log(res)
          const { data } = res;
          data.forEach(item => {
            const { bpkjs, bpkzs, cnt } = item;
            let _name = '不排课'; // 先统一为不排课
            item.sfpk = 1;
            if (!njdm && !bjdm) {
              // 修改为年级一致不一致
              const flag = item.cnt === this.LENGTH; // 判断班级数是否等于cnt 等于说明一致
              if (flag) {
                _name = '所有年级一致';
              } else {
                _name = '所有年级不一致';
              }

              item.sfpk = flag ? 1 : -2;
            }
            if (njdm && !bjdm) {
              // 修改为班级一致不一致
              const flag = item.cnt === this.LENGTH;
              if (flag) {
                _name = '所有班级一致';
              } else {
                _name = '所有班级不一致';
              }

              item.sfpk = flag ? 1 : -2;
            }
            item.gray = true;
            item.name = _name;
            item.pkjs = bpkjs;
            item.pkzs = bpkzs;
            table_Arr.forEach(row => {
              if (row.title.jcdm == bpkjs) {
                const _amount = 'amount' + bpkzs;
                row[_amount] = item; // 赋值td
              }
            });
          });

          this.tableDataClass = table_Arr; // 赋值整个表格
        })
        .then(() => {
          this.clickFlag = true; // 数据回来了才让点击第二次
        });
    },
    handleWeek(_week) {},
    closeRow(title) {
      //  删除 渲染
      api
        .deleteSectionTimingByPosition({
          rwid: this.rwid,
          xxdm: this.xxdm,
          jcwz: title.jcwz,
          jcmc: title.jcmc
        })
        .then(res => {
          if (res.status === 200) {
            // 每次点击都获取一遍表格
            this.handleTableState(this.njdm, this.bjdm);
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
          }
        });
    },
    editRow(title, e) {
      // 编辑公共时段
      title.editState = true;
      this.focusState = true;
    },
    saveRow(e, title) {
      // 保存公共时段
      const { keyCode, target } = e;
      if (keyCode === 13 || keyCode === 27) {
        e.target.blur();
      }
    },
    handleFocus(e, title) {
      const value = e.target.value;
      this.oldJcmc = value;
    },
    async handleInputBlur(e, title) {
      title.editState = false;
      const value = e.target.value;
      const query = {
        rwid: title.rwid,
        xxdm: title.xxdm,
        sfgs: title.sfgs,
        qzsj: title.qzsj,
        jcmc: value,
        jcwz: title.jcwz,
        oldJcmc: this.oldJcmc,
        xh: title.xh
      };
      const res = await api.updateSectionTiming(query);
      if (res.status == 200) {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        });
      }
      // 渲染一下表格
      // this.handleTableState();
    },
    // 检查后续设置信息
    checkHxsz() {
      const obj = { rwid: this.rwid, xxdm: this.xxdm };
      api.checkJxjh(obj).then(jxjhRes => {
        this.hxszFlag = jxjhRes.data;
      });
    },
    convertNum(num) {
      return fromatNum(num);
    },
    updateJcsjFlag(info) {
      api.updateJcsjInfo({ sfxs: info, rwid: this.rwid }).then(() => {
        this.handleTableState();
        this.qzsjFlag = info === 1;
        this.setkbtime = false;
      });
    },
    formatWeek(key) {
      const arr = ['一', '二', '三', '四', '五', '六', '日'];
      return arr[--key];
    }
  }
};
</script>


<style scoped>
/**滚动条样式**/
.kssz .clearfix:after {
  clear: both;
}
.kssz .box-card-kssz {
  margin-bottom: 5px;
}
.kssz .el-main {
  padding: 0px;
}
.kssz .el-checkbox-group label {
  margin-left: 23px;
}
.kssz .el-input-number--small {
  width: 120px;
  line-height: 30px;
  margin-bottom: 15px;
}
.kssz .fr {
  float: none;
}

.setKCtime {
  margin-bottom: 10px;
}

/* 表格样式 */

.bluetxt {
  color: #449afc;
  font-size: 13px;
}

.kssz .span-item .cell > div {
  position: relative;
}
.kssz .close {
  padding-right: 14px;
  line-height: 47px;
  font-size: 14px;
  color: #e6a23c;
  font-weight: bold;
}

.kssz .title-box .input-box {
  position: absolute;
  top: 0;
  left: 0;
  /* text-align: center; */
  /* line-height: 47px; */
  width: 100%;
  height: 100%;
  color: #e6a23c;
  background-color: #fdf6ec;
}

.kssz .title-box .input-box input {
  border: none;
  outline: none;
  text-align: center;
  height: 1.4em;
}

.mouse-style {
  cursor: pointer;
}
.isforbidden {
  background-color: #959a9d;
  color: #fff;
}
.isgood {
  background-color: #67c23a;
  color: #fff;
}
.isbad {
  background-color: #f66b6b;
  color: #fff;
}
.isnull {
  background-color: #fff;
}
</style>



