<template>
  <div class="maindiv">
    <div class="maindivtop flex" v-if="(unitCode_ == '006' && unitCode == 2) || unitCode == 1">
      <div class="block mdtb1 flex">
        <img src="./img/h1.png" width='79' height='79' alt="">
        <div class="br">
          <div class="bra">
            <div class="brb">
              <p class="p1">学校总数</p>
              <p class="p2">
                <span>{{schoolTotal.num}} </span> 所</p>
              <p class="p3">比上月增长{{schoolTotal.increase}}%</p>
            </div>
          </div>
        </div>
      </div>
      <div class="block mdtb2 flex">
        <img src="./img/h2.png" width='70' height='80'  alt="">
        <div class="br">
          <div class="bra">
            <div class="brb">
              <p class="p1">教师总数</p>
              <p class="p2">
                <span>{{teacherTotal.num}} </span> 名</p>
              <p class="p3">比上月增长{{teacherTotal.increase}}%</p>
            </div>
          </div>
        </div>
      </div>
      <div class="block mdtb3 flex">
        <img src="./img/h3.png" width='65' height='80'  alt="">
        <div class="br">
          <div class="bra">
            <div class="brb">
              <p class="p1">学生总数</p>
              <p class="p2">
                <span>{{studentTotal.num}} </span> 名</p>
              <p class="p3">比上月增长{{studentTotal.increase}}%</p>
            </div>
          </div>
        </div>
      </div>
      <div class="block mdtb4 flex" v-if="unitCode == 1">
        <img src="./img/h4.png" width='80' height='80'  alt="">
        <div class="br">
          <div class="bra">
            <div class="brb">
              <p class="p1">教育局总数</p>
              <p class="p2">
                <span>{{learnHomeTotal.num}} </span> 个</p>
              <p class="p3">比上月增长{{learnHomeTotal.increase}}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
<!--    <div class="maindivcontent" v-if=" unitCode_ != '006' &&  unitCode == 2">
      <div class="mdcpart mdcpart1 flex" style="border: none; padding:0;">
        <div class="mdcpartschool mdcpartschool1">
          <el-tabs type="border-card" v-model="activeNamea">
            <el-tab-pane label="待办事项" name="todo">
              <div v-for="(o, index) in todo" :key="index" class="text item">
                {{o.message }}
              </div>
            </el-tab-pane>
            <el-tab-pane label="我的申请" name="myApply">
              <div v-for="(o, index) in myApply" :key="index" class="text item">
                {{o.message }}
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="mdcpartschool mdcpartschool2">
          <el-tabs type="border-card" v-model="activeNameb">
            <el-tab-pane label="全部公告" name="allNotice">
              <div v-for="(o, index) in allNotice" :key="index" class="text item">
                {{o.message }}
              </div>
            </el-tab-pane>
            <el-tab-pane label="我的通知" name="myNotice">
              <div v-for="(o, index) in myNotice" :key="index" class="text item">
                {{o.message }}
              </div>
            </el-tab-pane>
            <el-tab-pane label="最新公文" name="newNotice">
              <div v-for="(o, index) in newNotice" :key="index" class="text item">
                {{o.message }}
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>-->
    <!-- 教师首页-->
    <div class="maindivcontent" v-if="unitCode == 3||(unitCode_ != '006' &&  unitCode == 2)">
      <div class="mdcpart mdcpart1 flex" style="border: none; padding:0;">
        <div class="mdcpartschool mdcpartschool1">
          <el-tabs type="border-card">
            <el-tab-pane label="待办事项">
                <div v-for="(o, index) in todo" :key="index" class="text item">
                <el-button  type="text" @click="ckspxq(o.rwlx,o.rwid)">{{o.rwmc}}--{{o.cjsj }}</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="mdcpartschool mdcpartschool2">
          <el-tabs type="border-card">
            <el-tab-pane label="最新公文">
              <div v-for="(gg, index) in newNotice" :key="index" class="text item">
                <el-button  type="text" @click="ckggxq(gg.jlid)">{{gg.ggbt }}--{{gg.fbsj }}</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <div class="maindivcontent">
      <div class="mdcpart mdcpart1 flex">
        <div class="mdcpartl mdcpartcommon">
          <div class="mdcpartldiv" id="lineId" ref="myEchart" style="height:500px;width:100%;">
          </div>
        </div>
        <el-card shadow="never" class="box-card" v-if="unitCode != 1">
          <div slot="header" class="clearfix">
            <span class="userdt">用户动态</span>
          </div>
          <div id="useractivies" style="height: 445px;overflow: hidden;">
            <ul>
              <li v-for="(o, i) in activeties" :key="o.result + i" class="text item flex mdcpartrcard">
                <div class="mdcpartrcarditemcontent">
                  <p>{{o.crtName}}&nbsp;&nbsp;&nbsp;&nbsp;{{o.crtTime}}&nbsp;&nbsp;&nbsp;&nbsp;{{o.result}}</p>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
        <div class="mdcpartr mdcpartcommon" v-if="unitCode == 1">
          <p class="producetitle">各产品开通情况</p>
          <el-table border class="table" :data="procactiveties">
            <el-table-column prop="product" label="产品">
            </el-table-column>
            <el-table-column prop="schoolNumer" label="学校数">
            </el-table-column>
            <el-table-column prop="techerNumber" label="老师数">
            </el-table-column>
            <el-table-column prop="studentNumer" label="学生数">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="mdcpart mdcpart2" v-if="unitCode!=1">
        <p class="mdcpart2title">常用快捷菜单</p>
        <div class="mdcpart2div" v-if="unitCode_ == '006' && unitCode == 2">
          <el-button class="mdcpart2btn">创建学年学期</el-button>
        </div>
        <div class="mdcpart2div" v-if="unitCode_ != '006' && unitCode == 2">
          <el-button class="mdcpart2btn">添加教师</el-button>
          <el-button class="mdcpart2btn">添加学生</el-button>
          <el-button class="mdcpart2btn">添加场地</el-button>
          <el-button class="mdcpart2btn">重置老师密码</el-button>
          <el-button class="mdcpart2btn">重置学生密码</el-button>
        </div>
      </div>
    </div>
    <page-splimx ref="pageSplimx"></page-splimx>
  </div>
