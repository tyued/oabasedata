<template>
    <div class="app-container calendar-list-container">
        <div class="table-container divcenter nstumain">
            <el-row class="nsturow">
                <el-col :span="24"><div class="grid-content bg-purple-dark">
                    新生总人数 <span class='green'>{{studentlist.totalNum}}</span>人,男生<span class='green'>{{studentlist.boyNum}}</span>人,女生<span class='green'>{{studentlist.girlNum}}</span>人
                </div></el-col>
                
            </el-row>
            <el-row class="nsturow">
                <el-col :span="2"><div class="grid-content rowtit">
                   <span style="color: red">*</span>班级数:
                </div></el-col>
                <el-col :span="22"><div class="grid-content rowcont">
                    <el-input class="inlineipt" :maxlength="2" v-model="studentparams.classNum" placeholder="请输入班级数"></el-input>个
                </div></el-col>
                
            </el-row>
            <el-row class="nsturow">
                <el-col :span="2"><div class="grid-content rowtit">
                    分班依据:
                </div></el-col>
                <el-col :span="22"><div class="grid-content rowcont">
                    <div class="title">
                        <div class="xztj">勾选分班条件</div>
                        <!-- <div class="yxj">设置优先级</div> -->
                    </div>
                </div></el-col>
                <!-- <el-col :span="4"><div class="grid-content rowtit">
                        分班依据:
                </div></el-col> -->
                <el-col :span="22" style="margin-left: 8.5%;"><div class="grid-content rowcont">
                    <div>
                        <el-checkbox-group v-model="checkList" v-for="item in basisorder" :key="item.type" style="width: 100%;">
                            <el-col :span="24" v-if="item.type==0">
                                <el-checkbox label="A" :checked=studentparams.scoreAverage @change="check1">按成绩均分</el-checkbox>
                                <div class="chk-inline-div">(每个班级的成绩平均分之差控制在
                                    <!-- <el-input :maxlength="4" class="inlineipt" v-model="studentparams.averageScoreDifference" style="width:60px;"></el-input> -->
                                    最小值,各单科成绩平均分之差控制在
                                    <!-- <el-input class="inlineipt" :maxlength="4" v-model="studentparams.scoreAverageScoreDifference" style="width:60px;"></el-input> -->
                                    最小值)</div>
                                <!-- <el-select v-model="value" placeholder="" style="width: 60px;float: right;margin-right: 20px;" @change="selectachievement(value, type=0)">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select> -->
                            </el-col>
                            <el-col :span="24" v-else-if="item.type==1">
                                <div>
                                    <el-checkbox label="C" :checked=rankd @change="check3">按名次段人数均分</el-checkbox>
                                    <el-button type="text" style="margin-left: 100px" @click.stop="addcondition">添加名次段</el-button>
                                    <el-button type="text" class="newbtn" @click.stop="opencondition" v-if="Rank.length">{{isopen ? '收起' : '展开'}}</el-button>
                                    <!-- <el-select v-model="value2" placeholder="" style="width: 60px;float: right;margin-right: 20px;" @change="selectachievement(value2, type=1)">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select> -->
                                </div>
                                <div style="width: 100%;position: relative;" v-show="isopen">
                                    <!-- <div> -->
                                    <!--  v-model="studentparams.averageScoreDifference" -->
                                    <el-col :span="24" style="padding-left: 50px;">
                                        <div style="padding: 10px;border: 1px solid #eee;margin: 10px 0;border-radius: 5px;" v-if="Rank.length">
                                            <div v-for="(item, index) in Rank" :key="index">
                                                <div class="chk-inline-div">前</div><el-input class="inlineipt" :maxlength="4" v-model="item.rankNode" style="width:65px;"></el-input>
                                                <div class="chk-inline-div">名学生分配在每个班级的人数之差控制</div>
                                                <!-- <el-input class="inlineipt" :maxlength="3" v-model="item.studentCount" style="width:60px;"></el-input> -->
                                                <div class="chk-inline-div">在最小值</div>
                                                <el-button icon="el-icon-error" circle @click.stop="deleteranklist(item, index)" style="margin-left: 10px;"></el-button>
                                                <!-- <el-select v-model="item.orderNo" placeholder="" style="width: 60px;float: right;" @change="handelchange">
                                                    <el-option
                                                    v-for="item in options2"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                    </el-option>
                                                </el-select> -->
                                            </div>
                                        </div>
                                    </el-col>
                                    <!-- </div> -->
                                </div>
                            </el-col>
                            <el-col :span="24" v-else-if="item.type==2">
                                <el-checkbox label="B" :checked=studentparams.sexAverage @change="check2">按性别均分(每个班级的男女比例相同)</el-checkbox>
                                <!-- <el-select v-model="value3" placeholder="" style="width: 60px;float: right;margin-right: 20px;" @change="selectachievement(value3, type=2)">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select> -->
                            </el-col>
                        </el-checkbox-group>
                    </div>

                </div></el-col>
            </el-row>
            <el-row class="nsturow">
                <el-col :span="4"><div class="grid-content rowtit">&nbsp;
                </div></el-col>
                <el-col :span="20"><div class="grid-content rowtit">
                    <el-button type="primary" @click="startGroup" class="fl" :loading="isloading">开始分班</el-button>
                </div></el-col>
            </el-row>
            <!-- 注意事项beg -->
            <el-row class="nsturow">
                <el-col :span="24"><div class="grid-content bg-purple-dark">
                    <h2 style="color: lightgreen;font-size: 16px;">注意事项</h2>
                    <p>1、班级数不可小于预设班级最大值。</p>
                    <p>2、勾选的分班条件及设置的优先级将作为自动分班的依据。优先级系数越小的分班条件将优先考虑。</p>
                    <p>3、分班结果不理想时，有可能是分班条件设置过多，请适当调整分班条件及优先级。</p>
                </div></el-col>
            </el-row>
            <!-- 注意事项end -->
        </div>
    </div>
