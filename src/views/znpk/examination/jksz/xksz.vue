<template>
    <div class="xksz">
      <el-dialog title="教师设置" :visible.sync="dialogVisible"  width="28%">
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
                <el-option
                  v-for="(item,index) in jsList"
                  :key="index"
                  :label="item.xm"
                  :value="item.gh">
                </el-option>
              <!--<el-option v-for="item in jsList" :key="item.gh" :label="item.xm" :value="item.gh"></el-option>-->
            </el-select>
          </el-col>
          <!-- <el-col :span="4">
             <el-button type="primary" @click="onSubmit">确定</el-button>
           </el-col>-->
        </el-form-item>
        <el-alert
          title="温馨提示，可输入教师姓名搜索查找。"
          type="warning" show-icon :closable="false">
        </el-alert>
      </el-form>
    </el-dialog>
          <el-table header-cell-class-name="dark-th" :data="tableData" border fit highlight-current-row style="width: 100%">
            <el-table-column  min-width="160" align="center"  v-for='(fruit,index) in formThead' :key='index' :label="fruit.kcmc">
              <template slot-scope="scope">
                <div v-if="scope.row[fruit.kcdm]">
                 <el-input autocomplete="off"
                            v-model="scope.row[fruit.kcdm].xm"
                            readonly="readonly"
                            suffix-icon="el-icon-edit el-input__icon"
                           @focus="inputEidt(scope,fruit)"
                            ></el-input>
                </div>
                <div v-else>
                  <span style="color: #c0c4cc;font-size: 8px;">不可设置</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
    </div>
</template>
<script>
  import jcsj from '@/api/jcsj'
  import * as api from '@/api/znpk/examination/jksz/index'
  export default {
    data() {
      return {
        activeName: '1',
        kskmid: null,
        multipleLimit: 2, // 每门科目教师最多数量
        value9: [], // 科目选中的教师
        dialogVisible: false,
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,  // 当前考试代码
        tableData: [],
        formThead: []
      };
    },
    watch: {
      dqNjdm() {
        this.initXksz();
      }
    },
    methods: {

      async initXksz() { /** @巡考设置  **/
        if (this.dqNjdm !== '') {
          /** 获取考试科目 **/
          const res_km = await api.getKskmxx({ njdm: this.dqNjdm, ksdxid: this.ksid });
          const kmlist = res_km.data.rows;
          if (kmlist) {
            /** 科目表头**/
            this.formThead = kmlist.map(item => ({ kskmid: item.jlid, kcdm: item.kcdm, kcmc: jcsj.hqkcmcByid(this.kcList, item.kcdm) }));
            /** 科目教师信息 **/
            const res_js = await api.getXkjsAll(this.ksid)
            /** 获取科目教师 **/
            this.tableData = [];
            const map = {}
            for (const o of kmlist) {  /** 科目中放入教师 **/
              const km_js_list = _.filter(res_js.data, item => item.njdm === this.dqNjdm && item.kskmid === o.jlid);
              const [js_map, zghArr, xmArry] = [{}, [], []];
              if (km_js_list.length > 0) {
                for (const e of km_js_list) {
                  zghArr.push(e.zgh);
                  xmArry.push(jcsj.hqjsmcByid(this.jsList, e.zgh));
                }
                js_map.gh = zghArr;
                js_map.xm = xmArry.join(',');
                map[o.kcdm] = js_map;
                map.kskmid = o.jlid;
              } else {
                js_map.gh = '';
                js_map.xm = '';
                map[o.kcdm] = js_map;
                map.kskmid = o.jlid;
              }
            }
            this.tableData.push(map);
          }
        }
      },
      inputEidt(scope, fruit) {
        const v = scope.row[fruit.kcdm].gh;
        this.value9 = v.length > 0 ? v : [];
        this.kskmid = fruit.kskmid;
        this.dialogVisible = true;
      },
      handleChangeSel(v) {
        const list = v.length > 0 ? v.map(item => ({
          ksid: this.ksid,
          njdm: this.dqNjdm,
          kskmid: this.kskmid,
          zgh: item
        })) : [{ ksid: this.ksid, njdm: this.dqNjdm, kskmid: this.kskmid, zgh: null }];
        /** 循环考试老师信息**/
        api.getSaveXklsxx(list).then(res => {
          if (res.status === 200) {
            this.initXksz();
            this.$notify({ title: '成功', message: '教师设置成功', type: 'success', duration: 2000 })
          }
        })
      }
    },
    props: {
      dqNjdm: {
        /** 年级类型列表数据**/
        type: String,
        required: true
      },
      njList: {
        /** 年级类型列表数据**/
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
      }
    }
  };
</script>
<style>
.xksz .dark-th {
  background-color: #f5f7fa;
}
</style>
