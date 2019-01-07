<template>
    <div class="app-container calendar-list-container" style="padding-bottom:50px;float:left;">
        <!-- <el-button type="primary" @click="createschoolno">一键自动生成学号</el-button> -->
        <el-button type="primary" @click="previewbtn">打印录取通知</el-button>
        <el-button type="primary" @click.stop="exportautoclass">导出分班结果</el-button>
        <el-button type="primary" @click.stop="rankingstatistics">各名次段班级人数统计</el-button>
        <!-- 班级列表beg -->
        <div class="table-container" style="max-width:900px; min-width:900px; margin-top:20px">
            <ul class="tabletitle">
                <li v-for="(item, itemindex) in title" :key="itemindex">{{item}}</li>
            </ul>
            <table-list :dataSource="item" v-for="(item, index) in bjinfo.classInfo" :key="index"></table-list>
            <!-- @handleSelectionChange1='handleSelectionChange1' -->
            <div class="noinfo" v-if="!bjinfo.classInfo.length">暂无数据</div>
        </div>
        <!-- 班级列表end -->
        <!-- 选择班级输入说明beg -->
        <el-dialog title="打印录取通知书" :visible="dialogModelVisible" width="650px" @close="closeselect">
            <div class="preview_tit">请选择班级输入说明</div>
            <div class="preview_main2">
                <el-row class="nsturow">
                    <el-col :span="5"><div class="preview-content">
                    打印班级
                    </div></el-col>
                    <el-col :span="10">
                    <div class="selectionbox">
                        <ul v-if="show">
                        <li v-for="item in classlist" :key="item.value" @click.stop="selectclass(item.value, item.schoolCode, item.classId)">{{item.label}}</li>
                        </ul>
                        <div class="selection" :class="{avtive: ischose}" placeholder="请选择" @click.stop="choseclass">{{msg}}</div>
                    </div>
                    </el-col>
                </el-row>
            </div>
            <div class="preview_main">
                <el-row class="nsturow">
                    <el-col :span="5"><div class="preview-content">
                        入学说明
                    </div></el-col>
                    <el-col :span="19">
                        <div class="preview-content">
                        <el-input width="100%" :autosize="{ minRows: 4, maxRows: 4}" type="textarea" placeholder="请输入内容" v-model="textarea2"></el-input>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelselect">取 消</el-button>
                <el-button type="primary" @click="confirmselecet">确 认</el-button>
            </div>
        </el-dialog>
        <!-- 选择班级输入说明end -->
        <!-- 打印预览beg -->
        <el-dialog title="打印录取通知书" :visible="dialogFormVisible" width="650px" @close="close">
            <!-- @close="close" -->
            <div class="preview_tit">预览</div>
            <div ref="tablevew" class="tableinfo">
                <print-model :classintroduce="classintroduce" @cancelpreview="cancelpreview" :classlist="classlist" v-for="(item, index) in studentinfo" :key="index" :dataSource="item"></print-model>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelpreview">取 消</el-button>
                <el-button type="primary" @click="confirmpreview">打 印</el-button>
            </div>
        </el-dialog>
        <!-- 打印预览end -->
        <!-- 班级名次段人数统计beg -->
        <el-dialog
            title="各名次段班级人数统计"
            :visible.sync="dialogRankVisible"
            @close="closeDialog"
            width="1000px">
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        设置统计名次段：
                        <span class="ranklistbox" v-for="(item, index) in ranklist" :key="index">
                            <!-- step="5" -->
                            <el-input type="number" oninput="if(value.length>3)value=value.slice(0,3)" v-model="item.rankNode" min="0" style="width: 75px;margin-left: 10px;margin-bottom: 10px;" :disabled="isable"></el-input>
                            <span class="delect-rank-btn" @click.stop="delectrank(item, index)" v-if="isedit">x</span>
                        </span>
                        <el-button style="margin-left: 20px;" type="text" @click.stop="addrank" v-if="isedit">添加</el-button>
                        <el-button style="margin-left: 20px;" type="text" @click.stop="editrank" v-if="!isedit">编辑</el-button>
                        <el-button style="margin-left: 20px;" type="text" @click.stop="sureeditrank" v-if="isedit">确定</el-button>
                        <el-button style="margin-left: 20px;" type="text" @click.stop="canceleditrank" v-if="isedit">取消</el-button>
                    </div>
                </el-col>
                <el-col :span="24" style="margin: 15px 0;">
                    <div class="grid-content bg-purple-dark">
                        <el-button type="primary" @click.stop="startstastic">开始统计</el-button>
                        <el-button type="primary" @click.stop="exportranknum">导出</el-button>
                    </div>
                </el-col>
                <el-col :span="24" style="margin: 15px 0;">
                    <div class="grid-content bg-purple-dark" style="font-size: 15px;font-weight: 600;width: 50px;border-bottom: 2px solid rgb(100, 134, 245);">
                        总成绩
                    </div>
                </el-col>
                <table-line :dataSource='firstfewlist' v-if="firstfewlist.length"></table-line>
                <!-- <el-table
                    :data="tableData"
                    border
                    max-height="400"
                    style="width: 100%; margin-top: 20px">
                    <el-table-column
                        fixed
                        prop="name"
                        :label="tabletitle"
                        > -->
                        <!-- <el-table-column
                        fixed
                        prop="name"
                        label="班级"
                        width="120"
                        > -->
                        <!-- </el-table-column> -->
                    <!-- </el-table-column>
                    <el-table-column v-for="(item, index) in Listoflist" :key="index" :label="item.name">
                        <template slot-scope="scope">
                            <span v-if="scope.row[item.rankingId]">{{scope.row[item.rankingId].count}}</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                </el-table> -->
            </el-row>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click.stop="cancel">取 消</el-button>
                <el-button type="primary" @click.stop="Determine">确 定</el-button>
            </span> -->
        </el-dialog>
        <!-- 班级名次段人数统计end -->
    </div>
