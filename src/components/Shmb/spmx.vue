<template>
  <el-dialog v-loading="loading" class="splcModel" :title="spsl.slmc" :visible.sync="dialogForm" width="40%" @close="colseDialog" >
      <el-dialog
        title="提示"
        :visible.sync="innerVisible"
        width="30%"
        center>
        <span>确认撤销申请吗?</span>
        <span slot="footer" class="dialog-footer">
      <el-button @click="innerVisible = false">取 消</el-button>
      <el-button type="primary" @click="innerVisible = false">确 定</el-button>
    </span>
    </el-dialog>
    <el-form label-width="80px" class="demo-ruleForm">
      <el-form-item label="审核状态" style="margin-bottom: 0px;">
        <el-button v-if="spsl.slzt==1" type="primary" size="mini" round>审批中</el-button>
        <el-button v-else-if="spsl.slzt==2" type="info" size="mini" round>已撤销</el-button>
        <el-button v-else-if="spsl.slzt==3" type="success" size="mini" round>审批通过</el-button>
        <el-button v-else-if="spsl.slzt==4" type="danger" size="mini" round>审批拒绝</el-button>
      </el-form-item>
      <el-form-item v-for="bdx in spsl.ywxx" :key="bdx.bdxid" style="margin-bottom: 0px;" :label="bdx.bdxmc" prop="ksmc">
        <div v-html="showYwz(bdx)"></div>
      </el-form-item>
    </el-form>
      <hr>
      <div>
        <div>
          <el-steps direction="vertical" :active="currentIndex" finish-status="success" process-status="process">
            <el-step v-for="(bzs ,index) in spsl.slbzList" :key="bzs.bzid" :title="(bzs.spbzmc+''+bzs.spsj)" @click.native="cxbzmx(index)">
              <template slot="description">
                <p v-for="bz in bzs.slbz" :class="getSlztClass(bz.spzt)">{{getSpyj(bz)}}</p>
              </template>
            </el-step>

          </el-steps>
        </div>
      </div>
      <hr>
      <el-row v-if="spsl.slzt==1">
        <el-button v-if="pdsfksp()" round type="primary" @click="bcspyj(1)">同意</el-button>
        <el-button v-if="pdsfksp()" round type="info" @click="bcspyj(2)" >拒绝</el-button>
        <el-button v-if="spsl.fqr==userid" round type="warning" @click="cxspsl(spsl.slid)">撤销</el-button>
       <!-- <el-button v-if="spsl.fqr==userid" round type="warning" @click="cbspsl(spsl.slid)">催办</el-button>-->
      </el-row>
    <el-dialog :visible.sync="showImageDialog" :modal="false" width="50%">
      <img width="100%" height="100%" :src="img_url_show">
    </el-dialog>
  </el-dialog>
