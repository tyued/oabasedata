<!--排课系统首页-->
<template>
  <div class="app-container calendar-list-container" style="height: 60px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/examManager/examination' }">我的排考</el-breadcrumb-item>
        <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
      </el-breadcrumb>
       <br>
        <el-row style="margin-bottom: 3px">
          <el-select v-model="currentNjmc" style="width: 150px"
                     placeholder="请选择年级"
                     clearable
                     @change="initXsList" @clear="initXsList">
            <el-option
              v-for="item in njArr"
              :key="item.njdm"
              :label="item.njmc"
              :value="item.njdm">
            </el-option>
          </el-select>
          <el-input style="width: 210px" maxlength="20" v-model="searchValue" placeholder="输入姓名;学号查询"  clearable></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initXsList">搜索</el-button>
          <upload-excel-component @on-selected-file='getExcelData' style="float: right;"></upload-excel-component>
          <el-button @click="handleDownload" type="primary" icon="el-icon-download" style="float: right;">模板下载</el-button>
        </el-row>
        <el-table height="600"
                  header-cell-class-name="dark-th"
                  :data="tableData"
                  border
                  style="width: 100%;">
          <el-table-column
            fixed
            prop="njmc"
            label="年级"
            width="120">
          </el-table-column>
          <el-table-column
            prop="bjmc"
            label="班级"
            width="120">
          </el-table-column>
          <el-table-column
            prop="xh"
            label="学号">
          </el-table-column>
          <el-table-column
            prop="xsxm"
            label="姓名">
          </el-table-column>
          <el-table-column align="center" label="考试状态">
            <template slot-scope="scope">
              <el-tag size="medium">免考</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text"  size="small" icon="el-icon-edit" @click="deleteData(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    <!--导入失败-->
    <el-dialog title="导入警告信息" :visible.sync="dialogExcelVisible"  width="45%">
      <el-table :data="gridData" border>
        <el-table-column  label="导入成功" width="150">
          <template slot-scope="scope">
            {{ scope.row.success }}条
          </template>
        </el-table-column>
        <el-table-column  label="导入失败" width="150">
          <template slot-scope="scope">
            {{ scope.row.error }}条
          </template>
        </el-table-column>
        <el-table-column  label="导入出错原因">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-download"  size="small" @click="downXsxx">下载模板查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import jcsj from '@/api/jcsj'
  import * as api from '@/api/znpk/examination/mksz/index'
  import UploadExcelComponent from '@/components/UploadExcel/index'

  export default {
    name: 'uploadExcel',
    components: { UploadExcelComponent },
    data() {
      return {
        name: this.$route.query.ksmc,
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,
        dqxn: this.$route.query.dqxn,
        tableData: [],
        njArr: [],
        currentNjmc: '',
        searchValue: null,
        tempList: [],
        dialogExcelVisible: false,
        gridData: []
      }
    },
    async created() {
      const parm = { xxdm: this.xxdm, xn: this.dqxn }
      /** 获取年级**/
      this.njList = await jcsj.hqnjlb(parm);
      /** 获取班级**/
      this.bjList = await jcsj.hqbjlb(parm);
      /** 获取参考年级 **/
      api.getCknj({ ksdxid: this.ksid }).then(res => {
        if (res.length > 0) {
          const $this = this, nj_arry = [];
          res.forEach(njdm => {
            const obj = {};
            obj.njdm = njdm;
            obj.njmc = jcsj.hqnjmcByid($this.njList, njdm);
            nj_arry.push(obj);
          });
          // 初始化默认选中年级
          this.njArr = nj_arry;
          // this.currentNjmc = this.njArr[0].njdm;
          this.initXsList();
        }
      })
    },
    methods: {
      initXsList() {
        /** @学生考号列表方法 **/
        api.getCkxsxxList({ sfck: 1, ksid: this.ksid, xxdm: this.xxdm, njdm: this.currentNjmc, search: this.searchValue }).then(response => {
          const list = response.data.map(item => ({
            njdm: item.njdm,
            njmc: jcsj.hqnjmcByid(this.njList, item.njdm), // 获取年级名称
            bjmc: jcsj.hqbjmcByid(this.bjList, item.bjdm),
            xh: item.xh,
            xsxm: item.xsxm,
            kh: item.kh
          }));
          this.tableData = _.sortBy(list, ['njdm', 'bjmc']);
        })
      },
      handleClick() {
        console.log('');
      }, handleDownload() { /** @下载Excel数据 **/
        /** 下载excel**/
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['年级', '班级', '学号', '学生'];
          const filterVal = ['njdm', 'bjdm', 'xh', 'xsxm'];
          const data = this.formatJson(filterVal, [])
          excel.export_json_to_excel(tHeader, data, '免考学生录入表格')
        })
      },
      getExcelData(json) {
        /** 导入模板验证**/
        if (json.header.length !== 4) {
          this.$alert('excel表头不匹配，请下载正确的模板。', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: () => false
          });
          return false
        } else {
          const data = json.results;
          if (data.length > 0) {
            const list = data.map(item => ({
              ksid: this.tempksid,
              xxdm: this.xxdm,
              xh: item['学号'],
              xsmc: item['姓名'],
              njmc: item['年级'],
              bjmc: item['班级'],
              sfck: 1
            }))
            api.saveMkszXx(list).then(res => {
              if (res.status === 200) {
                if (res.data) {
                  this.tempList = res.data.json;
                  const map = { success: res.data.success, error: res.data.error }
                  this.gridData = [];
                  this.gridData.push(map);
                  this.dialogExcelVisible = true;
                } else {
                  this.initXsList();
                  this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
                }
              } else {
                this.$notify({ title: '失败', message: '操作发生异常，请联系管理员！', type: 'error', duration: 2000 });
              }
            })
          } else {
            this.$alert('导入的数据不能为空！', '提示', {
              type: 'warning',
              confirmButtonText: '确定',
              callback: () => false
            });
          }
        }
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      downXsxx() { // 下载错误模板
        /** 下载excel**/
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['年级', '班级', '学号', '学生', '错误原因'];
          const filterVal = ['njmc', 'bjmc', 'xh', 'xsmc', 'mgssage'];
          const data = this.formatJson(filterVal, this.tempList)
          excel.export_json_to_excel(tHeader, data, '学生考号录入异常表格')
        })
      },
      deleteData(item) {
      /** 删除**/
        this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
          api.getDelete({ ksid: item.ksid, xh: item.xh, sfck: 0 }).then(() => {
            this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
            this.initXsList();
          });
        });
      }

    }
  }

</script>



