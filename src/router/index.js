import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router);

/* layout */
import Layout from '../views/layout/Layout';

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/

export const constantRouterMap = [{
  path: '/login',
  component: _import('login/index'),
  hidden: true
},
{
  path: '/authredirect',
  component: _import('login/authredirect'),
  hidden: true
},
{
  path: '/404',
  component: _import('error/404'),
  hidden: true
},
{
  path: '/401',
  component: _import('error/401'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  name: '首页',
  hidden: true,
  children: [{
    path: 'dashboard',
    component: _import('dashboard/index')
  },
  {
    path: 'example',
    component: _import('staticpages/index')
  },
  {
    path: 'searchdemo',
    component: _import('staticpages/searchdemo')
  }
  ]
},
{
  path: '/introduction',
  component: Layout,
  redirect: '/introduction/index',
  icon: 'form',
  noDropdown: true,
  children: [{
    path: 'index',
    component: _import('introduction/index'),
    name: '简述'
  }]
}, {
  path: '/audit',
  component: Layout,
  name: '审批管理',
  icon: 'setting',
  children: [{
    path: 'auditTemplate',
    icon: 'fa-user',
    component: _import('audit/approvalprocess/audittemplate'),
    name: '创建新审批'
  },
  {
    path: 'selectForm',
    icon: 'fa-user',
    component: _import('audit/approvalprocess/selectform'),
    name: '选择表单'
  }, {
    path: 'szspbz',
    icon: 'fa-user',
    component: _import('audit/approvalprocess/szspbz'),
    name: '设置流程步骤'
  },
  {
    path: 'addkcxxManager',
    icon: 'category',
    component: _import('xkxt/kcxxManager/addkcxx'),
    name: '课程增加',
    authority: 'addkcxxManager'
  }
]
},{
    path: '/process',
    component: Layout,
    name: '审批申请',
    icon: 'setting',
    children: [{
      path: 'index',
      icon: 'fa-user',
      component: _import('audit/mobile/spindex'),
      name: '审批首页'
    },{
      path: 'apply',
      icon: 'fa-user',
      component: _import('audit/mobile/spsq'),
      name: '创建新审批'
    },{
      path: 'info',
      icon: 'fa-user',
      component: _import('audit/mobile/spslmx'),
      name: '审批详情'
    }]
  }, {
    path: '/pkxt', //排课管理跳转页面设置
    component: Layout,
    name: '排课管理',
    icon: 'setting',
    children: [{
      path: 'pksz',
      icon: 'fa-user',
      component: _import('pkxt/arrangingTask/pksz'),
      name: '排课设置'
    }]
  }
]

export default new Router({
  mode: 'hash',  //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});


export const asyncRouterMap = [{
  path: '/baseManager',
  component: Layout,
  name: '基础配置管理',
  icon: 'setting',
  authority: 'baseManager',
  children: [{
    path: 'userManager',
    icon: 'fa-user',
    component: _import('admin/user/index'),
    name: '用户管理',
    authority: 'userManager'
  }, {
    path: 'menuManager',
    icon: 'category',
    component: _import('admin/menu/index'),
    name: '菜单管理',
    authority: 'menuManager'
  }, {
    path: 'groupManager',
    icon: 'group_fill',
    component: _import('admin/group/index'),
    name: '角色权限管理',
    authority: 'groupManager'
  }, {
    path: 'groupTypeManager',
    icon: 'fa-users',
    component: _import('admin/groupType/index'),
    name: '角色类型管理',
    authority: 'groupTypeManager'
  }, {
    path: 'gateLogManager',
    icon: 'viewlist',
    component: _import('admin/gateLog/index'),
    name: '操作日志管理',
    authority: 'gateLogManager'
  }, {
    path: 'campus',
    icon: 'viewlist',
    component: _import('admin/campus/index'),
    name: '校区管理',
    authority: 'campus'
  }, {
    path: 'teachManager',
    icon: 'category',
    component: _import('admin/teach/index'),
    name: '教师管理',
    authority: 'teachManager'
  }, {
    path: 'stuManager',
    icon: 'category',
    component: _import('admin/student/index'),
    name: '学生维护',
    authority: 'stuManager'
  }, {
    path: 'termManager',
    icon: 'category',
    component: _import('admin/term/index'),
    name: '学期维护',
    authority: 'termManager'
  }, {
    path: 'acadyearManager',
    icon: 'category',
    component: _import('admin/acadyear/index'),
    name: '学年维护',
    authority: 'acadyearManager'
  }, {
    path: 'gradeManager',
    icon: 'category',
    component: _import('admin/grade/index'),
    name: '年级维护',
    authority: 'gradeManager'
  }, {
    path: 'placeManager',
    icon: 'category',
    component: _import('admin/place/index'),
    name: '场地维护',
    authority: 'placeManager'
  }, {
    path: 'courseManager',
    icon: 'category',
    component: _import('admin/course/index'),
    name: '课程维护',
    authority: 'courseManager'
  }, {
    path: 'teachclassManager',
    icon: 'category',
    component: _import('admin/teachclass/index'),
    name: '教师任课设置',
    authority: 'teachclassManager'
  }, {
    path: 'classManager',
    icon: 'category',
    component: _import('admin/class/index'),
    name: '班级维护',
    authority: 'classManager'
  }, {
    path: 'specialTypeManager',
    icon: 'category',
    component: _import('admin/specialType/index'),
    name: '特长生类型',
    authority: 'specialTypeManager'
  }, {
    path: 'specialRaw',
    icon: 'category',
    component: _import('xkxt/specialRaw/index'),
    name: '特长生维护',
    authority: 'specialRaw'
  },{
    path: 'courseTypeManager',
    icon: 'category',
    component: _import('xkxt/courseTypeManager/index'),
    name: '课程类别维护',
    authority: 'courseTypeManager'
  }, {
    path: 'stuPreallocationManager',
    icon: 'category',
    component: _import('xkxt/stuPreallocation/index'),
    name: '学生预分配',
    authority: 'stuPreallocationManager'
  },
  {
    path: 'kcxxManager',
    icon: 'category',
    component: _import('xkxt/kcxxManager/index'),
    name: '课程开设',
    authority: 'kcxxManager'
  }

]
}, {
  path: '/authManager',
  component: Layout,
  name: '服务管理',
  icon: 'setting',
  authority: 'authManager',
  children: [{
    path: 'serviceManager',
    component: _import('auth/service/index'),
    name: '服务权限管理',
    authority: 'serviceManager'
  }]
}, {
  path: '/monitorManager',
  component: Layout,
  name: '监控模块管理',
  icon: 'setting',
  authority: 'monitorManager',
  children: [{
    path: 'serviceEurekaManager',
    component: _import('monitor/eureka/index'),
    name: 'Eureka注册中心',
    authority: 'serviceEurekaManager'
  }, {
    path: 'serviceMonitorManager',
    component: _import('monitor/service/index'),
    name: '服务状态监控',
    authority: 'serviceMonitorManager'
  }, {
    path: 'serviceZipkinManager',
    component: _import('monitor/zipkin/index'),
    name: '服务链路监控',
    authority: 'serviceZipkinManager'
  }]
}, {
  path: '/projectManager',
  component: Layout,
  name: '学分管理',
  icon: 'setting',
  authority: 'projectManager',
  children: [{
    path: 'mainProject',
    component: _import('project/mainProject/index'),
    name: '主项目',
    authority: 'mainProject'
  },
  {
    path: 'sonProject',
    component: _import('project/sonProject/index'),
    name: '子项目',
    authority: 'mainProject'
  }, {
    path: 'projectDetail',
    component: _import('project/projectDetail/index'),
    name: '项目详情',
    authority: 'mainProject'
  }, {
    path: 'scoreTable',
    component: _import('project/scoretable/index'),
    name: '在线导入',
    authority: 'mainProject'  // 假数据-----该删除
  }]
}, {
  path: '/auditManager',
  component: Layout,
  name: '审批管理',
  icon: 'setting',
  authority: 'auditManager',
  children: [{
    path: 'holidayManager',
    icon: 'fa-user',
    component: _import('audit/holidaymanager/index'),
    name: '假期管理',
    authority: 'holidayManager'
  }, {
    path: 'approvalProcess',
    icon: 'fa-user',
    component: _import('audit/approvalprocess/index'),
    name: '审批流程',
    authority: 'approvalProcess'
  }, {
    path: 'auditTemplate',
    icon: 'fa-user',
    component: _import('audit/approvalprocess/audittemplate'),
    name: '创建新审批',
    authority: 'approvalProcess'
  },
  {
    path: 'selectForm',
    icon: 'fa-user',
    component: _import('audit/approvalprocess/selectform'),
    name: '选择表单',
    authority: 'approvalProcess'
  },{
      path: 'splscx',
      icon: 'fa-user',
      component: _import('audit/approvalprocess/spcx'),
      name: '选择表单',
      authority: 'splscx'
    }]
}, {
  path: '/xkxtManager',
  component: Layout,
  name: '选课系统',
  icon: 'setting',
  authority: 'xkxtManager',
  children: [{
    path: 'xkrw',
    icon: 'fa-user',
    component: _import('xkxt/xkrwmanager/index'),
    name: '选课任务',
    authority: 'xkxtManager'
  }, {
    path: 'xkjgmanager',
    icon: 'fa-user',
    component: _import('xkxt/xkjgmanager/index'),
    name: '选课结果查询',
    authority: 'xkjgmanager'
  }, {
    path: 'xkjgtzmanager',
    icon: 'fa-user',
    component: _import('xkxt/xkjgtzmanager/index'),
    name: '选课结果调整',
    authority: 'xkjgtzmanager'
  },{
    path: 'xkjgmanager',
    icon: 'fa-user',
    component: _import('audit/approvalprocess/index'),
    name: '审批流程',
    authority: 'xkjgmanager'
  }, {
    path: 'auditTemplate',
    icon: 'fa-user',
    component: _import('audit/approvalprocess/audittemplate'),
    name: '创建新审批',
    authority: 'approvalProcess'
  },
  {
    path: 'selectForm',
    icon: 'fa-user',
    component: _import('audit/approvalprocess/selectform'),
    name: '选择表单',
    authority: 'approvalProcess'
  }]
},{
  path: '/scoreMonitor', // --------------- 学分监控 ------------------
  component: Layout,
  name: '学分监控',
  icon: 'setting',
  authority: 'scoreMonitor',
  children: [{
    path: 'schoolScore',
    component: _import('project/scoreMonitor/schoolScore/index'),
    name: '全校学分监控',
    authority: 'scoreMonitor',
  },{
    path: 'njScore',
    component: _import('project/scoreMonitor/njScore/index'),
    name: '年级学分监控',
    authority: 'scoreMonitor',
  },{
    path: 'bjScore',
    component: _import('project/scoreMonitor/bjScore/index'),
    name: '班级学分监控',
    authority: 'scoreMonitor',
  },{
    path: 'xsScore',
    component: _import('project/scoreMonitor/xsScore/index'),
    name: '学生学分监控',
    authority: 'scoreMonitor'
  }],
},{
  path: '/arrangingManager', // ---------------排课管理 ------------------
  component: Layout,
  name: '排课管理',
  icon: 'category',
  authority: 'arrangingManager',
  children: [{
    path: 'arrangingTask',
    component: _import('pkxt/arrangingTask/index'),
    name: '排课任务',
    authority: 'arrangingTask',
  }],
}];

// export const asyncRouterMap = [{
//   path: '/',
//   component: Layout,
//   name: '',
//   icon: '',
//   authority: 'test'
// }];
