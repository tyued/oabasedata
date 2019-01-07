<!--  -->
<template>
    <div class="app-container calendar-list-container" style="padding-bottom:50px;float:left;">
        <div class="filter-container">
            <el-form ref="form" :model="formlist">
                <el-row>
                    <el-form-item label="学年学期" style="min-width:600px;">
                        <el-select  class="schoolYear" v-model="listQuery.xn" placeholder="请选择" size="small" @change="getList">
                            <el-option
                                v-for="(item, index) in schoolyearlist"
                                :key="index"
                                :value="item">
                                {{item+'年'}}
                            </el-option>
                        </el-select>
                        <el-select  class="schoolYear" v-model="listQuery.xq" placeholder="请选择" size="small"  @change="getList">
                            <el-option
                                v-for="(item, index) in semesterlist"
                                :key="index"
                                :label="item.xqmc"
                                :value="item.xq">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
            </el-form>
            <!-- 卡片区beg -->
            <div class="table-container" style="max-width:1000px; min-width:900px; margin-top:15px">
                <p class="tip"><span>注：</span>只有班主任和任课老师有录入权限。报告单锁定后，教师将不能进行录入操作。</p>
                <el-card class="box-card" v-for="(item, index) in list" :key="index" style="width: 100%;">
                    <div class="content_left">
                        <div class="title">
                            <span class="title_info">{{item.xn}}{{item.xq === '01'? '上学期':'下学期'}} {{item.mc}}</span>
                            <span class="tip" :style="{background: item.lrsd? 'orange':'green',color:'#fff'}">{{item.lrsd?'已锁定':'可录入'}}</span>
                        </div>
                        <div class="time_info">
                            <span class="school_year">学年学期：{{item.xn}}{{item.xq === '01'?'上学期':'下学期'}}</span>
                            <span class="entry_time">最后编辑时间：{{item.gxsj}}</span>
                        </div>
                    </div>
                    <div class="content_right">
                        <el-button style="padding: 3px 0" type="text" @click="entryinfo(item)">录入</el-button>
                        <el-button style="padding: 3px 0" type="text" @click="exportinfo(item)">导出</el-button>
                    </div>
                </el-card>
                <div class="pagination">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"  :total="listQuery.total"> </el-pagination>
                </div>
            </div>
            <!-- 卡片区end -->
            <!-- <el-dialog
                title="提示信息"
                :visible.sync="centerDialogVisible"
                width="30%"
                center>
                <span></span>
                <span>窗口将在1秒后自动关闭</span>
            </el-dialog> -->
        </div>
    </div>
</template>

