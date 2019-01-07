<template>
    <div class="app-container calendar-list-container" style="padding-bottom:50px;float:left;">
        <!-- 顶部beg -->
        <div class="filter-container">
            <div class="select_box">学年学期 
                <el-select  class="schoolYear" v-model="listQuery.xn" placeholder="请选择" size="small" @change="getList">
                    <el-option
                        v-for="(item, index) in schoolyearlist"
                        :key="index"
                        :value="item">
                        {{item+'年'}}
                    </el-option>
                </el-select>
                <el-select  class="schoolYear" v-model="listQuery.xq" placeholder="请选择" size="small" @change="getList">
                    <el-option
                        v-for="(item, index) in semesterlist"
                        :key="index"
                        :label="item.xqmc"
                        :value="item.xq">
                    </el-option>
                </el-select>
            </div>   
            <div class="select_box">年级班级
                <el-select  class="schoolYear" v-model="listQuery.njdm" placeholder="请选择" size="small" @change="getList">
                    <el-option
                        v-for="(item, index) in gradelist"
                        :key="index"
                        :label="item.njmc"
                        :value="item.njdm">
                    </el-option>
                </el-select>
                <el-select  class="schoolYear" v-model="listQuery.bjId" placeholder="请选择" size="small" @change="getList">
                    <el-option
                        v-for="(item, index) in classlist"
                        :key="index"
                        :label="item.bj"
                        :value="item.uuid">
                    </el-option>
                </el-select>
            </div>
            <div class="select_box">科目
                <el-select  class="schoolYear" v-model="curriculumIndex" placeholder="请选择" size="small" @change="getList">
                    <el-option
                        v-for="(item, index) in curriculumlist"
                        :key="index"
                        :label="item.kcmc"
                        :value="index">
                    </el-option>
                </el-select>
                <el-input size="small" style="width: 150px;" v-model="searchInfo" placeholder="请输入姓名" @blur="getList"> </el-input>
                <el-button size="small" style="margin-left: 10px;"  type="primary" icon="edit" @click="exporttable" :loading="downloads">导出</el-button>
            </div>
        </div>
        <!-- 顶部end -->
        <!-- 表格区域beg -->
        <div class="table-container" style="max-width:1250px; min-width:900px; margin-top:45px;">
            <dynamic-table :table-data="tableData" :table-header="tableheader" :height="height" v-if="tableData.length"></dynamic-table>
            <!--  v-if="dynamicTableShow" -->
            <!--  :table-header="tableConfig" -->
        </div>
        <!-- 表格区域end -->
    </div>
</template>

