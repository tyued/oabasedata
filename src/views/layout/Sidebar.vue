<template>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse">

      <!--
      <el-submenu index="1">
        <template slot="title">
          <icon-svg icon-class="setting"></icon-svg>
          <span>审批管理</span>
        </template>

        <router-link to="/audit/approvalProcess">
          <el-menu-item index="1-1">
            <icon-svg icon-class="category"></icon-svg>
            <span>审批流程</span>
          </el-menu-item>
        </router-link>

        <router-link to="/audit/holidayManager">
          <el-menu-item index="1-3">
            <icon-svg icon-class="category"></icon-svg>
            <span>假期管理</span>
          </el-menu-item>
        </router-link>
      </el-submenu>
      -->

      <sidebar-item :routes='permissionMenus'></sidebar-item>
    </el-menu>
</template>


<script>
  import { mapGetters } from 'vuex';
  import SidebarItem from './SidebarItem';
  export default {
    components: { SidebarItem },
    mounted() {
    // console.log(this.$route);
    // console.log(this.$route.path);

    // console.log(this.sidebar)
    //  console.log(this.permissionMenus);
    },

    computed: {
      ...mapGetters([
        'sidebar',
        'permissionMenus'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
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
