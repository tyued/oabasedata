<template>
<div class="oarow" style="float:left; margin-top:20px;width:100%;">
      <el-row>
        <el-button type="primary"  @click="saveGz('form')">保存</el-button>
        <el-button type="primary" @click="xkgoback">返回</el-button>
      </el-row>
      <div class="rowmain">
      
      <el-form :model="form" ref="form" :rules="formrules" label-width="110px" name="myform"> 
       <el-row>
            <el-form-item  label="每名学生最多选"  prop="zxks">
            <input type="hidden" v-model.trim="form.uuid"/>
            <el-input style="display:inline-block; width:50px;" placeholder="" v-model.trim="form.zxks"  ></el-input> 门课
            </el-form-item>
       </el-row>
       <el-row>
        <div class="rowcontent">
          <div class="rowLeftBox">不能同时选择的课程</div>
          <div class="rowRightBox">
            <el-button type="primary" @click="addhcKc" >添加</el-button>
            <div class="courseList">
              <div class="course"  v-for="hckc in hckclist" :label="hckc.kcdms" :key="hckc.zhid">
                <span>{{hckc.kcmcs}}</span> <i class="el-icon-edit" @click="edithckc(hckc.zhid,hckc.kcdms)"></i> <i class="el-icon-delete" @click="delhckc(hckc.zhid)"></i>
              </div>
            </div>
          </div>
        </div>
       </el-row>

       <el-row>
        <div class="rowcontent">
          <div class="rowLeftBox">必选的课程类别</div>
          <div class="rowRightBox">
            <el-button type="primary" @click="addbxKc">添加</el-button>
            <div class="courseList">
              <el-form-item prop="zdxks">
              <div class="course" v-for="(lbkc, index) in lbkclist" :label="lbkc.lbid" :key="index">
                <span>{{lbkc.lbmc}} 至少选 <el-input style="display:inline-block; width:50px;" placeholder="" v-model.trim="lbkclist[index].zdxks" ></el-input> 门课</span> <i class="el-icon-delete" @click="delBxkc(lbkc.uuid)"></i>
              </div>
              </el-form-item>
              
            </div>
          </div>
        </div>
      </el-row>
      </el-form>
      <!--选择课程 -->
      <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogXkFormVisible" width="560px">
      <el-form :model="kcform" ref="kcform" label-width="110px" name="kcform">
      <el-row>
      <input type="hidden" v-model.trim="kcform.zhid" />
      <div class="courseCheckList">
        <el-checkbox-group v-model="checkkcxx">

         <el-checkbox v-for="kcxx in xkkclist" :label="kcxx.kcdm" :key="kcxx.kcdm">{{kcxx.kcmc}}</el-checkbox>
        </el-checkbox-group>
      </div>
      </el-row>
      </el-form>
      <el-row>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="addHckc('kcform')" :disabled="changeSure">保存</el-button>
        <el-button v-else type="primary" @click="updatehckc('kcform')" :disabled="changeSure">保存</el-button>
        <el-button type="primary" @click="cancel('kcform')">取消</el-button>
      </el-row>
      
    </el-dialog>
    <!--选择课程类别 -->
    <el-dialog title="选择课程类别"  :visible.sync="dialogLbFormVisible" width="560px">
      <el-form :model="lbform" ref="lbform" label-width="110px" name="lbform">
      <el-row>
      <input type="hidden" v-model.trim="form.zhid" />
      <div class="courseCheckList">
        <el-checkbox-group v-model="checkkclb">

         <el-checkbox v-for="kclb in kclblist" :label="kclb.lbid" :key="kclb.lbid">{{kclb.lbmc}}</el-checkbox>
        </el-checkbox-group>
      </div>
      </el-row>
      </el-form>
      <el-row>
        <el-button  type="primary" @click="addkclb('lbform')" >保存</el-button>
        <el-button type="primary" @click="cancellb('lbform')">取消</el-button>
      </el-row>
      
    </el-dialog>
      </div>
      </div>
</template>

