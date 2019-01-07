<template>
  <div class="groupAuthority">
    <el-row>
        <div style="width:200px;">
          <el-input class="groupAuthorityelinput" placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
        </div>
    </el-row>
    <el-row>
      <el-col :span="12" style='margin-top:15px;'>
        <el-card class="box-card">
          <el-menu :default-active="defaultVal"
                   ref="elmenugroupauth"
                   background-color="#ffffff"
                   text-color="#303133"
                   class="el-menu-vertical-demo"
                   @select="handleEvent">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">PC端权限设置</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">钉钉端权限设置</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-menu"></i>
              <span slot="title">微信端权限设置</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-menu"></i>
              <span slot="title">数据权限分配</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="12" style='margin-top:15px;'>
        <el-tree class="filter-tree" style="height:500px; overflow:auto"
                 :node-key="getTreeNodeKey" :data="treeData"
                 show-checkbox node-key="id"
                 accordion
                 highlight-current
                 :props="defaultProps" :filter-node-method="filterNode" ref="menuTree"
                 @node-click="getNodeData"
                 :default-expanded-keys='[]'>
        </el-tree>
      </el-col>
      <!-- <el-col :span="16" style='margin-top:15px;'>
          <el-table ref="elementTable" :data="list" border fit highlight-current-row @select="handleSelectionChange" style="width: 100%">
            <el-table-column v-if="groupManager_element" type="selection" width="55"> </el-table-column>
            <el-table-column width="200px" align="center" label="资源编码">
                <template slot-scope="scope">
                    <span>{{scope.row.code}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="资源类型">
                <template slot-scope="scope">
                    <span>{{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="资源名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="资源地址">
                <template slot-scope="scope">
                    <span>{{scope.row.uri}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="资源请求类型">
                <template slot-scope="scope">
                    <span>{{scope.row.method}}</span>
                </template>
            </el-table-column>
          </el-table>
      </el-col> -->
    </el-row>
    <el-row>
      <el-button style="float:right;margin-right:50px;margin-top:20px;" type="primary" v-if="groupManager_menu"
                 @click="isHidden">取消
      </el-button>
      <el-button style="float:right;margin-right:50px;margin-top:20px;" type="primary" v-if="groupManager_menu"
                 @click="update">保存
      </el-button>
    </el-row>

  </div>
</template>
<script>
  import {fetchTree, fetchddTree, fetchwxTree} from 'api/admin/menu/index';
  import {page} from 'api/admin/element/index';
  import {
    removeElementAuthority,
    addElementAuthority,
    getElementAuthority,
    modifyMenuAuthority,
    modifyWXMenuAuthority,
    getMobileWXMenuAuthority,
    modifySJMenuAuthority,
    getMobileDDMenuAuthority,
    getMobileSJMenuAuthority,
    modifyDDMenuAuthority,
    getMenuAuthority
  } from 'api/admin/group/index';
  import {
    getdqxn,
  } from 'api/admin/grade/index';
  import {
    getBjTree,
  } from 'api/admin/student/index';

  import {mapGetters} from 'vuex';

  export default {
    name: 'groupAuthority',
    props: {
      groupId: {
        default: '1'
      },
      xxdm: {},
      userid: {},
      dialogAuthorityVisible: false,
    },
    data() {
      return {
        temArr: [] , // 请求传参
        isHandle: '',
        dqxnoptions: '',
        defaultVal: '1',
        filterText: '',
        list: null,
        total: null,
        listQuery: {
          name: undefined,
          userid: this.userid
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        groupManager_menu: true,
        groupManager_element: true
      };
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val);
      },
      dialogAuthorityVisible(val) {
        this.$nextTick(() => {
          this.$refs.elmenugroupauth.activeIndex = this.isHandle = '1';
          this.getList();
        })
      }
    },
    computed: {},
    mounted() {
      this.isHandle = '1';
    },
    created() {
      this.getList();
    },
    computed: {
      ...mapGetters(['elements'])
    },
    methods: {
      isHidden(){
        this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()
      },
      getCurrentXN(temArr){
        getdqxn({ xxdm: this.xxdm }).then(res => {
          this.dqxnoptions = res.data.xn;
          temArr.forEach((item, index) =>{
            item.xndm  = this.dqxnoptions
          })
          this.temArr = temArr
          modifySJMenuAuthority(this.temArr).then(() => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()
          });
        });
      },
      // menuEvent
      handleEvent(index, keyPath) {
        if (index == 1) {
          this.isHandle = '1'
          this.getList();
        } else if (index == 2) {
          this.isHandle = '2'
          this.treeData = []
          fetchddTree({id: this.userid}).then(data => {
            this.treeData = data;
            this.initMobileDDAuthoritys()
          });
        } else if (index == 3) {
          this.isHandle = '3'
          this.treeData = []
          fetchwxTree({id: this.userid}).then(data => {
            this.treeData = data;
            this.initMobileWXAuthoritys()
          });
        } else if (index == 4) {
          this.isHandle = '4'
          this.treeData = []
          getBjTree(this.xxdm)
            .then(response => {
              this.treeData = this.handleTree(response, 1)
              this.initMobileSJAuthoritys()
            })
        }
      },
      handleTree(arr, fl){
        arr.forEach(item =>{

          if(fl){
            delete item.id;
            item.id = item.bjdm;
            if(item.hasOwnProperty('name')){
              item.title = item.name;
              item.label = item.name;
            }
          }else{
            if(item.hasOwnProperty('name')){
              item.title = item.name;
            }
          }
          if(item.hasOwnProperty('children')){
            this.handleTree(item.children, fl)
          }
        })
        return arr;
      },
      getList() {
        fetchTree(this.listQuery).then(data => {
          this.treeData = data;
          this.initAuthoritys();
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getNodeData(data) {
        this.listQuery.menuId = data.id;
        page(this.listQuery).then(response => {
          this.list = response.data.rows;
          getElementAuthority(this.groupId).then(data => {
            const obj = {};
            for (let i = 0; i < this.list.length; i++) {
              obj[this.list[i].id] = this.list[i];
            }
            const toggle = {};
            for (let i = 0; i < data.data.length; i++) {
              const id = data.data[i];
              if (obj[id] !== undefined && toggle[id] === undefined) {
                this.$refs.elementTable.toggleRowSelection(obj[data.data[i]]);
                toggle[id] = true;
              }
            }
          });
        });
        this.currentId = data.id;
        this.showElement = true;
      },
      getTreeNodeKey(node) {
        return node.id;
      },
      handleSelectionChange(val, row) {
        let flag = true;
        for (let i = 0; i < val.length; i++) {
          if (val[i].id === row.id) {
            addElementAuthority(this.groupId, {
              menuId: this.currentId,
              elementId: row.id
            });
            flag = false;
            break;
          }
        }
        if (flag) {
          removeElementAuthority(this.groupId, {
            menuId: this.currentId,
            elementId: row.id
          });
        }
      },

      update() {
        let self = this;
        const nodes = this.$refs.menuTree.getCheckedNodes();
        const ids = [];
        for (let i = 0; i < nodes.length; i++) {
          ids.push(nodes[i].id);
        }
        if (this.isHandle == 1) {
          modifyMenuAuthority(this.groupId, {
            menuTrees: ids.join(),
            xxdm: this.xxdm
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()
          });
        } else if (this.isHandle == 2) {
          modifyDDMenuAuthority(this.groupId, {
            menuTrees: ids.join(),
            xxdm: this.xxdm
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()
          });
        } else if (this.isHandle == 3) {
          modifyWXMenuAuthority(this.groupId, {
            menuTrees: ids.join(),
            xxdm: this.xxdm
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()
          });
        } else if (this.isHandle == 4) {
          let temArr = [];
          ids.forEach((item, index) => {
            let obj = {};
            obj.bjid = item;
            obj.jsid = this.groupId;
            obj.xxdm  = this.xxdm
            if(item != undefined){
              temArr.push(obj)
            }
          });
          this.getCurrentXN(temArr)
        }
      },
      initAuthoritys() {
        getMenuAuthority(this.groupId).then(data => {
          const result = [];
          for (let i = 0; i < data.data.length; i++) {
            result.push(data.data[i].id);
          }
          this.$refs.menuTree.setCheckedKeys(result);
        });
      },

      initMobileWXAuthoritys() {
        getMobileWXMenuAuthority(this.groupId).then(data => {
          const result = [];
          for (let i = 0; i < data.data.length; i++) {
            result.push(data.data[i].id);
          }
          this.$refs.menuTree.setCheckedKeys(result);
        });
      },

      initMobileSJAuthoritys() {
        getMobileSJMenuAuthority(this.groupId).then(data => {
          const result = [];
          const tempArr = data
          for (let i = 0; i < tempArr.length; i++) {
            result.push(tempArr[i].bjid);
          }
          this.$refs.menuTree.setCheckedKeys(result);
        });
      },

      initMobileDDAuthoritys() {
        getMobileDDMenuAuthority(this.groupId).then(data => {
          const result = [];
          for (let i = 0; i < data.data.length; i++) {
            result.push(data.data[i].id);
          }
          this.$refs.menuTree.setCheckedKeys(result);
        });
      }
    }
  };
</script>
<style scope>
  .groupAuthority .el-menu-item * {
    color: #303133 !important;
  }

  .groupAuthority .el-menu-item.is-active {
    color: #409EFF !important;
    background-color: #d9d9d9 !important;
  }

  .groupAuthorityelinput .el-input__inner {
    height: 56px;
    line-height: 56px;
  }

  .groupAuthority .box-card {
    position: absolute;
    left: 0;
    right: 50%;
    bottom: 0;
    top: 15px;
  }

  .groupAuthority .box-card .el-card__body {
    padding: 0;
  }

  .el-menu {
    border: none;
  }
</style>
