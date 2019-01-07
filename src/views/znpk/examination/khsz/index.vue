<template>
  <div class="khsz">
    <el-row style="margin-bottom: 14px;">
      <el-select v-model="njValue" style="width: 150px"
                 placeholder="请选择年级"
                 clearable
                 @change="loadNjBjsz($event,0)" @clear="clearBjList">
        <el-option
          v-for="item in njOptions"
          :key="item.njdm"
          :label="item.njmc"
          :value="item.njdm">
        </el-option>
      </el-select>
      <el-select v-model="bjValue" style="width: 150px"
                 placeholder="请选择班级"
                 clearable
                 @change="loadNjBjsz($event,1)">
        <el-option
          v-for="item in bjOptions"
          :key="item.bjdm"
          :label="item.bjmc"
          :value="item.bjdm">
        </el-option>
      </el-select>
      <el-input style="width: 210px" maxlength="20" v-model="search" placeholder="输入姓名;学号;考号查询"  clearable></el-input>
      <el-button type="primary" icon="el-icon-search" @click="getKhszList">搜索</el-button>
      <!--<el-button size="small" type="primary" icon="el-icon-time" disabled style="float: right;">自动生成考号</el-button>-->
      <upload-excel-component @on-selected-file='getExcelData' style="float: right;"></upload-excel-component>
      <el-button @click="handleDownload" type="primary" icon="el-icon-download" style="float: right;">模板下载</el-button>

    </el-row>
  <el-table v-loading="loading"
    height="550"
    header-cell-class-name="dark-th"
    :data="tableData"
    border
    style="width: 100%;">
    <el-table-column
      prop="njmc"
      label="年级"
      width="180">
    </el-table-column>
    <el-table-column
      prop="bjmc"
      label="班级"
      width="180">
    </el-table-column>
    <el-table-column
      prop="xh"
      label="学号">
    </el-table-column>
    <el-table-column
      prop="xsxm"
      label="学生">
    </el-table-column>
    <el-table-column label="考号">
      <template slot-scope="scope">
        <template v-if="scope.row.xh == tempxh">
          <el-input class="edit-input" size="small" v-model="scope.row.kh" maxlength="20"  clearable></el-input>
        </template>
        <span v-else>{{ scope.row.kh }}</span>
      </template>
   </el-table-column>
    <el-table-column align="center" label="操作" width="120">
      <template slot-scope="scope">
        <el-button v-if="tempxh==scope.row.xh" type="success" @click="confirmEdit(scope.row)" size="small" icon="el-icon-circle-check-outline">确定</el-button>
        <el-button v-else type="primary" @click='tempxh = scope.row.xh' size="small" icon="el-icon-edit">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
        <el-col :span="24">
          <!--工具条-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="xsxx.query.page" :page-sizes="[8,12,16,20,24]"
                         :page-size="xsxx.query.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-col>

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
  import UploadExcelComponent from '@/components/UploadExcel/index'
  import * as api from '@/api/znpk/examination/khsz/index'
  export default {
    name: 'uploadExcel',
    components: { UploadExcelComponent },
    data() {
      return {
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,  // 当前考试代码
        loading: true,
        xsxx: {
          query: {
            page: 1,
            limit: 12
          }
        },
        total: 0,
        njOptions: [], // 年级list
        njValue: null, // 年级选中
        bjOptions: [], // 班级list
        bjValue: null, // 班级选中
        tableData: [],
        tempxh: null,
        search: null,
        dialogExcelVisible: false,
        gridData: [],
        tempList: [] // 下载导入错误的学生信息
      }
    }, methods: {
      loadNjBjsz(v, e) { /** @年级班级条件查询处理方法 **/
        /** 年级为空则查询班级 **/
        if (this.njValue != null && this.njValue !== '') {
          if (e === 0) {
            this.bjOptions = [];
            this.bjValue = null;
          }
          this.bjOptions = _.filter(this.bjList, item => item.njdm === this.njValue).map(item => (
          { bjdm: item.uuid, bjmc: item.bj } // 设置班级
          ))
        }
        this.getKhszList();
      },
      clearBjList() {
        this.bjOptions = [];
        this.bjValue = null;
        this.getKhszList();
      },
      getKhszList() { /** @学生考号列表方法 **/
        this.loading = true;
        /** 获取年级**/
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
            this.njOptions = nj_arry;
          }
        })
        this.xsxx.sfck = 0;
        this.xsxx.ksid = this.ksid;
        this.xsxx.xxdm = this.xxdm;
        this.xsxx.njdm = this.njValue;
        this.xsxx.bjdm = this.bjValue;
        this.xsxx.xsxm = this.search;
        api.getPageList(this.xsxx).then(response => {
          this.total = response.data.total;
          const list = response.data.rows.map(item => ({
            njdm: item.njdm,
            njmc: jcsj.hqnjmcByid(this.njList, item.njdm), // 获取年级名称
            bjmc: jcsj.hqbjmcByid(this.bjList, item.bjdm),
            xh: item.xh,
            xsxm: item.xsxm,
            kh: item.kh
          }));
          this.tableData = _.sortBy(list, ['njdm', 'bjmc']);
          this.loading = false;
        })
      },
      getExcelData(json) { /** @导入Excel数据 **/
        /** 导入模板验证**/
        if (json.header.length !== 5) {
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
              ksid: this.ksid,
              xxdm: this.xxdm,
              xh: item['学号'],
              kh: item['考号'],
              xsmc: item['学生'],
              njmc: item['年级'],
              bjmc: item['班级']
            }))
            this.loading = true;
            api.saveCkxsxx(list).then(res => {
              if (res.status === 200) {
                if (res.data) {
                  this.tempList = res.data.json;
                  const map = { success: res.data.success, error: res.data.error }
                  this.gridData = [];
                  this.gridData.push(map);
                  this.dialogExcelVisible = true;
                } else {
                  this.$notify({ title: '成功', message: '导入学生考号成功', type: 'success', duration: 2000 })
                }
                this.getKhszList();
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
      handleChange(value) {
        console.log(value);
      }, handleDownload() { /** @下载Excel数据 **/
        this.loading = true;
        api.getCkxsxxList({ sfck: 0, ksid: this.ksid, xxdm: this.xxdm, njdm: this.njValue, bjdm: this.bjValue, search: this.search }).then(response => {
          const list = response.data.map(item => ({
            njdm: item.njdm,
            njmc: jcsj.hqnjmcByid(this.njList, item.njdm), // 获取年级名称
            bjmc: jcsj.hqbjmcByid(this.bjList, item.bjdm),
            xh: item.xh,
            xsxm: item.xsxm,
            kh: item.kh
          }));
          const arryList = _.sortBy(list, ['njdm', 'bjmc']);
          /** 下载excel**/
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['年级', '班级', '学号', '学生', '考号'];
            const filterVal = ['njmc', 'bjmc', 'xh', 'xsxm', 'kh'];
            const data = this.formatJson(filterVal, arryList)
            excel.export_json_to_excel(tHeader, data, '学生考号录入表格')
          })
          this.loading = false;
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      confirmEdit(row) { /** 编辑某个学生考号方法 **/
        api.getEditXskh({ ksid: this.ksid, njdm: row.njdm, xh: row.xh, kh: row.kh ? row.kh : '' }).then(res => {
          if (res.status === 200) {
            if (res.data) {
              this.$notify({ title: '成功', message: '考号编辑成功', type: 'success', duration: 2000 });
              this.tempxh = null;
            } else {
              this.$notify({ title: '失败', message: '考号已存在，请使用其他考号。', type: 'error', duration: 2000 });
            }
          } else {
            this.$notify({ title: '失败', message: '考号编辑失败', type: 'error', duration: 2000 });
          }
          this.getKhszList();
        })
      },
      downXsxx() { // 下载错误模板
        /** 下载excel**/
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['年级', '班级', '学号', '学生', '考号', '错误原因'];
          const filterVal = ['njmc', 'bjmc', 'xh', 'xsmc', 'kh', 'mgssage'];
          const data = this.formatJson(filterVal, this.tempList)
          excel.export_json_to_excel(tHeader, data, '学生考号录入异常表格')
        })
      },
      handleSizeChange(val) {
        /** 跳转到某页**/
        this.xsxx.query.limit = val;
        this.getKhszList();
      },
      handleCurrentChange(val) {
        /** 跳转到某页**/
        this.xsxx.query.page = val;
        this.getKhszList();
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
      }
    }
  }
</script>

<style>
.khsz .dark-th {
  background-color: #f5f7fa;
}
</style>
