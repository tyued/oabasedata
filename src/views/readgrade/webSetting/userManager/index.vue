<template>
  <div class="app-container calendar-list-container user_warrper">
    <div class="btnBox">
      <el-button @click="showAddUser">添加</el-button>
      <el-button @click="batchDeleteUser">批量删除</el-button>
      <el-input  v-model="listQuery.mc" style="width:300px;margin-left:10px;"></el-input>
      <el-button @click="getList" type="info" icon="el-icon-search">搜索</el-button>
    </div> 

    <!-- 角色表格 -->
    <el-table
      :data="userTable"
      stripe
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        align='center'
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        align='center'
        prop="obj.mc"
        label="姓名">
      </el-table-column>
      <el-table-column
        align='center'
        label="所属角色">
        <template slot-scope="scope">
          <span>{{[scope.row,roleList] | rolefilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align='center'
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="userDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align='center'
        label="管理">
        <template slot-scope="scope">
          <el-button size="mini" @click="showEditUser(scope.$index, scope.row)">编辑权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加用户表单视图 -->
    <el-dialog title="编辑权限" width="550px" :visible.sync="addUserView">
      <div class="formBox">
        <div class="left formList">
          <div class="listHeader">教师列表</div>
          <div class="listBody">
            <el-checkbox :indeterminate="selectTip1" v-model="selectAll1" @change="selectAllChange1" class="listItem">全选</el-checkbox>
            <el-checkbox-group v-model="selectUser" @change="userSelectChange1">
              <el-checkbox v-for="(item,index) in residualUserList" :label="item" :key="index" class="listItem">{{item.mc}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="right formList">
          <div class="listHeader">角色列表</div>
          <div class="listBody">
            <el-checkbox :indeterminate="selectTip2" v-model="selectAll2" @change="selectAllChange2" class="listItem">全选</el-checkbox>
            <el-checkbox-group v-model="selectRole" @change="userSelectChange2">
              <el-checkbox v-for="(item,index) in roleList" :label="index" :key="index" class="listItem">{{item}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="t_center">
        <el-button type="primary" @click="addUser">保存</el-button>
        <el-button type="info" @click="addUser">取消</el-button>
      </div>
    </el-dialog>  

    <!-- 编辑用户权限表单视图 -->
    <el-dialog title="编辑权限" width="450px" :visible.sync="editUserView">
      <div class="formBox">
        <div class="formList">
          <div class="listHeader">角色列表</div>
          <div class="listBody">
            <el-checkbox :indeterminate="selectTip3" v-model="selectAll3" @change="selectAllChange3" class="listItem">全选</el-checkbox>
            <el-checkbox-group v-model="currentUser.role" @change="userSelectChange3">
              <el-checkbox v-for="(item,index) in roleList" :label="index" :key="index" class="listItem">{{item}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="t_center">
        <el-button type="primary" @click="updateUser">保存</el-button>
      </div>
    </el-dialog>   
  </div>
</template>

<style lang="scss">
.user_warrper {
  .mbottom {
    margin-bottom: 60px;
  }
  .el-table thead th {
    background-color: #6f7f97 ;
    color: #ffffff;
  }
  .el-checkbox {
    margin: 0;
  }


  .t_center {
    text-align: center;
  }
  .btnBox {
    margin-bottom: 30px;
  }

  .left {
    width: 47%;
    margin-right: 6%;
    float: left;
  }
  .right {
    width: 47%;
    float: left;
  }
  .formBox {
    overflow: hidden;
    margin-bottom: 20px;
    .formList {
      .listHeader {
        padding: 1px;
        width: 100%;
        font-size: 14px;
        color: #fff;
        font-family: "å¾®è½¯é›…é»‘";
        font-weight: normal;
        background: #0096ff;
        text-align: center;
        line-height: 32px;
        height: 32px;
      }
      .listBody {
        height: 350px;
        overflow: auto;
        padding: 10px 0; 
        border: 1px solid #ddd;
        border-top: none; 
        .listItem {
          width: 100%;
          line-height: 40px;
          padding-left: 15px;
        }
        .listItem:hover {
          background: #f2f4f5;
        }
      }
    }
  }
  
}
   
</style>

<script>

export default {
  name: "userManager",
  components: {
    
  },
  data() {
    return {
      listQuery:{
        mc: '',
      },
      addUserView: false,
      editUserView: false,
      userform: {},
      userTable: [],  
      roleList: ['管理员','普通教师'],
      residualUserList: [],
      selectUser:[],
      selectRole:[],  
      currentUser: {},
      selectTip1: false,
      selectTip2: false,
      selectTip3: false,
      selectAll1: false,
      selectAll2: false,
      selectAll3: false,
    }
  },  
  created() {
    this.init()
  },
  computed: {
   
  },
  directives: {

  },
  filters: {
    rolefilter([item,roleList]) {
      let arr = []
      for(let i = 0; i < item.role.length; i++) {
        arr.push(roleList[item.role[i]])
      }
      let arrString = arr.join('、')
      return arrString
    },
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.userTable = [{
        obj: {
          mc: '校管理员',
          val: 'admin',
        },
        role: [0,1],
      },{
        obj: {
          mc: '迪丽热巴',
          val: 'dil',
        },
        role: [1],
      },{
        obj: {
          mc: '贾青',
          val: 'jiaq',
        },
        role: [1],
      }]

      this.residualUserList = [{
        mc: '迪丽热巴',
        val: 'dil',
      },{
        mc: '贾青',
        val: '',
      },{
        mc: '刘涛',
        val: 'liut',
      }]
    },
    showAddUser() {
      // 数据初始化
      this.selectUser=[]
      this.selectRole=[]  
      this.selectTip1 = false
      this.selectTip2 = false
      this.selectAll1 = false
      this.selectAll2 = false

      this.addUserView = true
    },
    showEditUser(index, item) {
      this.currentUser = JSON.parse(JSON.stringify(item))

      if(this.currentUser.role.length == this.roleList.length) {
        this.selectAll3 = true
      }else {
        if(this.currentUser.role.length == 0) {
          this.selectTip3 = false
        }else {
          this.selectTip3 = true
        }
        this.selectAll3 = false
      }

      this.editUserView = true
    },
    userDelete() {
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
    batchDeleteUser() {

      let data = this.multipleSelection
      console.log(data)
      if(!data || data.length == 0) {
        this.$notify({
            title: '提示',
            message: '请选择至少一条数据',
            type: 'info',
            duration: 2000
        });
      }else {
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
      }
      
      
    },
    addUser() {

    },
    updateUser() {

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val)
    },

    selectAllChange1(val) {
      if(val) {
        this.selectUser = this.residualUserList
      }else {
        this.selectUser = []
      }
      this.selectTip1 = false
      console.log(val)
    },
    selectAllChange2(val) {
      if(val) {
        let arr = []
        for(let i = 0; i < this.roleList.length; i++) {
          arr.push(i)
        }
        this.selectRole = arr
      }else {
        this.selectRole = []
      }
      this.selectTip2 = false
      console.log(val)
    },
    selectAllChange3(val) {
      if(val) {
        let arr = []
        for(let i = 0; i < this.roleList.length; i++) {
          arr.push(i)
        }
        this.currentUser.role = arr
      }else {
        this.currentUser.role = []
      }
      this.selectTip3 = false
      console.log(val)
    },

    userSelectChange1(val) { 
      if(this.selectUser.length == this.residualUserList.length) {
        this.selectAll1 = true
        this.selectTip1 = false
      }else {
        if(this.selectUser.length == 0) {
          this.selectTip1 = false
        }else {
          this.selectTip1 = true
        }
        this.selectAll1 = false
      }
    },
    userSelectChange2(val) {
      if(this.selectRole.length == this.roleList.length) {
        this.selectAll2 = true
        this.selectTip2 = false
      }else {
        if(this.selectRole.length == 0) {
          this.selectTip2 = false
        }else {
          this.selectTip2 = true
        }
        this.selectAll2 = false
      }
    },
    userSelectChange3(val) {
      if(this.currentUser.role.length == this.roleList.length) {
        this.selectAll3 = true
        this.selectTip3 = false
      }else {
        if(this.currentUser.role.length == 0) {
          this.selectTip3 = false
        }else {
          this.selectTip3 = true
        }
        this.selectAll3 = false
      }
    },
  }
};
</script>


