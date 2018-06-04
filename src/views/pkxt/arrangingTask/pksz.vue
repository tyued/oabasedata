<template>
  <div class="content-container">
    <el-col :span="24" class="toolbar">
    </el-col>
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">我的任务</el-breadcrumb-item>
        <el-breadcrumb-item>2017-2018年期中考试</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane>
        <span slot="label"><i class="iconfont icon-el-icon-shezhi"></i> 基础设置</span>
        <template style="margin-right:20px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="课程设置" name="first">用户管理</el-tab-pane>
              <el-tab-pane label="课时设置" name="second">配置管理</el-tab-pane>
              <el-tab-pane label="教师设置" name="third">
                  <!--调用教师设置页面-->
                   <page-jssz></page-jssz>
              </el-tab-pane>
            </el-tabs>
        </template>
      </el-tab-pane>

      <el-tab-pane>
        <span slot="label"><i class="iconfont icon-el-icon-guize"></i> 规则条件</span>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="课程设置" name="first">用户管理</el-tab-pane>
          <el-tab-pane label="课时设置" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="教师设置" name="third">角色管理</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane >
        <span slot="label"><i class="iconfont icon-yixiangfuwushang_huaban"></i> 自动排课</span>
           <div>自动排课。。。。。。。</div>
      </el-tab-pane>
      <el-tab-pane >
        <span slot="label"><i class="el-icon-refresh"></i> 排课调整</span>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="课程设置" name="first">用户管理</el-tab-pane>
          <el-tab-pane label="课时设置" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="教师设置" name="third">角色管理</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-document"></i> 查看排课</span>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="课程设置" name="first">用户管理</el-tab-pane>
          <el-tab-pane label="课时设置" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="教师设置" name="third">角色管理</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
  import pageJssz from '@/views/pkxt/arrangingTask/jcsz/jssz';
  export default {
    components: {
      pageJssz,
    },
    data() {
      return {
        activeName2: 'first'
      }
    },methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
