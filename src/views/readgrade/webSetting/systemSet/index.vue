<template>
  <div class="app-container calendar-list-container">
    <!-- <p class="gap">系统设置</p> -->
   
  <div class="first">
    <span class="spap">学生跨级考级</span> 

    
    <span style="margin-left:70px" >
   
     <el-radio-group v-model="radiojug" @change="sak">
      <el-radio :label="num">允许</el-radio>
      <el-radio :label="3">不允许</el-radio>
    </el-radio-group>
    </span>
  
  <span v-if="isshow" style="margin-left:130px">
    <el-radio-group v-model="schoolinfo.CrossLevel" @change="ggg">
      <el-radio :label="1" style="margin-left:30px">本年级阅读考级部分通过</el-radio>
      <el-radio :label="2">本年级阅读考级全部通过</el-radio>
    </el-radio-group>
    </span>
    </div>   
    

  <p class="gap">
    <span class="spa">继续考级条件设置</span>
    <span style="padding-left:45px">交卷周期为<input type="text"  class="day" v-model="schoolinfo.ExamnationDays" > 天,期间交卷次数不超过<input type="text"  class="day" v-model="schoolinfo.ExaminationTimes">次
    </span>
     </p>
    <p class="gap"  style="padding-top:10px">
      <span class="spas"> 发表一篇读书心得</span>
     <span style="padding-left: 45px;"> 
       获得<el-input v-model="schoolinfo.PassScore" class="read"> </el-input>个成长值</span></p>
      
    <p class="gap" style="padding-top:10px"> <span class="spas"> 通过一个挑战</span> 
   <span style="padding-left: 75px;"> 
     获得<el-input v-model="schoolinfo.MoralityScore" class="reap">
        </el-input>个成长值</span></p>

    <!-- 添加学校图章 -->
    <div style="display:none">
    <span>证书图章上传</span>
       
         <div id="img">
                  
                  
                  <el-upload
                    class="avatar-uploader"
                    :action="urls"  
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
        

              <span>只支持jpg格式，建议上传图片的像素108*108
如需更换，直接点击图片上传即可</span>        
                 </div> 

     </div>            
       
    

  <p class="gap" style="height:30px;padding-top:10px">   <span class="spa"> 开启上下学期</span>
           <span  style="margin-left:75px">
           <el-radio-group v-model="schoolinfo.HaveTerm">
              <el-radio :label="0">开启</el-radio>
              <el-radio :label="1">关闭</el-radio>
            </el-radio-group>
            </span>
  </p>

  <p class="gapa"><span>AppID</span> <el-input v-model="input3" class="long"></el-input> </p>
  <p class="gapa"><span>AppSecret</span><el-input v-model="input4" class="duan" ></el-input></p>
  <p class="gapa"><span>学分系统</span> <el-input v-model="input5"  class="duch" ></el-input> </p>
      <el-button type="success" class="bao" @click.stop="savebook">保存</el-button>
      
  
  </div> 
  
</template>

<style scoped lang="scss">
.day {
  width: 25px;
  height: 25px;
}
.long {
  width: 400px;
  margin-left: 110px;
   font-weight: 900
}
.duan {
  width: 400px;
  margin-left: 80px;
   font-weight: 900
}
.duch {
  width: 400px;
  margin-left: 100px;
   font-weight: 900
}
.read {
  width: 300px;
  
}
.reap {
  width: 300px;
 
}
.gapa {
  margin-left: 1px;
    font-weight: 900
 
}
.gav {
  font-size: 15px;
}
.el-upload {
  width: 200px;
}
.upimg {
  margin-left: 400px;
}
.allow {
  width: 200px;
  display: inline-block;
  background: white;
  opacity: 0.5;
  margin-top: 10px;
}
.first {
  margin-left: 2px;
  width: 400px;
  margin-bottom: 10px;
}
.spa {
  float: left;
  font-size: 15px;
  font-weight: 900
}
.spas{
  float: left;
  margin-top:10px; 
  font-size: 15px;
  font-weight: 900
}
.spap{
  float: left;
  font-size: 15px;
  font-weight: 900
}

.spv {
  float: right;
}
.sh {
  margin-left: 500px;
  height: 30px;
}

// 图片
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.bao {
  width: 200px;
  height: 50px;
  margin-left: 300px;
}
</style>

