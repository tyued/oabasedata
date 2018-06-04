<!--排课系统首页-->
<template>
  <section class="content-container">
    <div class="handle-box">
      <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新建排课任务</el-button>
      <el-select v-model="select_cate" placeholder="请选择" class="handle-select mr10">
        <el-option key="1"  label="排课中" value="排课中"></el-option>
        <el-option key="2" label="未发布" value="未发布"></el-option>
        <el-option key="3" label="已发布" value="已发布"></el-option>
      </el-select>
      <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <div>
      <el-row :gutter="16" style="margin-bottom:6px;">
        <el-card shadow="always">
          <el-badge value="未启用" class="item">
            <h4>2017-2018期中考试</h4>
          </el-badge>
          <div style="height: 52px;">
            <p>起止时间:2017年08月01日</p>
          </div>
          <div style="height: 40px">
            <el-row style="float:left;">
              <el-button @click="toPksz" size="small" type="info" icon="iconfont icon-el-icon-config" plain>排课设置</el-button>
              <el-button @click="toPksz" size="small" type="primary" icon="iconfont icon-el-icon-survey" plain disabled>排课维护</el-button>
              <el-button @click="toPksz" size="small" type="warning" icon="iconfont icon-el-icon-yuyuedingdan" plain disabled>临时排课</el-button>
              <el-button @click="toPksz" size="small" type="success" icon="iconfont icon-el-icon-templatedefault" plain disabled>排课结果</el-button>
            </el-row>
            <el-row  style="float:right;">
              <el-tooltip class="item" effect="dark" content="修改" placement="top-start">
                <el-button  size="mini" type="primary" icon="el-icon-edit-outline" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button  size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="启用" placement="top-start">
                <el-button  size="mini" type="success" icon="el-icon-tickets" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="复用" placement="top-start">
                <el-button  size="mini" type="warning" icon="el-icon-document" circle></el-button>
              </el-tooltip>

            </el-row>
          </div>
          <p></p>
        </el-card>
      </el-row>
      <el-row :gutter="16" style="margin-bottom:6px;">
        <el-card shadow="always">
          <el-badge value="未启用" class="item">
            <h4>2017-2018期中考试</h4>
          </el-badge>
          <div style="height: 52px;">
            <p>起止时间:2017年08月01日</p>
          </div>
          <div style="height: 40px">
            <el-row style="float:left;">
              <el-button size="small" type="info" icon="iconfont icon-el-icon-config" plain>排课设置</el-button>
              <el-button size="small" type="primary" icon="iconfont icon-el-icon-survey" plain>排课维护</el-button>
              <el-button size="small" type="warning" icon="iconfont icon-el-icon-yuyuedingdan" plain>临时排课</el-button>
              <el-button size="small" type="success" icon="iconfont icon-el-icon-templatedefault" plain>排课结果</el-button>
            </el-row>
            <el-row  style="float:right; margin-bottom:6px; ">
              <el-tooltip class="item" effect="dark" content="修改" placement="top-start">
                <el-button  size="mini" type="primary" icon="el-icon-edit-outline" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button  size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="启用" placement="top-start">
                <el-button  size="mini" type="success" icon="el-icon-tickets" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="复用" placement="top-start">
                <el-button  size="mini" type="warning" icon="el-icon-document" circle></el-button>
              </el-tooltip>

            </el-row>
          </div>
          <p></p>
        </el-card>
      </el-row>
      <el-row :gutter="16" style="margin-bottom:6px;">
        <el-card shadow="always">
          <el-badge value="未启用" class="item">
            <h4>2017-2018期中考试</h4>
          </el-badge>
          <div style="height: 52px;">
            <p>起止时间:2017年08月01日</p>
          </div>
          <div style="height: 40px">
            <el-row style="float:left;">
              <el-button size="small" type="info" icon="iconfont icon-el-icon-config" plain>排课设置</el-button>
              <el-button size="small" type="primary" icon="iconfont icon-el-icon-survey" plain>排课维护</el-button>
              <el-button size="small" type="warning" icon="iconfont icon-el-icon-yuyuedingdan" plain>临时排课</el-button>
              <el-button size="small" type="success" icon="iconfont icon-el-icon-templatedefault" plain>排课结果</el-button>
            </el-row>
            <el-row  style="float:right;  ">
              <el-tooltip class="item" effect="dark" content="修改" placement="top-start">
                <el-button  size="mini" type="primary" icon="el-icon-edit-outline" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button  size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="启用" placement="top-start">
                <el-button  size="mini" type="success" icon="el-icon-tickets" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="复用" placement="top-start">
                <el-button  size="mini" type="warning" icon="el-icon-document" circle></el-button>
              </el-tooltip>

            </el-row>

          </div>
          <p></p>
        </el-card>
      </el-row>
      <!--新增界面-->
      <el-dialog title="新建排课任务" :visible.sync="dialogFormVisible" width="30%" @close="colseDialog">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="任务名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="任务类型">
            <el-select v-model="form.region" placeholder="请选择任务类型">
              <el-option label="常规排课" value="1"></el-option>
              <el-option label="单双周" value="2"></el-option>
              <el-option label="暑假排课" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-col :span="8">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="1">&nbsp;&nbsp;-</el-col>
            <el-col :span="8">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date2" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="colseDialog" >取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

  </section>
</template>

<script>
  export default {
    data() {
      return {
        dialogFormVisible: false, //定义新增弹框默认关闭
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        message: 'first',
        showHeader: false,
        unread: [{
          date: '2018-04-19 20:00:00',
          title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护',
        },{
          date: '2018-04-19 21:00:00',
          title: '今晚12点整发大红包，先到先得',
        }],
        read: [{
          date: '2018-04-19 20:00:00',
          title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
        }],
        recycle: [{
          date: '2018-04-19 20:00:00',
          title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
        }]
      }
    },
    methods: {
      toPksz(){ /**跳转排课设置页面**/
        this.$router.push('/pkxt/pksz');
      },
      handleAdd(){/**打开新增弹框**/
        this.dialogFormVisible = true;
      },
      onSubmit() {
        console.log('submit!');
      },
      colseDialog(){
        this.dialogFormVisible = false;
      },
      handleRead(index) {
        const item = this.unread.splice(index, 1);
        console.log(item);
        this.read = item.concat(this.read);
      },
      handleDel(index) {
        const item = this.read.splice(index, 1);
        this.recycle = item.concat(this.recycle);
      },
      handleRestore(index) {
        const item = this.recycle.splice(index, 1);
        this.read = item.concat(this.read);
      }
    },
    computed: {
      unreadNum(){
        return this.unread.length;
      }
    }
  }

</script>

<style>
  .content-container {
    padding: 20px;
  }
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 78px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }
  .del-dialog-cnt{
    font-size: 16px;
    text-align: center
  }
  .    margin-bottom: 6px;

  /* .item {
       margin-top: 10px;
       margin-right: 40px;
   }*/
</style>


