<!--选择框-->
<template>
  <div >
     <label :for="id" class="checkbox" :class="{isActive:selected}" ref="label">
       <input type="checkbox" :id="id" v-model="selected" @click.stop="changeSelect" :disabled="isdisable">
     </label>
 </div>
</template>

<!--脚本-->
<script>
export default{
 name: 'CheckBox',
 data (){
     return{
         id:Math.random(),
         selected:false
     }
 },
 components: {
 },
 methods: {
     changeSelect(){
         this.$emit('click', this.selected)
     }
 },
 computed: {

 },
 watch:{
     value (newValue) {
         this.selected = newValue?newValue:false;
     }
 },
 props:{
     value: {
         validator (value) {
             if (typeof value === 'boolean') {
             return true
             } else if (typeof value !== 'boolean') {
             return value === false
             }
             return false
         },
         default: false
     },
     isdisable: Boolean
 },
 created(){
     setTimeout(()=>{
         this.$data.selected = this.value;
         // this.$refs.label.addEventListener("touchstart",()=>{
         // })
     },0)
 }
}
</script>

<!--样式-->
<style scoped lang="scss">
/* @box-size:0.5rem; */
.checkbox{
 top: 0;
 left: 0;
 margin: 0;
 padding: 0;
 width: 20px;
 height: 20px;
 position: absolute;
 /* border-radius: 50%; */
 background: #fff;
 box-sizing: border-box;
 border: 1px solid #bababa;
 transition: all linear .3s;
 z-index: 9;
 &.isActive{
   background: #6699ff;
   border: none;
   &::after{
     content: '';
     position: absolute;
     left: 6px;
     top: 4px;
     width: 6px;
     height: 10px;
     border-right: 2px solid #fff;
     border-bottom: 2px solid #fff;
     transform: rotate(45deg);
   }
 }
 input{
   display: none;
 }
}
</style>