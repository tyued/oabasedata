<template>
 <div>
  <div class="detaLeft">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="原上课人:">
        <el-autocomplete v-if="glytype"
          class="inline-input yskr"
          v-model="form.yskr"
          :fetch-suggestions="querySearch"
          placeholder="输入教师姓名进行查询"
          :trigger-on-focus="false"
          @select="handleSelect"
          suffix-icon="el-icon-search"
        >
          <template slot-scope="item">
            <div class="name">{{ item.item.xm }}</div>
          </template>
        </el-autocomplete>
        <el-input v-else
          placeholder=""
          v-model="initYdk"
          :disabled="true"
          class="inline-input yskr">
        </el-input>
      </el-form-item>
      <el-form-item label="代课人:">
        <el-autocomplete
          class="inline-input dkr"
          v-model="form.dkr"
          :fetch-suggestions="dkrquerySearch"
          placeholder="代课人"
          :trigger-on-focus="false"
          @select="dkrhandleSelect"
          suffix-icon="el-icon-edit"
        >
          <template slot-scope="item">
            <div class="name">{{ item.item.xm }}</div>
          </template>
        </el-autocomplete>
        <el-tooltip class="item" effect="dark" content="查看代课人课表" placement="top-end">
          <el-button icon="el-icon-view" @click="openBox" circle></el-button>
        </el-tooltip>
       <!-- <a class="checkClass" @click="openBox">查看课表</a>-->
      </el-form-item>
      <el-form-item label="推荐老师:">
         <el-button size="small" v-for="(item,index) in tjjs" @click="changedkr(item)" :key="index" type="info" plain>{{item}}</el-button>

      </el-form-item>
      <el-form-item label="代课日期:">
        <el-tag
          v-for="tag in tags"
          :key="tag.name"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          :type="tag.type">
          {{tag.name}}
        </el-tag>
      </el-form-item>
      <el-form-item label="代课原因:">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancle">返回</el-button>
        <el-button @click="shengqin" type="primary">申请</el-button>
      </el-form-item>
    </el-form>
    <!--<div class="handel">
      <el-button @click="cancle">取消</el-button>
      <el-button @click="shengqin" type="primary">申请</el-button>
   </div>-->
  </div>
  <div class="detaRight">
     <el-table
    :data="tableData" border
    style="width: 100%">
     <el-table-column style="text-align:center" label="原上课人课表">
     <el-table-column
      type="index"
      width="40">
    </el-table-column>
    <el-table-column
      label="星期一"
      width="200">
       <template slot-scope="scope" >
        <el-popover trigger="hover" placement="top">
          <p>课程: {{ scope.row.class1 }}</p>
          <div v-for="(item,index) in scope.row.timeView1" :key="index">
            <p v-if="item" >时间: {{ item }}</p>
            <p v-if="scope.row.status1[index] != ''">状态: {{ scope.row.status1[index] }}</p>
          </div>

          <div slot="reference" v-show="scope.row.class1 != ''" class="name-wrapper">
            <el-checkbox v-if="scope.row.inputchecked1" disabled v-model="scope.row.checked1">{{ scope.row.class1 }}</el-checkbox>
            <el-checkbox v-else v-model="scope.row.checked1" @change="changeCheck">{{ scope.row.class1 }}</el-checkbox>
            <span v-if="scope.row.statuVal1 != '' && scope.row.statuVal1 == '3'" class="handelPass">
              通过
            </span>
            <span v-else-if="scope.row.statuVal1 != '' && scope.row.statuVal1 == '0'" class="noPass">
              未审核
            </span>
            <span v-else-if="scope.row.statuVal1 != '' && scope.row.statuVal1 == '1'" class="noPass">
              审批中
            </span>
            <span v-else-if="scope.row.statuVal1 != '' && scope.row.statuVal1 == '3'" class="passing">
              撤销
            </span>
            <span v-else-if="scope.row.statuVal1 != '' && scope.row.statuVal1 == '4'" class="handelPass">
              不通过
            </span>
            <span v-else-if="scope.row.statuVal1 != '' && scope.row.statuVal1 == '4'" class="handelPass">
              暂无状态
            </span>
            <el-date-picker
              type="dates"
              format="yyyy-MM-dd"
              v-model="scope.row.chooseTime1"
              value-format="yyyy-MM-dd"
              placeholder="请选择一个或多个日期"
              :picker-options="scope.row.pickerOptions"
              :disabled="scope.row.disabled1"
              @change="changeTime(scope)">
            </el-date-picker>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="星期二"
      width="200">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>课程: {{ scope.row.class2 }}</p>
          <div v-for="(item,index) in scope.row.timeView2" :key="index">
            <p v-if="item" >时间: {{ item }}</p>
            <p v-if="scope.row.status2[index] != ''">状态: {{ scope.row.status2[index] }}</p>
          </div>
          <div slot="reference" class="name-wrapper"  v-show="scope.row.class2 != ''">
            <el-checkbox v-if="scope.row.inputchecked2" disabled v-model="scope.row.checked2">{{ scope.row.class2 }}</el-checkbox>
            <el-checkbox v-else v-model="scope.row.checked2" @change="changeCheck">{{ scope.row.class2 }}</el-checkbox>
            <span v-if="scope.row.statuVal2 != '' && scope.row.statuVal2 == '3'" class="handelPass">
              通过
            </span>
            <span v-else-if="scope.row.statuVal2 != '' && scope.row.statuVal2 == '0'" class="noPass">
              未审核
            </span>
            <span v-else-if="scope.row.statuVal2 != '' && scope.row.statuVal2 == '1'" class="noPass">
              审批中
            </span>
            <span v-else-if="scope.row.statuVal2 != '' && scope.row.statuVal2 == '2'" class="passing">
              撤销
            </span>
            <span v-else-if="scope.row.statuVal2 != '' && scope.row.statuVal2 == '4'" class="handelPass">
              不通过
            </span>
            <span v-else-if="scope.row.statuVal2 != '' && scope.row.statuVal2 == '4'" class="handelPass">
              暂无状态
            </span>
            <el-date-picker
              type="dates"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="scope.row.chooseTime2"
              placeholder="请选择一个或多个日期"
              :picker-options="scope.row.pickerOptions"
              :disabled="scope.row.disabled2"
              @change="changeTime(scope)">
            </el-date-picker>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     <el-table-column
      label="星期三"
      width="200">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>课程: {{ scope.row.class3 }}</p>
          <div v-for="(item,index) in scope.row.timeView3" :key="index">
            <p v-if="item" >时间: {{ item }}</p>
            <p v-if="scope.row.status3[index] != ''">状态: {{ scope.row.status3[index] }}</p>
          </div>
          <div slot="reference" class="name-wrapper"  v-show="scope.row.class3 != ''">
            <el-checkbox v-if="scope.row.inputchecked3" disabled v-model="scope.row.checked3">{{ scope.row.class3 }}</el-checkbox>
            <el-checkbox v-else  v-model="scope.row.checked3" @change="changeCheck">{{ scope.row.class3 }}</el-checkbox>
            <span v-if="scope.row.statuVal3 != '' && scope.row.statuVal3 == '3'" class="handelPass">
              通过
            </span>
            <span v-else-if="scope.row.statuVal3 != '' && scope.row.statuVal3 == '0'" class="noPass">
              未审核
            </span>
            <span v-else-if="scope.row.statuVal3 != '' && scope.row.statuVal3 == '1'" class="noPass">
              审批中
            </span>
            <span v-else-if="scope.row.statuVal3 != '' && scope.row.statuVal3 == '2'" class="passing">
              撤销
            </span>
            <span v-else-if="scope.row.statuVal3 != '' && scope.row.statuVal3 == '4'" class="handelPass">
              不通过
            </span>
            <span v-else-if="scope.row.statuVal3 != '' && scope.row.statuVal3 == '4'" class="handelPass">
              暂无状态
            </span>
            <el-date-picker
              type="dates"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="scope.row.chooseTime3"
              placeholder="请选择一个或多个日期"
              :picker-options="scope.row.pickerOptions"
              :disabled="scope.row.disabled3"
              @change="changeTime(scope)">
            </el-date-picker>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     <el-table-column
      label="星期四"
      width="200">
       <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>课程: {{ scope.row.class4 }}</p>
          <div v-for="(item,index) in scope.row.timeView4" :key="index">
            <p v-if="item" >时间: {{ item }}</p>
            <p v-if="scope.row.status4[index] != ''">状态: {{ scope.row.status4[index] }}</p>
          </div>
          <div slot="reference" class="name-wrapper"  v-show="scope.row.class4 != ''">
            <el-checkbox v-if="scope.row.inputchecked4" disabled v-model="scope.row.checked4">{{ scope.row.class4 }}</el-checkbox>
            <el-checkbox v-else  v-model="scope.row.checked4" @change="changeCheck(scope)">{{ scope.row.class4 }}</el-checkbox>
            <span v-if="scope.row.statuVal4 != '' && scope.row.statuVal4 == '3'" class="handelPass">
              通过
            </span>
            <span v-else-if="scope.row.statuVal4 != '' && scope.row.statuVal4 == '0'" class="noPass">
              未审核
            </span>
            <span v-else-if="scope.row.statuVal4 != '' && scope.row.statuVal4 == '1'" class="noPass">
              审批中
            </span>
            <span v-else-if="scope.row.statuVal4 != '' && scope.row.statuVal4 == '2'" class="passing">
              撤销
            </span>
            <span v-else-if="scope.row.statuVal4 != '' && scope.row.statuVal4 == '4'" class="handelPass">
              不通过
            </span>
            <span v-else-if="scope.row.statuVal4 != '' && scope.row.statuVal4 == '4'" class="handelPass">
              暂无状态
            </span>
            <el-date-picker
              type="dates"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="scope.row.chooseTime4"
              placeholder="请选择一个或多个日期"
              :disabled="scope.row.disabled4"
              :picker-options="scope.row.pickerOptions"
              @change="changeTime(scope)">
            </el-date-picker>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="星期五"
      width="200">
       <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>课程: {{ scope.row.class5 }}</p>
          <div v-for="(item,index) in scope.row.timeView5" :key="index">
            <p v-if="item" >时间: {{ item }}</p>
            <p v-if="scope.row.status5[index] != ''">状态: {{ scope.row.status5[index] }}</p>
          </div>
          <div slot="reference" class="name-wrapper"  v-show="scope.row.class5 != ''">
            <el-checkbox v-if="scope.row.inputchecked5" disabled v-model="scope.row.checked5">{{ scope.row.class5 }}</el-checkbox>
            <el-checkbox v-else  v-model="scope.row.checked5" @change="changeCheck">{{ scope.row.class5 }}</el-checkbox>
            <span v-if="scope.row.statuVal5 != '' && scope.row.statuVal5 == '3'" class="handelPass">
              通过
            </span>
            <span v-else-if="scope.row.statuVal5 != '' && scope.row.statuVal5 == '0'" class="noPass">
              未审核
            </span>
            <span v-else-if="scope.row.statuVal5 != '' && scope.row.statuVal5 == '1'" class="noPass">
              审批中
            </span>
            <span v-else-if="scope.row.statuVal5 != '' && scope.row.statuVal5 == '2'" class="passing">
              撤销
            </span>
            <span v-else-if="scope.row.statuVal5 != '' && scope.row.statuVal5 == '4'" class="handelPass">
              不通过
            </span>
            <span v-else-if="scope.row.statuVal5 != '' && scope.row.statuVal5 == '4'" class="handelPass">
              暂无状态
            </span>
            <el-date-picker
              type="dates"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="scope.row.chooseTime5"
              placeholder="请选择一个或多个日期"
              :picker-options="scope.row.pickerOptions"
              :disabled="scope.row.disabled5"
              @change="changeTime(scope)">
            </el-date-picker>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     </el-table-column>

  </el-table>


  </div>

  <div class="dkFade" v-if="fade">

    <div v-if="fadeTabel" class="fadeTabel">
      <i class="el-icon-close closeModel" @click="closeMod"></i>
      <el-table class="tableMo"
    :data="dktableData" border
    style="width: 100%; height:100%">
     <el-table-column style="text-align:center" label="带课人课表">
     <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      label="星期一"
      width="190">
      <template slot-scope="scope" >
        <div slot="reference" v-show="scope.row.class1 != ''" class="name-wrapper">
          <p>{{ scope.row.class1 }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="星期二"
      width="190">
      <template slot-scope="scope">
         <div slot="reference" v-show="scope.row.class2 != ''" class="name-wrapper">
          <p>{{ scope.row.class2 }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="星期三"
      width="190">
      <template slot-scope="scope">
        <div slot="reference" v-show="scope.row.class3 != ''" class="name-wrapper">
          <p>{{ scope.row.class3 }}</p>
        </div>
      </template>
    </el-table-column>
     <el-table-column
      label="星期四"
      width="190">
       <template slot-scope="scope">
         <div slot="reference" v-show="scope.row.class4 != ''" class="name-wrapper">
          <p>{{ scope.row.class4 }}</p>
        </div>
      </template>
    </el-table-column>
     <el-table-column
      label="星期五"
      width="190">
       <template slot-scope="scope">
         <div slot="reference" v-show="scope.row.class5 != ''" class="name-wrapper">
          <p>{{ scope.row.class5 }}</p>
        </div>
      </template>
    </el-table-column>
     </el-table-column>

  </el-table>

    </div>
  </div>



  </div>
</template>

<script>
import {
  getByJsList,getClassStructure,getRecommendedTeacher,checkConflict,save
  } from '@/api/tdk/tk'
 import jcsj from '@/api/jcsj';
 import { getCurrentXnxq } from 'api/admin/acadyear/index';
export default {
  data() {
    return {
      restaurants: [],
      form: {
        yskr: "",
        dkr: "",
        desc: "",
        yskrgh:"",
        dkrgh:""
      },
      tags: [
      ],
      tableData:[],
      dktableData:[],
      fade:false,
      fadeTabel:false,
      listQuery:{
        xxdm:'',
        zgh:''
      },
      ysklistQuery:{
        xxdm:'',
        zgh:''
      },
      resData:[],
      classAll:[],
      xnAll:[],
      bjAll:[],
      week:{
        '一':1,
        '二':2,
        '三':3,
        '四':4,
        '五':5,
        '六':6,
        '七':7,

      },
      checked:false,
      isdk:false,
      kcdm:'',
      tjTeachquest:{
        dkkc: "",//代课课程
        dksjList: [],
        xxdm: "",//学校代码
        yskr:'',
        dkr:'',
        dkyy:'',
        sqr:'',
        mbid:'',
        userid:'',
        shzt:'1',
        dkmx:'',
      },
      tjjs:[],
      finArr:[],
      classInfo:'',
      isSubmit1:false,
      isSubmit2:false,
      isSubmit3:false,
      isSubmit4:false,
      isSubmit5:false,
      usercode:'',
      glytype:false,//2 管理员
      initYdk:'',// 非管理员的不可选的人
      submited:false,//防止重复提交
      finArr1:[],
      finArr2:[],
      finArr3:[],
      finArr4:[],
      finArr5:[]
    };
  },
  mounted() {

  },
  created() {
    this.getJsAll();
    this.getClassAll();
    this.getxnAll();
    this.listQuery.xxdm = window.localStorage.getItem('xxdm');
    this.ysklistQuery.xxdm = window.localStorage.getItem('xxdm');
    this.tjTeachquest.xxdm = this.ysklistQuery.xxdm;
    this.tjTeachquest.mbid = window.localStorage.getItem('rdkmb');
    this.tjTeachquest.sqr = window.localStorage.getItem('name');
    this.tjTeachquest.userid = window.localStorage.getItem('userid');
    this.usercode = window.localStorage.getItem('usercode');
    this.glytype = this.$route.query.isgly == true ? true : false;
    this.submited = false;
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    handleDelete(index, row, column) {
    },
    indexInit(index){//改变序号
      if(index == 4){
        return ''
      }else if(index < 4){
        return index +1
      }else{
        return index
      }
    },
    changeCheck(scorp){//勾选代课课程
      this.tjTeachquest.dksjList = [];
      this.tableData.forEach((item,index) =>{
        if(item.checked1 == true && !item.inputchecked1){
          if(item.inputchecked1 == true){
            this.$set(this.tableData[index],'disabled1',true)
          }else{
            this.$set(this.tableData[index],'disabled1',false);
          }

          if(this.kcdm != ''){
            if(item.dkkc1 && this.kcdm == item.dkkc1){
                this.tjTeachquest.dksjList.push({
                  dkjc: item.row1,
                  dknj: item.dknj1,
                  dkzc: item.col1,
                  dkbj: item.dkbj1
                })
              this.tjTeachquest.dkkc = item.dkkc1;
            }else{
              this.$message({
                message: '请选择同一科目',
                type: 'warning'
              });
              return;
            }
          }else{
              this.tjTeachquest.dksjList.push({
                dkjc: item.row1,
                dknj: item.dknj1,
                dkzc: item.col1,
                dkbj: item.dkbj1,
              })
            this.tjTeachquest.dkkc = item.dkkc1;
          }
          this.kcdm = item.dkkc1;
        }
        else{
          this.$set(this.tableData[index],'disabled1',true)
        }
        if(item.checked2 == true && !item.inputchecked1){
          if(item.inputchecked2 == true){
            this.$set(this.tableData[index],'disabled2',true)
          }else{
            this.$set(this.tableData[index],'disabled2',false)
          }

          if(this.kcdm != ''){
            if(item.dkkc2 && this.kcdm == item.dkkc2){
                this.tjTeachquest.dksjList.push({
                  dkjc: item.row2,
                  dknj: item.dknj2,
                  dkzc: item.col2,
                  dkbj: item.dkbj2
                })
              this.tjTeachquest.dkkc = item.dkkc2;
            }else{
              this.$message({
                message: '请选择同一科目',
                type: 'warning'
              });
              return;
            }
          }else{
              this.tjTeachquest.dksjList.push({
                dkjc: item.row2,
                dknj: item.dknj2,
                dkzc: item.col2,
                dkbj: item.dkbj2
              })
            this.tjTeachquest.dkkc = item.dkkc2;
          }
          this.kcdm = item.dkkc2;
        }else{
          this.$set(this.tableData[index],'disabled2',true)
        }
        if(item.checked3 == true && !item.inputchecked1){
          if(item.inputchecked3 == true){
            this.$set(this.tableData[index],'disabled3',true)
          }else{
            this.$set(this.tableData[index],'disabled3',false);
          }
          if(this.kcdm != ''){
            if(item.dkkc3 && this.kcdm == item.dkkc3){
                this.tjTeachquest.dksjList.push({
                  dkjc: item.row3,
                  dknj: item.dknj3,
                  dkzc: item.col3,
                  dkbj: item.dkbj3
                })
              this.tjTeachquest.dkkc = item.dkkc3;
            }else{
              this.$message({
                message: '请选择同一科目',
                type: 'warning'
              });
              return;
            }
          }else{
              this.tjTeachquest.dksjList.push({
                dkjc: item.row3,
                dknj: item.dknj3,
                dkzc: item.col3,
                dkbj: item.dkbj3
              })
            this.tjTeachquest.dkkc = item.dkkc3;
          }
          this.kcdm = item.dkkc3;
        }else{
          this.$set(this.tableData[index],'disabled3',true)
        }
        if(item.checked4 == true && !item.inputchecked1){
          if(item.inputchecked4 == true){
            this.$set(this.tableData[index],'disabled4',true)
          }else{
            this.$set(this.tableData[index],'disabled4',false);
          }
          if(this.kcdm != ''){
            if(item.dkkc4 && this.kcdm == item.dkkc4){
                this.tjTeachquest.dksjList.push({
                  dkjc: item.row4,
                  dknj: item.dknj4,
                  dkzc: item.col4,
                  dkbj: item.dkbj4,
                })
              this.tjTeachquest.dkkc = item.dkkc4;
            }else{
              this.$message({
                message: '请选择同一科目',
                type: 'warning'
              });
              return;
            }
          }else{
            this.tjTeachquest.dksjList.push({
                  dkjc: item.row4,
                  dknj: item.dknj4,
                  dkzc: item.col4,
                  dkbj: item.dkbj4
            })
            this.tjTeachquest.dkkc = item.dkkc4;
          }
          this.kcdm = item.dkkc4;
        }else{
          this.$set(this.tableData[index],'disabled4',true)
        }
        if(item.checked5 == true && !item.inputchecked1){
          // console.log(555555555555555555555)
          // console.log(this.tableData[index])
          if(item.inputchecked5 == true){
            this.$set(this.tableData[index],'disabled5',true)
          }else{
            this.$set(this.tableData[index],'disabled5',false);
          }
          if(this.kcdm != ''){
            if(item.dkkc5 && this.kcdm == item.dkkc5){
              this.tjTeachquest.dksjList.push({
                  dkjc: item.row5,
                  dknj: item.dknj5,
                  dkzc: item.col5,
                  dkbj: item.dkbj5
                })
              this.tjTeachquest.dkkc = item.dkkc5;
            }else{
              this.$message({
                message: '请选择同一科目',
                type: 'warning'
              });
              return;
            }
          }else{
            this.tjTeachquest.dksjList.push({
                dkjc: item.row5,
                dknj: item.dknj5,
                dkzc: item.col5,
                dkbj: item.dkbj5
              })
              //const tempData = Object.assign({}, this.tjTeachquest);

            this.tjTeachquest.dkkc = item.dkkc5;
          }
          this.kcdm = item.dkkc5;
        }else{
          this.$set(this.tableData[index],'disabled5',true)
        }
      })
      this.gettjteach();
    },
    openBox() {
      this.fade = true;
      this.fadeTabel = true;
    },
    querySearch(queryString, cb) {//得到原上课人
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据

      cb(results);
    },
    dkrquerySearch(queryString, cb) {//得到代课人
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {//帅选教师
      return (restaurant) => {
        return (restaurant.xm.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {//选择原上课人
      this.form.yskr = item.xm;
      this.form.yskrgh = item.gh;
      this.listQuery.zgh = item.gh;
      this.tjTeachquest.yskr = item.gh;
      this.getClassStructure();
      this.getByJsList();
      this.isdk = false;
    },
    dkrhandleSelect(item) {//选择代课人
      this.form.dkr = item.xm;
      this.form.dkrgh = item.gh;
      this.ysklistQuery.zgh = item.gh;
      this.tjTeachquest.dkr = item.gh;
      this.isdk = true;
      this.getClassStructure();
      this.getyskList();
    },
    getJsAll(){//获取所有教师
      const v = { xxdm:this.listQuery.xxdm};
      jcsj.hqjslb(v).then(res => {
        this.restaurants = res;
        this.initYdk = jcsj.hqjsmcByid(this.restaurants,this.usercode);
        if(!this.glytype){
          this.form.yskr = this.initYdk;
          this.form.yskrgh = this.usercode;
          this.listQuery.zgh = this.usercode;
          this.tjTeachquest.yskr = this.usercode;
          this.getByJsList();
          this.getClassStructure();

        }
      })
    },
    getClassAll(){//获取所有课程
      let that = this;
      const v = { xxdm:window.localStorage.getItem('xxdm')};
      jcsj.hqkclb(v).then(res => {
        that.classAll = res;
      })
    },
    getxnAll(){//获取当前学期
      let that = this;
      getCurrentXnxq({ xxdm: window.localStorage.getItem('xxdm') }).then(response => {
        that.xnAll = response.data.xn;

        that.getbjAll();
      });
    },
    getbjAll(){//获取所有班级
      let that = this;
      const v = {xn:that.xnAll, xxdm: window.localStorage.getItem('xxdm')};
      jcsj.hqbjlb(v).then(res => {
        that.bjAll = res;
      })
    },
    closeMod(){
      this.fade = false;
      this.fadeTabel = false;
    },
    getByJsList(){//获得课程并组装数组
      let that = this;
      getByJsList(that.listQuery).then(res=>{
        that.resData = res;
        if( that.resData.length > 0){
          that.resData.forEach((item,index) =>{
            let baseInfo = jcsj.hqbjmcByid(that.bjAll,item.bjdm)+'-'+jcsj.hqkcmcByid(that.classAll,item.kcdm);
            // console.log("yuyuuybhgdbvcghdvcgdvbcghvcghdsg");
            // console.log(that.tableData);
            // console.log([item.pkjs])
            that.$set(that.tableData[item.pkjs-1],'class'+item.pkzs,baseInfo);
              // that.$set(that.tableData[item.pkjs-1],'checked'+item.pkzs,jcsj.hqbjmcByid(that.bjAll,item.bjdm)+'-'+jcsj.hqkcmcByid(that.classAll,item.kcdm));
            that.$set(that.tableData[item.pkjs-1],'row'+item.pkzs,item.pkjs);
            that.$set(that.tableData[item.pkjs-1],'col'+item.pkzs,item.pkzs);
            that.$set(that.tableData[item.pkjs-1],'dknj'+item.pkzs,item.njdm);
            that.$set(that.tableData[item.pkjs-1],'dkkc'+item.pkzs,item.kcdm);
            that.$set(that.tableData[item.pkjs-1],'dkbj'+item.pkzs,item.bjdm);
            that.$set(that.tableData[item.pkjs-1],'pickerOptions',{//设置禁止选中的日期
              disabledDate(time) {
                return time.getTime() < (new Date().getTime()- 24*60*60*1000)
              }});
            if(item.spjl && Object.keys(item.spjl).length > 0){
              let dkztArr = item.spjl.shzt.split(',');
              that.$set(that.tableData[item.pkjs-1],"chooseTime"+item.pkzs,item.spjl.dkrq.split(','));
              that.$set(that.tableData[item.pkjs-1],"initTime"+item.pkzs,item.spjl.dkrq.split(','));
              that.$set(that.tableData[item.pkjs-1],"timeView"+item.pkzs,item.spjl.dkrq.split('|'));
              that.$set(that.tableData[item.pkjs-1],'statuVal'+item.pkzs,dkztArr[dkztArr.length-1]);
              that.$set(that.tableData[item.pkjs-1],'disabled'+item.pkzs,true);
              that.$set(that.tableData[item.pkjs-1],'inputchecked'+item.pkzs,item.spjl.dkzt == 'dk' ? true : false);
              //that.$set(that.tableData[item.pkjs-1],'checked'+item.pkzs,item.spjl.dkzt == 'dk' ? false : true);
              let itemShzt = item.spjl.shzt.split(',');
              let statusArr = [];
              itemShzt.forEach((childitem,index)=>{
                switch (childitem){
                  case '0':
                    //that.$set(that.tableData[item.pkjs-1],'status'+item.pkzs,'未审核');
                    statusArr.push('未审核');
                    break;
                  case '1':
                    //that.$set(that.tableData[item.pkjs-1],'status'+item.pkzs,'审批中');
                    statusArr.push('审批中');
                    break;
                  case '2':
                    statusArr.push('撤销');
                    //that.$set(that.tableData[item.pkjs-1],'status'+item.pkzs,'撤销');
                    break;
                  case '3':
                    //that.$set(that.tableData[item.pkjs-1],'status'+item.pkzs,'通过');
                    statusArr.push('通过');
                    break;
                  case '4':
                    statusArr.push('不通过');
                    //that.$set(that.tableData[item.pkjs-1],'status'+item.pkzs,'不通过');
                    break;
                  default:
                    statusArr.push('暂无状态');
                    //that.$set(that.tableData[item.pkjs-1],'status'+item.pkzs,'暂无状态');
                }
              })
              that.$set(that.tableData[item.pkjs-1],'status'+item.pkzs,statusArr);
            }else{
              that.$set(that.tableData[item.pkjs-1],'disabled'+item.pkzs,true);

            }
          })

        }
      })

    },
    changeTime(scop){//时间改变
      let that = this;
      that.tjTeachquest.dksjList = [];
      that.tags = [];

      let weeklab = scop.column.label.substr(scop.column.label.length-1),
          weekVal = that.week[weeklab],
          chooseTime1 = [],chooseTime2 = [],chooseTime3 = [],chooseTime4 = [],chooseTime5 = [],
          chooseArr = [scop.row.chooseTime1,scop.row.chooseTime2,scop.row.chooseTime3,scop.row.chooseTime4,scop.row.chooseTime5],
          chooseInit = [scop.row.initTime1,scop.row.initTime2,scop.row.initTime3,scop.row.initTime4,scop.row.initTime5],
          initTime1 = [],initTime2 = [],initTime3 = [],initTime4 = [],initTime5 = [];
      that.finArr1=[];that.finArr2=[];that.finArr3=[];that.finArr4=[];that.finArr5=[];
      //let weeklabNum = weeklab.substr();
      that.finArr = [];

      if(weekVal == 1 && scop.row.checked1 == true){
        chooseTime1 = scop.row.chooseTime1;
        initTime1 = scop.row.initTime1;
        if(initTime1.length > 0){
          that.timeGetArr(chooseTime1,initTime1,scop.column.label,weekVal,that.finArr1);
        }else if(typeof(chooseTime1) != 'string' && chooseTime1.length > 0){
          for(let l = 0;l<chooseTime1.length;l++){
            // console.log(111111111111111)
            // console.log(chooseTime1)
            if(new Date(chooseTime1[l]).getDay() !== weekVal){//判断所选时间是否是对应的周
              that.$message({
                message: chooseTime1[l]+'不是'+scop.column.label,
                type: 'warning'
              });
            }else{
              that.finArr.push(chooseTime1[l]);
              that.finArr1.push(chooseTime1[l]);
            }
          }
        }else{
          that.finArr1 = [];
        }
        that.$set(that.tableData[scop.row.index],'timeView'+weekVal,[]);
        that.$set(that.tableData[scop.row.index],'chooseTime'+weekVal,that.finArr1);
        that.$set(that.tableData[scop.row.index],'timeView'+weekVal,that.finArr1);
      }

      if(weekVal == 2 && scop.row.checked2 == true){
        chooseTime2 = scop.row.chooseTime2;
        initTime2 = scop.row.initTime2;
        if(initTime2.length > 0){
          that.timeGetArr(chooseTime2,initTime2,scop.column.label,weekVal,that.finArr2);
        }else if(typeof(chooseTime2) != 'string' && chooseTime2.length > 0){
          for(let l = 0;l<chooseTime2.length;l++){
            if(new Date(chooseTime2[l]).getDay() !== weekVal){//判断所选时间是否是对应的周
              // console.log(2222222222222222222)
              // console.log(chooseTime2)
              that.$message({
                message: chooseTime2[l]+'不是'+scop.column.label,
                type: 'warning'
              });
            }else{
              that.finArr.push(chooseTime2[l]);
              that.finArr2.push(chooseTime2[l]);
            }
          }
        }else{
          that.finArr2 = [];
        }
        that.$set(that.tableData[scop.row.index],'timeView'+weekVal,'');
        that.$set(that.tableData[scop.row.index],'chooseTime'+weekVal,that.finArr2);
        that.$set(that.tableData[scop.row.index],'timeView'+weekVal,that.finArr2);
      }

      if(weekVal == 3 && scop.row.checked3 == true){
        chooseTime3 = scop.row.chooseTime3;
        initTime3 = scop.row.initTime3;
        if(initTime3.length > 0){
          that.timeGetArr(chooseTime3,initTime3,scop.column.label,weekVal,that.finArr3);
        }else if(typeof(chooseTime3) != 'string' && chooseTime3.length > 0){
          for(let l = 0;l<chooseTime3.length;l++){
            if(new Date(chooseTime3[l]).getDay() !== weekVal){//判断所选时间是否是对应的周
              // console.log(33333333333333333333)
              // console.log(chooseTime3)
              that.$message({
                message: chooseTime3[l]+'不是'+scop.column.label,
                type: 'warning'
              });
            }else{
              that.finArr.push(chooseTime3[l]);
              that.finArr3.push(chooseTime3[l]);
            }
          }
        }else{
          that.finArr3 = [];
        }
        that.$set(that.tableData[scop.row.index],'timeView'+weekVal,'');
        that.$set(that.tableData[scop.row.index],'chooseTime'+weekVal,that.finArr3);
        that.$set(that.tableData[scop.row.index],'timeView'+weekVal,that.finArr3);
      }

      if(weekVal == 4 && scop.row.checked4 == true){
        chooseTime4 = scop.row.chooseTime4;
        initTime4 = scop.row.initTime4;
        if(initTime4.length > 0){
          that.timeGetArr(chooseTime4,initTime4,scop.column.label,weekVal,that.finArr4);
        }else if(typeof(chooseTime4) != 'string' && chooseTime4.length > 0){
          for(let l = 0;l<chooseTime4.length;l++){
            // console.log(4444444444444444444444)
            // console.log(chooseTime4)
           if(new Date(chooseTime4[l]).getDay() !== weekVal){//判断所选时间是否是对应的周
              that.$message({
                message: chooseTime4[l]+'不是'+scop.column.label,
                type: 'warning'
              });
            }else{
              that.finArr.push(chooseTime4[l]);
              that.finArr4.push(chooseTime4[l]);
            }
          }
        }else{
          that.finArr4 = [];
        }
        that.$set(that.tableData[scop.row.index],'timeView'+weekVal,'');
        that.$set(that.tableData[scop.row.index],'chooseTime'+weekVal,that.finArr4);
        that.$set(that.tableData[scop.row.index],'timeView'+weekVal,that.finArr4);
      }


      if(weekVal == 5 && scop.row.checked5 == true){
        chooseTime5 = scop.row.chooseTime5;
        initTime5 = scop.row.initTime5;
        if(initTime5.length > 0){
          that.timeGetArr(chooseTime5,initTime5,scop.column.label,weekVal,that.finArr5);
        }else if(typeof(chooseTime5) != 'string' && chooseTime5.length > 0){
          for(let l = 0;l<chooseTime5.length;l++){
            // console.log(555555555555555555555)
            // console.log(chooseTime5)
            if(new Date(chooseTime5[l]).getDay() !== weekVal){//判断所选时间是否是对应的周
              that.$message({
                message: chooseTime5[l]+'不是'+scop.column.label,
                type: 'warning'
              });
            }else{
              that.finArr.push(chooseTime5[l]);
              that.finArr5.push(chooseTime5[l]);
            }
          }
        }else{
          that.finArr5 = [];
        }
        that.$set(that.tableData[scop.row.index],'timeView'+weekVal,'');
        that.$set(that.tableData[scop.row.index],'chooseTime'+weekVal,that.finArr5);
        that.$set(that.tableData[scop.row.index],'timeView'+weekVal,that.finArr5);
      }
      /*
      判断所选时间是不是之前有审批记录的时间   如果是则不让选并提示
       */

      that.tags = [];
      that.finArr.forEach((item,index)=>{
        that.tags.push({
          name:item + '第' + that.tableData[scop.row.index].row+weekVal + '节课',
          type:'info'
        })
      })
      that.tjTeachquest.dkyy = that.form.desc;
      that.tjTeachquest.dkmx = that.classInfo;
    },
    getClassStructure(){//获取课表结构
      getClassStructure({xxdm:this.listQuery.xxdm}).then( res =>{
        let resdata = res,
            row = resdata.swjs + resdata.wsjs + resdata.xwjs,
            col = resdata.pkzs.split(','),
            tableArr = [];
        let arr = [];
        arr.length = row;
        for(let i=0;i<arr.length;i++){
          tableArr[i] = {};
        }
        tableArr.forEach((item,index) =>{
          item.row = '';
          item.col = '';
          item.index = index;
          item.checked1 = false;
          item.checked2 = false;
          item.checked3 = false;
          item.checked4 = false;
          item.checked5 = false;
          item.timeView1 = '';
          item.timeView2 = '';
          item.timeView3 = '';
          item.timeView4 = '';
          item.timeView5 = '';
          item.class1 = '';
          item.class2 = '';
          item.class3 = '';
          item.class4 = '';
          item.class5 = '';
          item.chooseTime1 = '';
          item.chooseTime2 = '';
          item.chooseTime3 = '';
          item.chooseTime4 = '';
          item.chooseTime5 = '';
          item.status1 = '';
          item.status2 = '';
          item.status3 = '';
          item.status4 = '';
          item.status5 = '';
          item.statuVal1 = '';
          item.statuVal2 = '';
          item.statuVal3 = '';
          item.statuVal4 = '';
          item.statuVal5 = '';
          item.disabled1 = false;
          item.disabled2 = false;
          item.disabled3 = false;
          item.disabled4 = false;
          item.disabled5 = false;
          item.inputchecked1 = false;
          item.inputchecked2 = false;
          item.inputchecked3 = false;
          item.inputchecked4 = false;
          item.inputchecked5 = false;
          item.initTime1 = '';
          item.initTime2 = '';
          item.initTime3 = '';
          item.initTime4 = '';
          item.initTime5 = '';
          // if(col.length == 6) item.class6 = '';
          // if(col.length == 7) item.class7 = '';
          item.pickerOptions = "";
        })
        if(this.isdk){
          this.dktableData = tableArr;
        }else{
          this.tableData = tableArr;
        }
      })
    },
    getyskList(){//获得课程并组装数组
      let that = this;
      getByJsList(that.ysklistQuery).then(res=>{
        that.resData = res;
        if( that.resData.length > 0){
          that.resData.forEach((item,index) =>{
            that.$set(that.dktableData[item.pkjs-1],'class'+item.pkzs,jcsj.hqbjmcByid(that.bjAll,item.bjdm)+'-'+jcsj.hqkcmcByid(that.classAll,item.kcdm));
          })
        }
      })
    },
    gettjteach(){//获得推荐老师
      this.tjjs = [];
      getRecommendedTeacher(this.tjTeachquest).then(res =>{
        //this.tjTeachquest.dksjList = [];
        this.kcdm = '';
        //this.tjTeachquest.dkkc = '';
        res.forEach((item,index) =>{
          this.tjjs.push(jcsj.hqjsmcByid(this.restaurants,item))
        })
      })
    },
    changedkr(item){
      this.form.dkr = item;
      this.form.dkrgh = jcsj.hqjsdmBymc(this.restaurants,item);
      this.ysklistQuery.zgh = this.form.dkrgh;
      this.isdk = true;
      this.tjTeachquest.dkr = this.form.dkrgh;
      this.getClassStructure();
      this.getyskList();
    },
    shengqin(){
      this.getsubmitInfo();
      this.tjTeachquest.dkyy = this.form.desc;
      this.tjTeachquest.dkmx = this.classInfo;
      if(this.tjTeachquest.dkyy == ''){
        this.$message({
          message: '警告,' + '代课原因未写',
          type: 'warning'
        });
        return false;
      }
      if(this.tjTeachquest.dkr == ''){
        this.$message({
          message: '警告,' + '代课人未写',
          type: 'warning'
        });
        return false;
      }
      // console.log('yyuyuyuyuyuyuyuyuyuy')
      // console.log(this.submited)
      // console.log(this.isSubmit1 + 'jj' + this.isSubmit2+ 'jj' + this.isSubmit3+ 'jj' + this.isSubmit4+ 'jj' + this.isSubmit5)
      if(this.checkSubmit()){
        if(!this.isSubmit1 && !this.isSubmit2 && !this.isSubmit3 && !this.isSubmit4 && !this.isSubmit5){
          if(this.tjTeachquest.dksjList.length != 0){
            checkConflict(this.tjTeachquest).then((res)=>{
              this.submited = true;
              if(res.length == 0){
                save(this.tjTeachquest).then(res=>{
                  if(res.status  > 0){
                    this.submited = false;
                    this.$router.push({
                      path: 'tdkManager/dkwh'
                    })
                  }else{
                    this.submited = false;
                    this.$message({
                    message: '警告,' + res.message,
                    type: 'warning'
                  });
                  }
                })
              }else{
                res.forEach((item,index) =>{
                  this.$message({
                    message: '警告,' + item,
                    type: 'warning'
                  });
                })
              }
            })
          }else{
            this.$message({
              message: '警告,' + '未选课程或时间',
              type: 'warning'
            });
          }
        }
      }
    },
    getsubmitInfo(){
      let that = this;
      this.tjTeachquest.dksjList = [];
      this.classInfo = '';
      this.isSubmit1 = false;
      this.isSubmit2 = false;
      this.isSubmit3 = false;
      this.isSubmit4 = false;
      this.isSubmit5 = false;
      this.tableData.forEach((item,index)=>{
        if(item.checked1 == true && !item.inputchecked1){
          if(item.chooseTime1 != null && item.chooseTime1.length > 0){
            if(item.initTime1 != ''){
              that.getArr(item.chooseTime1,item.initTime1,function(arrItem){
                that.submited = false;
                // console.log(1111111111111)
                //  console.log(item)
                that.tjTeachquest.dksjList.push({
                  dkjc: item.row1,
                  dknj: item.dknj1,
                  dkzc: item.col1,
                  dkbj: item.dkbj1,
                  dkrq:arrItem
                })
              });
              // for(let i = 0;i<item.initTime1.length;i++){
              //   for(let l = 0;l<item.chooseTime1.length;l++){
              //     console.log(1111111111111)
              //     console.log(item)
              //     if(item.initTime1[i] == item.chooseTime1[l]){//判断所选时间是否选过
              //       this.$message({
              //         message: item.initTime1[i]+'该时间已代过课',
              //         type: 'warning'
              //       });
              //       this.isSubmit1 = true;
              //     }else{
              //       this.submited = false;
              //       item.chooseTime1.forEach((titem,tindex) =>{
              //         this.tjTeachquest.dksjList.push({
              //           dkjc: item.row1,
              //           dknj: item.dknj1,
              //           dkzc: item.col1,
              //           dkbj: item.dkbj1,
              //           dkrq:titem
              //         })
              //       })
              //     }
              //   }
              // }
            }else{
              this.submited = false;
              item.chooseTime1.forEach((titem,tindex) =>{
                this.tjTeachquest.dksjList.push({
                  dkjc: item.row1,
                  dknj: item.dknj1,
                  dkzc: item.col1,
                  dkbj: item.dkbj1,
                  dkrq:titem
                })
              })
            }
          }else{
            this.isSubmit1 = true;
            this.$message({
              message: '警告,' + '星期' + item.col1 + '第' + item.row1 + '节课未选日期',
              type: 'warning'
            });
          }
        }
        if(item.checked2 == true && !item.inputchecked2){
          // console.log('wwwwwwwwwwwwwwwwwwwww')
          // console.log(item)
          if(item.chooseTime2 != null && item.chooseTime2.length > 0){
            if(item.initTime2 != ''){
              that.getArr(item.chooseTime2,item.initTime2,function(arrItem){
                that.submited = false;
                // console.log(1111111111111)
                // console.log(item)
                that.tjTeachquest.dksjList.push({
                  dkjc: item.row2,
                  dknj: item.dknj2,
                  dkzc: item.col2,
                  dkbj: item.dkbj2,
                  dkrq:arrItem
                })
              });
              // for(let i = 0;i<item.initTime2.length;i++){
              //   for(let l = 0;l<item.chooseTime2.length;l++){
              //     if(item.initTime2[i] == item.chooseTime2[l]){//判断所选时间是否选过
              //       this.$message({
              //         message: item.initTime2[i]+'该时间已代过课',
              //         type: 'warning'
              //       });
              //       this.isSubmit2 = true;
              //     }else{
              //       // console.log(22222222222222)
              //       // console.log(item)
              //       this.submited = false;
              //       item.chooseTime2.forEach((titem,tindex) =>{
              //         this.tjTeachquest.dksjList.push({
              //           dkjc: item.row2,
              //           dknj: item.dknj2,
              //           dkzc: item.col2,
              //           dkbj: item.dkbj2,
              //           dkrq:titem
              //         })
              //       })
              //     }
              //   }
              // }
            }else{
              this.submited = false;
              item.chooseTime2.forEach((titem,tindex) =>{
                this.tjTeachquest.dksjList.push({
                  dkjc: item.row2,
                  dknj: item.dknj2,
                  dkzc: item.col2,
                  dkbj: item.dkbj2,
                  dkrq:titem
                })
              })

            }

          }else{
              this.$message({
                message: '警告,' + '星期' + item.col2 + '第' + item.row2 + '节课未选日期',
                type: 'warning'
              });
              this.isSubmit2 = true;

            }
        }
        if(item.checked3 == true && !item.inputchecked3){
          // console.log('eeeeeeeeeeeeee')
          // console.log(item)
          if(item.chooseTime3 != null && item.chooseTime3.length > 0){
            if(item.initTime3 != ''){
              that.getArr(item.chooseTime3,item.initTime3,function(arrItem){
                that.submited = false;
                // console.log(1111111111111)
                // console.log(item)
                that.tjTeachquest.dksjList.push({
                  dkjc: item.row3,
                  dknj: item.dknj3,
                  dkzc: item.col3,
                  dkbj: item.dkbj3,
                  dkrq:arrItem
                })
              });
              // for(let i = 0;i<item.initTime3.length;i++){
              //   for(let l = 0;l<item.chooseTime3.length;l++){
              //     if(item.initTime3[i] == item.chooseTime3[l]){//判断所选时间是否选过
              //       this.$message({
              //         message: item.initTime3[i]+'该时间已代过课',
              //         type: 'warning'
              //       });
              //       this.isSubmit3 = true;

              //     }else{
              //       // console.log(33333333333333)
              //       // console.log(item)
              //       this.submited = false;
              //       item.chooseTime3.forEach((titem,tindex) =>{
              //         this.tjTeachquest.dksjList.push({
              //           dkjc: item.row3,
              //           dknj: item.dknj3,
              //           dkzc: item.col3,
              //           dkbj: item.dkbj3,
              //           dkrq:titem
              //         })
              //       })
              //     }
              //   }
              // }
            }else{
              this.submited = false;
              item.chooseTime3.forEach((titem,tindex) =>{
                this.tjTeachquest.dksjList.push({
                  dkjc: item.row3,
                  dknj: item.dknj3,
                  dkzc: item.col3,
                  dkbj: item.dkbj3,
                  dkrq:titem
                })
              })
            }
          }else{
              this.$message({
                message: '警告,' + '星期' + item.col3 + '第' + item.row3 + '节课未选日期',
                type: 'warning'
              });
              this.isSubmit3 = true;
            }
        }
        if(item.checked4 == true  && !item.inputchecked4){
          // console.log('rrrrrrrrrrrrrrrrrrrrr')
          // console.log(item)
          if(item.chooseTime4 != null && item.chooseTime4.length > 0){
            if(item.initTime4 != ''){
              that.getArr(item.chooseTime4,item.initTime4,function(arrItem){
                that.submited = false;
                // console.log(1111111111111)
                // console.log(item)
                that.tjTeachquest.dksjList.push({
                  dkjc: item.row4,
                  dknj: item.dknj4,
                  dkzc: item.col4,
                  dkbj: item.dkbj4,
                  dkrq:arrItem
                })
              });
              // for(let i = 0;i<item.initTime4.length;i++){
              //   for(let l = 0;l<item.chooseTime4.length;l++){
              //     // console.log(44444444444444)
              //     // console.log(item)
              //     if(item.initTime4[i] == item.chooseTime4[l]){//判断所选时间是否选过
              //       this.$message({
              //         message: item.initTime4[i]+'该时间已代过课',
              //         type: 'warning'
              //       });
              //       this.isSubmit4 = true;
              //     }else{
              //       this.submited = false;
              //       item.chooseTime4.forEach((titem,tindex) =>{
              //         this.tjTeachquest.dksjList.push({
              //           dkjc: item.row4,
              //           dknj: item.dknj4,
              //           dkzc: item.col4,
              //           dkbj: item.dkbj4,
              //           dkrq:titem
              //         })
              //       })
              //     }
              //   }
              // }
            }else{
              this.submited = false;
              item.chooseTime4.forEach((titem,tindex) =>{
                this.tjTeachquest.dksjList.push({
                  dkjc: item.row4,
                  dknj: item.dknj4,
                  dkzc: item.col4,
                  dkbj: item.dkbj4,
                  dkrq:titem
                })
              })

            }

          }else{
            this.$message({
              message: '警告,' + '星期' + item.col4 + '第' + item.row4 + '节课未选日期',
              type: 'warning'
            });
            this.isSubmit4 = true;
          }
        }
        if(item.checked5 == true  && !item.inputchecked5){
          // console.log('ttttttttttttttttttttttt')
          // console.log(item)
          if(item.chooseTime5 != null && item.chooseTime5.length > 0){
            if(item.initTime5 != ''){
              that.getArr(item.chooseTime5,item.initTime5,function(arrItem){
                that.submited = false;
                // console.log(1111111111111)
                // console.log(item)
                that.tjTeachquest.dksjList.push({
                  dkjc: item.row5,
                  dknj: item.dknj5,
                  dkzc: item.col5,
                  dkbj: item.dkbj5,
                  dkrq:arrItem
                })
              });
              // for(let i = 0;i<item.initTime5.length;i++){
              //   for(let l = 0;l<item.chooseTime5.length;l++){
              //     // console.log(555555555555555555)
              //     // console.log(item)
              //     if(item.initTime5[i] == item.chooseTime5[l]){//判断所选时间是否选过
              //       this.$message({
              //         message: item.initTime5[i]+'该时间已代过课',
              //         type: 'warning'
              //       });
              //       this.isSubmit5 = true;
              //     }else{
              //       this.submited = false;
              //       item.chooseTime5.forEach((titem,tindex) =>{
              //         this.tjTeachquest.dksjList.push({
              //           dkjc: item.row5,
              //           dknj: item.dknj5,
              //           dkzc: item.col5,
              //           dkbj: item.dkbj5,
              //           dkrq:titem
              //         })
              //       })
              //     }
              //   }
              // }
            }else{
              this.submited = false;
              item.chooseTime5.forEach((titem,tindex) =>{
                this.tjTeachquest.dksjList.push({
                  dkjc: item.row5,
                  dknj: item.dknj5,
                  dkzc: item.col5,
                  dkbj: item.dkbj5,
                  dkrq:titem
                })
              })

            }

          }else{
            this.$message({
              message: '警告,' + '星期' + item.col5 + ' ' + '第' + item.row5 + '节课' + '未选日期',
              type: 'warning'
              });
            this.isSubmit5 = true;

          }
        }
      })
      this.tjTeachquest.dksjList.forEach((item,index)=>{
        this.classInfo += item.dkrq + ' ' + '星期' + item.dkzc + ' ' + '第' + item.dkjc + '节课' + ' ' + jcsj.hqkcmcByid(this.classAll, this.tjTeachquest.dkkc) + ',';
      //   this.tags.push({
      //     name:item.dkrq + '第' + item.dkjc + '节课',
      //     type:'info'
      //   })
     })

    },
    checkSubmit(){
      if (!this.submited) {
        // console.log('kkkkkkkkkkkkkkkkkkkkkk');
        // console.log(this.submited)
        this.submited = true;
        return true;
      } else {

        // console.log(this.submited)console.log('hhhhhhhhhhhhhhhh');
        this.$toast("请不要重复提交");
        return false;
      }
    },
    cancle(){
      this.$router.push({
        path: 'tdkManager/dkwh'
      })
    },
    getArr(arr1,arr2,callback){//数组去重
      let that = this;
      arr1.filter(function(item1) {
        arr2.every(function(item2) {
          if(item2 !== item1){
            callback(item1);
          }else{
            //console.log("arrarrrarrrarrrarrrarararararar")
            that.$message({
              message: item2+'该时间已代过课',
              type: 'warning'
            });
            that.isSubmit1 = true;
          }
        })
      })
    },
    timeGetArr(arr1,arr2,week,weekVal,saveArr){//点击时间数组去重
      let that = this;
      // console.log(33333333333333333333333);
      // console.log(arr1);
      // console.log(arr2);
      // console.log(weekVal);
      if(arr1 != null ){
        arr1.filter(function(item1) {
          arr2.every(function(item2) {
            if(item1 == item2){//判断所选时间是否选过
              that.$message({
                message: item1+'该时间已代过课',
                type: 'warning'
              });

            }else if(new Date(item1).getDay() !== weekVal){//判断所选时间是否是对应的周
              // console.log(55555555555555);
              // console.log(item1)
              that.$message({
                message: item1+'不是'+week,
                type: 'warning'
              });
            }else{
              saveArr.push(item1)
              that.finArr.push(item1);
            }
          })
        })
      }
    }
  }
};
</script>

<style>
.detaLeft {
  width: 24%;
  float: left;
  margin: 10px;
  padding: 10px;
  height: 700px;
  border: 1px solid #eee;

}
.el-checkbox__label{
  overflow: hidden !important;
  text-overflow:ellipsis !important;
  white-space: nowrap !important;
  width: 110px !important;
  line-height: 12px;
}
.detaRight {
  width: 70%;
  float: left;
  margin: 10px;
  padding: 10px;
  min-height: 800px;
  border: 1px solid #eee;
}
.el-tag {
  margin-right: 10px;
}
.yskr {
  width: 200px;
}
.dkr {
  width: 200px;
}
.checkClass {
  color: #449afc;
}
.el-date-picker{
  margin-top:-50px;
}

.el-input--suffix .el-input__inner{
    padding-right: 1px !important;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 220px;
    margin-top: -40px;
}

.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 184px !important;
  margin-top: 1px !important;
}

  .handelPass{
   padding:5px 4px;
    background-color: #eff9ec;
    border: 1px solid #d3eecc;
    color:#63c249;
    text-align: center;
    line-height: 30px;
    margin: 0 auto;
    border-radius: 5px;
  }

  .passing{
    width: 70px;
    height: 30px;
    background-color: #fcf6ec;
    border: 1px solid #f7e5cb;
    color:#e8ac65;
    text-align: center;
    line-height: 30px;
    margin: 0 auto;
    border-radius: 5px;
  }

  .noPass{
    width: 70px;
    height: 30px;
    background-color: #fef0f0;
    border: 1px solid #fcd5d5;
    color:#f77474;
    text-align: center;
    line-height: 30px;
    margin: 0 auto;
    border-radius: 5px;
  }
  .el-table_1_column_1,.cell  {
    text-align: center !important;
  }
  .handel{
    margin:10px;
  }
  .fadeTabel{
    position: relative;
    background-color: #fff;
    width: 1010px;
    height:600px;
    background:#fff;
    margin:0 auto;
    margin-top:200px;

  }
  .dkFade{
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0,0.4);
    width: 100%;
    height: 100%;
    z-index: 99;
  }
  .closeModel{
    width: 50px;
    height: 50px;
    z-index: 999;
    float:right;
    font-size: 30px;
    padding: 10px;
  }
  .tableMo{
    margin-top:40px;
  }
</style>