<script>
import {school_page,getXn,getXq,getNj,getXk,dqxnxqObj,getBj,Getreport,Getreportset,Getjurisdiction} from 'api/project/creditInquiry/index'
export default {
    name: "inoutReport",
    components: {
    
    },
    data() {
        return {
            lguserType: window.localStorage.getItem('lguserType'), // 用户类型
            centerDialogVisible:false,
            back: true? 'red' : 'blue',
            list: [
                {
                    title: '2016-2017上学期 学生素质综合评价报告单',
                    status: false,
                    xnxq: '2016-2017上学期',
                    bjsj: '2018-01-03 14:00'
                }
            ], // 模拟数据
            zgh: '', // 职工号
            xndm: '', // 学年代码
            username: window.localStorage.getItem('username'), // 用户账号 （zgh = username去掉学校代码部分的字符串）
            formlist: {}, // 表单数据源
            listQuery:{ // 基础信息
                xxdm: window.localStorage.getItem('xxdm'),
                xn: '',
                xq: '',
                pageSize: 10,
                pageIndex: 1,
                total: 0
            },
            schoolyearlist: [],// 学年列表
            semesterlist: [], // 学期列表
            gradelist: [], // 年级列表
            classlist: [], // 权限班级列表
            newclasslist: [], // 筛选班级列表暂存
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init() { // 初始化
            let _this = this;
            Promise.all([
                dqxnxqObj({
                    xxdm: _this.listQuery.xxdm,
                }),
                getXn({
                    xxdm: _this.listQuery.xxdm,
                    page: 1,
                    limit: 50,
                }), 
                getXq({
                    xxdm: _this.listQuery.xxdm,
                    page: 1,
                    limit: 50,
                })]).then(function (res) {
                let res0 = res[0];
                let res1 = res[1].data.rows;
                let res2 = res[2].data.rows;
                // 学年
                let schoolyearlist = [];
                if(res1) {
                    for(let i = 0; i < res1.length; i++) {
                        if(schoolyearlist.indexOf(res1[i].xn) < 0) {
                            schoolyearlist.push(res1[i].xn)
                        }
                    }
                }
                // 学年
                _this.schoolyearlist = schoolyearlist;

                // 学期
                _this.semesterlist = res2;

                //初始化请求数据
                let schoolyearIndex = schoolyearlist.indexOf(res0.xn);
                if(schoolyearIndex<0) {schoolyearIndex = 0}

                let semesterIndex = 0 ;
                for(let i = 0; i < res2.length; i++) {
                    if(res0.xq == res2[i].xq) {
                        semesterIndex = i;
                        break
                    }
                }
                // _this.listQuery.xn = schoolyearlist[schoolyearIndex];
                // _this.listQuery.xq = res2[semesterIndex].xq;
                var t = _this.listQuery.xxdm.length
                _this.zgh = _this.username.substring(t)
                // console.log(_this.zgh)
                _this.getList()
            });
        },
        getList() {
            console.log(333)
            var that = this
            Getreport(this.listQuery).then(data => {// 获取报告单集合
                console.log(data)
                var arr = []
                var arr2 = []
                if (data.list.length) {
                    data.list.forEach(el => {
                        if (el.byzD1.length) {
                            el.byzD1.forEach(byz => {
                                byz.bjidlist = byz.bjid.split(',')
                                for(var i in byz.bjidlist){
                                    arr.push(byz.bjidlist[i])
                                }
                            })
                            el.bjidlist = arr
                        } else {
                            el.bjidlist = []
                        }
                    });
                }
                // console.log(data)
                // that.getqxbj()
                // data.list.forEach(el => {
                    // console.log(el)
                    // Getreportset({id:el.uuid}).then(datas => {// 获取报告单设置
                    //     console.log(datas)
                    //     if (el.uuid === datas.bgdid) {
                    //         if (datas.njSzList.length) {
                    //             datas.njSzList.forEach(item => {
                    //                 // console.log(item.bjid)
                    //                 el.idlist = item.bjid.split(',')
                    //                 // console.log(el.idlist)
                    //             })
                    //         } else {
                    //             el.idlist = []
                    //         }
                    //     }
                    // }).catch(error => {
                    //     // console.log(error)
                    // })
                // });
                this.listQuery.total = data.totalCount
                that.list = data.list
            })
        },
        // 获取当前人有权限的班级
        getqxbj(item, str) {
            let params = {
                xxdm: this.listQuery.xxdm,
                zgh: this.zgh,
                xndm: this.xndm,
                xm: '',
            }
            var that = this
            that.newclasslist = []
            // 根据职工号学年代码获取权限班级
            Getjurisdiction(params).then(data => {
                console.log(data)
                if (data.status === 200) {
                    this.classlist = data.data
                    // console.log(data)
                    for(var i = 0; i<item.bjidlist.length; i++){
                        for(var j = 0; j<that.classlist.length; j++){
                            if (item.bjidlist[i] === that.classlist[j].bjdm) {
                                that.newclasslist.push(that.classlist[j])
                                j = ++i
                                window.localStorage.setItem('bgdsj',JSON.stringify(item))
                                window.localStorage.setItem('newclasslist',JSON.stringify(that.newclasslist))
                                if (str === 'lr') {
                                    // window.localStorage.setItem('bgdsj',JSON.stringify(item))
                                    // window.localStorage.setItem('newclasslist',JSON.stringify(that.newclasslist))
                                    this.$router.push({path: '/zhszReport/InformationEntry', query: {zgh: this.zgh}})
                                    // query:{dataSource:JSON.stringify(that.newclasslist),datas:JSON.stringify(item)}
                                } else {
                                    this.$router.push({path: '/zhszReport/InformationExport', query: {zgh: this.zgh}})
                                    // ,query:{dataSource:JSON.stringify(that.newclasslist),datas:JSON.stringify(item)}
                                }
                            }
                        }
                    }
                }
                // console.log(data)
            })
        },
        // 录入信息(进入录入界面)
        entryinfo(item) {
            // console.log(item)
            this.xndm = item.xn
            var that = this
            if (item.lrsd) {
                that.$notify({
                    title: '提示',
                    message: '已锁定不可录入',
                    type: 'warning',
                    duration: 1000
                });
            } else if (item.byzD1.length) {
                // 获取权限班级
                this.getqxbj(item, 'lr') 
                // item.idlist.forEach(el => {
                //     that.classlist.forEach(i => {
                //         if (el === i.bjdm) {
                //             console.log('有权限')
                //         }
                //     })
                // })
            } else {
                that.$notify({
                    title: '提示',
                    message: '只有班主任和任课老师有录入授权！',
                    type: 'warning',
                    duration: 1000
                });
            }
            // this.$router.push({path: '/zhszReport/InformationEntry',query:{datas:item}})
            // this.$notify.success({
            //     title: 'Info',
            //     message: '这是一条没有关闭按钮的消息',
            //     showClose: false
            // });
        },
        // 进入导出信息页面
        exportinfo(item) {
            console.log(item)
            this.xndm = item.xn
            var that = this
            if (this.lguserType === 2) {
                this.getqxbj(item, 'dc')
            } else if (item.bjidlist.length) {
                this.getqxbj(item, 'dc')
            } else {
                that.$notify({
                    title: '提示',
                    message: '只有班主任和任课老师及管理员有查看权限！',
                    type: 'warning',
                    duration: 1000
                });
            }
            // this.$router.push({path: '/zhszReport/InformationExport'})
        },
        // 翻页
        handleSizeChange(val) {
            this.listQuery.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.listQuery.pageIndex = val;
            this.getList()
        },
    }
}
</script>

<style scoped lang="scss">
@import "src/styles/mixin.scss";
.filter-container{
    float: left;
}
.select_box{
    float: left;
    margin-right: 10px;
}
.schoolYear{
    width: 120px;
}
.table-container{
    .box-card{
        height: 100px;
        margin-top: 20px;
    }
    .tip{
        color: #ccc;
        font-size: 14px;
        span{
            color: #333;
            font-size: 16px;
            font-weight: 500;
        }
    }
    .content_left{
        float: left;
        .title{
            height: 40px;
            line-height: 40px;
            .title_info{

            }
            .tip{
                margin-left: 20px;
                display: inline-block;
                width: 60px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                background: rebeccapurple;
                border-radius: 15px;
            }
        }
        .time_info{
            height: 40px;
            line-height: 40px;
            .school_year{

            }
            .entry_time{
                margin-left: 20px;
            }
        }
    }
    .content_right{
        float: right;
        line-height: 80px;
    }
}
</style>
<style>
.box-card .el-card__body{
    padding: 10px 20px;
}
</style>