<script>
import { page } from "api/project/mainProject/index";
import * as http from "api/admin/read/readbook.js";
export default {
  name: "examCount",
  components: {},
  data() {
    return {
      num: 0,
      radioshow: false,
      isshow: false,
      radiojug: 0,
      radio1: "",
      radio2: "",
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      input5: "",
      readInput1: "",
      readInput2: "",
      imageUrl: "",
      schoolinfo: {
        ID: "",
        SchoolCode: "",
        CrossLevel: "",
        ExaminationTimes: "",
        ExamnationDays: "",
        CreditUrl: "",
        HaveTerm: "",
        PassScore: "",
        MoralityScore: "",
        Stamp: "",
        AddTime: ""
      },
      urls: "/red/ReadPC/UploadImage",
      visible2: false,
      show: "",
     
    };
  },
  created() {
    this.addSchool();
    // this.redBook()
    // this.pcinto();
  },
  computed: {},
  directives: {},
  filters: {},

  methods: {
    ggg(val) {
      console.log(val);
    },
    //
    sak(val) {
      console.log(val);
      if (val === 3) {
        this.isshow = false;
        this.schoolinfo.CrossLevel = val;
      } else {
        this.isshow = true;
      }
    },
   

    ExaminationTimes() {},
    savebook() {
      console.log(this.schoolinfo);
      this.schoolinfo.SchoolCode = localStorage.getItem("xxdm");
      this.pcinto();
    },

    selecte1(Value) {
      this.schoolinfo.CrossLevel = Value;
    },
    selecte2(Value) {
      this.schoolinfo.CrossLevel = Value;
    },
    selecte3(Value) {
      this.schoolinfo.CrossLevel = Value;
    },
    selecte4(Value) {
      this.schoolinfo.HaveTerm = Value;
    },
    selecte5(Value) {
      this.schoolinfo.HaveTerm = Value;
    },
    // 获取学校信息
    addSchool() {
      http
        .addSchool({
          SchoolCode: localStorage.getItem("xxdm")
        })
        .then(res => {
          console.log(res);
          this.imageUrl = res.Value.Stamp;
          console.log(123123123);
          console.log(res.Value.Stamp);
          this.schoolinfo = res.Value;

          this.radiojug = res.Value.CrossLevel;
          if (this.radiojug === 3) {
            this.radioshow = true;
            this.isshow = false;
          } else {
            this.num = res.Value.CrossLevel;
            this.isshow = true;
          }
         
          this.schoolinfo.CrossLevel = res.Value.CrossLevel;
         
        });
    },
    //是否为正整数
    isPositiveInteger(s) {
      var re = /^[0-9]+$/;
      return re.test(s);
    },
    pcinto() {
      console.log(this.schoolinfo);
      this.schoolinfo.SchoolCode = localStorage.getItem("xxdm");
      console.log(this.schoolinfo);

      if (
        this.schoolinfo.ExaminationTimes != 0 &&
        this.isPositiveInteger(this.schoolinfo.ExaminationTimes)
      ) {
        if (
          this.schoolinfo.ExamnationDays != 0 &&
          this.isPositiveInteger(this.schoolinfo.ExamnationDays)
        ) {
          if (
            this.schoolinfo.PassScore != 0 &&
            this.isPositiveInteger(this.schoolinfo.PassScore)
          ) {
            if (
              this.schoolinfo.MoralityScore != 0 &&
              this.isPositiveInteger(this.schoolinfo.MoralityScore)
            ) {
              http
                .pcinto({
                  ID: this.schoolinfo.Id,
                  SchoolCode: this.schoolinfo.SchoolCode,
                  CrossLevel: this.schoolinfo.CrossLevel,
                  ExaminationTimes: this.schoolinfo.ExaminationTimes,
                  ExamnationDays: this.schoolinfo.ExamnationDays,
                  CreditUrl: this.schoolinfo.CreditUrl,
                  HaveTerm: this.schoolinfo.HaveTerm,
                  PassScore: this.schoolinfo.PassScore,
                  MoralityScore: this.schoolinfo.MoralityScore,
                  Stamp: this.imageUrl,
                  AddTime: this.schoolinfo.AddTime
                })
                .then(res => {
                  console.log(1);
                  console.log(res);
                  this.schoolinfo = res;
                  this.addSchool();
                  this.$message.success("修改成功");
                });
            } else {
              this.$message.error("通过测试成长值必须是大于零的整数");
            }
          } else {
            this.$message.error("读书心得成长值必须是大于零的整数");
          }
        } else {
          this.$message.error("交卷次数必须是大于零的整数");
        }
      } else {
        this.$message.error("交卷周期必须是大于零的整数");
      }
    },
    handleAvatarSuccess(res, file) {
      //  console.log(res)
      this.schoolinfo.Stamp = res.Value;
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl);
      this.imageUrl = res.Value;
    },
    beforeAvatarUpload(file) {
      // console.log(file)
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  mounted() {}
};
</script>


