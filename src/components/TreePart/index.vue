<!-- 树形控件 -->
<template>
    <el-card class="treebox-card">
        <p class="tree-header">{{treeHeader}}</p>
        <div class="custom-tree-container">
            <el-tree highlight-current  :expand-on-click-node='false' :data="treeData" v-firstexpand
                node-key="id"
                :default-expanded-keys="treemrexpand"
                :props="defaultProps" 
                @node-click="handleNodeClick">
            </el-tree>
        </div>
    </el-card>
    
</template>

<script>

export default {
    name: 'treepart',
    props: {
        treeData: {
            type: Array
        },
        treeHeader:{},
        defaultProps:{},
        treemrexpand:{
            type: Array
        },
    },
    data() {
        return {
            clickdata:{},
        }
    },
    created() {

    },
    directives: {
        firstexpand: {                                             
            inserted: function (el) {
                setTimeout(function(){
                    $(el).find(".is-expanded .el-tree-node__children .el-tree-node").eq(0).addClass("is-current")
                },500)
            },
        },
    },
    methods: {
        handleNodeClick(data) {
            if(this.treeData[0].children){
                if(data.id!=this.treeData[0].children[0].id){
                    $(".el-tree").find(".is-expanded .el-tree-node__children .el-tree-node").eq(0).removeClass("is-current")
                }
            }
            
            this.$emit('treeCClick',data)
        },
    }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .treebox-card{
        width: 100%;
        height:720px;
        position: relative;
        .tree-header{
            text-align: center;
            height:36px; line-height: 36px;
            background: #eee;
            margin: 0;
        }
        .custom-tree-container{
            width:100%;
            position: absolute;
            top:36px;
            bottom:0;
            overflow: auto;
        }
    }
    ::-webkit-scrollbar {
        width: 6px;
        background-color: #fff;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 6px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #ccc;
    }

</style>
<style>
    .treebox-card .is-expanded .el-tree-node__children:first-child{

    }
</style>

