<template>
	<div class='menu-wrapper'>

	<template v-for="item in routes">

		<el-submenu :index="item.title"  v-if='item.children&&item.children.length>0'>
			<template slot="title">
				<icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg>
				<span>{{item.title}}</span>				
			</template>
			<template v-for="child in item.children">
		
				<sidebar-item class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>
				<router-link v-else :to="'/'+item.code+'/'+child.code">
					<el-menu-item :index="item.code+'/'+child.code">
						<icon-svg v-if='child.icon' :icon-class="child.icon"></icon-svg>
						<span>{{child.title}}</span>
					</el-menu-item>
				</router-link>
			</template>
		</el-submenu>
		<router-link v-else :to="'/'+sidebarcurMenu+'/'+item.code">
			<el-menu-item :index="item.title">
				<icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg>
				<span>{{item.title}}</span>
			</el-menu-item>
		</router-link>

	</template>

	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        // type: Array
      }
    },
		data(){
        return{
        }
    },
		computed: {     
			...mapGetters([
					'sidebar',
					'sidebarcurMenu',
			]),
    },
		mounted() {
    },
		watch:{
			sidebar(){
			},
			routes(){
			},
			sidebarcurMenu(){
				console.log(this.sidebarcurMenu)
			}
		}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

