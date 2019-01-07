<template>
    <div class="app-container calendar-list-container" style="padding-bottom:50px;float:left;">
        <!-- 班级列表beg -->
        <div class="">
            <el-row class="nsturow" style="width:900px;">
                <el-col :span="20">
                    <div class="grid-content">
                        提示:目前班级成绩平均分之差最大值为<span class="diffScore" style="color: lightcoral">{{diffScore}}</span>分
                    </div>
                    <div class="grid-content">
                        <div style="padding-left: 30px;">各单科平均分极差为<span v-for="(item, index) in singledifference" :key="index">{{item.name}}<span style="color: lightcoral;margin: 0 5px;">{{item.maxDifference}}分,</span></span></div>
                    </div>
                    <div class="grid-content">
                        <div style="padding-left: 30px;" v-if="rankingCountDifferences.length">名次段班级人数极差为<span v-for="(item, index) in rankingCountDifferences" :key="index">{{item.name}}<span style="color: lightcoral;margin: 0 5px;">{{item.countDifference}}人,</span></span></div>
                    </div>
                </el-col>
                <el-col :span="4"><div class="grid-content">
                    <el-button style="float:right;" @click="groupresult" type="primary" size="small">分班确认</el-button>
                </div></el-col>
            </el-row>
            <div class="table-container" style="min-width:1000px; margin-top:20px">
                <el-table :data="contentList" highlight-current-row border @row-click="handleCurrentChange" style="width: 100%;" class="bjinfo">
                    <el-table-column fixed prop="name" label="班级编号" width="100"></el-table-column>
                    <el-table-column fixed prop="averageScore" label="成绩平均分" width="100"></el-table-column>
                    <el-table-column prop="totalNum" label="班级人数" width="100"></el-table-column>
                    <el-table-column prop="boyNum" label="男生数" width="100"> </el-table-column>
                    <el-table-column prop="girlNum" label="女生数" width="100"> </el-table-column>
                    <el-table-column prop="maleFemaleRatio" label="男女比例" width="100"></el-table-column>
                    <!--  -->
                    <el-table-column v-for="(item, index) in rankarr" :key="index" :label="item.name">
                        <template slot-scope="scope">
                            <span v-if="scope.row[item.rankingId]">{{scope.row[item.rankingId].count}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <!--  -->
                    <!-- <div> -->
                    <el-table-column v-for="item in othercourselist" :key="item.courseId" :label="item.courseName">
                        <template slot-scope="scope">
                            <span v-if="scope.row[item.courseId]">{{scope.row[item.courseId].courseaverageScore}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <!-- </div> -->
                    <el-table-column label="学生名单" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="small" @click.stop="handleCheck(scope.$index, scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 班级列表end -->
        <!-- 交换班级学生beg -->
        <div class="changeStuMain">
            <el-row class="nsturow" style="width:900px;margin-top:20px;">
                <el-col :span="24"><div class="grid-content">
                    交换学生：（注：名字为<span style="color: #409EFF">蓝色</span>的学生已预设班级，不可交换）
                </div></el-col>
            </el-row>
            <div class="table-container"  style="max-width:400px; margin-top:20px; float:left;">

                <el-row class="nsturow" style="width:100%;">
                <el-col :span="19"><div class="grid-content">
                    <div class="gridname">{{xgbj1.bjName?xgbj1.bjName:'请选择需要交换的班级'}}</div><div v-if="xgbj1.bjName" class="classnuminfo">班级人数<span>{{xgbj1.students.length}}</span>人，男生<span>{{boy1list.length}}</span>人，女生<span>{{girl1list.length}}</span>人</div>
                </div></el-col>
                <el-col :span="5"><div class="grid-content">
                    <el-button style="float:right;" type="primary" @click="cancelBj(1)" size="small">取消</el-button>
                </div></el-col>
                </el-row>

                <el-table :data="xgbj1.students" height="400"  border @selection-change="handleSelectionChange1" style="width: 100%; margin-top:10px; " class="bjinfo">
                        <!-- :cell-style="cellStyle" -->
                    <el-table-column type="selection" width="50" :selectable='checkboxT'></el-table-column>
                    <el-table-column label="姓名" width="130">
                        <template slot-scope="scope">
                            <span style="color: #409EFF" v-if="scope.row.designateClass">{{scope.row.name}}</span>
                            <span style="color: #333" v-else>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sex" :formatter="formatRole" label="性别" width="100"> </el-table-column>
                    <el-table-column prop="totalScore" label="总成绩" width="119"></el-table-column>
                    <!-- <el-table-column prop="mobile" label="电话" width="119"></el-table-column>
                    <el-table-column prop="idCard" label="身份证号" width="200"></el-table-column> -->
                </el-table>
            </div>

            <div class="changeStuBtn" style="float:left;">
                <el-button class="changebtn" @click="changeStu" style="float:right;" type="primary" size="small">交换学生</el-button>
            </div>

            <div class="table-container" style="max-width:400px; margin-top:20px; float:left;">
                
                <el-row class="nsturow" style="width:100%;">
                <el-col :span="19"><div class="grid-content">
                    <div class="gridname" v-html="xgbj2.bjName?xgbj2.bjName:'请选择需要交换的班级'"></div><div v-if="xgbj2.bjName" class="classnuminfo">班级人数<span>{{xgbj2.students.length}}</span>人，男生<span>{{boy2list.length}}</span>人，女生<span>{{girl2list.length}}</span>人</div>
                </div></el-col>
                <el-col :span="5"><div class="grid-content">
                    <el-button style="float:right;" type="primary" @click="cancelBj(2)" size="small">取消</el-button>
                </div></el-col>
                </el-row>

                <el-table :data="xgbj2.students" height="400"  border style="width: 100%; margin-top:10px;" @selection-change="handleSelectionChange2" class="bjinfo">
                    <!--  :cell-style="cellStyle" -->
                    <el-table-column type="selection" width="50" :selectable='checkboxT'></el-table-column>
                    <el-table-column label="姓名" width="130">
                        <!-- prop="name" -->
                        <template slot-scope="scope">
                            <span style="color: #409EFF" v-if="scope.row.designateClass">{{scope.row.name}}</span>
                            <span style="color: #333" v-else>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sex" :formatter="formatRole" label="性别" width="100"> </el-table-column>
                    <el-table-column prop="totalScore" label="总成绩" width="119"></el-table-column>
                    <!-- <el-table-column prop="mobile" label="电话" width="119"></el-table-column>
                    <el-table-column prop="idCard" label="身份证号" width="200"></el-table-column> -->
                </el-table>
            </div>
        </div>
        <!-- 交换学生end -->
        <!-- 查看班级详情beg -->
        <el-dialog  title="查看详情" :visible.sync="dialogFormVisible" width="1000px" @close="closscheckmodel" style="margin-top: -80px">
            <p>（注：名字为<span style="color: #409EFF">蓝色</span>的学生已预设班级，不可交换） </p>
            <el-table :data="xslist" highlight-current-row border style="width: 100%;" class="bjinfo">
                <el-table-column fixed label="姓名" width="100">
                    <template slot-scope="scope">
                        <span style="color: #409EFF" v-if="scope.row.designateClass">{{scope.row.name}}</span>
                        <span style="color: #333" v-else>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed prop="totalScore" label="总分" width="100"></el-table-column>
                <el-table-column prop="mobile" label="手机号码" width="150"></el-table-column>
                <el-table-column prop="idCard" label="身份证号" width="200"> </el-table-column>
                <el-table-column prop="sex" :formatter="formatRole" label="性别" width="100"> </el-table-column>
                <el-table-column v-for="item in studentothercourselist" :key="item.courseId" :label="item.courseName">
                    <template slot-scope="scope">
                        <span v-if="scope.row[item.courseId]">{{scope.row[item.courseId].score}}</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 查看班级详情end -->
    </div>
</template>

<script>

import { PostClassList, GetClassStudentInfo, AllocationStudentClass, AllocationConfirm, Adjustmenthistory } from '../../../api/admin/division/index'
// Getkcsj, Getxndm,
export default {
    name: 'login',
    data() {
        return {
            red: 'red',
            changeboy1list: [],
            changeboy2list: [],
            changegirl1list: [],
            changegirl2list: [],
            boy1list: [],
            girl1list: [],
            boy2list: [],
            girl2list: [],
            xslist: [],
            checkList: [],
            dialogFormVisible: false,
            contentList: [],
            diffScore: '',
            bjinfo:[],
            courselist: [],
            bjList: [],
            xgbj1:{
                bjName: '',
                bjId: '',
                students: [
                ]
            },
            xgbj2:{
                bjName: '',
                bjId: '',
                students: [
                ]
            },
            multipleSelection1:[],
            multipleSelection2:[],
            class1id: '',
            class2id: '',
            students1id: [],
            students2id: [],
            params1: [],
            params2: [],
            rankarr: [],
            singledifference: [],
            rankingCountDifferences: [],
            othercourselist: [],
            studentothercourselist: [],
            from: '',
            routerbatch: ''
        }
    },
    mounted: function(){
        const GetYear = () => {
            const date = new Date()
            let y = date.getFullYear()
            return y
        }
        // 获取学年代码
        // Getxndm({xxdm: localStorage.getItem('xxdm')}).then(data => {
        //     let params = {
        //         page: 1,
        //         limit: 30,
        //         xxdm: localStorage.getItem('xxdm'),
        //         ssxn: data.xn,
        //         ssxq: data.xq
        //     }
        //     // 获取课程
        //     Getkcsj(params).then(data => {
        //         this.courselist = data.data.rows
        //     })
        // })
        this.from = this.$route.query.from ? this.$route.query.from : ''
        this.routerbatch = this.$route.query.datas ? this.$route.query.datas : JSON.stringify(GetYear())
        let params = {
            schoolCode:  this.$route.query.schoolCode ? this.$route.query.schoolCode : localStorage.getItem('xxdm'),
            batch: this.$route.query.datas ? this.$route.query.datas : JSON.stringify(GetYear()),
            state: 1
        }
        this.getcalsslist(params)
    },
    methods: {
        // 表格复选框
        checkboxT (row, index) {
            if (row.designateClass) {
                return 0
            } else {
                return 1
            }
        },
        // 表格单元格样式
        cellStyle({row, column, rowIndex, columnIndex}){
            if(row.designateClass){
                return 'color:#409EFF'
            }else{
                return 'color:#333'
            }
        },
        // 转换男女性别数字
        formatRole (row, column) {
            return row.sex === 1 ? '男' : '女'
        },
        // 关闭查看信息
        closscheckmodel () {
            this.dialogFormVisible = false
            this.checkList = []
        },
        // 点击查看
        handleCheck (index, row) {
            this.xslist = []
            let params = {
                schoolCode: localStorage.getItem('xxdm'),
                classId: row.id
            }
            this.getcalssInfo(params, 'check')
        },
        GetYear () {
            const date = new Date()
            let y = date.getFullYear()
            return y
        },
        // 转换男女性别数字
        formatRole (row, column) {
            return row.sex === 1 ? '男' : '女'
        },
        // 获取班级列表
        getcalsslist (params) {
            this.contentList = []
            this.rankarr = []
            PostClassList(params).then(data => {
                this.singledifference = data.courseAverageScoreDifferences
                this.rankingCountDifferences = data.rankingCountDifferences
                this.diffScore = data.maxAverageScoreDifference
                this.bjList = data.classInfos
                for (var i=0;i<this.bjList.length;i++) {
                    this.bjList[i].rankingCounts.forEach(item => {
                        this.rankarr.push({count: item.count, name: item.name, rankingId: item.rankingId, type: item.type})
                    })
                    this.bjList[i].courseAverageScores.forEach(item => {
                        this.othercourselist.push({averageScore: item.averageScore, courseId: item.courseId, courseName: item.courseName})
                    })
                    var course = {}
                    course['name'] = this.bjList[i].name
                    course['totalNum'] = this.bjList[i].totalNum
                    course['boyNum'] = this.bjList[i].boyNum
                    course['girlNum'] = this.bjList[i].girlNum
                    course['maleFemaleRatio'] = this.bjList[i].maleFemaleRatio
                    course['averageScore'] = this.bjList[i].averageScore
                    course['id'] = this.bjList[i].id
                    for (var j=0;j<this.bjList[i].courseAverageScores.length;j++) {
                        var conlist = {}
                        conlist['courseName'] = this.bjList[i].courseAverageScores[j].courseName
                        conlist['courseaverageScore'] = this.bjList[i].courseAverageScores[j].averageScore
                        conlist['courseId'] = this.bjList[i].courseAverageScores[j].courseId
                        course[this.bjList[i].courseAverageScores[j].courseId] = conlist;
                    }
                    for (var k=0;k<this.bjList[i].rankingCounts.length;k++) {
                        var ranklist = {}
                        ranklist['count'] = this.bjList[i].rankingCounts[k].count
                        ranklist['name'] = this.bjList[i].rankingCounts[k].name
                        ranklist['rankingId'] = this.bjList[i].rankingCounts[k].rankingId
                        ranklist['type'] = this.bjList[i].rankingCounts[k].type
                        course[this.bjList[i].rankingCounts[k].rankingId] = ranklist;
                    }
                    this.contentList.push(course)
                    this.othercourselist = this.splicearr2(this.othercourselist)
                    this.rankarr = this.splicearr(this.rankarr)
                }
                
            })
        },
        // 数组去重
        splicearr (arr) {
            var result = []
            for(var i=0;i<arr.length;i++) {
                for (var j=i+1;j<arr.length;j++) {
                    if (arr[i].rankingId === arr[j].rankingId) {
                        j = ++i
                    }
                }
                result.push(arr[i])
            }
            return result
        },
        splicearr2 (arr) {
            var result = []
            for(var i=0;i<arr.length;i++) {
                for (var j=i+1;j<arr.length;j++) {
                    if (arr[i].courseId === arr[j].courseId) {
                        j = ++i
                    }
                }
                result.push(arr[i])
            }
            return result
        },
        // 第一个班级查看复选
        handleSelectionChange1(val, event, column){
            this.multipleSelection1 = val;
        },
        // 第二个班级查看复选
        handleSelectionChange2(val){
            this.multipleSelection2 = val;
        },
        // 获取班级学生信息
        getcalssInfo (params, val) {
            GetClassStudentInfo(params).then(data => {
                this.xslist = []
                if (val === 'check') {
                    this.checkList = data
                    for (var i=0;i<this.checkList.length;i++) {
                        this.checkList[i].scores.forEach(item => {
                            this.studentothercourselist.push({courseId: item.courseId, courseName: item.courseName, id: item.id, score: item.score})
                        })
                        var course = {}
                        course['designateClass'] = this.checkList[i].designateClass
                        course['name'] = this.checkList[i].name
                        course['mobile'] = this.checkList[i].mobile
                        course['idCard'] = this.checkList[i].idCard
                        course['sex'] = this.checkList[i].sex
                        course['totalScore'] = this.checkList[i].totalScore
                        for (var j=0;j<this.checkList[i].scores.length;j++) {
                            var conlist = {}
                            conlist['courseName'] = this.checkList[i].scores[j].courseName
                            conlist['score'] = this.checkList[i].scores[j].score
                            conlist['courseId'] = this.checkList[i].scores[j].courseId
                            course[this.checkList[i].scores[j].courseId] = conlist;
                        }
                        this.xslist.push(course)
                    }
                    this.studentothercourselist = this.splicearr2(this.studentothercourselist)
                    this.dialogFormVisible = true
                } else{
                    if (this.xgbj1.students.length) {
                        this.xgbj2.bjName = val.name
                        this.xgbj2.bjId = val.id
                        this.xgbj2.students = data
                        this.class2id = val.id
                        this.boy2list = []
                        this.girl2list = []
                        this.xgbj2.students.forEach((item) => {
                            if (item.sex === 1) {
                                this.boy2list.push(item)
                            } else {
                                this.girl2list.push(item)
                            }
                        })
                    } else {
                        this.xgbj1.bjName = val.name
                        this.xgbj1.bjId = val.id
                        this.xgbj1.students = data
                        this.class1id = val.id
                        this.boy1list = []
                        this.girl1list = []
                        this.xgbj1.students.forEach((item) => {
                            if (item.sex === 1) {
                                this.boy1list.push(item)
                            } else {
                                this.girl1list.push(item)
                            }
                        })
                    }
                }
            })
        },
        // 点击输出准备交换学生
        handleCurrentChange(val){
            let params = {
                schoolCode: localStorage.getItem('xxdm'),
                classId: val.id
            }
            if (val) {
                if (!this.xgbj1.bjId) {
                    if (!this.xgbj2.bjId) {
                        this.getcalssInfo(params, val)
                    } else {
                        if (val.id === this.xgbj2.bjId) {
                            this.$notify({title: '提示', message: '请不要选择同一个班级', type: 'error', duration: 2000})
                        } else {
                            this.getcalssInfo(params, val)
                        }
                    }
                } else {
                    if (val.id === this.xgbj1.bjId) {
                        this.$notify({title: '提示', message: '请不要选择同一个班级', type: 'error', duration: 2000})
                    } else {
                        this.getcalssInfo(params, val)
                    }
                }
            }
        },
        // 交换班级学生
        allocationStudentClass (params) {
            AllocationStudentClass(params).then(data => {
                this.$notify({title: '交换学生', message: data, type: 'success', duration: 2000})
                let params = {
                    schoolCode: this.$route.query.schoolCode ? this.$route.query.schoolCode : window.localStorage.getItem('xxdm'),
                    batch: this.$route.query.datas ? this.$route.query.datas : window.localStorage.getItem('year'),
                    state: 1
                }
                this.getcalsslist(params)
            })
        },
        // 交换班级学生
        changeStu(){
            if (this.xgbj1.students.length && this.xgbj2.students.length) {
                if (this.multipleSelection1.length && this.multipleSelection2.length) {
                    if (this.multipleSelection1.length === this.multipleSelection2.length) {
                        this.boy1list = []
                        this.girl1list = []
                        this.girl2list = []
                        this.boy2list = []
                        this.multipleSelection1.forEach(item => {
                            this.params1.push({
                                Batch: this.routerbatch,
                                classId: this.class2id,
                                studentId: item.id,
                                schoolCode: item.schoolCode
                            })
                        })
                        this.multipleSelection2.forEach(item => {
                            this.params1.push({
                                Batch: this.routerbatch,
                                classId: this.class1id,
                                studentId: item.id,
                                schoolCode: item.schoolCode
                            })
                        })
                        this.allocationStudentClass(this.params1)
                        var that = this;
                        var del_index_arr_1 = [];
                        var del_index_arr_2 = [];

                        for(var i=0;i<this.multipleSelection1.length;i++){
                            del_index_arr_1.push(_.findIndex(this.xgbj1.students, function(o) { return o==that.multipleSelection1[i]}));
                        }
                        for(var i=0;i<this.multipleSelection2.length;i++){
                            del_index_arr_2.push(_.findIndex(this.xgbj2.students, function(o) { return o==that.multipleSelection2[i]}));
                        }
                        var temp;
                        for(var j=0;j<del_index_arr_1.length;j++){
                            temp = this.xgbj1.students[del_index_arr_1[j]]
                            this.xgbj1.students[del_index_arr_1[j]] = this.xgbj2.students[del_index_arr_2[j]];
                            this.xgbj2.students[del_index_arr_2[j]] = temp;
                        }
                        this.xgbj1.students.splice(this.xgbj1.students.length)
                        this.xgbj2.students.splice(this.xgbj2.students.length)
                        this.$set(this.xgbj1,"students",this.xgbj1.students)
                        this.$set(this.xgbj2,"students",this.xgbj2.students)
                        this.xgbj1.students.forEach((item) => {
                            if (item.sex === 1) {
                                this.boy1list.push(item)
                            } else {
                                this.girl1list.push(item)
                            }
                        })
                        this.xgbj2.students.forEach((item) => {
                            if (item.sex === 1) {
                                this.boy2list.push(item)
                            } else {
                                this.girl2list.push(item)
                            }
                        })
                    } else {
                        this.$message.error('交换学生人数出错');
                    }
                } else {
                    this.$notify({title: '提示', message: '请选择要交换的学生', type: 'error', duration: 2000})
                }
            } else if (!this.xgbj1.students.length && !this.xgbj2.students.length) {
                this.$notify({title: '提示', message: '请选择交换班级', type: 'error', duration: 2000})
            } else if (!this.xgbj1.students.length || !this.xgbj2.students.length) {
                this.$notify({title: '提示', message: '请选择要交换的班级', type: 'error', duration: 2000})
            }
             
        },
        // 取消
        cancelBj(no){
            if(no==1){
                this.boy1list = []
                this.girl1list = []
                this.xgbj1 = {
                    bjName: '',
                    bjId: '',
                    students: [
                    ]
                };
            }else if(no==2){
                this.girl2list = []
                this.boy2list = []
                this.xgbj2 = {
                    bjName: '',
                    bjId: '',
                    students: [
                    ]
                };
            }
        },
        // 确认分班
        groupresult(){
            let params = {
                schoolCode: this.$route.query.schoolCode ? this.$route.query.schoolCode : window.localStorage.getItem('xxdm'),
                batch: this.$route.query.datas ? this.$route.query.datas : window.localStorage.getItem('year')
            }
            AllocationConfirm(params).then(data => {
                this.$notify({title: '成功', message: '确认分班', type: 'success', duration: 1000})
                this.$router.push({path:'/newstudent/groupresult', query:{batch: data, from: 'Auto'}})
            })
        },
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
.fl{
    float: left;
}
.table-container{
    max-width:1000px;
}
.changeStuMain{
    float:left;
}
.changeStuBtn{
    width: 120px;
    padding: 0 20px;
    height: 500px;
    position: relative;
}
.changebtn{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
.diffScore{
    margin: 0 5px;
}
.el-table th{
    background: #f8f8f8;
}
.bjinfo td{
    padding:5px 0;
}
.gridname{
    float: left;
}
.classnuminfo{
    float: left;
    margin-left: 15px;
}
</style>

