<template>
    <div class="sidebar-container-view">
      <router-link :to="'/dashboard'" class="sider-index">
          <icon-svg icon-class="setting"></icon-svg>
          <span>首页</span>
      </router-link>
      <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse">
        <sidebar-item :routes='changepermissionMenus'></sidebar-item>
      </el-menu>
    </div>
</template>


<script>
  import { mapGetters } from 'vuex';
  import SidebarItem from './SidebarItem';
  export default {
    components: { SidebarItem },
    data(){
        return{
            changepermissionMenus:[],

        }
    },
    mounted() {
    },

    computed: {
      ...mapGetters([
        'sidebar',
        'sidebarcurMenuId',
        'sidebarcurMenu',
        'permissionMenus'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    created() {
        this.menuChange()
    },
    watch:{
      sidebar(){
        // console.log(this.sidebar)
      },
      sidebarcurMenuId(){
        this.menuChange()
      },
    },
    methods: {
      menuChange(){
        var that = this
        // if(this.sidebarcurMenu=='dashboard'){          //首页
        //   this.changepermissionMenus = []
        // }else{
          this.permissionMenus.forEach(function(item,index){
            if(item.id==that.sidebarcurMenuId){
              that.changepermissionMenus = item.children
              that.$store.dispatch('SetCurMenu',item.code)
            }
          })
        // }
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
    .sider-index{ 
      display:block;
      height: 56px; 
      line-height: 56px;
      padding: 0 20px;
      color:#fff;
    }
    .sider-index:focus,.sider-index:hover{
      background-color: #48576a;
      color:#fff;
    }
    .sidebar-container-view .el-menu{
			background:#324157;
    }
    .el-submenu .el-menu{
			background:#1f2d3d;
		}
    .el-menu{
			background:#eef1f6;
		}
    .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
      background-color: #48576a;
    }
    .el-submenu__title,.el-menu-item{
			color:#ffffff!important;
		}
    .el-menu-item:focus, .el-menu-item:hover{
      background:#48576a;
    }
    .router-link-active .el-menu-item{
      color:#20a0ff;
    }

</style>
