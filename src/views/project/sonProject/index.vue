<template>
  <div class="app-container calendar-list-container">
     <div style="overflow:hidden;margin-left:-20px">
        <el-card class="card-box" @click.native="handleView(item)" shadow="hover" v-for="(item,index) in itemList" :key="index">
            <div class="right card-btn">
                <el-button class="right delete-btn" size="mini" type="danger" @click.stop="handleDelete(item)" v-if="item.xmlx == 0">删除</el-button>
                <el-button class="right" size="mini" @click.stop="handleUpdate(item)">编辑</el-button> 
            </div>
            <div class="card-title">
                {{item.mc}}
            </div>
            <div class="card-tag">
                <el-tag size="mini"  v-if="item.xmlx == 0 || item.xmlx == 1">{{item.njmc}}</el-tag>
                <el-tag size="mini"  v-if="item.xmlx == 2 || item.xmlx == 3">{{xnxq.xn+'年'+xnxq.xqmc}}</el-tag>
                <el-tag size="mini" type="info"  v-if="item.xmlx != 0">系统</el-tag>
            </div>
            <div class="card-desc">
                <span>总任务 {{item.rwsl}}</span><span v-if="item.ywzx == 1" class="desc-son"> ( 子项目 {{item.zxmsl}})</span>
            </div>
            <div class="card-progress">
                <el-progress v-textDesc="{ysbsl: item.ysbsl}" :text-inside="true" :stroke-width="18" :percentage="0" v-if="item.ysbsl == 0"></el-progress>
                <el-progress v-textDesc="{ysbsl: item.ysbsl}" :text-inside="true" :stroke-width="18" :status="item.ysbsl==item.rwsl?'success':''" :percentage="Math.floor(100 * item.ysbsl/item.rwsl)" v-if="item.ysbsl > 0"></el-progress>
            </div>        
        </el-card>
    </div>
       
    <div class="menu-btn" v-if="xmlx == 0">
        <div>
            <el-button circle type="primary" icon="el-icon-plus" @click="handleCreate" class="create-btn"></el-button>
        </div>    
    </div>
    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <hr>
    <span>目前进行考评的项目有{{itemNum}}个，任务共计{{taskTotalNum}}个</span>

    <!-- 新建项目弹层 -->
    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="createFormVisible" width="850px" :before-close="createCancel">
        <el-form :model="form" ref="createform" label-width="100px" :rules="rules">
            <el-form-item label="项目名称" prop="mc">
                <el-input v-model="form.mc" placeholder="请输入项目名称" :disabled="form.xmlx != 0"></el-input>
            </el-form-item>
            <el-form-item label="计分类型" required>
            	  <el-radio v-model="jflx" label="0" border :disabled="form.xmlx != 0">成绩换算</el-radio>
                <el-radio v-model="jflx" label="1" border :disabled="form.xmlx != 0">累计量换算</el-radio>
            </el-form-item>
            <el-form-item label="评分标准">
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.bz" maxlength="200"></el-input>
            </el-form-item>  
            <el-form-item label="最高学分" prop="zgxf">
                <el-input v-model.number="form.zgxf" placeholder="支持一位小数"></el-input>
            </el-form-item>
            <el-form-item label="最高成绩" prop="zgcj" v-if="jflx == 0">
                <el-input v-model.number="form.zgcj" placeholder="请输入1~100数值"></el-input>
            </el-form-item>
            <el-form-item label="学分换算" required v-show="jflx == 0">
                <el-row class="hsItem" v-for="(item,index) in hsRange" :key="index">
                    <el-col :span="9">
                        <el-slider 
                            v-model="item.range"
                            range
                            :max="form.zgcj | numberFilter">
                        </el-slider>
                        <div>取值范围：{{item.range[0]}}~{{item.range[1]}}</div>
                    </el-col>
                    <el-col :span="9" :offset="1">
                            为<el-input v-model.number="item.xf" placeholder="请输入1~100数值" class="hsInput"></el-input>学分
                    </el-col>
                    <el-col :span="5" v-if="index==0">
                        <el-button  icon="el-icon-plus" class="right" @click="addRange">区间</el-button>
                    </el-col>
                    <el-button type="text" icon="el-icon-minus"  v-if="index > 0 && index < hsRange.length-1" @click="deleteRange(index)"></el-button>
                </el-row>
                <div style="color:red"><span>温馨提示</span> : 成绩区间重合处将以学分较低的区间进行换算</div>
            </el-form-item>

            <el-form-item label="学分换算" required v-show="jflx == 1">
                <div class="hsItem" v-for="(item,index) in hsLjl" :key="index">
                    累计完成
                    <el-input v-model="item.zxz" placeholder="请输入1~100数值" class="hsInput" v-if="item.type != 2"></el-input>
                    <span v-if="item.type == 1">至</span>
                    <el-input v-model="item.zdz" placeholder="请输入1~100数值" class="hsInput" v-if="item.type != 0"></el-input>
                    <span v-if="item.type == 0">及以上任务获得</span>
                    <span v-if="item.type == 2">及以下任务获得</span>
                    <span v-if="item.type == 1">任务获得</span>
                        <el-input v-model.number="item.xf" placeholder="请输入1~100数值" class="hsInput"></el-input>
                    学分
                    <el-button  icon="el-icon-plus" class="right" @click="addLjl" v-if="item.type == 0">区间</el-button>
                    <el-button type="text" icon="el-icon-minus" @click="deleteLjl(index)" v-if="item.type == 1"></el-button>
                </div>
	    </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="createSubmit('createform')" :disabled="btnLimt">保 存</el-button>
            <el-button @click="createCancel">取 消</el-button> 
        </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.right {
        float: right;
    }
