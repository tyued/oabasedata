<template>
  <div class="app-container calendar-list-container">
     
    <p class="head">
      <el-button   @click="addform" type="primary"  style="margin-left:-18px" >添加考核等级</el-button> 
      <!-- add=!add -->
      <span>发布一篇读书心得获得{{tex}}个成长值，通过一个挑战获得{{tek}}个成长值</span>
    </p>
    <!-- 修改考核等级 -->
      <div style="width: 950px;">
        <el-table
        :data="tableData"
        border
        fixed:none
        >
    <el-table-column
      prop=""
      type="index"
      label="序号"
      width="150" style="display:none">
      
    </el-table-column>
    <el-table-column
      prop="Title"
      label="考核等级名称"
      width="350">
    </el-table-column>
    <el-table-column
      prop="Score"
      label="所需成长值"
      width="200">
    </el-table-column>

    <el-table-column
      label="操作"
>
      <template slot-scope="scope">
        <el-button @click.stop="editGradeappraisal(scope.row)" type="primary" size="small">编辑</el-button>
        <!-- apt=!apt -->
       
         <el-button @click.stop="cancel(scope.$index, scope.row.ID)" type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>


      </div>

   <!-- 添加数据弹框 -->
<el-dialog title="添加考核等级" :visible.sync="dialogVisible" width="40%" center="center"
  :before-close="handleClose" >                      
  <div class="add">
       <p class="pt">考核等级名称<el-input  v-model="input1"  maxlength = '10'
      class="read" placeholder="请输入等级名称,不超过十个字" style="margin-left:30px;"></el-input>
      </p> 
      <p class="pt">等级成长值设置<el-input v-model="input2" class="read" placeholder="请输入等级成长值，大于零的整数"  style="margin-left:18px;"></el-input></p>
        <p>说明：学生成长值累积达到等级要求后，显示相应的考核等级名称</p> 

       </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save" >确 定</el-button>
  </span>
</el-dialog>

  <!-- 修改数据弹框 -->
  
     <el-dialog title="修改考核等级" :visible.sync="dialog" width="40%" @close='closeDialog'>                      
  <div class="upda">
       <p class="pt">考核等级名称<el-input  v-model="Gradeappraisal.Title" 
      class="read" placeholder="请输入等级名称,不超过十个字" style="margin-left:30px;"></el-input>
      </p> 
      <p class="pt">等级成长值设置<el-input v-model="Gradeappraisal.Score" class="read" placeholder="请输入等级成长值，大于零的整数"  style="margin-left:18px;"></el-input></p>
        <p>说明：学生成长值累积达到等级要求后，显示相应的考核等级名称</p> 

       </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialog = false">取 消</el-button>
    <el-button type="primary" @click="redact" >确 定</el-button>
  </span>
</el-dialog>



  </div>
</template>

<style scoped lang="scss">
.read {
  width: 300px;
}
.text {
  width: 300px;
  margin-left: 25px;
}
.app {
  height: 150px;
  margin-top: 30px;
}
.pt {
  margin-left: 50px;
}
.save {
  width: 150px;
  margin-left: 200px;
  margin-top: 30px;
}
.head {
  margin: 20px;
}
</style>

<script>
import { page } from "api/project/mainProject/index";
import * as http from "api/admin/read/readbook.js";
import { cancel, redact } from "api/admin/read/readbook.js";
export default {
  name: "examCount",
  components: {},
  data() {
    return {
      Gradeappraisal: {
        ID: "",
        Title: "",
        Score: 0
      },
      centerDialogVisible: false,
      dialogVisible: false,
      dialog: false,
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      ID: [],
      tex: "",
      tek: "",
      tableData: [],

      ruleForm2: {
        pass: "",
        checkPass: "",
        age: ""
      }
    };
  },
  created() {
    this.init();
    this.getList();
    this.addSchool();
  },
  computed: {},
  directives: {},
  filters: {},
  methods: {
    // 编辑
    editGradeappraisal(value) {
      // console.log(value)
      this.dialog = true;
      this.Gradeappraisal.ID = value.ID;
      this.Gradeappraisal.Title = value.Title;
      this.Gradeappraisal.Score = value.Score;
    },
    // 关闭模态框
    closeDialog() {
      console.log(11);
      // this.dialog = false
    },
    // 确认添加
    save() {
      this.postList(localStorage.getItem("xxdm"));
    },
    handleClose() {
      this.dialogVisible = false;
    },
    addform() {
      this.dialogVisible = true;
    },
    eate() {
      this.dialogVisible = false;
    },
    isPositiveInteger(s) {
      var re = /^[0-9]+$/;
      return re.test(s);
    },

    init() {},
    //添加数据
    postList() {
      if (this.input1 != 0) {
        if (this.input2 != 0 && this.isPositiveInteger(this.input2)) {
          http
            .grade({
              SchoolCode: localStorage.getItem("xxdm"),
              Title: this.input1, //标题
              Score: this.input2 //分数
            })
            .then(res => {
              this.dialogVisible = false;
              this.getList();
              this.input1 = "";
              this.input2 = "";
              this.$message.success("添加成功");
            });
        } else {
          this.$message.error("等级成长值:必须是大于零的整数");
        }
      } else {
        this.$message.error("考核等级名称不可超过10个字！");
      }
    },
    //获取数据
    getList() {
      http.gain().then(res => {
        // console.log(res);
        this.tableData = res.Value;
      });
    },
    edit(index, data) {
      this.apt = true;
      this.ID = data;
    },
    //编辑数据
    redact() {
      http.redact(this.Gradeappraisal).then(res => {
        this.dialog = false;
        this.getList();
        // this.ID = [];
        // console.log(res);
      });
    },

    //删除数据
    cancel(index, ID) {
      console.log(index);
      console.log(ID);
      var that = this;

      this.ID = [];
      this.ID.push(ID);
      console.log(this.ID);

      // cancel(this.ID).then(data => {
      //   console.log(data)
      // })
      this.$confirm("此操作将永久删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cancel(this.ID).then(data => {
            console.log(data);
            if (data.State === "1") {
              this.getList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$message({
                type: "info",
                message: data.Message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //展示学校数据
    addSchool() {
      http
        .addSchool({
          SchoolCode: localStorage.getItem("xxdm")
        })
        .then(res => {
          console.log(res.Value);
          this.tex = res.Value.MoralityScore;
          this.tek = res.Value.PassScore;
          console.log(this.tex);
        });
    }
  }
};
</script>


