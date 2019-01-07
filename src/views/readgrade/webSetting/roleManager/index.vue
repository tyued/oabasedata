<template>
  <div class="app-container calendar-list-container role_warrper">
    <div class="btnBox">
      <el-button @click="showRole">添加角色</el-button>
    </div> 

    <!-- 角色表格 -->
    <el-table
      :data="roleTable"
      stripe
      border
      style="width: 100%">
      <el-table-column
        align='center'
        prop="mc"
        label="角色名称">
      </el-table-column>
      <el-table-column
        align='center'
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="roleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="roleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align='center'
        label="管理">
        <template slot-scope="scope">
          <el-button size="mini" @click="authorityEdit(scope.$index, scope.row)">编辑权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 角色表单视图 -->
    <el-dialog :title="textMap[dialogStatus]" width="550px" :visible.sync="roleView">
      <el-form ref="roleform" :model="roleform" label-width="100px" label-position="left">
        <el-form-item label="角色名称:">
          <el-input v-model="roleform.mc"></el-input>
        </el-form-item>
      </el-form>
      <div class="t_center">
        <el-button type="primary" @click="addRole" v-if="dialogStatus==0">保存</el-button>
        <el-button type="primary" @click="updateRole" v-if="dialogStatus==1">保存</el-button>
      </div>
    </el-dialog>

    <!-- 权限表单视图 -->
    <el-dialog title="编辑权限" width="550px" :visible.sync="authorityView">
      <div v-for="(itemList,index) in authorityform" :key="index" style="margin-left: 30px;"> 
        <el-checkbox :indeterminate="selectTips[index]" v-model="selectAll[index]" @change="selectAllChange(index)">{{options[index].mc}}</el-checkbox>
        <div style="margin: 10px 0 15px 25px;">
          <el-checkbox-group v-model="authorityform[index]" @change="selectChange(index)">
            <el-checkbox v-for="(item,index2) in options[index].child" :label="item.val" :key="index2">{{item.mc}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      
      <div class="t_center">
        <el-button type="primary" @click="updateAuthority">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.role_warrper {
  .mbottom {
    margin-bottom: 60px;
  }
  .el-table thead th {
    background-color: #6f7f97 ;
    color: #ffffff;
  }
  .el-checkbox {
    margin: 0 30px 15px 0;
  }

  .t_center {
    text-align: center;
  }
  .btnBox {
    margin-bottom: 30px;
  }
}
  
</style>

<script>

export default {
  name: "examCount",
  components: {
    
  },
  data() {
    return {
      roleView: false,
      authorityView: false,
      roleform: {},
      authorityform: {},
      textMap: ['添加角色','修改角色'],
      dialogStatus: 0,
      roleTable: [],
      options: [{
        mc: '参考书目',
        child: [{mc: '添加',val: 0,},{mc: '编辑',val: 1,},{mc: '删除',val: 2,},{mc: '导入',val: 3,},{mc: '导出',val: 4,}],
      },{
        mc: '题库管理',
        child: [{mc: '添加',val: 0,},{mc: '编辑',val: 1,},{mc: '删除',val: 2,},{mc: '导入',val: 3,},{mc: '导出',val: 4,}],
      },{
        mc: '试卷规范',
        child: [{mc: '保存',val: 0,}],
      },{
        mc: '阅读成果统计',
        child: [{mc: '按年级统计',val: 0,},{mc: '按班级统计',val: 1,},{mc: '按学生统计',val: 2,}],
      },{
        mc: '考试统计',
        child: [{mc: '按年级统计',val: 0,},{mc: '按班级统计',val: 1,},{mc: '按学生统计',val: 2,}],
      },{
        mc: '管理员权限',
        child: [{mc: '系统设置',val: 0,},{mc: '成长体系设置',val: 1,},{mc: '阅读成果统计',val: 2,},{mc: '角色管理',val: 3,},{mc: '用户管理',val: 4,},{mc: '考试统计',val: 5,}],
      }],
      selectAll: [false,false,false,false,false,false],
      selectTips: [false,false,false,false,false,false],
    }
  },  
  created() {
    this.init()
  },
  watch: {
    selectAll: function (old) {
      console.log(old)
    }
  },
  computed: {
  },
  directives: {

  },
  filters: {
  },
  methods: {
    init() {
      // 假数据
      this.roleTable = [{
        mc: '管理员',
        auth: [[0,1,2,3,4],[0,1,2,3,4],[0],[0,1,2],[0,1,2],[0,1,2,3,4,5]],
      },{
        mc: '普通教师',
        auth: [[0,1,2,3],[1,2],[],[0],[0],[0,1]],
      }]
    },
    showRole() {
      this.roleform = {}
      this.dialogStatus = 0
      this.roleView = true
    },    
    addRole() {
      // 添加角色
      this.roleView = false
    },
    updateRole() {
      // 编辑角色
      this.roleView = false
    },  
    updateAuthority() {
      // 编辑权限
      this.authorityView = false
    }, 
    roleEdit(index, item) {
      this.roleform = JSON.parse(JSON.stringify(item))
      this.dialogStatus = 1
      this.roleView = true
    },
    authorityEdit(index, item) {
      this.authorityform = JSON.parse(JSON.stringify(item.auth))
      for(let i = 0; i < this.authorityform.length; i++) {
        if(this.authorityform[i].length == this.options[i].child.length) {
          this.selectAll[i] = true
          this.selectTips[i] = false
        }else {
          if(this.authorityform[i].length == 0) {
            this.selectTips[i] = false
          }else {
            this.selectTips[i] = true
          }
          this.selectAll[i] = false
        }
      }  
      this.authorityView = true
    },
    selectAllChange(index) {
      if(this.selectAll[index]) {
        let arr = []
        for(let i = 0; i < this.options[index].child.length; i++) {
          arr.push(this.options[index].child[i].val)
        }
        this.authorityform[index] = arr
      }else {
        this.authorityform[index] = []
      }
      this.selectTips[index] = false
    },
    selectChange(index) {
      this.selectAll = JSON.parse(JSON.stringify(this.selectAll))
      if(this.authorityform[index].length == this.options[index].child.length) {
        this.selectAll[index] = true
        this.selectTips[index] = false
      }else {
        if(this.authorityform[index].length == 0) {
          this.selectTips[index] = false
        }else {
          this.selectTips[index] = true
        }
        this.selectAll[index] = false
      }
    },
    roleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
          });
      });
    },   
  }
};
</script>


