<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <table cellpadding="0" cellspacing="0" class="RLHead">
	    	<tbody><tr>
	       		<td class="Htd1"><a href="javascript:void(0);" onclick="javascript:preStep();" class="Rl-Perv"></a></td>
	           	<td class="Htd2"><a id="preYear" href="javascript:void(0);" onclick="javascript:preYearChange();">2017年</a> | <a id="currentYear" href="javascript:void(0);" onclick="javascript:currentYearClick();">2018年</a></td>


<td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;1&quot;)"
                              class="Ms">一月</a></td>


          <td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;2&quot;)"
                              class="Ms">二月</a></td>


          <td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;3&quot;)"
                              class="Ms">三月</a></td>


          <td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;4&quot;)"
                              class="Ms">四月</a></td>


          <td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;5&quot;)"
                              class="Ms">五月</a></td>


          <td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;6&quot;)"
                              class="Ms CurMs">六月</a></td>


          <td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;7&quot;)"
                              class="Ms">七月</a></td>


          <td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;8&quot;)"
                              class="Ms">八月</a></td>


          <td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;9&quot;)"
                              class="Ms">九月</a></td>


          <td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;10&quot;)"
                              class="Ms">十月</a></td>


          <td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;11&quot;)"
                              class="Ms">十一月</a></td>


          <td class="Htd3"><a href="javascript:void(0);" onclick="javascript:monthChange(this,&quot;12&quot;)"
                              class="Ms">十二月</a></td>

          <td class="Htd4"><a id="sufYear" href="javascript:void(0);" onclick="javascript:sufYearChange();">2019年</a></td>
	           	<td class="Htd1"><a href="javascript:void(0);" onclick="javascript:sufStep();" class="Rl-Next"></a></td>
	       	</tr>
	   	</tbody></table>
            <table cellpadding="0" cellspacing="0" class="RLBody"><tbody><tr>
	     		<td rowspan="7" class="TodayInfo"><div class="TodayBtn" id="TodayBtnBlank" style="background: rgb(255, 255, 255); border: 0px; height: 23px;"></div> <div class="TodayBtn" id="TodayBtn" style="display:none;"><a href="javascript:void(0);" onclick="javascript:backToday();">返回今天</a></div><div class="TodayNum">16</div><div class="TodayDet"><span style="display:none;">戊戌【狗】年 五月初三</span>2018年6月16日<br>星期六</div></td>
		 		<th align="center">周日</th>
		 		<th align="center">周一</th>
		 		<th align="center">周二</th>
		 		<th align="center">周三</th>
		 		<th align="center">周四</th>
		 		<th align="center">周五</th>
		 		<th align="center">周六</th>
            </tr>
            <tr>
              <td class="DayTd"></td>
              <td class="DayTd"></td>
              <td class="DayTd"></td>
              <td class="DayTd"></td>
              <td class="DayTd"></td>
              <td style="cursor: pointer;" id="td_1" onclick="dataChange(this,'2018年6月1日','2018','6','1','星期五')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">1</span><span></span></td>
              <td style="cursor: pointer;" id="td_2" onclick="dataChange(this,'2018年6月2日','2018','6','2','星期六')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">2</span><span></span></td>
            </tr>
            <tr>
              <td style="cursor: pointer;" id="td_3" onclick="dataChange(this,'2018年6月3日','2018','6','3','星期日')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">3</span><span></span></td>
              <td style="cursor: pointer;" id="td_4" onclick="dataChange(this,'2018年6月4日','2018','6','4','星期一')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">4</span><span></span></td>
              <td style="cursor: pointer;" id="td_5" onclick="dataChange(this,'2018年6月5日','2018','6','5','星期二')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">5</span><span></span></td>
              <td style="cursor: pointer;" id="td_6" onclick="dataChange(this,'2018年6月6日','2018','6','6','星期三')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">6</span><span></span></td>
              <td style="cursor: pointer;" id="td_7" onclick="dataChange(this,'2018年6月7日','2018','6','7','星期四')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">7</span><span></span></td>
              <td style="cursor: pointer;" id="td_8" onclick="dataChange(this,'2018年6月8日','2018','6','8','星期五')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">8</span><span></span></td>
              <td style="cursor: pointer;" id="td_9" onclick="dataChange(this,'2018年6月9日','2018','6','9','星期六')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">9</span><span></span></td>
            </tr>
            <tr>
              <td style="cursor: pointer;" id="td_10" onclick="dataChange(this,'2018年6月10日','2018','6','10','星期日')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">10</span><span></span></td>
              <td style="cursor: pointer;" id="td_11" onclick="dataChange(this,'2018年6月11日','2018','6','11','星期一')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">11</span><span></span></td>
              <td style="cursor: pointer;" id="td_12" onclick="dataChange(this,'2018年6月12日','2018','6','12','星期二')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">12</span><span></span></td>
              <td style="cursor: pointer;" id="td_13" onclick="dataChange(this,'2018年6月13日','2018','6','13','星期三')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">13</span><span></span></td>
              <td style="cursor: pointer;" id="td_14" onclick="dataChange(this,'2018年6月14日','2018','6','14','星期四')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">14</span><span></span></td>
              <td style="cursor: pointer;" id="td_15" onclick="dataChange(this,'2018年6月15日','2018','6','15','星期五')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">15</span><span></span></td>
              <td style="cursor: pointer;" id="td_16" onclick="dataChange(this,'2018年6月16日','2018','6','16','星期六')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt2'"><span class="DSt2">16</span><span></span></td>
            </tr>
            <tr>
              <td style="cursor: pointer;" id="td_17" onclick="dataChange(this,'2018年6月17日','2018','6','17','星期日')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">17</span><span></span></td>
              <td style="cursor: pointer;" id="td_18" onclick="dataChange(this,'2018年6月18日','2018','6','18','星期一')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">18</span><span></span></td>
              <td style="cursor: pointer;" id="td_19" onclick="dataChange(this,'2018年6月19日','2018','6','19','星期二')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">19</span><span></span></td>
              <td style="cursor: pointer;" id="td_20" onclick="dataChange(this,'2018年6月20日','2018','6','20','星期三')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">20</span><span></span></td>
              <td style="cursor: pointer;" id="td_21" onclick="dataChange(this,'2018年6月21日','2018','6','21','星期四')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">21</span><span></span></td>
              <td style="cursor: pointer;" id="td_22" onclick="dataChange(this,'2018年6月22日','2018','6','22','星期五')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">22</span><span></span></td>
              <td style="cursor: pointer;" id="td_23" onclick="dataChange(this,'2018年6月23日','2018','6','23','星期六')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">23</span><span></span></td>
            </tr>
            <tr>
              <td style="cursor: pointer;" id="td_24" onclick="dataChange(this,'2018年6月24日','2018','6','24','星期日')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">24</span><span></span></td>
              <td style="cursor: pointer;" id="td_25" onclick="dataChange(this,'2018年6月25日','2018','6','25','星期一')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">25</span><span></span></td>
              <td style="cursor: pointer;" id="td_26" onclick="dataChange(this,'2018年6月26日','2018','6','26','星期二')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">26</span><span></span></td>
              <td style="cursor: pointer;" id="td_27" onclick="dataChange(this,'2018年6月27日','2018','6','27','星期三')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">27</span><span></span></td>
              <td style="cursor: pointer;" id="td_28" onclick="dataChange(this,'2018年6月28日','2018','6','28','星期四')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">28</span><span></span></td>
              <td style="cursor: pointer;" id="td_29" onclick="dataChange(this,'2018年6月29日','2018','6','29','星期五')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">29</span><span></span></td>
              <td style="cursor: pointer;" id="td_30" onclick="dataChange(this,'2018年6月30日','2018','6','30','星期六')"
                  class="DayTd" onmouseover="this.children[0].className='DSt4'"
                  onmouseout="this.children[0].className='DSt1'"><span class="DSt1">30</span><span></span></td>
            </tr>
            </tbody>
            </table>


        </el-col>


        <el-col :span="24" class="mt20">
            <el-button type="info" plain size="small">查看</el-button>
            <el-button type="info" plain size="small">增加</el-button>
            <el-button type="info" plain size="small">修改</el-button>
            <el-button type="info" plain size="small">删除</el-button>
            <el-button type="info" plain size="small">查询</el-button>
        </el-col>

        <el-col :span="24">
            <div class="tableControl mt20">
            无计划
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
       txt1:"",
       tableData3: [{
            cphm: '浙A485HH',
            clxh: "大众",
            grrq: '2017-09-26',
            gmjg:"20",
            zws:"4",
            sfqy:"是",
        },{
            cphm: '浙A785KK',
            clxh: "奥迪",
            grrq: '2017-09-26',
            gmjg:"50",
            zws:"4",
            sfqy:"是",
        }
        ],
    }
  },
  mounted: function(){


  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/oasysys.scss";


</style>
