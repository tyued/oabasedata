<template>
    <div :style="{width:width}">
        <div class='partBox' v-if='type==3'>
            应出勤<span>{{PartData.ycq}}</span>天，事假<span>{{PartData.sj}}</span>天，病假<span>{{PartData.bj}}</span>天，旷课<span>{{PartData.kk}}</span>节，迟到及早退<span>{{PartData.cdzt}}</span>节。
        </div>
        <div class='partBox write' v-if='type==4'>{{PartData.jcjl}}</div>
        <div class='partBox write bzrjy' v-if='type==5'>
            <p>{{PartData.bzrjy}}</p>
            <div class='right'>班主任签字：<span>{{PartData.bzrname}}</span></div>
        </div>
        <div class='partBox write' v-if='type==6'>{{PartData.fy}}</div>
    </div>
</template>

<script>

export default {
    // name:'出勤记录\奖惩记录\班主任寄语\附言',
    props: {
        PartData: {
            type: Object
        },
        type: {
            type: Number
        },
        width:{
            type: String
        }
    },
    data() {
        return {
        };
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {
        
    }
}
</script>
<style scoped lang="scss">
    .partBox{
        width: 100%;
        border: 1px solid #ccc; padding: 12px;
        span{
            width: 30px; display: inline-block; text-align: center; color: #000;
        }
        .right{ 
            text-align: right;
        }
    }
    .bzrjy{
        p{
            height: 64px;
        }
        span{
            width: 60px; text-align: left;
        }
    }
    .write{
        color: #000; height: 120px;
    }
    
</style>
<style lang="scss">

</style>