<script>
import {
    school_page,
    getXn,
    getXq,
    getNj,
    getXk,
    dqxnxqObj,
    getBj,
    GetCredit,
    ImportRportlateDownload
} from 'api/project/creditInquiry/index'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import DynamicTable from './DynamicTable'
export default {
    name: "creditSearch",
    components: {
        DynamicTable
    },
    data() {
        return {
            height: 800 + 'px',
            // dynamicTableShow: true, // 使得DynamicTable组件重新渲染变量
            // areaLoading: false,
            listQuery:{ // 基础信息
                xxdm: window.localStorage.getItem('xxdm'),
                xn: '',
                xq: '',
                njdm: '',
                bjId: '',
                kcmc: '',
                kcId: '',
                xm: '',
            },
            curriculumIndex: 0, // 课程列表下标
            schoolyearlist: [],// 学年列表
            semesterlist: [], // 学期列表
            gradelist: [], // 年级列表
            classlist: [], // 班级列表
            curriculumlist: [], // 课程列表
            searchInfo: '', // 搜索信息
            classidArr: [], // 班级id列表
            
            tableData: [], // 表格数据
            tablearr: [], // 表格项目数组集合
            tablearr2: [], // 表格项目数据暂存
            rwlist: [], // 任务列表暂存
            tableheader: [], // 表头数据集
            downloads: false, // 下载加载动画
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        // 合并行列
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (rowIndex % 2 === 0) {
                if (columnIndex === 0) {
                    return [1, 2];
                } else if (columnIndex === 1) {
                    return [0, 0];
                }
            }
        },

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
                }), 
                getNj({
                    xxdm: _this.listQuery.xxdm,
                    page: 1,
                    limit: 50,
                }),
                getXk({
                    xxdm: _this.listQuery.xxdm,
                    page: 1,
                    limit: 50,
                })]).then(function (res) {
                // console.log(res)
                let res0 = res[0];
                let res1 = res[1].data.rows;
                let res2 = res[2].data.rows;
                let res3 = res[3].data.rows;
                let res4 = res[4].data.rows;
                // 学年
                let schoolyearlist = [];
                if(res1) {
                    for(let i = 0; i < res1.length; i++) {
                        if(schoolyearlist.indexOf(res1[i].xn) < 0) {
                            schoolyearlist.push(res1[i].xn)
                        }
                    }
                }  
                _this.schoolyearlist = schoolyearlist;

                // 学期
                _this.semesterlist = res2;

                // 年级
                // console.log(res3)
                _this.gradelist = res3;
                
                // 课程
                _this.curriculumlist = res4;
                // console.log(res4)
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
        
                _this.listQuery.xn = schoolyearlist[schoolyearIndex];
                _this.listQuery.xq = res2[semesterIndex].xq;
                _this.listQuery.njdm = res3[0].njdm;
                _this.curriculumIndex = 0;
                // _this.getAllBj()
                setTimeout(() => {
                    _this.getList()
                }, 100)
            });
        },
        async getList() {
            this.tablearr = []
            this.tablearr2 = []
            this.tableData = []
            this.tableheader = []
            this.listQuery.xm = this.searchInfo;
            this.listQuery.kcId = this.curriculumlist[this.curriculumIndex].uuid;
            this.listQuery.kcmc = this.curriculumlist[this.curriculumIndex].kcmc;
            this.classlist = await this.getAllBj()
            if (this.classlist.length) {
                this.listQuery.bjId = this.classlist[0].uuid
                let bjidArr = [];  //班级代码value数组
                for(let i = 0; i < this.classlist.length; i++) {
                    bjidArr.push(this.classlist[i].uuid) 
                }
                this.classidArr = bjidArr

                console.log(this.listQuery)
                if (this.listQuery.bjId) {
                    GetCredit(this.listQuery).then(data => {
                        // console.log(data)
                        let _this = this 
                        data.studentXmDfList.forEach(el => {
                            if (el.xmReportList) {
                                if (el.xmReportList.length) {
                                    _this.tablearr.push(el.xmReportList)
                                }  
                            }
                        });
                        _this.tablearr.forEach(el => {
                            el.forEach(item => {
                                _this.tablearr2.push(item)
                            })
                        })
                        var arr = this.splicearr(this.tablearr2)
                        // console.log(arr)
                        this.tableheader = arr
                        this.tableData = data.studentXmDfList
                    }).catch(error => {
                        console.log(error)
                    })
                } else {
                    this.$notify({
                        title: '提示',
                        message: '没有班级代码',
                        type: 'warning',
                        duration: 1000
                    });
                }
                
            } else {
                this.$notify({
                    title: '提示',
                    message: '该年级没有数据',
                    type: 'warning',
                    duration: 1000
                });
            }
            

            
            
        },
        // 数组去重
        splicearr (arr) {
            var result = []
            for(var i=0;i<arr.length;i++) {
                for (var j=i+1;j<arr.length;j++) {
                    if (arr[i].uuid === arr[j].uuid && !arr[i].ywzx && !arr[j].ywzx) {
                        // if (arr[i].rwList.length === arr[j].rwList.length) {
                        //     j = ++i
                        // }
                        if (arr[i].rwList.length >= arr[j].rwList.length) {
                            arr[j] = arr[i]
                            j = ++i
                        } else if (arr[i].rwList.length <= arr[j].rwList.length) {
                            arr[j] = arr[j]
                            j = ++i
                        }
                    } else if (arr[i].uuid === arr[j].uuid && arr[i].ywzx && arr[j].ywzx) {
                        if (arr[i].zxmList.length >= arr[j].zxmList.length) {
                            arr[j] = arr[i]
                            j = ++i
                        } else if (arr[i].zxmList.length <= arr[j].zxmList.length) {
                            arr[j] = arr[j]
                            j = ++i
                        }
                    }
                    // if ((arr[i].uuid === arr[j].uuid && arr[i].rwList.length === arr[j].rwList.length)||(arr[i].uuid === arr[j].uuid && arr[i].ywzx === arr[j].ywzx && arr[i].zxmList.length === arr[j].zxmList.length)) {
                    //     j = ++i
                    // }
                }
                result.push(arr[i])
            }
            return result
        },
        splicearr2 (arr) {
            var result = []
            for(var i=0;i<arr.length;i++) {
                for (var j=i+1;j<arr.length;j++) {
                    if (arr[i].uuid === arr[j].uuid && arr[i].rwList.length >= arr[j].rwList.length) {
                        arr[j] = arr[i]
                        j = ++i
                    } else if (arr[i].uuid === arr[j].uuid && arr[i].rwList.length <= arr[j].rwList.length) {
                        arr[j] = arr[j]
                        j = ++i
                    }
                }
                result.push(arr[i])
            }
            return result
        },
        // 获取年级所有班级
        async getAllBj () {
            let stastic = []
            await getBj({
                xxdm: this.listQuery.xxdm,
                njdm: this.listQuery.njdm,
                xn: this.listQuery.xn
            }).then(response => {
                console.log(response)
                if (response.length) {
                    stastic = response
                } else {

                }
                
                // this.classlist = response
                // this.listQuery.bjId = response[0].uuid
                // let bjidArr = [];  //班级代码value数组
                // for(let i = 0; i < this.classlist.length; i++) {
                //     bjidArr.push(this.classlist[i].uuid) 
                // }
                // this.classidArr = bjidArr
            })
            return stastic
        }, 
        // 导出
        exporttable(){
            this.downloads = true
            let params = {
                // njMc: '',
                // bjMc: '',
                xxdm: this.listQuery.xxdm,
                xn: this.listQuery.xn,
                xq: this.listQuery.xq,
                njdm: this.listQuery.njdm,
                bjId: this.listQuery.bjId,
                kcId: this.listQuery.kcId,
                kcmc: this.listQuery.kcmc,
                // xm: this.listQuery.xm
            }
            ImportRportlateDownload(params).then(data => {
                var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
                var downloadElement = document.createElement('a');
            　　var href = window.URL.createObjectURL(blob); //创建下载的链接
            　　downloadElement.href = href;
            　　downloadElement.download = '年级班级学分表单.xlsx'; //下载后文件名
            　　document.body.appendChild(downloadElement);
            　　downloadElement.click(); //点击下载
            　　document.body.removeChild(downloadElement); //下载完成移除元素
            　　window.URL.revokeObjectURL(href); //释放掉blob对象
                this.downloads = false
            }).catch(error => {
                setTimeout(() => {
                    this.downloads = false
                }, 1000)
                console.log(error)
            })
        }
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
    }
</style>