</template>
<script>

  import * as api from 'api/audit/mobile/spcx';
  export default {
    name: 'info',
    data() {
      return {
        loading: true,
        dialogForm: false,
        innerVisible: false,
        showImageDialog: false,
        img_url_show: '',
        slztEnum: { SPZ: 1, // 审批中
          SPCX: 2, // 审批撤销
          SPTG: 3, // 审批通过
          SPJJ: 4 // 审批拒绝
        },
        bzztEnum: { DSP: 1, // 待审批
          SPWC: 2, // 审批完成
          WSP: 3, // 未审批
          HQWC: 4// 或签自动完成
        },
        slid: '',
        spsl: {},
        allbz: [],
        bzmx: [],
        userid: '',
        currentIndex: 1
      };
    },
    created() {
      window.showBigImage = this.showBigImage;
      this.userid = window.localStorage.getItem('userid');
    },
    methods: {
      init(id) {
        this.$nextTick(() => {
          this.slid = id
          this.cxslxq();
          this.loading = false;
          this.dialogForm = true;
        })
      },
      cxslxq() {
        api.cxspslxx(this.slid).then(response => {
          this.spsl = response;
          this.allbz = response.slbzList;
          this.clspbz(response.slbzList);
        });
      },
      hqsqr() {
        let sqrname = '';
        this.spsl.ywxx.forEach((item, index) => {
          if (item.bdbm == 'sqr') {
            sqrname = item.ywz;
          }
        })
        return sqrname;
      },
      clspbz(allbz) {
        const slzt = this.spsl.slzt;
        let zsbz = [];
        if (slzt == this.slztEnum.SPZ) {
          zsbz = allbz;
        } else if (slzt == this.slztEnum.SPTG || slzt == this.slztEnum.SPJJ || slzt == this.slztEnum.SPCX) {
          zsbz = _.filter(allbz, ['spzt', this.bzztEnum.SPWC]);
        }
        const zsslbz = [];
        zsslbz.push(this.addstep(this.slztEnum.SPZ));
        if (zsbz) {
          zsbz.forEach((item, index) => {
            const bzindex = item.spslbz;
            const bz = _.find(zsslbz, ['spslbz', bzindex]);
            if (bz) {
              bz.spbzmc = item.mbbzmc;
              bz.spslbz = item.spslbz;
              bz.spbzzt = item.spzt;
              bz.spsj = '';
              bz.slbz.push(item);
            } else {
              const obj = {};
              obj.spslbz = bzindex;
              obj.spbzzt = item.spzt;
              obj.spbzmc = item.bzmc;
              obj.spsj = '';
              obj.slbz = [];
              obj.slbz.push(item);
              zsslbz.push(obj);
            }
          })
        }
        if (slzt == this.slztEnum.SPCX) {
          zsslbz.push(this.addstep(this.slztEnum.SPCX));
        }
        this.spsl.slbzList = zsslbz;
        this.hqdqbz();
      },
      hqdqbz() {
        let dqbz = this.spsl.slbzList.length;
        const dspbz = _.find(this.spsl.slbzList, { spbzzt: this.bzztEnum.DSP });
        if (dspbz) {
          dqbz = dspbz.spslbz;
        }
        this.currentIndex = dqbz;
      },
      addstep(slzt) {
        const step = {};
        step.slbz = [];
        const sqrname = this.hqsqr();

        if (slzt == this.slztEnum.SPCX) {
          step.spslbz = 99;
          step.spbzzt = this.bzztEnum.SPWC;
          step.spsj = this.spsl.gxsj;
          step.spbzmc = sqrname + '撤销了审批';
        } else {
          step.spslbz = 0;
          step.spbzzt = this.bzztEnum.SPWC;
          step.spsj = this.spsl.cjsj;
          step.spbzmc = sqrname + '发起了审批';
        }
        return step
      },
      cxbzmx(index) {
        this.bzmx = this.spsl.slbzList[index].slbz;
      },
      cxspsl(slid) {
        this.$confirm('确认撤销申请吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          api.cxspsl(slid).then(response => {
            this.cxslxq();
            this.$message({ type: 'success', message: '撤销成功!' });
            this.$parent.queryPageList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      bcspyj(type) {
        this.$prompt('请输入审批意见', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[0-9a-zA_Z]{0}/,
          inputErrorMessage: '抱歉,最多只能输入20字符串'
        }).then(({ value }) => {
          const dspbz = this.pdsfksp();
          if (dspbz) {
            const spyj = {};
            spyj.slbzid = dspbz.slbzid;
            spyj.spnr = value;
            spyj.spyj = type;
            api.clslbz(spyj).then(res => {
              if (res.status === 200) {
                this.cxslxq();
                this.$message({ type: 'success', message: '操作成功！' });
                setTimeout(() => {
                  this.$parent.queryPageList();
                }, 2000)
              } else {
                console.error(res.message)
              }
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      pdsfksp() {
        const dspbz = _.find(this.allbz, { spr: this.userid, spzt: this.bzztEnum.DSP });
        return dspbz;
      },
      cbspsl(slid) {
        this.$message({ type: 'success', message: '催办通知' });
      },
      colseDialog() {
        this.dialogForm = false;
      },
      getSpyj(bz) {
        let spnr = bz.bzmc;
        const spsj = bz.gxsj ? bz.gxsj : '';
        if (bz.spyj) {
          const spyjnr = bz.spyj.spnr ? bz.spyj.spnr : '';
          if (bz.spyj.spyj === 1) {
            spnr += spsj + ':同意:' + spyjnr;
          } else if (bz.spyj.spyj === 2) {
            spnr += spsj + ':拒绝:' + spyjnr;
          }
        } else if (bz.spzt === this.bzztEnum.HQWC) {
          spnr += spsj + ':或签自动完成';
        }
        return spnr;
      },
      getSlztClass(spzt) {
        let className = '';
        if (spzt === this.bzztEnum.DSP) {
          className = 'is-process';
        } else if (spzt === this.bzztEnum.WSP) {
          className = 'is-wait';
        } else {
          className = 'is-success';
        }
        return className;
      },
      showYwz(bdx) {
        let showHtml = '';
        try {
          if (bdx.bdxlx === 5) {
            // 文件
            const ywz = bdx.ywz.split(',');
            ywz.forEach((yw, index) => {
              if (yw) {
                showHtml += '<a target="_blank" href="' + yw + '" class="el-button el-button--primary el-button--mini">附件' + (index + 1) + '</a>';
              }
            })
          } else if (bdx.bdxlx === 6) {
            // 图片
            const ywz = bdx.ywz.split(',');
            ywz.forEach(yw => {
              if (yw) {
                showHtml += '<img src=' + yw + ' onclick=showBigImage(\'' + yw + '\') class="showImg"/>';
              }
            })
          } else {
            showHtml = '<span>' + bdx.ywz + '</span>'
          }
        } catch (e) {
          console.error(e);
        }
        return showHtml;
      },
      showBigImage(url) {
        this.img_url_show = url;
        this.showImageDialog = true;
      }
    }
  };

</script>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
  .showImg{
    width: 50px;
    height: 50px
  }
</style>
<style scoped>
  .is-success{
    color: #67c23a;
    border-color: #67c23a;
  }
  .is-wait{
    color: #c0c4cc;
    border-color: #c0c4cc;
  }
  .is-process{
    color: #303133;
    border-color: #303133;
  }
</style>
