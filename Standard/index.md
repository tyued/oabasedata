## 项目主要目录结构
```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filtres                // 全局filter
│   ├── mock                   // mock数据
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── view                   // view
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
│   ├── jquery
│   └── Tinymce                // 富文本
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json
```

## 状态管理
后台只有user和app配置相关状态使用vuex存在全局，其它数据都由每个业务页面自己管理。


## router管理
一个应用项目建立相应的路由文件，统一 import 到router/index.js中
路由文件命名需和在view里的项目文件夹命名一致.并做好中文说明(例如:znpk--智能排考)

## views层目录结构
```shell
views
├── admin                            // 基础数据模块
│   ├── acadyear                     // 学年维护
│   ├── campus                       // 校区管理
│   ├── class                        // 班级维护
│   ├── course                       // 课程维护
│   ├── gataLog                      // 操作日志管理
│   ├── grade                        // 年级维护
│   ├── group                        // 角色权限管理
│   ├── groupType                    // 角色类型管理
│   ├── major                        // 专业维护
│   ├── menu                         // 菜单管理
│   ├── place                        // 场地维护
│   ├── school                       // 学校维护
│   ├── specialstu                   // (暂不知道是否还有必要留着)
│   ├── specialType                  // 特长生类型
│   ├── student                      // 学生维护
│   ├── teach                        // 教师管理
│   ├── teachclass                   // 教师任课设置
│   ├── teachergroup                 // 教师组维护
│   ├── term                         // 学期维护
│   ├── unit                         // (暂不知道是否还有必要留着)
│   ├── user                         // 用户管理
│   └── index.vue                    
├── audit                            // 审批管理 (应用)
│   ├── approvalprocess              // 审批流程
│   │   ├── index                    // 审批流程首页
│   │   ├── audittemplate            // 创建新审批
│   │   ├── selectform               // 选择表单
│   │   ├── spcx                     // 审批历史
│   │   ├── szspbz                   // 设置审批流程步骤
│   │   └── ChooseMember             // 选择成员 (组件)
│   ├── holidaymanager               // 假期管理 (审批管理首页)
│   └── mobile                       // 审批申请
│       ├── spindex                  // 审批申请首页
│       ├── spsq                     // 创建新审批
│       └── spslmx                   // 审批详情
├── auth                             // 服务管理
│   └── service                      // 服务权限管理
├── charts                           // 基于Echarts的图表 (开源框架原有的,可以考虑删除)
├── components                       // 公告组件库 (目前里面全是开源框架带的,不用的组件可以删除)
├── dashboard                        // 整个平台的首页
├── dkgl                             // (空页面建议删除)
├── errorlog                         // 异常捕获页面 (目前不知是否有用)
├── error                            // 404 401页面出错后,跳转页面
├── introduction                     // 简述? (空页面建议删除)
├── ksgl                             // 考试管理 (应用)    
│   ├── kslx                         // 考试类型
│   └── kswh                         // 考试维护
│       ├── ksfxwh                   // 科目分项设置 (组件)
│       ├── kssz                     // 考试选班设置 (组件)
│       ├── kstj                     // 人数统计 (组件)
│       ├── index                    // 考试维护
│       └── top                      // 考试设置
├── layout                           // 整系统的整体框架结构：如顶部,左边栏,面包屑,主体内容等
├── login                            // 登录模块,可扩展比如第三方登录等
├── main                             // 平台登录后的首页
├── maintenance                      // 学籍管理 (应用) 
│   └── graduateEnquiries            // 毕业生查询
├── monitor                          // 监控模块 (空页面建议删除)
├── newstudent                       // 新生管理 (应用)
│   ├── autogroup                    // 自动分班页面
│   ├── groupconfirm                 // 分班确认
│   ├── grouphistory                 // 分班记录
│   ├── groupresult                  // 分班结果
│   └── innewstudent                 // 新生信息录入
├── oasysys                          // OA系统演示页面 
├── permission                       // 切换权限 (目前不清楚是什么功能,是否可以删除)
├── pkxt                             // 排课系统 (应用)
│   └── arrangingTask                // 排课任务
│      ├── ckkb                      // 查看课表 (组件)
│      ├── gztj                      // 规则条件 (组件)
│      ├── jcsz                      // 基础设置 (组件)
│      ├── pktz                      // 排课调整 (组件)
│      ├── zdpk                      // 自动排课 (组件)
│      ├── index.vue                 // 排课首页
│      └── pksz.vue                  // 排课设置
├── project                          // 学分管理系统
├── qiniu                            // 七牛文件上传 (可以删除)
├── readgrade                        // 阅读考级项目 (应用)   
│   ├── examCount                    // 考试统计
│   │   ├── bj                       // 班级
│   │   ├── nj                       // 年级
│   │   └── student                  // 学生
│   ├── publicLibManager             // 公共库管理
│   │   ├── bookTitleCheck           // 书目题目审核
│   │   ├── bookTitleManager         // 书目题目管理
│   │   ├── PageBar                  // 页面栏目 (组件)
│   │   ├── questionCheck            // 题目审核
│   │   └── questionManagement       // 题目管理 
│   ├── readCount                    // 阅读成果统计
│   │   ├── bj                       // 班级
│   │   ├── nj                       // 年级
│   │   └── student                  // 学生
│   ├── testManager                  // 考试管理
│   │   ├── bookManager              // 书目管理
│   │   │   └── intoBook             // 书目导入
│   │   │       └── textBook         // 查看题目
│   │   ├── paperSetting             // 试卷规范设置   
│   │   │   ├── echart               // 试卷规范设置-图表管理
│   │   │   └── paperTable           // 试卷规范设置-表格管理
│   │   └── questionManager          // 题库管理       
│   └── webSetting                   // 网站设置
│       ├── growthValueSet           // 成长值系统设置
│       ├── roleManager              // (目前不知是否有用)
│       ├── systemSet                // 系统设置
│       └── userManager              // (目前不知是否有用)
├── staticpages                      // 测试静态页面供开发调试用 (可以删除)
├── tdk                              // 调代课 (应用) 
│   ├── dkkb                         // 我的课表
│   ├── dktj                         // 代课统计
│   ├── dkwh                         // 代课维护
│   └── tkwh                         // 调课维护
├── theme                            // 系统皮肤设置 (可以删除)
├── xkxt                             // 选课系统 (应用)   
│   ├── courseTypeManager            // 课程类别维护
│   ├── kcxxManager                  // 课程管理
│   │   ├── addkcxx                  // 课程增加
│   │   ├── ckkcxx                   // 课程查看
│   │   ├── index                    // 课程管理首页
│   │   └── updatekcxx               // 课程修改
│   ├── specialRaw                   // 特长生维护
│   ├── stuPreallocation             // 学生预分配
│   ├── xkjgmanager                  // 选课结果管理        
│   ├── xkjgtzmanager                // 选课结果调整
│   └── xkrwmanager                  // 选课任务
│       ├── ckgzsz                   // 查看规则设置
│       ├── ckxkrw                   // 查看选课任务
│       └── xkgzsz                   // 选课规则设置
├── xxaf                             // 校园安防 (应用) 
│   ├── aqsb                         // 校园安防上报设置
│   └── jgcx                         // 结果查询
└── znpk                             // 智能排考 (应用) 
    └── examination                  // 考试
        ├── cxpk                     // 查看排考
        ├── jksz                     // 监考设置
        ├── kcsz                     // 课程设置
        ├── khsz                     // 考号设置
        ├── kssz                     // 考试设置
        ├── mksz                     // 免考设置
        ├── pktz                     // 排考调整
        ├── znpk                     // 智能排考
        ├── index.vue
        └── top.vue                  // 排考设置 (首页)
```

## 组件管理
应用内组件写在当前应用文件夹内已components命名,入平台级组件例如弹层,tips等写入src/components里