<script>
import { addGzszHckc,getGzszXkkc,getHckcList,deleteHckc,getGzszXklb,addGzszBxkc,getBxkcList,saveGzsz,deleteBxkc,getXktjzdks } from 'api/xkxt/xkrwmanager/index'
 export default {
     name: 'xkgzsz',
     
     data(){
          var checkZxks = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('每名学生最多选的课程数不能为空'));
           }
           setTimeout(() => {
            if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
            } else {
            if (value > 18) {
              callback(new Error('必须少于18门,课业负担太大了'));
            } else {
              callback();
            }
          }
         }, 1000);
         };
          var checkZdxks = (rule, value, callback) => {
            for (let i = 0; i < this.lbkclist.length; i++) {
                let temp = this.lbkclist[i];
                if(!temp.zdxks){
                   return callback(new Error('至少选的课程数不能为空'));
                }
                if(temp.zdxks > this.form.zxks){
                   callback(new Error('至少选的课程数不能大于每名学生最多选的课程数'));
                }
                 callback();
            }
         };
         return{   
             checkkcxx : [],
             checkkclb : [],
             xkkclist : [],
             hckclist : [],
             kclblist : [],
             lbkclist : [],
             zdksmap : [],
             changeSure : false, 
             form: {
               uuid :'',
               zxks :''
             },
             kcform: {},
             lbform: {},
             listQuery: { 
              xxdm: ''
             },
             textMap: {
             update: '编辑',
             create: '新增'
            },
            dialogStatus: '',
            dialogXkFormVisible : false,
            dialogLbFormVisible : false,
            formrules: {
             
             zxks: [
               { validator: checkZxks, trigger: 'blur' }
              ],
              zdxks: [
               { validator: checkZdxks, trigger: 'blur' }
              ],
            }
         }
     },
     created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      this.getHckcList();
      this.getBxkcList();
      this.getXktjzdks();
    },
     methods:{
         getXkkcList(){ //查询不能同时选择的课程
         this.listQuery.xxdm = this.xxdm;
         getGzszXkkc(this.listQuery).then(response => {
          this.xkkclist = response.data.rows;
         })
         },
         addhcKc(){ //打开互斥课程选择窗口
           this.checkkcxx = [];
           this.dialogStatus = 'create';
           this.dialogXkFormVisible = true;
           this.getXkkcList();  
         },
         getXklbList(){//查询必选的课程类别
          this.listQuery.xxdm = this.xxdm;
         getGzszXklb(this.listQuery).then(response => {
          this.kclblist = response.data.rows;
         })
         },
          addbxKc(){//打开课程类别选择窗口
           this.checkkclb = [];
           
            let lbids=[];
            for(let i=0 ;i<this.lbkclist.length ; i++){
              let temp = this.lbkclist[i];
              lbids[i] = temp.lbid;
            }
           this.checkkclb = lbids;
           this.dialogStatus = 'create';
           this.dialogLbFormVisible = true;
           this.getXklbList();  
         },
         addkclb(formName){//保存选择的课程类别
          this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.lbform.xxdm = this.xxdm;
            this.lbform.kclbs = this.checkkclb;
            addGzszBxkc(this.lbform).then(res => {
              this.dialogLbFormVisible = false;
              this.getBxkcList();;//刷新课程类别列表
              if (res.status == '200') {
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
            this.$notify({ title: '失败', message: '课程类型不能为空', type: 'error', duration: 2000 });
            return false;
          }
       });
         },
         getBxkcList(){//查询课程类别
          this.listQuery.xxdm = this.xxdm;
          getBxkcList(this.listQuery).then(response => {
          this.lbkclist = response.data;
         })
         },
          getXktjzdks(){//查询最多选
          this.listQuery.xxdm = this.xxdm;
          getXktjzdks(this.listQuery).then(response => {
          this.form.zxks = response.data.zdxks;
          this.form.uuid = response.data.uuid;
         })
         },
        delBxkc(uuid){//删除互斥课程
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.uuid = uuid;
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBxkc(this.listQuery).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
              this.getBxkcList();
          });
        });
       },
         saveGz(formName){//保存规则设置
          this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.form.xxdm = this.xxdm;
            let zdxks=[];
            let kclbs=[];
            for (let i = 0; i < this.lbkclist.length; i++) {
                let temp = this.lbkclist[i];
                zdxks[i]=temp.zdxks;
                kclbs[i]=temp.uuid;
            }
            this.form.zdxks = zdxks;
            this.form.kclbs = kclbs;
            saveGzsz(this.form).then(res => {
              if (res.status == '200') {
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
            this.$notify({ title: '失败', message: '表单验证条件不能通过,请检查', type: 'error', duration: 2000 });
            return false;
          }
       });
         },
         getHckcList(){ //查询互斥课程列表
         this.listQuery.xxdm = this.xxdm;
          getHckcList(this.listQuery).then(response => {
          this.hckclist = response.data;
         })
         },
         xkgoback(){//返回 
         this.$router.push('/xkxtManager/xkrw');
         },
       cancel() {
        this.dialogXkFormVisible = false;
       },
       cancellb(){
       this.dialogLbFormVisible = false;
       },
       addHckc(formName){//增加互斥课程
          this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.kcform.xxdm = this.xxdm;
            this.kcform.kcdms = this.checkkcxx;
            addGzszHckc(this.kcform).then(res => {
              this.dialogXkFormVisible = false;
              this.getHckcList();//刷新互斥课程列表
              if (res.status == '200') {
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
            this.$notify({ title: '失败', message: '互斥课程不能为空', type: 'error', duration: 2000 });
            return false;
          }
       });
       },
       delhckc(zhid){//删除互斥课程
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.zhid = zhid;
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteHckc(this.listQuery).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
              this.getHckcList();
          });
        });
       },
       edithckc(zhid,kcdms){//编辑互斥课程 
           this.dialogStatus = 'update';
           this.dialogXkFormVisible = true;
           this.getXkkcList(); 
           this.checkkcxx = kcdms.split(",");
           this.kcform.zhid=zhid;
           
       },
       updatehckc(formName){//更新互斥课程 
            this.changeSure = true;
            this.kcform.xxdm = this.xxdm;
            this.kcform.kcdms = this.checkkcxx;
           addGzszHckc(this.kcform).then(res => {
              this.dialogXkFormVisible = false;
              if (res.status == '200') {
                this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
              } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
              }
            });
            const that = this;
            setTimeout(() => {
              that.changeSure = false;
            }, 1500);
           this.listQuery.xxdm = this.xxdm;
           this.listQuery.zhid = this.kcform.zhid;
           deleteHckc(this.listQuery).then(() => {
              this.getHckcList();
          });
       }
       
     }
}
</script>

<style>

</style>