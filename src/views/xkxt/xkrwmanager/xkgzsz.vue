<template>
  <div class="oarow" style="float:left;width:100%;">
    <el-row style="margin-bottom: 10px;">
      <el-button type="primary"  @click="saveGz('form')">保存</el-button>
      <el-button type="primary"  @click="xkgoback">返回</el-button>
    </el-row>
    <el-row :gutter="20" >
      <el-col >
        <el-card shadow="hover">
          <div class="rowmain">
            <el-form :model="form" ref="form" :rules="formrules" label-width="110px" name="myform">
              <el-row>
                <el-form-item  label="每名学生最多选"  prop="zxks">
                  <input type="hidden" v-model.trim="form.uuid"/>
                  &nbsp;&nbsp;
                  <el-input style="display:inline-block; width:50px;" placeholder="" v-model.trim="form.zxks"  ></el-input> 门课
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item  label="不能同时选择的课程"  >
                  <div class="rowcontent">
                    <div class="rowRightBox">
                      <el-button type="primary" icon="el-icon-plus" size="small" plain @click="addhcKc" >添加</el-button>
                      <div class="courseList">
                        <div class="course"  v-for="hckc in hckclist" :label="hckc.kcdms" :key="hckc.zhid">
                          <span>{{hckc.kcmcs}}</span> <i class="el-icon-edit" @click="edithckc(hckc.zhid,hckc.kcdms)"></i> <i class="el-icon-delete" @click="delhckc(hckc.zhid)"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item  label="必选的课程类别"  >
                  <div class="rowcontent">
                    <div class="rowRightBox">
                      <el-button type="primary" icon="el-icon-plus" size="small" plain @click="addbxKc">添加</el-button>
                      <div class="courseList">
                        <el-form-item prop="zdxks">
                          <div class="course" v-for="(lbkc, index) in lbkclist" :label="lbkc.lbid" :key="index">
                            <span>{{lbkc.lbmc}} 至少选 <el-input style="display:inline-block; width:50px;" placeholder="" v-model.trim="lbkclist[index].zdxks" ></el-input> 门课</span> <i class="el-icon-delete" @click="delBxkc(lbkc.uuid)"></i>
                          </div>
                        </el-form-item>

                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
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
</template>

