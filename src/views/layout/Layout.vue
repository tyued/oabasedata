<template>
	<el-container style=" height:100%;">
		<el-header style=" height:100px; background:#1f2d3d;">
			<Headerbar></Headerbar>
		</el-header>
		<el-container class='app-wrapper' :class="{hideSidebar:!sidebar.opened}">
			<sidebar class="sidebar-container"></sidebar>
			<el-main>
				<div class="main-container">
					<navbar></navbar>
					<app-main></app-main>
				</div>
			</el-main>
		</el-container>
</el-container>

	<!--<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
		<sidebar class="sidebar-container"></sidebar>
		<div class="main-container">
			<navbar></navbar>
			<app-main></app-main>
		</div>
	</div>-->
</template>

<script>
  import { Navbar, Sidebar, AppMain ,Headerbar } from 'views/layout';

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
			Headerbar
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";
	.app-wrapper {
		@include clearfix;
		position: relative;
		&.hideSidebar {
			.sidebar-container{
				width:36px;
				overflow: inherit;
			}
			.main-container {
				margin-left: 36px;
			}
		}
		.sidebar-container {
			transition: width 0.28s ease-out;
			width: 210px;
			height: 100%;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			z-index: 1001;
			overflow-y: auto;
			background:#324157;
 			&::-webkit-scrollbar {display:none}
		}
		.main-container {
			flex: 1;
			flex-basis: auto;
			min-height: 100%;
			transition: margin-left 0.28s ease-out;
			margin-left: 210px;
		}
		.el-main{
			padding:0;
		}
	}

</style>

