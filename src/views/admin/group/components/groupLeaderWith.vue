<template>
    <el-container style="height:500px">
        <el-header>
            <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery.name"  style="width: 400px;" ></el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
        </el-header>
        <el-main>
            <div v-if="list.length == 0">
              <span style="font-size:2rem; color: #707070;">请先点击自选教师添加教师！</span>
            </div>
            <el-form :model="form" ref="form" label-width="110px" style="height:300px;">
                <el-checkbox-group v-model="members" size="small">
                    <el-checkbox v-for="item in list" :key="item.id" :label="item.id" border>{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form>
            <div class="dialog-footer" style="float:right;">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button type="primary" @click="create('form')">确 定</el-button>
            </div>
        </el-main>
        <!--<el-footer>-->
            <!--<el-pagination small layout="prev, pager, next"  @current-change="handleCurrentChange" :total="total" :current-page.sync="listQuery.page" :page-size="listQuery.limit"></el-pagination>-->
        <!--</el-footer>-->
    </el-container>
</template>

<script>
import {
    userAllpage
} from 'api/admin/user/index'
import {
  getUsers,
  modifyLeaders,
  modifyUsers
} from 'api/admin/group/index';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      xxdm: '',
      listQuery: {
        page: 1,
        limit: 20,
        type: 3,
        name: undefined
      },
      list: null,
      total: null,

      form: {},
      members: [],
      allremmber: []
    }
  },
  props: {
    groupId: {
      default: '1'
    },
    seltype: {                       // 角色/部门

    },
    alreadyMem: {                    // 已经关联的用户

    }
  },
  computed: {
    ...mapGetters([
      'get_dynamicTagschange'
    ])
  },
  created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.allremmber = this.$store.getters.get_dynamicTagschange

    this.getList();

    for (let i = 0; i < this.alreadyMem.length; i++) {
      this.members[i] = this.alreadyMem[i].id;
    }
  },
  watch: {
    alreadyMem() {
      this.members = [];
      for (let i = 0; i < this.alreadyMem.length; i++) {
        this.members[i] = this.alreadyMem[i].id;
      }
    },
    get_dynamicTagschange() {
      this.allremmber = this.$store.getters.get_dynamicTagschange
      this.getList();
    }
  },
  methods: {
    getList() {
      this.listQuery.xxdm = this.xxdm;
      this.list = this.allremmber
            // if(this.seltype==1){
            //     userAllpage(this.listQuery).then(response => {
            //
            //         this.list = response.data.rows;
            //         this.total = response.data.total;
            //     })
            // }
    },
        // 搜索
    handleFilter() {
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
        // 取消按钮
    cancel(formName) {
      this.$emit('closeUserWithLeaderDialog');
      this.$refs[formName].resetFields();
    },
        // 确定按钮
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.xxdm = this.xxdm;
          if (this.members.length > 0) this.form.leaders = this.members.join();
          modifyLeaders(this.groupId, this.form).then(() => {
            this.$emit('closeUserWithLeaderDialog');
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style scoped>
    .el-row{ margin-bottom: 20px;}
    .selUserBox{ width: 100%;}
    .el-form-item__content{ margin-left: 0;}
    .el-checkbox.is-bordered+.el-checkbox.is-bordered{ margin-left: 0; margin: 5px}
    .el-checkbox.is-bordered{ margin: 5px}
</style>