</template>

<script>
import echarts from 'echarts';
import pageSplimx from '@/components/shmb/spmx';
import {
  getjyjTotalData,
  getGateLog,
  getdbsx,
  getjyjStatisticsData,
  getxglStatisticsData,
  getcgTotalData,
  getcgStatisticsData,
  getGGxx
} from '../../api/main';

export default {
  components: { pageSplimx },
  data() {
    return {
      // 总计
      xxdm: this.xxdm = window.localStorage.getItem('xxdm'),
      userid: this.userid = window.localStorage.getItem('userid'),
      listQuery: {
        query: {
          page: 1,
          limit: 10
        },
        xxdm: ''
      },
      schoolTotal: {},
      teacherTotal: {},
      studentTotal: {},
      learnHomeTotal: {},
      // 动态
      activeties: [],
      // 产品开通
      procactiveties: [],
      // 首页显示
      unitCode: '',
      unitCode_: '',
      // 标签
      activeNamea: 'todo',
      activeNameb: 'allNotice',
      // 校管理员
      todo: [],
      myApply: [],
      allNotice: [],
      myNotice: [],
      newNotice: []
    };
  },
  mounted() {
    // unitCode (1:系统管理员 2:学校管理员 3:普通老师 4,学生, 5:教育局管理员)'
    // type 2 && xxbxlxm 006 ->教育局管理员
    // type 1 ->系统管理员
    // type 2 && xxbxlxm !006->学校管理员
    this.unitCode = sessionStorage.getItem('unitCode');
    this.unitCode_ = sessionStorage.getItem('xxbxlxm');
    this.initChart();
    this.queryPageList();
    this.getUserActiveF();
  },
  methods: {
    // 动画
    animateCustom() {
      const $this = $('#useractivies');
      let scrollTimer;
      $this
        .hover(
          () => {
            clearInterval(scrollTimer);
          },
          () => {
            scrollTimer = setInterval(() => {
              scrollActivities($this);
            }, 2000);
          }
        )
        .trigger('mouseleave');

      const scrollActivities = obj => {
        const $self = obj.find('ul');
        const lineHeight = $self.find('li:first').height();
        $self.animate(
          {
            marginTop: -(lineHeight + 15) + 'px'
          },
          600,
          () => {
            $self
              .css({
                marginTop: 0
              })
              .find('li:first')
              .appendTo($self);
          }
        );
      };
    },

    // 总计 + tab切换
    async queryPageList() {
      if (this.unitCode_ == '006' && this.unitCode == 2) {
        getjyjTotalData().then(res => {
          if (res.status != 200) {
            this.$message({
              message: res.message,
              type: 'error'
            });
            return;
          }
          const totalData = res.data;
          this.schoolTotal = totalData.schoolTotal;
          this.teacherTotal = totalData.studentTotal;
          this.studentTotal = totalData.teacherTotal;
        });
      } else if (this.unitCode == 1) {
        getcgTotalData().then(res => {
          if (res.status != 200) {
            this.$message({
              message: res.message,
              type: 'error'
            });
            return;
          }
          const totalData = res.data;
          this.schoolTotal = totalData.schoolTotal;
          this.teacherTotal = totalData.teacherTotal;
          this.studentTotal = totalData.studentTotal;
          this.learnHomeTotal = totalData.eduTotal;
        });
      } else if (this.unitCode == 3 || (this.unitCode_ != '006' && this.unitCode == 2)) {
        getdbsx(this.userid).then(res => {
          if (res.status === 200) {
            this.todo = res.data;
          } else {
            console.log(res.message);
          }
        });
        getGGxx({ xxdm: this.xxdm }).then(res => {
          if (res.status === 200) {
            this.newNotice = res.data;
          } else {
            console.log(res.message);
          }
        })
      }
    },

    // 用户动态/产品开通情况
    async getUserActiveF() {
      this.listQuery.xxdm = this.xxdm;
      getGateLog(this.listQuery).then(response => {
        this.activeties = response.data.rows;
      });
    },

    // 图表
    async initChart() {
      const chart = echarts.init(this.$refs.myEchart);
      let setOption;
      let statisticsData;
      if (this.unitCode_ == '006' && this.unitCode == 2) {
        setOption = {
          title: {
            text: '活跃用户(本月)'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            show: true,
            type: 'category',
            data: [],
            axisLabel: {
              interval: 0
            }
          },
          yAxis: {
            show: true,
            type: 'value'
          },
          grid: {
            // 控制图的大小，调整下面这些值就可以，
            y2: 20 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
          },
          series: [
            {
              type: 'line',
              name: '人数',
              stack: '人'
            }
          ]
        };
        await getjyjStatisticsData().then(res => {
          statisticsData = res.data;
        });
      } else if (this.unitCode_ != '006' && this.unitCode == 2) {
        setOption = {
          title: {
            text: '活跃用户(本月)'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: [],
            axisLabel: {
              interval: 0
            }
          },
          yAxis: {
            type: 'value'
          },
          grid: {
            // 控制图的大小，调整下面这些值就可以，
            y2: 20 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
          },
          series: [
            {
              type: 'line',
              name: '人数',
              stack: '人'
            }
          ]
        };
        await getxglStatisticsData().then(res => {
          statisticsData = res.data;
        });
      } else if (this.unitCode == 1) {
        setOption = {
          title: {
            text: '各产品活跃情况'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['老师数', '学生数']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '老师数',
              type: 'line',
              stack: '总量'
            },
            {
              name: '学生数',
              type: 'line',
              stack: '总量'
            }
          ]
        };
        const xAxis = [];
        const seriesteacher = [];
        const seriesstudent = [];
        await getcgStatisticsData().then(res => {
          statisticsData = res.data;
          statisticsData.forEach(item => {
            xAxis.push(item.product);
            seriesteacher.push(item.techerNumber);
            seriesstudent.push(item.studentNumer);
          });
          setOption.xAxis.data = xAxis;
          setOption.series[0].data = seriesteacher;
          setOption.series[1].data = seriesstudent;
          chart.setOption(setOption);
        });
        return;
      }
      setOption.xAxis.data = statisticsData.xAxis;
      setOption.series[0].data = statisticsData.series;
      chart.setOption(setOption);
    },
    ckspxq(rwPath, slid) {
      if (slid) {
        if (rwPath === 'SP') {
          this.$nextTick(() => {
            this.$refs.pageSplimx.init(slid);
          })
        }
      }
    },
    ckggxq(jlid) {
      console.log(jlid);
    }
  }
};
</script>

