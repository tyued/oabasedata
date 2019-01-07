<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <div class="znxhead">
                <el-button icon="el-icon-upload2" size="small" type="primary">上传</el-button>
                <el-button icon="el-icon-tickets" size="small" type="primary">新建目录</el-button>
                <el-button icon="el-icon-download" size="small" type="primary">下载</el-button>
                <el-button icon="el-icon-delete
" size="small" type="primary">删除</el-button>
                <div class="znxhead-other fr">
                    <el-input size="small" placeholder="请输入内容" v-model="txt1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>

            <div class="tableControl mt20">
               我的网盘 >
            </div>
            <div class="wpmainbox">
                <ul>
                    <li>
                        <div class="FileIco"><div class="Ft-N"></div>
                        <div class="ft-1"></div></div> 	 
                        <div class="filenames" title="文档">文档</div>     
                    </li>
                    <li>
                        <div class="FileIco"><div class="Ft-N"></div>
                        <div class="ft-1"></div></div> 	 
                        <div class="filenames" title="文档">文档</div>     
                    </li>
                    <li>
                        <div class="FileIco"><div class="Ft-N"></div>
                        <div class="ft-1"></div></div> 	 
                        <div class="filenames" title="文档">文档</div>     
                    </li>
                    <li>
                        <div class="FileIco"><div class="Ft-N"></div>
                        <div class="ft-2"></div></div> 	 
                        <div class="filenames" title="文档">文档</div>     
                    </li>
                    <li>
                        <div class="FileIco"><div class="Ft-N"></div>
                        <div class="ft-3"></div></div> 	 
                        <div class="filenames" title="文档">文档</div>     
                    </li>
                    <li>
                        <div class="FileIco"><div class="Ft-N"></div>
                        <div class="ft-4"></div></div> 	 
                        <div class="filenames" title="文档">文档</div>     
                    </li>
                    <li>
                        <div class="FileIco"><div class="Ft-N"></div>
                        <div class="ft-5"></div></div> 	 
                        <div class="filenames" title="文档">文档</div>     
                    </li>
                    <li>
                        <div class="FileIco"><div class="Ft-N"></div>
                        <div class="ft-6"></div></div> 	 
                        <div class="filenames" title="文档">文档</div>     
                    </li>
                    <li>
                        <div class="FileIco"><div class="Ft-N"></div>
                        <div class="ft-7"></div></div> 	 
                        <div class="filenames" title="文档">文档</div>     
                    </li>
                </ul>
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
            cphm: '浙A705KK',
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
