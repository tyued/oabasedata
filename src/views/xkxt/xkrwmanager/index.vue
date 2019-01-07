<template>
    <section class="content-container">
      <searchbar  ref="searchbar" :search-input-select="searchInputSelect" :search-placeholder="searchPlaceholder" :searchTypes="searchTypes" :conditionItems="conditionItems" @searchClick="goSerch"></searchbar>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新增任务</el-button>
            <el-button type="primary" icon="el-icon-setting" @click="xkgzsz">选课规则设置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column align="left" label="任务名称" width="300">
          <template slot-scope="scope">
            <span>{{scope.row.rwmc}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始报名时间" width="280" >
          <template slot-scope="scope">
            <span>{{workTime(scope.row.kssj) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="截止报名时间" width="280">
          <template slot-scope="scope">
            <span>{{ workTime(scope.row.jssj)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="280">
          <template slot-scope="scope">
            <span>{{scope.row.rwzt | formatXkzt}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.xndm==dqxn&&scope.row.xqdm==dqxq">
            <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
            <!--<el-button  size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>-->
            <el-button  size="small" type="danger" @click="handleNotice(scope.row)">一键通知</el-button>
            </div>
            <div v-else>
              <el-button  size="small" type="success" @click="viewHis(scope.row)">查看</el-button>
              <el-button  size="small" type="danger" @click="viewHisGzsz(scope.row)">规则设置</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,15,20,25,30]"
                       :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>

      <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="900px" @close="cancel">
        <el-form :model="form" ref="form" label-width="110px" name="myform"  :rules="formrules">
          <el-form-item label="任务名称"  prop="rwmc" :rules="[{ required: true,trigger:'blur', message: '任务名称不能为空'}]" >
            <el-col :span="20">
              <input type="hidden" v-model.trim="form.xkrwid" />
              <el-input v-model.trim="form.rwmc" placeholder="请输入任务名称" ></el-input>
            </el-col>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开始报名时间" prop="kssj" >
                <el-date-picker  type="datetime"  value-format="yyyy-MM-dd HH:mm:ss"  format="yyyy-MM-dd HH:mm"  v-model="form.kssj"  :picker-options="pickerOptions0" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="截止报名时间"  prop="jssj">
                <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  format="yyyy-MM-dd HH:mm"  v-model="form.jssj" :picker-options="pickerOptions0" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="6">
              <el-card shadow="never">
                <el-collapse accordion style="width: 150px;">
                  <div v-for="item in kclxMap" @click="details_kcxx(item.lbid)"  :key="item.lbid">
                    <el-collapse-item >
                      <template slot="title">
                        {{ item.lbmc}}
                      </template>
                    </el-collapse-item>
                  </div>
                </el-collapse>
              </el-card>
            </el-col>
            <el-col :span="16">

              <!-- <el-card shadow="never">
                <el-transfer v-model="value1" :data="data" :titles="title" @change="handleChange" ></el-transfer>
              </el-card> -->

              <div style="float: left;" class="table_cont">
                <div class="table-container"  style="width:200px; float:left;height: 285px;margin-left: 10px;border-radius: 5px;border: 1px solid #eee;">
                  <div class="checkboxtitle" style="width: 100%;height:40px;background: #eee;">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin-left: 20px;margin-top:10px;"><span style="font-size: 15px;font-weight: 500;">课程名称</span></el-checkbox>
                  </div>
                  <div style="width: 100%;height: 245px;overflow-x: auto;overflow-y: scroll;">
                    <el-checkbox-group v-model="checkedCourselist" @change="handleCheckedCitiesChange" style="margin-left: 20px;">
                      <li v-for="(item, index) in data" :key="index">
                        <el-checkbox :label="item.key" :disabled="item.isselect">{{item.label}}</el-checkbox>
                      </li>
                    </el-checkbox-group>
                  </div>
                </div>
                <div class="changeStuBtn" style="float:left;margin-left: 10px;margin-right: 10px">
                  <el-button class="changebtn" style="float:right;margin-top: 120px;" type="primary" size="small" @click.stop="addcourse">添加》</el-button>
                </div>
                <div class="table-container" style="width:200px; float:left;height: 285px;border-radius: 5px;border: 1px solid #eee;">
                  <div class="checkboxtitle" style="width: 100%;height:40px;background: #eee;">
                    <!-- <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2" style="margin-left: 20px;margin-top:10px;"> -->
                      <span style="font-size: 15px;font-weight: 500;margin-left: 20px;margin-top: 10px;display: inline-block;">已选课程</span>
                    <!-- </el-checkbox> -->
                    <!-- <span style="margin-left: 40px;"><el-button type="danger" size="mini" icon="el-icon-delete" @click.stop="delectall"></el-button></span> -->
                  </div>
                  <div style="width: 100%;height: 245px;overflow-x: auto;overflow-y: scroll;">
                    <!-- <el-checkbox-group v-model="checkedCourselist2" @change="handleCheckedCitiesChange2" style="margin-left: 20px;"> -->
                      <li  v-for="(item, index) in selectedcourse" :key="index" style="display: inline-block;width: 100%;display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
                        <span style="float: left;display: inline-block;">
                          <!-- <el-checkbox :label="item.key" @change="checkitem" style="padding: 10px 0;" :disabled="item.isselect">{{item.label}}</el-checkbox> -->
                          <span style="display: inline-block;margin-left: 20px;">{{item.label}}</span>
                        </span><span style="display: inline-block;float: left;margin-right: 5px;"><el-button type="text" @click.stop="delectcourse(item, index)">删除</el-button></span>
                      </li>
                    <!-- </el-checkbox-group> -->
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        <!--  <el-row :gutter="20">
            <el-col :span="20">
              <el-collapse accordion style="width: 150px;">
                <div v-for="item in kclxMap" @click="details_kcxx(item.lbid)"  :key="item.lbid">
                  <el-collapse-item >
                    <template slot="title">
                      {{ item.lbmc}}
                    </template>
                  </el-collapse-item>
                </div>
              </el-collapse>
              <el-transfer v-model="value1" :data="data" :titles="title" @change="handleChange" ></el-transfer>
            </el-col>
          </el-row>-->

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel('form')">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定</el-button>
          <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 选课规则设置-->
      <el-dialog title="选课规则设置"  :visible.sync="dialogXkgzFormVisible" width="870px" >
        <el-form :model="form" ref="xkgzform" label-width="110px" name="xkgzform">
          <div class="oarow" style="float:left; margin-top:20px;width:100%;">
            <div class="rowmain">
              <el-row>
                <div class="rowcontent">
                  <div class="rowLeftBox">每名学生最多选</div>
                  <div class="rowRightBox">
                    <el-input style="display:inline-block; width:50px;" placeholder=""></el-input> 门课
                  </div>
                </div>
              </el-row>
              <el-row>
                <div class="rowcontent">
                  <div class="rowLeftBox">不能同时选择的课程</div>
                  <div class="rowRightBox">
                    <el-button type="primary">添加</el-button>
                    <div class="courseList">
                      <div class="course">
                        <span>钢琴入门,蹭蹭蹭,阿尔甘</span> <i class="el-icon-edit"></i> <i class="el-icon-delete"></i>
                      </div>
                      <div class="course">
                        <span>课外阅读</span> <i class="el-icon-edit"></i> <i class="el-icon-delete"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </el-row>

              <el-row>
                <div class="rowcontent">
                  <div class="rowLeftBox">必选的课程类别</div>
                  <div class="rowRightBox">
                    <el-button type="primary">添加</el-button>
                    <div class="courseList">
                      <div class="course">
                        <span>音乐类 至少选 <el-input style="display:inline-block; width:50px;" placeholder=""></el-input> 门课</span> <i class="el-icon-delete"></i>
                      </div>
                      <div class="course">
                        <span>体育类 至少选 <el-input style="display:inline-block; width:50px;" placeholder=""></el-input> 门课</span> <i class="el-icon-delete"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </el-row>
            </div>
          </div>
        </el-form>
      </el-dialog>
      <!-- 一键通知-->
      <el-dialog title="一键通知"  :visible.sync="dialogXktzFormVisible" width="870px" >
        <el-form :model="form" ref="xktzform" label-width="110px" name="xktzform">
          <el-form-item label="消息内容" prop="message">
            <el-col :span="18">
              <input type="hidden"  name="xkrwid" v-model="form.xkrwid" />
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"  v-model="form.sendMessageInfo"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="通知对象" prop="tzdx">
            <el-col :span="18">
              <el-checkbox-group  v-model="form.checkedTzdx" :min="1" :max="2">
                <el-checkbox label="1">通知班主任</el-checkbox>
                <el-checkbox label="2" >通知家长</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-form-item>
          <el-form-item label="通知方式" prop="tzfs">
            <el-col :span="18">
              <el-checkbox-group  v-model="form.checkedTzfs" :min="1" :max="2">
                <el-checkbox label="1">微信推送</el-checkbox>
                <el-checkbox label="2">短信推送</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="tzcancel('xktzform')">取 消</el-button>
          <el-button  type="primary" @click="sendTzMessage('xktzform')" :disabled="changeSure">确 定</el-button>
        </div>
      </el-dialog>
    </section>
  </template>
  <script>

    import { page, get, del, post, put, checkUnique, getKclx, getKcxx, addKcxx, deleteKcxx, getxnList, getxqList, sendXktz } from 'api/xkxt/xkrwmanager/index'

    import searchbar from '@/views/components/searchbar'
    import { dqxnxqObj } from 'api/components/searchbar'
    export default {
      name: 'xkrwManager',
      components: {
        searchbar
      },
      data() {
        const checkKssj = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('开始报名时间不能为空'));
          }
          setTimeout(() => {
            if (this.form.jssj && Date.parse(value) > Date.parse(this.form.jssj)) {
              callback(new Error('开始报名时间不能大于截止报名时间'));
            } else {
              callback();
            }
          }, 1000);
        };
        const checkjssj = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('截止报名时间不能为空'));
          }
          setTimeout(() => {
            if (this.form.kssj && Date.parse(value) < Date.parse(this.form.kssj)) {
              callback(new Error('截止报名时间不能小于开始报名时间'));
            } else {
              callback();
            }
          }, 1000);
        };
        return {
          isable: false,
          temparr: [], // 批量删除数据暂存
          temparr2: [], // 批量删除数据暂存
          oncearray: [], // 暂存修改课程时添加的课程代码
          isrepeat: false,
          isadd: true, // 判断是添加还是编辑
          selectedcourse: [], // 已选课程数组暂存
          isIndeterminate2: true,
          isIndeterminate: true, // 设置 indeterminate 状态，只负责样式控制
          checkedCourselist: [], // 已选课程暂存kcdm
          checkedCourselist2: [],
          checkAll: false, // 全选状态
          checkAll2: false,
          pickerOptions0: {
            disabledDate: time => time.getTime() < Date.now() - 8.64e7
          },
          xxdm: '',
          usercode: '', // 当前用户
          dqxn: '', // 当前学年
          dqxq: '', // 当前学期
          /** *搜索配置开始**/
          searchInputSelect: false,
          searchPlaceholder: '请输入任务名称',
          searchTypes: [
            { value: 'rwmc', label: '任务名称' }

          ],
          searchTypes: [{ /** 配置搜索框** 列如：<option value="1">名称</option>**/
            label: '任务名称',
            value: 0
          }],
          conditionItems: [{ /** 搜索条件配置 values:年级列表数组**/
            key: 'xndm',
            type: 'Checkbox', /** 类型 :单选Radio或者多选CheckBox；**/
            label: '学年',
            // selected:{value:'2017-2018',text:'2017-2018'},//默认选中制定元素
            selected: {}, // 默认选中制定元素
            values: []
          }, {
            key: 'xqdm',
            type: 'Checkbox',
            label: '学期',
            selected: {},
            values: []
          }], /** 条件配置结束**/

          tableKey: 0,
          listLoading: false,
          total: 0,
          list: [],
          dictMap: {},
          kclxMap: {},
          title: ['课程名称', '已选课程'],
          form: {
            checkedTzdx: [],
            checkedTzfs: []
          },
          listQuery: {  // 分页
            xnGroup: [],
            xqGroup: [],
            query: {
              page: 1,
              limit: 10
            },
            xxdm: ''
          },
          searchsel: 'lbmc',
          textMap: {
            update: '编辑',
            create: '新增'
          },
          dialogFormVisible: false,
          dialogXkgzFormVisible: false,
          dialogXktzFormVisible: false,

          sendMessageInfo: '',
          dialogStatus: '',
          changeSure: false,   // 防止重复提交
          moreset: false,
          data: [],
          kcxxList: [],
          value1: [],
          formrules: {
            kssj: [
              { validator: checkKssj, trigger: 'blur' }
            ],
            jssj: [
              { validator: checkjssj, trigger: 'blur' }
            ]
          }
        }
      },
      filters: {
        formatXkzt(value) {
          if (value == '0') {
            return '未开始';
          } else if (value == '1') {
            return '已开始';
          } else if (value == '2') {
            return '已结束';
          } else {
            return '未开始';
          }
        }
      },
      created() {
        this.xxdm = window.localStorage.getItem('xxdm');
        this.listQuery.xxdm = this.xxdm;
        this.usercode = window.localStorage.getItem('usercode');
        // console.log('this.usercode-----------------' + this.usercode)
        // this.getDictMap();
      },
      mounted() {
        this.getSearchCriteria();// 搜索条件
        dqxnxqObj({ xxdm: this.xxdm }).then(response => {
          this.conditionItems[0].selected.value = response.xn;
          this.conditionItems[0].selected.text = response.xn;
          this.conditionItems[1].selected.value = response.xq;
          this.conditionItems[1].selected.text = response.xqmc;
          this.$refs.searchbar.setChecked();
          this.listQuery.xnGroup = [response.xn];
          this.listQuery.xqGroup = [response.xq];
          this.dqxn = response.xn;
          this.dqxq = response.xq;
          this.getList();
        });
      },
      methods: {
        // 关闭弹层
        // clossaddmodel () {

        // },
        // 删除所有已勾选
        // delectall () {
        //   this.temparr = []
        //   this.temparr2 = []
        //   if (this.checkedCourselist2.length) {
        //     this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       if (this.isadd) {
        //         // this.selectedcourse = []
        //         this.selectedcourse.forEach(item => {
        //           this.checkedCourselist2.forEach(el => {
        //             console.log(el)
        //             if (el === item.key) {
        //               this.temparr.push(item)
        //             }
        //           })
        //         })
        //         console.log(this.temparr)
        //         var arr3 =[]
        //         for (key in this.selectedcourse) {
        //           var stra = this.selectedcourse[key]
        //           var count = 0
        //           for (var j=0; j<this.temparr.length; j++) {
        //             var strb = this.temparr[j]
        //             if(stra !== strb) {
        //               count++
        //             }
        //           }
        //           if(count!==0) {//表示数组1的这个值没有重复的，放到arr3列表中
        //             arr3.push(stra);
        //           }
        //         }
        //         console.log(arr3)
        //         // this.selectedcourse = this.temparr
        //         // this.checkedCourselist2 = this.temparr2
        //         // this.checkedCourselist2 = []
        //         this.data.forEach(el => {
        //           el.isselect = false
        //         })
        //         this.checkAll2 = false
        //         this.isIndeterminate2 = true

        //       } else {
        //         this.selectedcourse.forEach(item => {
        //           this.checkedCourselist2.forEach(el => {
        //             if (el !== item.key) {
        //               this.temparr.push(item)
        //               this.temparr2.push(item.key)
        //             }
        //           })
        //         })
        //         this.selectedcourse = this.temparr
        //         this.checkedCourselist2 = this.temparr2
        //         // this.selectedcourse = []
        //         this.listLoading = true;
        //         this.listQuery.xxdm = this.xxdm;
        //         this.listQuery.kcdms = this.checkedCourselist2;
        //         this.listQuery.xkrwid = this.form.xkrwid;
        //         deleteKcxx(this.listQuery).then(response => {
        //           console.log(response)
        //           this.listLoading = false;
        //         })
        //       }
        //     }).catch(action => {
        //       this.$message({
        //         type: 'info',
        //         message: action === 'cancel'
        //           ? '放弃删除！'
        //           : '确认删除！'
        //       })
        //     });
        //   } else {
        //     this.$notify({
        //       title: '提示',
        //       message: '请选择要取消关联的课程~',
        //       type: 'error',
        //       duration: 2000
        //     });
        //   }
        // },
        checkitem (val) {
          // console.log(val)
        },
        handleCheckedCitiesChange2 (value) {
          // console.log(value)
          let checkedCount = value.length;
          this.checkAll2 = checkedCount === this.selectedcourse.length;
          this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.selectedcourse.length;
        },
        handleCheckAllChange2 (val) {
          // console.log(val)
          if (val) {
            this.selectedcourse.forEach(el => {
              this.checkedCourselist2.push(el.key)
            });
          } else {
            this.checkedCourselist2 = []
          }
          this.isIndeterminate2 = false;
        },
        // 添加课程
        addcourse () {
          // console.log(this.checkedCourselist2)
          this.isrepeat = false
          if (this.checkedCourselist.length) {
              this.data.forEach(el => {
                this.checkedCourselist.forEach(item => {
                  if (el.key === item) {
                    if (this.isadd) {
                      el.isselect = true
                      this.selectedcourse.push(el)
                      this.checkedCourselist2.push(el.key)
                    } else {
                      el.isselect = true
                      this.selectedcourse.push(el)
                      this.checkedCourselist2.push(el.key)
                      this.oncearray.push(el.key)
                    }
                  }
                })
              })
              // console.log(this.checkedCourselist2)
              this.checkAll2 = true
              this.isIndeterminate2 = false
              this.checkedCourselist = []
              this.checkAll = false
              this.isIndeterminate = true
              if (this.isrepeat) {
                this.$notify({
                  title: '提示',
                  message: '有课程重复',
                  type: 'error',
                  duration: 2000
                });
              }
          } else {
            this.$notify({
              title: '提示',
              message: '请选课程',
              type: 'error',
              duration: 2000
            });
          }
        },
        // 全选反选课程
        handleCheckAllChange (val) {
          if (val) {
            this.data.forEach(el => {
              this.checkedCourselist.push(el.key)
            });
          } else {
            this.checkedCourselist = []
          }
          this.isIndeterminate = false;
        },
        // 选择课程
        handleCheckedCitiesChange (value) {
          // console.log(val)
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.data.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.length;
        },
        getSearchCriteria() {
          /** 查询学年列表**/
          getxnList({ xxdm: this.xxdm }).then(response => {
            let model, a;
            for (a of response) {
              model = {};
              model.value = a.xn;
              model.text = a.xn;
              this.conditionItems[0].values.push(model);
            }
          });
          /** 查询班级列表**/
          getxqList({ xxdm: this.xxdm, dqxn: this.dqxn }).then(response => {
            let model, a;
            for (a of response) {
              model = {};
              model.value = a.xq;
              model.text = a.xqmc;
              this.conditionItems[1].values.push(model);
            }
          });
        },
        goSerch(data) {
          this.listQuery.rwmc = data.curValue;
          this.listQuery.cxlx = data.type;
          this.listQuery.xnGroup = data.temp[0];
          this.listQuery.xqGroup = data.temp[1];
          this.getList();
        },
        // 查询课程
        details_kcxx(lbid) {
          this.isIndeterminate = false
          this.checkAll = false
          this.checkedCourselist = []
          this.data = []
          this.listQuery.xxdm = this.xxdm;
          this.listQuery.lbid = lbid;
          this.listQuery.xndm = this.dqxn;
          this.listQuery.xqdm = this.dqxq;
          getKcxx(this.listQuery).then(response => {
            this.kcxxList = response.data.rows;
            // const arrStr = JSON.stringify(this.selectedcourse);
            for (let i = 0; i < this.kcxxList.length; i++) {
              const temp = this.kcxxList[i];
              // if (arrStr.indexOf(temp.kcdm) == -1) { // 判断是否重复加
                this.data.push({
                  key: temp.kcdm,
                  label: temp.kcmc,
                  isselect: false
                });
              // }
            }
            this.data.forEach(item => {
              this.selectedcourse.forEach(el => {
                if (item.key === el.key) {
                  item.isselect = true
                }
              })
            })
          })
        },
        // 查询课程类型
        getKclx() {
          this.listQuery.xxdm = this.xxdm;
          getKclx(this.listQuery).then(response => {
            this.kclxMap = response.data.rows;
          })
        },
        getList() {
          this.listLoading = true;
          this.listQuery.xxdm = this.xxdm;
          page(this.listQuery).then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
        },
        addXkrwKcxx(kcdms) {
          this.form.xxdm = this.xxdm;
          this.form.kcdms = kcdms;
          addKcxx(this.form).then(response => {
          })
        },
        delectcourse (datas, index) { // 删除已选课程
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.selectedcourse.length === 1) {
              this.checkAll2 = false
              this.isIndeterminate2 = true
            }
            if (this.isadd) {
              this.selectedcourse.splice(index, 1)
              this.checkedCourselist2.splice(index, 1)
              if (this.selectedcourse.length) {
                this.data.forEach(el => {
                    if (datas.key === el.key) {
                      el.isselect = false
                    }
                })
              } else {
                this.data.forEach(el => {
                  el.isselect = false
                })
                this.checkAll2 = false
                this.isIndeterminate2 = true
              }

            } else {
              this.selectedcourse.splice(index, 1)
              this.data.forEach(item => {
                if (item.key === datas.key) {
                  item.isselect = false
                }
              })
              var arr = []
              arr.push(datas.key)
              this.listLoading = true;
              this.listQuery.xxdm = this.xxdm;
              this.listQuery.kcdms = arr;
              this.listQuery.xkrwid = this.form.xkrwid;
              deleteKcxx(this.listQuery).then(response => {
                this.listLoading = false;
              })
            }
          }).catch(action => {
            this.$message({
              type: 'info',
              message: action === 'cancel'
                ? '放弃删除！'
                : '您已删除！'
            })
          })
        },
        deleteXkrwKcxx(kcdms) { // 删除关联课程
          this.listLoading = true;
          this.listQuery.xxdm = this.xxdm;
          this.listQuery.kcdms = kcdms;
          this.listQuery.xkrwid = this.form.xkrwid;
          deleteKcxx(this.listQuery).then(response => {
            this.listLoading = false;
          })
        },
        // 搜索
        handleFilter() {
        /*  if(this.searchsel=="all"){
            this.listQuery = { page: 1, limit: 20, name: undefined }
          }*/
          this.getList();
        },
        searchChange(val) {
         /* this.listQuery = {
            page: 1,
            limit: 20,
            name: undefined
          }*/
          this.listQuery.xxdm = this.xxdm;
        },
        handleSizeChange(val) {
          this.listQuery.query.limit = val;
          this.getList();
        },
        handleCurrentChange(val) {
          this.listQuery.query.page = val;
          this.getList();
        },
        handleCreate() {
          this.isadd = true
          this.form = {};
          this.data = [];
          this.value1 = [];
          this.changeSure = false;
          this.dialogStatus = 'create';
          this.dialogFormVisible = true;
          this.getKclx();
        },
        handleUpdate(row) {
          this.isadd = false
          this.selectedcourse = []
          this.getKclx();
          this.changeSure = false;
          get(row.xkrwid).then(response => {
            console.log(response)
            this.form = response.data;
            if (response.data.kcdms) {
              this.checkedCourselist2 = response.data.kcdms;
            } else {
              this.checkedCourselist2 = []
            }
            const kcdms = response.data.kcdms;
            const kcmcs = response.data.kcmcs;
            if (this.checkedCourselist2) {
              if (this.checkedCourselist2.length) {
                this.checkAll2 = true
                this.isIndeterminate2 = false
              }
            } else {
              this.checkAll2 = false
              this.isIndeterminate2 = true
            }
            if (kcmcs) {
              // console.log(this.data)
              const arrStr = JSON.stringify(this.selectedcourse);
              for (let i = 0; i < kcmcs.length; i++) {
                // console.log(arrStr.indexOf(kcdms[i]))
                if (arrStr.indexOf(kcdms[i]) == -1) {
                  // this.data.push({
                  //   key: kcdms[i],
                  //   label: kcmcs[i]
                  // });
                  this.selectedcourse.push({
                    key: kcdms[i],
                    label: kcmcs[i],
                    isselect: true
                  });
                }
              }
            }
            // this.checkedCourselist2 = response.data.kcdms
            this.value1 = response.data.kcdms;
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
          });
        },
        handleDelete(row) {
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            del(row.lbid).then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            });
          });
        },
        handleNotice(row) { // 一键通知
          this.form.sendMessageInfo = '本学期兴趣班选课工作已开始进行，选课时间：' + row.kssj + '~' + row.jssj + '，请学生家长踊跃报名参加！';
          this.form.checkedTzdx = ['2'];
          this.form.checkedTzfs = ['2'];
          this.form.xkrwid = row.xkrwid;
          this.dialogXktzFormVisible = true;
        },
        sendTzMessage(formName) {
          this.form.usercode = this.usercode;
          this.form.xxdm = this.xxdm;
          this.form.tznr = this.form.sendMessageInfo;
          this.form.tzdx = this.form.checkedTzdx;
          this.form.tzfs = this.form.checkedTzfs;
          this.form.xndm = this.dqxn;
          this.form.xqdm = this.dqxq;
          sendXktz(this.form).then(res => {
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

          this.dialogXktzFormVisible = false;
        },
        tzcancel() {
          this.dialogXktzFormVisible = false;
        },
        cancel() {
          // this.checkAll = false
          // this.checkAll2 = false
          // this.checkedCourselist = []
          // this.data = []
          // this.selectedcourse = []
          // this.checkedCourselist2 = []
          // this.isIndeterminate = true
          // this.isIndeterminate2 = true
          // this.checkedCourselist2 = []
          this.clear()

          this.dialogFormVisible = false;
        },
        moresetting() {
          if (this.moreset) {
            this.moreset = false
          } else {
            this.moreset = true
          }
        },
        create(formName) { // 创建任务
          // console.log(this.value1)
          // console.log(this.checkedCourselist2)
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.changeSure = true;
              this.form.xxdm = this.xxdm;
              this.form.kcdms = this.checkedCourselist2;
              // this.form.kcdms = this.value1;
              this.form.xndm = this.dqxn;
              this.form.xqdm = this.dqxq;
              if (this.form.kcdms != null && this.form.kcdms.length > 0) {
                post(this.form).then(res => {
                  if (res.status == '200') {
                    this.dialogFormVisible = false;
                    this.$refs[formName].resetFields();
                    this.getList();
                    this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 });

                    // this.checkAll = false
                    // this.checkAll2 = false
                    // this.checkedCourselist = []
                    // this.data = []
                    // this.selectedcourse = []
                    // this.checkedCourselist2 = []
                    // this.isIndeterminate = true
                    // this.isIndeterminate2 = true
                    // this.checkedCourselist2 = []
                    this.clear()

                  } else {
                    this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
                  }
                })
              } else {
                alert('请选择任务关联的课程!');
              }
              const that = this;
              setTimeout(() => {
                that.changeSure = false;
              }, 1500);
            } else {
              this.$notify({ title: '失败', message: '类别名称不能为空', type: 'error', duration: 2000 });
              return false;
            }
          });
        },
        clear () {
          this.checkAll = false
          this.checkAll2 = false
          this.checkedCourselist = []
          this.data = []
          this.selectedcourse = []
          this.checkedCourselist2 = []
          this.isIndeterminate = true
          this.isIndeterminate2 = true
          this.checkedCourselist2 = []
          this.oncearray = []
        },
        update(formName) { // 确认修改任务
          this.addXkrwKcxx(this.oncearray)
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.changeSure = true;
              this.dialogFormVisible = false;
              this.form.xxdm = this.xxdm;
              // console.log(this.form)
              put(this.form.xkrwid, this.form).then(res => {
                this.dialogFormVisible = false;
                this.getList();
                if (res.status == '200') {

                  this.clear()

                  this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
                } else {
                  this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
                }
              });

              const that = this;
              setTimeout(() => {
                that.changeSure = false;
              }, 1500);
            } else {
              this.$notify({ title: '失败', message: '类别名称不能为空', type: 'error', duration: 2000 });
              return false;
            }
          });
        },
        getValue(type, key) {
          const data = this.dictMap[type];
          return _.find(data, { id: key }).text;
        },
        // 表格中日期2000-01-01
        workTime(val) {
          const d = new Date(val);              // 时间戳
          const year = d.getFullYear();
          let month = d.getMonth() + 1;
          let day = d.getDate();
          let hour = d.getHours();
          let min = d.getMinutes();
          if (month < 10) month = '0' + month;
          if (day < 10) day = '0' + day
          if (hour < 10) hour = '0' + hour;
          if (min < 10) min = '0' + min;
          return year + '-' + month + '-' + day + ' ' + hour + ':' + min
        },
        // 格式化日期json
        formTime(val) {
          const d = new Date(val);              // 时间戳
          const year = d.getFullYear();
          let month = d.getMonth() + 1;
          let day = d.getDate();
          let hour = d.getHours();
          let min = d.getMinutes();
          let sec = d.getSeconds();
          if (month < 10) month = '0' + month;
          if (day < 10) day = '0' + day;
          if (hour < 10) hour = '0' + hour;
          if (min < 10) min = '0' + min;
          if (sec < 10) sec = '0' + sec;
          return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
        },
        //
        handleChange(value, direction, movedKeys) {
          if (this.form.xkrwid) {
            if (direction === 'left') {
              this.deleteXkrwKcxx(movedKeys);
            } else if (direction === 'right') {
              this.addXkrwKcxx(movedKeys);
            }
          }
        },
        xkgzsz() {
          // this.dialogXkgzFormVisible = true;
          // this.getKclx();
          this.$router.push('/xkxtManager/xkgzsz');
        },
        viewHis(row) {  // 查看历史任务
          this.$router.push({ path: '/xkxtManager/ckxkrw', query: { row } });
        },
        viewHisGzsz(row) {  // 查看历史任务
          this.$router.push({ path: '/xkxtManager/ckgzsz', query: { row } });
        }

      }
    }
  </script>
  <style scoped>
    .table_cont{
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 8px;
      width: 550px;
    }

    .line {
      text-align: center;
    }

    .sliderRight-enter-active {
      animation-name: fadeInRight;
      animation-duration: .5s;
    }

    .sliderRight-leave-active {
      animation-name: fadeOutRight;
      animation-duration: .5s;
    }

    @-webkit-keyframes fadeInRight {
      from {
        opacity: 0;
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0);
      }

      to {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
      }
    }

    @keyframes fadeInRight {
      from {
        opacity: 0;
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0);
      }

      to {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
      }
    }

    @-webkit-keyframes fadeOutRight {
      from {
        opacity: 1;
      }

      to {
        opacity: 0;
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0);
      }
    }

    @keyframes fadeOutRight {
      from {
        opacity: 1;
      }

      to {
        opacity: 0;
        -webkit-transform: translate3d(100%, 0, 0);
        transform: translate3d(100%, 0, 0);
      }
    }

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
  <style>
    .content-container .el-table td {
      padding: 2px 0;
      /* min-width: 0; */
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;
    }
  </style>