</template>

<script>
import { GetStudentCount, AutoAllocationStudent, PostRank, PostRange, GetRankList, DelectRank, EditRange } from '../../../api/admin/division/index'
export default {
  name: 'login',
  data() {
    return {
        isopen: false,
        rankd: false,
        options: [{
          value: 1,
          label: 1
        }, {
          value: 2,
          label: 2
        }, {
          value: 3,
          label: 3
        }],
        options2: [],
        value: 1,
        value2: 2,
        value3: 3,
        isloading: false,
        studentlist: {},
        diffScore:0.3,
        checkList:[],
        bjnum:0,
        studentclass: {
            SchoolCode: localStorage.getItem('xxdm'),
            Batch: ''
        },
        studentparams: {
            schoolCode: '',
            batch: '',
            classNum: 0,
            averageScoreDifference: 0.0,
            scoreAverageScoreDifference: 0.0,
            allocationAccordings: []
        },
        classlists: {
            schoolCode: '',
            batch: ''
        },
        Rank: [],
        Ranklength: 0,
        i: 0,
        xxdm: '',
        batchs: '',
        num: 0,
        newRank: [],
        oldRank: [],
        copyranklist: [],
        rankHasStudentnum: [],
        rankSasRankNo: [],
        surestudentnum: false,
        changerank: false,
        rankorNo: [],
        ispadden: false,
        fenbanyouxianji: [],
        basis:[
            {type:0,orderNo:1},
            {type:1,orderNo:2},
            {type:2,orderNo:3}
        ],
        rankStudentNum: []
    }
  },
  mounted () {
    const GetYear = () => {
      const date = new Date()
      let y = date.getFullYear()
      return y
    }
    this.xxdm = localStorage.getItem('xxdm')
    this.batchs = JSON.stringify(GetYear())
    this.studentclass.Batch = JSON.stringify(GetYear())
    // 获取学生人数
    GetStudentCount(this.studentclass).then(data => {
        this.studentparams.schoolCode = data.schoolCode
        this.studentparams.batch = data.batch
        this.classlists.schoolCode = data.schoolCode
        this.classlists.batch = data.batch
        if (data) {
            this.studentlist = data
        }
    })
    this.getRanklist()
    this.copyranklist = this.$store.state.division.ranklist
  },
  computed:{
    basisorder(){
        return this.Sort(this.basis,"orderNo","asc");
    }
  },
  methods: {
    // 优先级改变事件
    handelchange (val) {
        // this.Sort(this.Rank, 'orderNo', 'asc')
    },
    // 排序算法
    Sort (arr, key, order) {
      function compareASC (x, y) {
        let prev = parseInt(x[key], 10)
        let next = parseInt(y[key], 10)
        if (isNaN(prev)) {
          return -1
        }
        if (isNaN(next)) {
          return 1
        }
        if (prev < next) {
          return -1
        } else if (prev > next) {
          return 1
        } else {
          return 0
        }
      }
      function compareDESC (x, y) {
        let prev = parseInt(x[key], 10)
        let next = parseInt(y[key], 10)
        if (isNaN(prev)) {
          return 1
        }
        if (isNaN(next)) {
          return -1
        }
        if (prev < next) {
          return 1
        } else if (prev > next) {
          return -1
        } else {
          return 0
        }
      }

      if (order === 'desc') {
        return arr.sort(compareDESC)
      } else {
        return arr.sort(compareASC)
      }
    },
    // 获取名次段列表
    getRanklist () {
        let params = {
            schoolCode: this.xxdm,
            batch: this.batchs,
            state: 1
        }
        GetRankList(params).then(data => {
            if (data) {
                this.$store.dispatch('set_copyranklist', JSON.parse(JSON.stringify(data)))
                this.Rank = data
                this.Ranklength = data.length
                // this.Sort(this.Rank, 'orderNo', 'asc')
                this.i = data.length
                for (var index in this.Rank) {
                    this.options2.push({label: Number(index)+1, value: Number(index)+1})
                }
                if (data.length) {
                    this.isopen = true
                }
            }
        })
    },
    // 选择名次优先级
    // selectrank (val, type) {

    // },
    // 选择性别优先级
    // selectsex (val, type) {

    // },
    // 选择成绩优先级
    selectachievement (val, type) {
        // this.basis.forEach(item => {
        //     if(item.type == type){
        //         item.orderNo = val;
        //     }
        // })
        this.studentparams.allocationAccordings.forEach(item => {
            if (item.type === type) {
                item.orderNo = val
            }
        });
    },
    // 删除名次段
    deleteranklist (datas, index) {
        if (datas.id) {
            // 执行删除名次段
            DelectRank(datas.id).then(data => {
                this.$notify({title: '提示', message: '删除成功', type: 'error', duration: 2000})
                this.Rank.splice(index, 1)
                if (!this.Rank.length) {
                    this.Ranklength = 0
                }
                this.i--
                this.options2.pop()
            })
        } else {
            this.Rank.splice(index, 1)
            this.i--
            this.options2.pop()
        }
        
    },
    // 添加名次段
    addcondition () {
        if (!this.Rank.length) {
            this.Rank.push({schoolCode: this.xxdm, batch: this.batchs, orderNo: 1, studentCount: 0, rankNode: '',state: 1})
            this.Rank[0].orderNo = this.num+1
        } else if (this.Rank.length <= 5) {
            this.num = 0
            this.Rank.push({schoolCode: this.xxdm, batch: this.batchs, orderNo: 1, studentCount: 0, rankNode: '',state: 1})
            for (var i=0; i<this.Rank.length; i++) {
                this.Rank[i].orderNo = i+1
            }
        } else {
            this.$message({
                message: '添加已达上限！',
                type: 'warning'
            });
        }
        if (this.Rank.length) {
            if (this.i<this.Rank.length) {
                this.i++
                this.options2.push({label: this.i, value: this.i})
            }
        }
        this.isopen = true
    },
    // 展开名次段
    opencondition () {
        this.isopen = !this.isopen
    },
    // 正则判断
    judgeIsNum (arr) {
        var pattern=/^[0-9]\d*$/;
        var result= arr.match(pattern)
        if (result==null){
            return false;  
        }else{
            return true;
        }  
    },
    // judgeIsNumNoZero (arr) {
    //     var pattern=/^[1-9]\d*$/;
    //     var result= arr.match(pattern)
    //     if (result==null){
    //         return false;  
    //     }else{
    //         return true;
    //     }  
    // },

    // 名次段是否发生改变
    // verification () {
    //     this.oldRank.forEach(item => {
    //         this.copyranklist.forEach(el => {
    //             if (!item.studentCount === el.studentCount && item.rankNode === el.rankNode) {
    //                 // 确定修改状态
    //                 return true
    //             } else {
    //                 // 确认不修改状态
    //                 return false
    //             }
    //         })
    //     })
    // },
    
    // 重复验证部分
    repeatCode (arr, personnum, strs, personstrs, stu, ran) {
        var judgeIsNumNoZero = /^[1-9]\d*$/
        var judgestudent = /^[0-9]\d*$/
        var valide = {}
        var validestu = {} 
        this.Rank.forEach(item => {
            // arr.push(item.rankNode)
            this.rankorNo.push(item.orderNo)
            // this.rankStudentNum.push()
            personnum.push(item.studentCount)
            // strs = arr.join('')
            personstrs = personnum.join('')
            if (item.studentCount>=0 && item.rankNode) {
                this.rankHasStudentnum.push(item)
            }
        })
        valide = this.Rank.find(el => !judgeIsNumNoZero.test(el.rankNode))
        validestu = this.Rank.find(el => !judgestudent.test(el.studentCount))
        this.isRepeat(this.rankorNo)
        if (this.rankHasStudentnum.length === this.Rank.length) {
            this.surestudentnum = true
        } else {
            this.surestudentnum = false
        }
        if (this.surestudentnum) {
            // stu = this.judgeIsNumNoZero(strs)
            ran = this.judgeIsNum(personstrs)
            if (!valide && !validestu) {
                // if (this.ispadden) {
                //     this.$notify({title: '提示', message: '请勿选择重复的名次段优先级', type: 'error', duration: 2000})
                //     setTimeout(() => {
                //         this.isloading = false
                //     }, 1500)
                // } else {
                    this.isRepeat(arr)
                    if (!this.ispadden) {
                        if (this.Rank.length >= this.Ranklength) {
                            this.Rank.forEach(item => {
                                if (!item.id) {
                                    this.newRank.push(item)
                                } else {
                                    this.oldRank.push(item)
                                }
                            })
                            if (this.Ranklength !== 0 && this.newRank.length) {
                                this.changerank = true
                                this.editrange(this.oldRank)
                                this.postrank(this.newRank)  
                            } else if (this.Ranklength !== 0 && !this.newRank.length) {
                                this.changerank = false
                                var oldRankEmpotyStuNum = this.oldRank.find( el => !el.studentCount)
                                var oldRankEmpotyRankNode = this.oldRank.find( el => !el.rankNode)
                                var oldRankEmpotyOrderNo = this.oldRank.find( el => !el.orderNo)
                                // if (oldRankEmpotyOrderNo) {
                                //     this.$notify({title: '提示', message: '名次段优先级不能为空', type: 'error', duration: 2000})
                                //     setTimeout(() => {
                                //         this.isloading = false
                                //     }, 500)
                                // } else {
                                    this.editrange(this.oldRank) 
                                // }
                            } else if (this.Ranklength === 0 && this.newRank.length) {
                                this.changerank = true
                                this.postrank(this.newRank)
                            }
                        } else {
                            this.changerank = false
                            this.Rank.forEach(item => {
                                if (!item.id) {
                                    this.newRank.push(item)
                                } else {
                                    this.oldRank.push(item)
                                }
                            })
                            if (this.newRank.length) {
                                this.postrank(this.newRank)
                            }
                            if (this.oldRank.length) {
                                this.editrange(this.Rank)
                            }
                        } 
                    } else {
                        this.$notify({title: '提示', message: '请勿重复名次段', type: 'error', duration: 2000})
                        setTimeout(() => {
                            this.isloading = false
                        }, 500)
                    }
                // }
            } else {
                this.$notify({title: '提示', message: '请输入正确的人数', type: 'error', duration: 2000})
                setTimeout(() => {
                    this.isloading = false
                }, 500)
            }
        } else {
            this.$notify({title: '提示', message: '您有信息未填', type: 'error', duration: 2000})
            setTimeout(() => {
                this.isloading = false
            }, 500)
        }
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
    // 分班按钮
    startGroup(){
        // this.ispadden = false
        this.newRank = []
        this.oldRank = []
        var arr = []
        var strs = ''
        var personnum = []
        this.fenbanyouxianji = []
        this.rankHasStudentnum = []
        this.rankorNo = []
        var personstrs = ''
        this.surestudentnum = false
        var stu = false
        var ran = false
        this.changerank = false
        var fractions = /^0\.\d+$|^[0-9]+(\.\d+)?$/
        var fraction = /^[1-9]\d*$/
        this.isloading = true
        var emptyOrderNoAlloationAccrding = this.studentparams.allocationAccordings.find(x=>!x.orderNo);// 优先级存在与否判断
        var alloationAccrdingRanking = this.studentparams.allocationAccordings.find(x=>x.type==1);// 名次段优先级勾选状态判断
        var averageScore = this.studentparams.allocationAccordings.find(x=>x.type==0);// 成绩平均分勾选状态判定
        var sexAverageEmpoty = this.studentparams.allocationAccordings.find(x=>x.type==2);// 性别平均分勾选状态判定
        if (fraction.test(this.studentparams.classNum)) {
            if (this.studentparams.classNum > this.studentlist.totalNum) {
                this.$notify({title: '提示', message: '班级数不可大于学生数', type: 'error', duration: 2000})
                setTimeout(() => {
                    this.isloading = false
                }, 500)
            } else {
                // 成绩均分判断
                if (averageScore) {
                    if (fractions.test(this.studentparams.averageScoreDifference) && fractions.test(this.studentparams.scoreAverageScoreDifference)) {
                        // if (emptyOrderNoAlloationAccrding) {
                        //     this.$notify({title: '提示', message: '优先级不能为空', type: 'error', duration: 2000})
                        //     this.isloading = false
                        // } else {
                            if (alloationAccrdingRanking) {
                                if (this.Rank.length) {
                                    // if (emptyOrderNoAlloationAccrding) {
                                    //     this.$notify({title: '提示', message: '优先级不能为空', type: 'error', duration: 2000})
                                    //     this.isloading = false
                                    // } else {
                                        if (sexAverageEmpoty) {
                                            // if (emptyOrderNoAlloationAccrding) {
                                            //     this.$notify({title: '提示', message: '优先级不能为空', type: 'error', duration: 2000})
                                            //     this.isloading = false
                                            // } else {
                                                this.repeatCode (arr, personnum, strs, personstrs, stu, ran)
                                            // }
                                        } else {
                                            this.repeatCode (arr, personnum, strs, personstrs, stu, ran)
                                        }
                                    // } 
                                } else {
                                    this.$notify({title: '提示', message: '请添加名次段', type: 'error', duration: 2000})
                                    setTimeout(() => {
                                        this.isloading = false
                                    }, 500)
                                }
                            } else {
                                if (sexAverageEmpoty) {
                                    // if (emptyOrderNoAlloationAccrding) {
                                    //     this.$notify({title: '提示', message: '优先级不能为空', type: 'error', duration: 2000})
                                    //     this.isloading = false
                                    // } else {
                                        this.autoAllocationStudent(this.studentparams)
                                    // }
                                } else {
                                    this.autoAllocationStudent(this.studentparams)
                                }
                            }
                        // }
                    } else {
                        this.$notify({title: '提示', message: '请正确填写分差', type: 'error', duration: 2000})
                        setTimeout(() => {
                            this.isloading = false
                        }, 500)
                    }
                } else {
                    // 名次段均分判断
                    if (alloationAccrdingRanking) {
                        this.studentparams.averageScoreDifference = 0
                        this.studentparams.scoreAverageScoreDifference = 0
                        if (this.Rank.length) {
                            // if (emptyOrderNoAlloationAccrding) {
                            //     this.$notify({title: '提示', message: '优先级不能为空', type: 'error', duration: 2000})
                            //     this.isloading = false
                            // } else {
                                if (sexAverageEmpoty) {
                                    // if (emptyOrderNoAlloationAccrding) {
                                    //     this.$notify({title: '提示', message: '优先级不能为空', type: 'error', duration: 2000})
                                    //     this.isloading = false
                                    // } else {
                                        this.repeatCode (arr, personnum, strs, personstrs, stu, ran)
                                    // }
                                } else {
                                    this.repeatCode (arr, personnum, strs, personstrs, stu, ran)
                                    
                                }
                            // } 
                        } else {
                            this.$notify({title: '提示', message: '请添加名次段', type: 'error', duration: 2000})
                            setTimeout(() => {
                                this.isloading = false
                            }, 500)
                        }
                    } else {
                        if (sexAverageEmpoty) {
                            // if (emptyOrderNoAlloationAccrding) {
                            //     this.$notify({title: '提示', message: '优先级不能为空', type: 'error', duration: 2000})
                            //     this.isloading = false
                            // } else {
                                this.studentparams.averageScoreDifference = 0
                                this.studentparams.scoreAverageScoreDifference = 0
                                this.autoAllocationStudent(this.studentparams)
                            // }
                        } else {
                            this.studentparams.averageScoreDifference = 0
                            this.studentparams.scoreAverageScoreDifference = 0
                            this.autoAllocationStudent(this.studentparams)
                        }
                    }
                }  
            }
        } else {
            this.$notify({title: '提示', message: '请正确填写班级数', type: 'error', duration: 2000})
            setTimeout(() => {
                this.isloading = false
            }, 500)
        }
    },
    // 修改名次段
    editrange (datas) {
        EditRange(datas).then(data => {
            if (!this.changerank) {
                this.autoAllocationStudent(this.studentparams)
            }
        })
    },
    // 添加名次段
    postrank (datas) {
        PostRange(datas).then(data => {
            if (data.length) {
                // setTimeout (() => {
                this.autoAllocationStudent(this.studentparams)
                // }, 1000)
            } else {
                this.$notify({title: '提示', message: data, type: 'error', duration: 2000})
            }
            // this.autoAllocationStudent(this.studentparams)
        }, error => {
            this.isloading = false
            this.getRanklist()
        })
    },
    // 分班
    autoAllocationStudent (data) {
        AutoAllocationStudent(data).then(data => {
            this.$notify({title: '分班成功。', message: data, type: 'success', duration: 2000})
            setTimeout(() => {
                this.isloading = false
                this.$router.push({path:'/newstudent/groupconfirm', query:{form: 'Auto'}})
            }, 1000)
        },error => {
            this.isloading = false
            this.getRanklist()
        })
    },
    // 勾选分班依据
    check1 (val) {
        // this.studentparams.scoreAverage = val
        var type = 0
        if (val) {
            this.studentparams.allocationAccordings.push({type: type, orderNo: this.value})
        } else {
            this.remove(this.studentparams.allocationAccordings, type)
        }
        // this.studentparams.allocationAccordings.push({type: 0, orderNo: this.value})
    },
    check2 (val) {
        // this.studentparams.sexAverage = val
        var type = 2
        if (val) {
            this.studentparams.allocationAccordings.push({type: type, orderNo: this.value3})
        } else {
            this.remove(this.studentparams.allocationAccordings, type)
        }
    },
    check3 (val) {
        // this.rankd = val
        var type = 1
        if (val) {
            this.studentparams.allocationAccordings.push({type: type, orderNo: this.value2})
        } else {
            this.remove(this.studentparams.allocationAccordings, type)
        }
        // this.studentparams.allocationAccordings.push({type: 1, orderNo: this.value2})
    },
    indexofs (val, type) {
        for (var i=0; i<val.length; i++) {
            if (val[i].type === type)
            return i
        }
        return -1
    },
    remove (val, type) {
        var index = this.indexofs(val, type)
        if (index > -1) {
            this.studentparams.allocationAccordings.splice(index, 1)
        }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
.fl{
    float: left;
}
.table-container{
    max-width:1060px;

}
.nstumain{
    border:1px solid #eee;
    padding:10px 15px;
    border-radius:10px;
}
.divcenter{
    margin:0 auto;
}
.rowtit{
    text-align: right;
    padding-right: 15px;
    line-height: 40px;
}
.rowcont{
    line-height: 40px;
}
.inlineipt{
    width: 120px;
    display: inline-block;
    margin: 0 10px;
}
.chk-inline-div{
    font-size: 14px;
    color: #606266;
    display: inline;
}
.nsturow{
    padding:10px 0;
}
.green{
    color:#67C23A;
}
.title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    .xztj{
        width: 82%;
        height: 100%;
        text-align: center;
        background-color: #eee;
    }
    .yxj{
        width: 15%;
        height: 100%;
        text-align: center;
        background-color: #eee;
    }
}
.deletebtn{
    display: inline-block;
    width: 30px;
    height: 30px;
    background-color: #ccc;
    color: #fff;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    right: 240px;
    top: 25px;
    }
    .deletebtn:hover{
    background-color: red;
    }
</style>