<script>
  import { dqxnxqObj } from 'api/components/searchbar'
  import { addGzszHckc, getGzszXkkc, getHckcList, deleteHckc, getGzszXklb, addGzszBxkc, getBxkcList, saveGzsz, deleteBxkc, getXktjzdks } from 'api/xkxt/xkrwmanager/index'
  export default {
    name: 'xkgzsz',


    data() {
      const checkZxks = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('每名学生最多选的课程数不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(Number.parseInt(value))) {
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
      const checkZdxks = (rule, value, callback) => {
        for (let i = 0; i < this.lbkclist.length; i++) {
          const temp = this.lbkclist[i];
          if (!temp.zdxks) {
            return callback(new Error('至少选的课程数不能为空'));
          }
          if (temp.zdxks > this.form.zxks) {
            return callback(new Error('至少选的课程数不能大于每名学生最多选的课程数'));
          }
        }
        callback();
      };
      return {
        activeNames: ['1', '2', '3'],
        dqxn: '', // 当前学年
        dqxq: '', // 当前学期
        checkkcxx: [],
        checkkclb: [],
        xkkclist: [],
        hckclist: [],
        kclblist: [],
        lbkclist: [],
        zdksmap: [],
        changeSure: false,
        form: {
          uuid: '',
          zxks: ''
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
        dialogXkFormVisible: false,
        dialogLbFormVisible: false,
        formrules: {

          zxks: [
            { validator: checkZxks, trigger: 'blur' }
          ],
          zdxks: [
            { validator: checkZdxks, trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        this.dqxn = response.xn;
        this.dqxq = response.xq;
        this.listQuery.xndm = this.dqxn;
        this.listQuery.xqdm = this.dqxq;
        this.getHckcList();
        this.getBxkcList();
        this.getXktjzdks();
      });
    },
    methods: {
      getXkkcList() { // 查询不能同时选择的课程
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.xndm = this.dqxn;
        this.listQuery.xqdm = this.dqxq;
        getGzszXkkc(this.listQuery).then(response => {
          this.xkkclist = response.data.rows;
        })
      },
      addhcKc() { // 打开互斥课程选择窗口
        this.checkkcxx = [];
        this.dialogStatus = 'create';
        this.changeSure = false;
        this.dialogXkFormVisible = true;
        this.getXkkcList();
      },
      getXklbList() { // 查询必选的课程类别
        this.listQuery.xxdm = this.xxdm;
        getGzszXklb(this.listQuery).then(response => {
          this.kclblist = response.data.rows;
        })
      },
      addbxKc() { // 打开课程类别选择窗口
        this.checkkclb = [];

        const lbids = [];
        for (let i = 0; i < this.lbkclist.length; i++) {
          const temp = this.lbkclist[i];
          lbids[i] = temp.lbid;
        }
        this.checkkclb = lbids;
        this.dialogStatus = 'create';
        this.dialogLbFormVisible = true;
        this.getXklbList();
      },
      addkclb(formName) { // 保存选择的课程类别
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.lbform.xxdm = this.xxdm;
            this.lbform.kclbs = this.checkkclb;
            this.lbform.xndm = this.dqxn;
            this.lbform.xqdm = this.dqxq;
            addGzszBxkc(this.lbform).then(res => {
              this.dialogLbFormVisible = false;
              this.getBxkcList();// 刷新课程类别列表
              if (res.status === 200) {
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
      getBxkcList() { // 查询课程类别
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.xndm = this.dqxn;
        this.listQuery.xqdm = this.dqxq;
        getBxkcList(this.listQuery).then(response => {
          this.lbkclist = response.data;
        })
      },
      getXktjzdks() { // 查询最多选
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.xndm = this.dqxn;
        this.listQuery.xqdm = this.dqxq;
        getXktjzdks(this.listQuery).then(response => {
          if (response.data) {
            this.form.zxks = response.data.zdxks;
            this.form.uuid = response.data.uuid;
          }
        })
      },
      delBxkc(uuid) { // 删除互斥课程
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
      saveGz(formName) { // 保存规则设置
        this.$refs[formName].validate(valid => {
          if (this.form.zxks == null || this.form.zxks === '') {
            this.$message({
              message: '每名学生最多选的课程数不能为空',
              type: 'warning'
            });
            return;
          }
          this.changeSure = true;
          this.form.xxdm = this.xxdm;
          const zdxks = [];
          const kclbs = [];
          let zdxkszs = 0;
          for (let i = 0; i < this.lbkclist.length; i++) {
            const temp = this.lbkclist[i];
            if (temp.zdxks == null || temp.zdxks === '') {
              this.$message({
                message: '至少选的课程数不能为空',
                type: 'warning'
              });
              return;
            }
            zdxkszs += parseInt(temp.zdxks);
            zdxks[i] = temp.zdxks;
            kclbs[i] = temp.uuid;
          }
          if (zdxkszs > parseInt(this.form.zxks)) {
            this.$message({
              message: '至少选的课程数之和不能大于每名学生最多选的课程数',
              type: 'warning'
            });
            return;
          }
          this.form.zdxks = zdxks;
          this.form.kclbs = kclbs;
          this.form.xndm = this.dqxn;
          this.form.xqdm = this.dqxq;
          if (valid) {
            saveGzsz(this.form).then(res => {
              if (res.status === 200) {
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
            this.$message({
              message: '请输入数字值',
              type: 'warning'
            });
            return false;
          }
        });
      },
      getHckcList() { // 查询互斥课程列表
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.xndm = this.dqxn;
        this.listQuery.xqdm = this.dqxq;
        getHckcList(this.listQuery).then(response => {
          this.hckclist = response.data;
        })
      },
      xkgoback() { // 返回
        this.$router.push('/xkxtManager/xkrw');
      },
      cancel() {
        this.dialogXkFormVisible = false;
      },
      cancellb() {
        this.dialogLbFormVisible = false;
      },
      addHckc(formName) { // 增加互斥课程
        this.$refs[formName].validate(valid => {
          if (valid) {
            const hckclist = this.hckclist;
            const xzkc = this.checkkcxx;
            for (let i = 0; i < hckclist.length; i++) {
              let tj = '';
              if (hckclist[i].kcdms.split(',').length !== xzkc.length) {
                tj = 'false';
              } else {
                for (let j = 0; j < xzkc.length; j++) {
                  if (j > 0) {
                    tj += ' && ';
                  }
                  tj += hckclist[i].kcdms.search(xzkc[j]) !== -1;
                }
              }
              // eval函数是把字符串转换成变量
              if (eval(tj)) {
                this.$message({
                  message: '该规则已存在！',
                  type: 'warning'
                });
                return false;
              }
            }
            this.changeSure = true;
            this.kcform.xxdm = this.xxdm;
            this.kcform.kcdms = this.checkkcxx;
            this.kcform.xndm = this.dqxn;
            this.kcform.xqdm = this.dqxq;
            this.kcform.zhid = '';
            if (this.checkkcxx != null && this.checkkcxx.length > 1) {
              addGzszHckc(this.kcform).then(res => {
                this.dialogXkFormVisible = false;
                this.getHckcList();// 刷新互斥课程列表
                if (res.status === 200) {
                  this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
                } else {
                  this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
                }
              });
            } else {
              this.$message({
                message: '请选择两科以上做为互斥课程',
                type: 'warning'
              });
            }
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
      delhckc(zhid) { // 删除互斥课程
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
      edithckc(zhid, kcdms) { // 编辑互斥课程
        this.dialogStatus = 'update';
        this.dialogXkFormVisible = true;
        this.changeSure = false;
        this.getXkkcList();
        this.checkkcxx = kcdms.split(',');
        this.kcform.zhid = zhid;
      },
      updatehckc() { // 更新互斥课程
        this.changeSure = true;
        this.kcform.xxdm = this.xxdm;
        this.kcform.kcdms = this.checkkcxx;
        this.kcform.xndm = this.dqxn;
        this.kcform.xqdm = this.dqxq;
        const hckclist = this.hckclist;
        const xzkc = this.checkkcxx;
        for (let i = 0; i < hckclist.length; i++) {
          let tj = '';
          if (hckclist[i].kcdms.split(',').length !== xzkc.length) {
            tj = 'false';
          } else {
            for (let j = 0; j < xzkc.length; j++) {
              if (j > 0) {
                tj += ' && ';
              }
              tj += hckclist[i].kcdms.search(xzkc[j]) !== -1;
            }
          }
          // eval函数是把字符串转换成变量
          if (eval(tj)) {
            this.$message({
              message: '该规则已存在,修改失败！',
              type: 'warning'
            });
            return false;
          }
        }
        if (this.checkkcxx != null && this.checkkcxx.length > 1) {
          addGzszHckc(this.kcform).then(res => {
            this.dialogXkFormVisible = false;
            if (res.status === 200) {
              this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
            } else {
              this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
            }
          });
        } else {
          alert('请选择两科以上做为互斥课程');
        }
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

<style scoped>
  .course {
    width: 70%;
    background: #f7f5f5;
  }
</style>