.card-box {
    cursor: pointer;
    width: 393px;
    margin-bottom: 20px; 
    height: 165px;
    float: left;
    margin-left: 20px;
    :hover .card-btn {
        display: block;
    }
    .card-btn {
        display: none;
        .delete-btn {
            margin-left: 10px; 
        }
    }
    .card-title {
        font-size: 20px;
        margin-bottom: 10px;   
    }
    .card-tag {
        margin-bottom: 16px;     
    }
    .card-desc {
        color: #606266;
        font-size: 16px;
        margin-bottom: 10px;  
        .desc-son {

            color: #909399;
        }
    }
}

.menu-btn {
    position: fixed;
    bottom: 60px;
    right: 52px;
    width: 70px;
    .create-btn {
        width: 70px;
        height: 70px;
        font-size: 30px;
    }
}

.hsItem {
  margin-bottom: 10px;
  .hsInput {
    width: 140px;
    margin: 0 10px;
  }
}
</style>

<script>
import { Loading } from 'element-ui';
import { getToken } from "utils/auth";
import { mapGetters } from "vuex";
import {
  page,
  createItem,
  updateItem,
  delItem,
  getItem,
  dqxnxqObj,
} from "api/project/mainProject/index";

export default {
  name: "mainProject",
  components: {
  
  },
  data() {
    return {
      xnxq: {},         //当前学年学期信息 
      xmlx: window.localStorage.getItem('xmlx'),
      listLoading: true, // 加载
      total: null,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        fjxmId: window.localStorage.getItem('fjxmId'),
        xxdm: window.localStorage.getItem('xxdm'),
      },
      dialogStatus: "",
      createFormVisible: false,
      textMap: {
        //判断弹层是添加还是编辑
        update: "编辑子项目",
        create: "新建子项目"
      },
      form: {},
      itemList: [],
      itemNum: 0,
      taskTotalNum: 0,
      jflx: "0", //计分形式
      hsRange:[{
        range: [90,100],
      },{
        range: [60,90],
      },{
        range: [0,60],
      }],
      hsLjl:[{
        type: 0
      },{
        type: 1
      },{
        type: 2
      }],
      uuid: null,
      
      btnLimt: false, //防止重复提交BUG
        //表单较检规则
      rules: {
        mc: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
        zgxf: [
          { required: true, message: '请输入最高学分', trigger: 'blur' },
          { type: 'number', message: '学分必须为数字值' },
        ],
        zgcj: [
          { validator: this.isIntNum, trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    console.log(this.$route)
    this.dqXnXqObj();
    this.getList(); 
  },
  computed: {
    ...mapGetters(["elements"])
  },
  directives: {
    textDesc: {
        inserted: function (el, params) {
            let progressDom = el.children[0].children[0].children[0].children[0];
            let percentageText = progressDom.innerText;
            let descText = '已完成 '+params.value.ysbsl;
            progressDom.innerText = descText + ' (' + percentageText + ')'
        }
    }
  },
  filters: {
      numberFilter: function(zgcj) {
          if(typeof(zgcj) == "number" ) {
              return zgcj
          }else {
              return 100
          }
      }
  },
  methods: {
    isIntNum(rule, value, callback) {
        if (!value) {
            callback(new Error('最高成绩不能为空'));
        }else if(Number.isInteger(value) && value >= 1 && value <= 100) {
            callback();
        }else {
            callback(new Error('请输入1~100的整数'));
        }    
    },
    getList() {
        // let loadingInstance = Loading.service({
        //     target: document.querySelector(".main-container"),
        //     background: 'rgba(255, 255, 255, 0.6)',
        // });
        // document.querySelector("body").style.overflow="hidden"

      page(this.listQuery).then(response => {

            // let _this = this
            // setTimeout(function(){
            //     _this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            //         loadingInstance.close();
            //     });
            //     document.querySelector("body").style.overflow="auto"
            // },1200)

        console.log(response);
        this.total = response.totalCount;
        this.itemList = response.list;
        this.itemNum = response.list.length;
        this.taskTotalNum = response.rwCount;
        this.listLoading = false;
      });
    },
    handleView(item) {
      window.localStorage.setItem('xmid',item.uuid);
      this.$router.push({
          path: '/projectManager/projectDetail', 
      })
    },
    handleCreate() {
      this.btnLimt = false;
      this.dialogStatus = "create";
      this.createFormVisible = true;
      this.form.xmlx = '0';
    },
    //表单内容初始化
    dataInit() {
      this.$refs['createform'].resetFields();
      this.uuid = null;
      this.form = {};
      this.jflx = "0";
        this.hsRange = [{
            range: [90,100],
        },{
            range: [60,90], 
        },{
            range: [0,60],
        }];
        this.hsLjl = [{
            type: 0
        },{
            type: 1
        },{
            type: 2
        }];
    },
    // 取消按钮
    createCancel() {
      this.createFormVisible = false;
      this.dataInit();
    },
    // 提交按钮
    createSubmit(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.btnLimt = true
          let isValidXf = true

          //数据处理
          _this.form.xxdm = _this.listQuery.xxdm;
          _this.form.uuid = _this.uuid;
          _this.form.fjxmid = _this.listQuery.fjxmId
          _this.form.jflx = Number(_this.jflx);

          _this.form.hs = [];
          switch (_this.form.jflx) {
            case 0:
              _this.hsRange.forEach(function(item, index) {
                item.zxz = item.range[0];
                item.zdz = item.range[1];
                item.type = 1;
                if(Number(item.xf) > Number(_this.form.zgxf)) {
                    isValidXf = false
                    return      
                }
                _this.form.hs.push(item);
              });
              break;
            case 1:
              _this.hsLjl.forEach(function(item, index){                          
                if(Number(item.xf) > Number(_this.form.zgxf)) {
                    isValidXf = false
                    return       
                }
              })
              _this.form.hs = _this.hsLjl;
              break;
          }

          console.log(_this.form);

          if(!isValidXf) {
            _this.btnLimt = false;
            this.$notify({
                title: '提示',
                message: '换算学分不能超过最高学分',
                type: 'waring',
                duration: 2000
            });
            return false
          }  

          //表单提交

          switch (_this.dialogStatus) {
            //更新
            case "update":
              updateItem({
                id: _this.uuid,
                info: _this.form,
              }).then(() => {
                _this.createFormVisible = false;
                _this.dataInit();
                _this.getList();
                _this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                  duration: 2000
                });
              }).catch(()=>{
                setTimeout(function(){
                    _this.btnLimt = false;
                },1500);
              })
              break;
            //创建
            case "create":
              createItem(_this.form).then(() => {
                _this.createFormVisible = false;
                _this.dataInit();
                _this.getList();
                _this.$notify({
                  title: "成功",
                  message: "创建成功",
                  type: "success",
                  duration: 2000
                });
              }).catch(()=>{
                setTimeout(function(){
                    _this.btnLimt = false;
                },1500);
              })
              break;
          }
        } else {
          return false;
        }
      });
    },
    handleUpdate(item) {
      let _this = this;
      _this.btnLimt = false;
      _this.uuid = item.uuid;
      _this.dialogStatus = "update";

      getItem({
        id: item.uuid,
      }).then(response => {
        _this.form = response;

        _this.jflx = String(_this.form.jflx);
        switch (_this.jflx) {
          case "0":
            _this.form.hs.forEach(function(item, index) {
              item.range = [item.zxz, item.zdz];
            });
            let rangeArr = [];
            let hs = _this.form.hs
            for(let i = 0; i < hs.length; i++) {
                rangeArr[i]={}
                for(let key in hs[i]) {
                
                    rangeArr[i][key] = hs[i][key]
                }
            }
            _this.hsRange = rangeArr
            break;
          case "1":
            _this.hsLjl = _this.form.hs;
            break;
        }
        this.createFormVisible = true;
      }); 
    },
    handleDelete(item) {
      let tishiMessage = undefined;
      if (item.rwsl > 0) {
        tishiMessage = "该项目包含任务，请先删除任务";
      }
      if (tishiMessage) {
        this.$confirm(tishiMessage, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
      } else {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delItem({
            id: item.uuid
          }).then(() => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            const index = this.itemList.indexOf(item);
            this.itemList.splice(index, 1);
          });
        });
      }
    },

    // 分页
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.getList();
    },
    //换算
    addRange() {
      console.log("出发了");
      let len = this.hsRange.length;
      this.hsRange.splice(len - 1, 0, {
        range: [60, 90]
      });
    },
    deleteRange(index) {
      this.hsRange.splice(index, 1);
    },
    addLjl() {
      console.log("触发了");
      let len = this.hsLjl.length;
      this.hsLjl.splice(len - 1, 0, {
        type: 1
      });
    },
    deleteLjl(index) {
      this.hsLjl.splice(index, 1);
    },
    dqXnXqObj() {
        dqxnxqObj({
            xxdm: this.listQuery.xxdm,
        }).then(response => {
            this.xnxq = response
        })
    }
  }
};
</script>


