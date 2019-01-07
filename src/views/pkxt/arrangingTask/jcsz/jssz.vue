<template>
  <div class="el-jssz">
    <div class="filter-container">
      <el-select style="float:left;" v-model="njValue" @change="handLoadJssz">
        <el-option
          v-for="item in njOptions"
          :key="item.njdm"
          :label="item.njmc"
          :value="item.njdm">
        </el-option>
      </el-select>&nbsp;
      <upload-excel-component @on-selected-file='getExcelData'></upload-excel-component>
      <el-button type="primary" icon="el-icon-download" @click="handleDownload" :loading="downloadLoading">
        下载导入模板
      </el-button>
    </div>
    <div style="padding-bottom: 10px">
    <el-alert
     style="margin: 4px 0 !important;"
      title="温馨提示，“不可设置”原因：基础设置模块-课程设置中无当前课程或者课程节数为0则不可设置班级课程教师。"
      type="warning" show-icon>
    </el-alert></div>
    <el-table class="jssz-table" :data="tableData" height="520" 
              border fit highlight-current-row style="width: 100%">
      <el-table-column fixed prop="name" label="任课" width="140" align="center"></el-table-column>
      <el-table-column width="160" align="center"  v-for='(fruit,index) in formThead' :key='index' :label="fruit.kcmc">
        <template slot-scope="scope">
          <!--{{scope.row[fruit.kcdm].xm}}-->
          <div v-if="scope.row[fruit.kcdm]">
            <el-input autocomplete="off"
                      v-model="scope.row[fruit.kcdm].xm"
                      readonly="readonly"
                      suffix-icon="el-icon-edit el-input__icon"
                      @focus="inputEidt(scope,fruit)"></el-input>
          </div>
          <div v-else>
            <span style="color: #c0c4cc;font-size: 8px;">不可设置</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="教师设置" :visible.sync="dialogVisible" width="28%">
      <el-form ref="form" label-width="40px">
        <el-form-item label="教师">
          <el-col :span="18">
            <el-select ref="jsSelect" style="width:128%;" v-model="value9"
                       prefix
                       multiple
                       placeholder="请选择或者搜索教师"
                       :multiple-limit="multipleLimit"
                       filterable clearable
                       @change="handleChangeSel(value9)">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
              <el-option-group
                v-for="(group,index) in list"
                :key="index"
                :label="group.label">
                <el-option
                  v-for="(item,index) in group.options"
                  :key="index"
                  :label="item.xm"
                  :value="item.gh">
                </el-option>
              </el-option-group>
            </el-select>
          </el-col>
        </el-form-item>
        <el-alert
          title="温馨提示，可输入教师姓名搜索查找。"
          type="warning" show-icon :closable="false">
        </el-alert>
      </el-form>
    </el-dialog>
    <el-dialog id="jel-dialog__body" style="margin-top:20vh;"
      title="提示"
      :visible.sync="messageVisible"
      width="25%">
      <div class="el-message-box__status el-icon-warning"></div>
      <div class="el-message-box__message"><p>确定对教师进行修改吗,修改后清空规则条件历史数据将无法恢复哦?</p></div>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="messageVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="nextCheck">确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getKcNjgx, getKcSz, getSaveJsSz, getJszjsgxList, checkGzsz, initGzsz } from '@/api/pkxt/arrangingTask/jcsz/jssz'
  import jcsj from '@/api/jcsj'
  import UploadExcelComponent from '@/components/UploadExcel/index'

  export default {
    name: 'uploadExcel',
    components: { UploadExcelComponent },
    data() {
      return {
        filename: '',
        mp: [],
        dialogVisible: false,
        szjsArry: [],
        njOptions: [],
        njValue: '',
        tableData: [],
        key: 1, // table key
        formThead: [], // 默认表头 Default header
        value9: [],
        temp: {},
        bjdm: '',
        kcdm: '',
        list: null,
        downloadLoading: false,
        loading: false,
        xxdm: this.$route.query.xxdm,
        rwid: this.$route.query.rwid,
        dqxn: this.$route.query.dqxn,
        dqxq: this.$route.query.dqxq,
        multipleLimit: 1,
        jszjsxxList: [],
        checkGztj: false,
        messageVisible: false
      }
    },
    watch: {
    },
    created() {
      const parm = { xxdm: this.xxdm }
      /** 获取年级**/
      jcsj.hqnjlb(parm).then(res => {
        this.njOptions = res;
        this.njValue = this.njOptions[0].njdm;
      })
    },
    mounted() {
    },
    methods: {
      async handLoadJssz() {
        const parm = { xxdm: this.xxdm, njdm: this.njValue, rwid: this.rwid }
        /** 获取课程年级关系**/
        const data = await getKcNjgx(parm);
        this.formThead = [];
        for (const o of data) {
          this.formThead.push({
              /** 获取课程代码**/
            kcdm: o.kcdm,
              /** 获取课程名称**/
            kcmc: jcsj.hqkcmcByid(this.kcList, o.kcdm)
          });
        }

        /** 获取年级课程设置列表**/
        getKcSz({ rwid: this.rwid, xxdm: this.xxdm }).then(response => {
          this.tableData = [];
          /** 获取年级班级信息**/
          const bj_list = _.filter(this.bjList, { njdm: this.njValue });
          /** 遍历班级**/
          this.tableData = bj_list.map(item => {
            const map = { bjdm: item.uuid, name: item.bj };
            /** 获取班级课程计划信息**/
            const kc_list = _.filter(response.data.rows, e => e.bjdm === item.uuid && parseInt(e.zxs) !== 0);
            /** 遍历课程信息**/
            for (const o of kc_list) {
              map[o.kcdm] = {
                gh: o.zgh,
                xm: jcsj.hqjsmcByid(this.jsList, o.zgh)
              };
            }
            return map;
          })
        });
        /** 远程搜索教师组教师数据初始化**/
        getJszjsgxList({ xxdm: this.xxdm }).then(res => {
          this.jszjsxxList = res;
          this.list = this.jszList.map(item => {
            const map = { label: item.zmc, options: [] }
            const arry = _.filter(res, e => e.zdm === item.zdm);
            map.options = arry.map(f => ({
              gh: f.zgh,
              xm: jcsj.hqjsmcByid(this.jsList, f.zgh)
            }))
            return map;
          });
        })
        /** 验证规则条件数据是否为空 **/
        checkGzsz({ rwid: this.rwid, xxdm: this.xxdm }).then(res => {
          this.checkGztj = res.data;
        });
      }, nextCheck() {
        this.messageVisible = false;
        this.$nextTick(() => {
          this.checkGztj = true;
          this.dialogVisible = true;
        })
      },
      /** 点击input修改教师**/
      inputEidt(scope, fruit) {
        /** 教师不为空则设置教师选中**/
        const [v, b, k] = [scope.row[fruit.kcdm].gh, scope.row.bjdm, fruit.kcdm];
        this.value9 = v ? [v] : [];
        this.bjdm = b;
        this.kcdm = k;
        if (this.checkGztj) { // 验证true规则条件已经使用教师
          this.messageVisible = true;
        } else {
          this.$nextTick(() => {
            this.dialogVisible = true;
          })
        }
      },
      /** 保存教师**/
      handleChangeSel(v) {
        const temp = {}
        temp.xxdm = this.xxdm;
        temp.rwid = this.rwid;
        temp.bjdm = this.bjdm;
        temp.kcdm = this.kcdm;
        temp.zgh = v.join(',');
        getSaveJsSz(temp).then(res => {
          this.handLoadJssz();
          if (res.data) {
            if (v.length > 0) {
              this.$nextTick(() => {
                this.$refs.jsSelect.blur();
                this.dialogVisible = false;
              })
            }
            this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
            if (this.checkGztj) { /** 清空规则条件数据 **/
              initGzsz({ rwid: this.rwid, xxdm: this.xxdm }).then(() => {
                this.checkGztj = false;
                this.$notify({ title: '成功', message: '规则条件历史数据已清空', type: 'success', duration: 2000 });
              });
            }
          } else {
            this.$notify.error({ title: '错误', message: '修改失败' });
          }
        })
      },
      handleDownload() {
        /** 下载excel**/
        this.downloadLoading = true;
        import('@/vendor/Export2Excel').then(excel => {
          /** 获取年级名称**/
          const njmc = jcsj.hqnjmcByid(this.njList, this.njValue);
          const tHeader = ['任课']
          const filterVal = ['name']
          for (const o of this.formThead) {
            tHeader.push(o.kcmc);
            filterVal.push(o.kcdm);
          }
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel(tHeader, data, njmc + '教师录入表格')
          this.downloadLoading = false;
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            if (j === 'name') {
              return v[j];
            } else {
              return v[j] ? v[j].xm : v[j];
            }
          }
        }))
      },
      getExcelData(data) { /** excel导入教师**/
        /** 导入模板验证**/
        if ((this.formThead.length + 1) !== data.header.length || data.results.length !== this.tableData.length) {
          this.$alert('excel表头不匹配，请下载正确的模板。', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: () => false
          });
          return false
        } else {
          /** excel数据处理**/
          const map = this.excelDispose(data);
          if (map.json) {
            let str = null;
            if (map.message.length > 0) {   /** 验证存在异常 **/
              str = map.message.join(',') + '该教师不存在于教师组维护中,将不会被导入是否导入?';
              this.$confirm(str, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.loadSaveJsSz(map.json);
              }).catch(() => false);
            } else {   /** 验证不存在异常 **/
              this.loadSaveJsSz(map.json);
            }
          }
        }
      }, loadSaveJsSz(json) {
        /** excel数据导入数据库**/
        getSaveJsSz({ xxdm: this.xxdm, rwid: this.rwid, njdm: this.njValue, pkJxjhList: json }).then(res => {
          this.handLoadJssz();
          if (res.data) {
            this.$notify({ title: '成功', message: '导入成功', type: 'success', duration: 2000 })
          } else {
            this.$notify.error({ title: '错误', message: '导入失败' });
          }
        })
      }, excelDispose(data) {
        const map_arry = { json: [], message: [] }
        for (const o of data.results) {
          /** 获取读取返回的班级课程教师excel数据**/
          let bjdm = '';
          for (const e in o) {
            if (e === '任课') {
              /** 取班级代码**/
              bjdm = this.hqbjdmBymc(this.bjList, o[e]);
              if (!bjdm) {
                const message = '错误原因:“' + o[e] + '”不匹配,请检查模板。';
                this.$alert(message, '提示', {
                  type: 'warning',
                  confirmButtonText: '确定',
                  callback: () => false
                });
                return false
              }
            } else {
              /** 取课程和教师代码**/
              const map = {}
              const kcdm = this.hqkcdmBymc(this.kcList, e);
              if (!kcdm) {
                const message = '错误原因:“' + e + '”不匹配,请检查模板。)';
                this.$alert(message, '提示', {
                  type: 'warning',
                  confirmButtonText: '确定',
                  callback: () => false
                });
                return false
              }
              map.rwid = this.rwid;
              map.xxdm = this.xxdm;
              map.bjdm = bjdm;
              map.kcdm = kcdm;
              if (o[e]) {
                const zgh = this.hqjsdmBymc(this.jsList, o[e]);
                if (!zgh) {
                  map_arry.message.push(o[e]);
                }
                map.zgh = zgh;
              } else {
                map.zgh = '';
              }
              map_arry.json.push(map);
            }
          }
        }
        return map_arry;
      }, hqjsdmBymc(dataList, value) {
        const res = _.find(dataList, o => o.xm === value);
        if (res) {
          return res.gh;
        } else {
          return null;
        }
      }, /** 课程名称获取课程代码**/
      hqkcdmBymc(dataList, value) {
        const res = _.find(dataList, o => o.kcmc === value);
        if (res) {
          return res.uuid;
        } else {
          return null;
        }
      }, /** 班级名称获取代码**/
      hqbjdmBymc(dataList, value) {
        const res = _.find(dataList, o => o.bj === value);
        if (res) {
          return res.uuid;
        } else {
          return null;
        }
      },
      handleUpload() {
        document.getElementById('excel-upload-input').click();
        this.$refs['excel-upload-input'].value = null;
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
  }
</script>
<style scoped>
  #excel-upload-input {
    display: none;
    z-index: -9999;
  }
  #jel-dialog__body .el-dialog__body {
    padding: 0px 20px;
  }
</style>