<style lang="scss">
$bordercolor: #eee;
@import '../../styles/bcommon.scss';
.maindiv {
  min-width: 1308px;
  padding: 1px 20px 50px 20px;
  .maindivtop {
    margin-top: 20px;
    .block {
      color: white;
      background-color: pink;
      padding: 20px 25px;
      border-radius: 4px;
      overflow: hidden;
      width: 33%;
      min-width: 300px;
      justify-content: center;
      margin-right: 20px;
      img {
        margin-top: 10px;
      }
      .br {
        flex: 1;
        text-align: center;
        width: 300px;
        .bra {
          width: 100%;
          text-align: left;
          padding-left: 50%;
          .brb {
            margin-left: -40%;
            .p1,
            .p3 {
              font-size: 16px;
            }
            .p2 {
              font-size: 24px;
            }
          }
        }
      }
    }
    .mdtb1 {
      background-color: #00b297;
    }
    .mdtb2 {
      background-color: #dc3545;
    }
    .mdtb3 {
      background-color: #0866c6;
    }
    .mdtb4 {
      background-color: #1d2939;
    }
  }
  .maindivcontent {
    min-width: 920px;
    .mdcpart {
      justify-content: left;
      border-radius: 4px;
      margin-top: 20px;
      overflow: hidden;
    }
    .mdcpart1 {
      width: 100%;
      .mdcpartl {
        margin-right: 20px;
      }
      .mdcpartcommon {
        border: 1px solid $bordercolor;
        padding: 20px 10px;
        flex: 1;
        .producetitle {
          font-size: 20px;
          padding: 10px;
          font-weight: 700;
        }
        .table {
          width: 99.55%;
          overflow: hidden;
        }
      }
      .mdcpartschool {
        width: 48%;
        height: 226px;
      }
      .mdcpartschool1 {
        min-width: 835px;
      }
      .mdcpartschool2 {
        margin-left: 1.5%;
      }
    }
    .mdcpart2 {
      border: 1px solid $bordercolor;
      padding: 20px 10px;
      .mdcpart2title {
        border-bottom: 1px solid #eee;
        margin-bottom: 30px;
        padding-bottom: 20px;
        font-size: 20px;
        font-weight: 700;
      }
      .mdcpart2div {
        .mdcpart2btn {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
<style>
.maindiv .el-card__body {
  height: 428px;
}
.maindiv .el-button {
  margin-left: 0px;
  margin-right: 10px;
}
.maindiv .userdt {
  font-size: 20px;
  font-weight: 700;
}
.maindiv .el-card {
  cursor: default;
}
.maindiv .mdcpartrcard {
  cursor: pointer;
}
.maindiv .mdcpartrcard img {
  width: 46px;
  height: 46px;
  margin-right: 15px;
}
.maindiv .el-tabs--border-card {
  height: 100%;
}
.maindiv .mdcpartrcard .mdcpartrcarditemcontent {
  flex: 1;
}
.maindiv .mdcpartrcard .mdcpartrcarditemtime {
  line-height: 60px;
  margin-right: 10px;
  width: 120px;
}
</style>
<style>
.maindiv .text {
  font-size: 14px;
}

.maindiv .item {
  margin-top: 15px;
  margin-bottom: 15px;
}

.maindiv .clearfix:before,
.maindiv .clearfix:after {
  display: table;
  content: '';
}
.maindiv .clearfix:after {
  clear: both;
}

.maindiv .box-card {
  width: 480px;
  flex: 1;
}
</style>