</template>
<script>
import { PostClassList, GetClassStudentInfo, ExcelExport, GetRankList, StatisticsRank, ExportClassRank, DelectRank, EditRange, GetGroupHistory, PostRange } from '../../../api/admin/division/index'
import TableList from './TableList'
import PrintModel from './PrintModel'
import TableLine from './TableLine'
// import Print from 'print-js'
export default {
    name: 'login',
    components: {
        TableList, PrintModel, TableLine
    },
    data() {
        return {
            tabletitle: '',
            isable: true,
            isedit: false,
            tableData: [],
            ranklist: [],
            input: '',
            dialogRankVisible: false,
            dialogModelVisible: false,
            studentinfo: [],
            title: ['班级编号', '班级人数', '男生数', '女生数', '男女比例', '成绩平均分'],
            expands: [],
            show: false,
            ischose: false,
            msg: '',
            dialogFormVisible:false,
            bjinfo: {
                classInfo: []
            },
            allData:[],
            checkBj: '',
            textarea2:'',
            xxdm: localStorage.getItem('xxdm'),
            batchs: '',
            classlist: [],
            paramscanshu: {},
            classintroduce: {},
            schoolCode: '',
            batch: '',
            Listoflist: [],
            firstfewlist: [],
            iskong: false,
            islength: false,
            isnegative: false,
            ranklistlength: 0,
            newranklist: [],
            oldranklist: [],
            ischangerank: false,
            ispadden: false
        }
    },
    mounted: function(){
        const GetYear = () => {
            const date = new Date()
            let y = date.getFullYear()
            return y
        }
        if (this.$route.query.from === 'history') {
            this.schoolCode = this.$route.query.schoolCode
            this.batch = this.$route.query.datas
            let params = {
                schoolCode: this.$route.query.schoolCode,
                batch: this.$route.query.datas,
                state: 2
            }
            this.getclasslist(params)
        } else if (this.$route.query.from === 'Auto') {
            this.schoolCode = window.localStorage.getItem('xxdm')
            this.batch = this.$route.query.batch
            let params = {
                schoolCode: window.localStorage.getItem('xxdm'),
                batch: this.$route.query.batch,
                state: 2
            }
            this.getclasslist(params)
        } else {
            GetGroupHistory({xxdm: localStorage.getItem('xxdm')}).then(data => {
                this.schoolCode = data[0].schoolCode
                this.batch = data[0].batch
                let params = {
                    schoolCode: data[0].schoolCode,
                    batch: data[0].batch,
                    state: 2
                }
                this.getclasslist(params)  
            })
        }
        this.batchs = GetYear() 
    },
    methods: {
        // 确认按钮
        Determine () {
            this.isedit = false
            this.isable = true
            this.dialogRankVisible = false
            this.tableData = []
            this.firstfewlist = []
        },
        // 取消按钮
        cancel () {
            this.isedit = false
            this.isable = true
            this.dialogRankVisible = false
            this.tableData = []
            this.firstfewlist = []
        },
        
        // 关闭弹窗
        closeDialog () {
            this.isedit = false,
            this.isable = true
            this.tableData = []
            this.firstfewlist = []
        },
        // 获取班级列表
        getclasslist (params) {
            // 获取班级列表
            PostClassList(params).then(data => {
                this.bjinfo.classInfo = data.classInfos
                this.bjinfo.classInfo.forEach(item => {
                    item.studentInfo = []
                    this.classlist.push({value: item.name, label: item.name, schoolCode: item.schoolCode, classId: item.id})
                });
            })
        },
        // 开始统计
        startstastic () {
            this.iskong = false
            this.islength = false
            this.tableData = []
            this.firstfewlist = []
            this.Listoflist = []
            let params = {
                schoolCode: this.schoolCode,
                batch: this.batch
            }
            if (this.ranklist.length) {
                this.islength = true
                this.ranklist.forEach(item => {
                    if (item.rankNode !== '') {
                        this.iskong = true
                    } else {
                        this.iskong = false
                    }
                })
                if (this.iskong) {
                    StatisticsRank(params).then(data => {
                        this.firstfewlist = data
                        // for (var i=0; i<this.firstfewlist.length; i++) {
                        //     this.firstfewlist[i].rankingCounts.forEach(item => {
                        //         this.Listoflist.push({count: item.count, name: item.name, rankingId: item.rankingId, type: item.type})
                        //     })
                        //     var ranking = {}
                        //     ranking['classId'] = this.firstfewlist[i].classId
                        //     ranking['name'] = this.firstfewlist[i].name
                        //     ranking['type'] = this.firstfewlist[i].type
                        //     for (var j=0; j<this.firstfewlist[i].rankingCounts.length; j++) {
                        //         var rankingCounts = {}
                        //         rankingCounts['count'] = this.firstfewlist[i].rankingCounts[j].count
                        //         rankingCounts['name'] = this.firstfewlist[i].rankingCounts[j].name
                        //         rankingCounts['rankingId'] = this.firstfewlist[i].rankingCounts[j].rankingId
                        //         rankingCounts['type'] = this.firstfewlist[i].rankingCounts[j].type
                        //         ranking[this.firstfewlist[i].rankingCounts[j].rankingId] = rankingCounts
                        //     }
                        //     this.tableData.push(ranking)
                        //     this.Listoflist = this.splicearr(this.Listoflist)
                        // }
                    })
                } else {
                    // 提醒
                    this.$notify({title: '提示', message: '您有信息未填', type: 'error', duration: 2000})
                }
            } else {
               this.islength = false
                // 提醒
                this.$notify({title: '提示', message: '您还没设名次段', type: 'error', duration: 2000})
            }
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
        // 导出班级各名次段人数
        exportranknum () {
            let params = {
                schoolCode: this.schoolCode,
                batch: this.batch
            }
            ExportClassRank(params).then(data => {
                var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
                var downloadElement = document.createElement('a');
            　　var href = window.URL.createObjectURL(blob); //创建下载的链接
            　　downloadElement.href = href;
            　　downloadElement.download = '班级各名次段人数表.xlsx'; //下载后文件名
            　　document.body.appendChild(downloadElement);
            　　downloadElement.click(); //点击下载
            　　document.body.removeChild(downloadElement); //下载完成移除元素
            　　window.URL.revokeObjectURL(href); //释放掉blob对象 
            })
        },
        // 判断数组是否重复
        isRepeat(arr){
        var hash = {};
        for(var i in arr) {
            if(hash[arr[i]])
            return true;
            this.ispadden = true;
            hash[arr[i]] = true;
        }
        this.ispadden = false
        return false;
        },
        // 取消编辑
        canceleditrank () {
            this.ranklist = JSON.parse(JSON.stringify(this.$store.state.division.ranklist))
            this.isedit = false,
            this.isable = true
        },
        // 编辑名次段
        editrank () {
            this.isedit = true
            this.isable = false
        },
        // 删除名次段
        delectrank (datas, index) {
            // this.ranklist.splice(index, 1)
            if (datas.id) {
                DelectRank(datas.id).then(data => {
                    this.$notify({title: '提示', message: '删除成功', type: 'error', duration: 2000})
                    this.ranklist.splice(index, 1)
                })  
            } else {
                this.ranklist.splice(index, 1)
            }
        },
        // 添加名次段
        addrank () {
            if (this.ranklist.length <= 5) {
                this.ranklist.push({batch: this.batch, schoolCode: this.schoolCode, orderNo: 0, studentCount: 0, rankNode: 0, state: 2})
            } else {
                this.$message({
                    message: '添加已达上限！',
                    type: 'warning'
                });
            }
        },
        postranklist () {
            PostRange(this.newranklist).then(data => {
                // if (this.ischangerank) {
                    this.isedit = false
                    this.isable = true
                    this.rankingstatistics()
                // }
            })
        },
        // 修改名次段
        cahngerank (datas) {
            EditRange(datas).then(data => {
                // if (!this.ischangerank) {
                    this.isedit = false
                    this.isable = true
                    this.rankingstatistics() 
                // }
            })
        },
        // 确认编辑
        sureeditrank () {
            var arr = []
            this.newranklist = []
            this.oldranklist = []
            this.ranklist.forEach(item => {
                if (item.rankNode === '') {
                    this.iskong = false
                } else {
                    if (JSON.parse(item.rankNode) < 0) {
                        this.isnegative = true
                    } else {
                        this.isnegative = false
                        this.iskong = true
                    }
                }
            })
            if (this.iskong && !this.isnegative) {
                // EditRange(this.ranklist).then(data => {
                //     this.isedit = false
                //     this.isable = true
                // })
                if (this.ranklist.length >= this.ranklistlength) {
                    // this.ischangerank = true
                    this.ranklist.forEach(item => {
                        arr.push(parseInt(item.rankNode))
                        if (!item.id) {
                            this.newranklist.push(item)
                        } else {
                            this.oldranklist.push(item)
                        }
                    })
                    this.isRepeat(arr)
                    if (this.ispadden) {
                        this.$notify({title: '提示', message: '名次段重复', type: 'error', duration: 2000})
                    } else {
                        if (this.newranklist.length) {
                            this.postranklist(this.newranklist)
                        }
                        if (this.oldranklist.length) {
                            this.cahngerank(this.oldranklist)
                        }
                    }
                    
                } else {
                    this.ranklist.forEach(item => {
                        if (!item.id) {
                            this.newranklist.push(item)
                        } else {
                            this.oldranklist.push(item)
                        }
                    })
                    if (this.newranklist.length) {
                        this.postranklist(this.newranklist)
                    }
                    if (this.oldranklist.length) {
                        this.cahngerank(this.oldranklist)
                    }
                    // this.cahngerank(this.ranklist)
                }
            } else if (this.iskong && this.isnegative) {
                this.$notify({title: '提示', message: '名次段不能为负数', type: 'error', duration: 2000})
            } else if (!this.iskong) {
                this.$notify({title: '提示', message: '您有信息未填写', type: 'error', duration: 2000})
            }
        },
        // 名次统计
        rankingstatistics () {
            if (this.batch !== '') {
                let params = {
                    schoolCode: this.schoolCode,
                    batch: this.batch,
                    state: 2
                }
                // 获取名次段列表
                GetRankList(params).then(data => {
                    this.$store.dispatch('set_ranklist', data)
                    this.ranklist = JSON.parse(JSON.stringify(data))
                    this.ranklistlength = data.length
                })
                this.dialogRankVisible = true
            } else {
                this.$notify({title: '提示', message: '分班结果不存在', type: 'error', duration: 2000})
            }
            
        },
        // 关闭选择班级
        closeselect () {
            this.dialogModelVisible = false
            this.msg = '',
            this.textarea2 = ''
        },
        selectclass (value, schoolCode, classId) {
            this.paramscanshu.schoolCode = schoolCode
            this.paramscanshu.classId = classId
            this.msg = value
            this.show = false
            this.ischose = false
        },
        //   选择班级下拉
        choseclass () {
            this.ischose = !this.ischose
            this.show = !this.show
        },
        // 取消选择班级
        cancelselect () {
            this.dialogModelVisible = false
        },
        // 确认选择班级
        confirmselecet () {
            if (this.msg) {
                this.classintroduce.msg = this.msg
                this.classintroduce.textarea = this.textarea2
                this.dialogModelVisible = false
                this.getcalssInfo(this.paramscanshu)
                setTimeout(() => {
                    this.dialogFormVisible = true
                }, 500)  
            } else {
                this.$notify({title: '提示', message: '请选择班级', type: 'error', duration: 2000})
            }
        },
        // 获取班级学生信息
        getcalssInfo (params) {
            GetClassStudentInfo(params).then(data => {
            this.studentinfo = data
            })
        },
        // 勾选学生
        handleSelectionChange1 (val) {
            this.studentinfo = val
        },
        GetYear () {
            const date = new Date()
            let y = date.getFullYear()
            return y
        },
        // 导出分班结果
        exportautoclass () {
            let params = {
                SchoolCode: localStorage.getItem('xxdm'),
                Batch: this.batch
            }
            ExcelExport(params).then(data => {
                var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
                var downloadElement = document.createElement('a');
            　　var href = window.URL.createObjectURL(blob); //创建下载的链接
            　　downloadElement.href = href;
            　　downloadElement.download = '分班信息.xlsx'; //下载后文件名
            　　document.body.appendChild(downloadElement);
            　　downloadElement.click(); //点击下载
            　　document.body.removeChild(downloadElement); //下载完成移除元素
            　　window.URL.revokeObjectURL(href); //释放掉blob对象 
            })
        },
        // 打印预览
        previewbtn(){
            this.dialogModelVisible = true
        },
        // 取消预览
        cancelpreview(val){
            this.dialogFormVisible = false;
        },
        // 关闭对话框
        close () {
            this.dialogFormVisible = false
        },
      // 确认打印
      confirmpreview () {
        let newContent = this.$refs.tablevew.innerHTML
        let oldContent = document.body.innerHTML
        document.body.innerHTML = newContent
        window.print()
        // document.body.innerHTML = oldContent
        window.location.reload()
        document.body.innerHTML = oldContent
        return false
      }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
.fl{
    float: left;
}
.nsturow{
    padding:10px 0;
}
.nsturow:after{
    content:"\20";display:block;height:0;clear:both
}
.el-table .cell{
    line-height:30px;
}
.el-table__expanded-cell{
    padding:20px 0px 20px 40px !important;
}
.table-container{
    max-width:1000px;
    .tabletitle{
        width: 100%;
        height: 50px;
        background: #eee;
        margin: 0;
        /* padding: 10px; */
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        li{
            width: 100px;
            list-style: none;
            height: 100%;
            font-size: 14px;
            color: rgb(116, 109, 109);
            line-height: 50px;
        }
    }
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
.preview_tit{
    font-size:20px;
    width:100%;
    text-align: center;
}
.tableinfo{
    width: 100%;
    height: 600px;
    overflow-x: hidden;
    overflow-y: scroll;
}
.preview_main{
    margin-top:20px;
    padding:30px;
    background:#f0f0f0;
}
.preview_main2{
    padding:10px 30px;
    background:#FFF;
}
.preview-content{
    line-height:50px;
    font-size:16px;
    padding-right:10px;
}
.selectionbox{
    position: relative;
    ul{
        margin: 0;
        padding: 0;
        background: #fff;
        position: absolute;
        width: 216px;
        bottom: 30px;
        max-height: 200px;
        border-radius: 5px;
        border: 1px solid #eee;
        overflow-x: hidden;
        overflow-y: scroll;
        margin-bottom: 10px;
        li{
            height: 40px;
            width: 100%;
            list-style: none;
            line-height: 40px;
            padding-left: 5px;
            border-bottom: solid 1px #eee;
            cursor: pointer;
        }
        li:last-child{
            border-bottom: none;
        }
    }
    /* ul::after{
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #eee;
        content: "";  
        position: relative;      
        width: 0; 
        top: 21px;
        left: 20px;
    } */
}
.simulationinput{
    background: #ffffff;
    text-align: start;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 5px;
    min-height: 100px;
    padding: 10px;
}
.simulationinput:empty::before {  
    content: attr(placeholder);
    color: #ccc;
}
.selection{
    width: 216px;
    height: 38px;
    background-color: #ffff;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    padding-left: 15px;
    line-height: 40px;
    transition: all .5s ease-in-out;
}
.selection:empty::before {  
    content: attr(placeholder);
    color: #ccc;
}
.selection:hover{
    border: 1px solid #ccc;
}
.selection::after{
    content: '';
    width: 8px;
    height: 8px;
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
    position: absolute;
    transform: rotate(135deg);
    right: 11px;
    top: 13px;
    transition: all .5s ease-in-out;
}
.avtive::after{
    transform: rotate(-45deg)
}
.noinfo{
    width: 100%;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 1px solid #eee;
}
.ranklistbox{
    display: inline-block;
    position: relative;
}
.delect-rank-btn{
    display: inline-block;
    position: absolute;
    top: -8px;
    width: 18px;
    height: 18px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    color: #fff;
    text-align: center;
    line-height: 16px;
    right: -8px;
    cursor: pointer;
}
</style>

