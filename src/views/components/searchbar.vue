<template>
  <div id="app">
    <!-- <div class="view">-->
    <el-col :span="24">
      <el-card shadow="always">
        查询条件:
        <el-input placeholder="请输入学生姓名和学号" v-model="form.curValue" class="input-with-select ssnr" size="medium">
          <el-select v-model="form.type" slot="prepend" placeholder="全部">
            <el-option v-for="(item,index) in searchTypes" :key="index" :label="item.label"
                       :value="item.value" style="border:none;"></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" slot="append" @click="search"></el-button>
        </el-input>
        &nbsp; &nbsp;
        <span v-if="conditionItems.length>0" class="moreseting el-icon-caret-bottom"
              v-bind:class="{active:moreset}" @click="moreset=!moreset"> 展开显示更多
                    </span>
        <div class="selectSearch" style="margin-top:12px" v-if="selectedCondition">
          <span>已选条件：</span>
          <el-tag size="small"
                  v-for="tag in conditions"
                  :key="tag.value"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
            {{tag.text}}
          </el-tag>
          <span>&nbsp;</span>
        </div>
        <my-transition>
          <div class="detailSearch" style="margin-top: 20px" v-show="moreset">
            <el-form ref="form1" :model="form" label-width="80px">
              <template v-for="(item,index) in conditionItems">
                <el-form-item v-if="item.type === 'Checkbox'" :label="item.label">
                  <!--checkbox 类型-->
                  <el-checkbox-group v-model="form.temp[index]">
                    <el-checkbox v-for="(loop,i) in item.values" :key="loop.value"
                                 :label="loop.value"
                                 v-on:change="handleCheckedCitiesChange($event,item.values[i],index)">
                      {{loop.text}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="item.type === 'Date'" :label="item.label">
                  <!--date 类型-->
                  <!--  <el-date-picker
                        v-model="form.temp[index]"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"  v-on:change="handleCheckedCitiesChange($event,item.values[i],index)">
                    </el-date-picker>-->
                </el-form-item>
              </template>

            </el-form>
          </div>
        </my-transition>

        <!--  </div>
        </div>-->
      </el-card>
    </el-col>
  </div>
  <!-- </div>-->
</template>

<script>
  import MyTransition from '@/views/components/mtransition'

  export default {
    name: 'App',
    components: {
      MyTransition
    },
    data() {
      return {
        form: {
          curValue: '',
          type: '',
          temp: []
        },
        conditions: [],//已选条件
        moreset: false
      }
    },
    created() {
      if (this.searchTypes.length > 0) {
        this.type = this.searchTypes[0].value
      }
      if (this.conditionItems.length > 0) {
        for (let a of this.conditionItems) {
          this.form.temp.push([]);
          this.loadSearchList(a);
        }
      }
    },
    computed: {
      selectedCondition() {
        return this.conditions.length > 0;
      }
    },
    methods: {
      handleCheckedCitiesChange(check, arry, index) {
        if (check) {
          arry.index = index;
          this.conditions.push(arry);
        } else {
          this.conditions.splice(this.conditions.indexOf(arry), 1);
        }
      },
      handleClose(v) {
        this.conditions.splice(this.conditions.indexOf(v), 1);
        let checkBox = this.form.temp[v.index];
        checkBox = checkBox.splice(checkBox.indexOf(v.value), 1);
      },
      search() {
        this.$emit('searchClick', this.form);
      },
      loadSearchList(v) {
        if (v.key == 'njList') {

        }
        if (v.key == 'bjList') {

        }
        if (v.key == 'xnList') {

        }
      }
    },
    props: {
      searchTypes: {
        type: Array,
        required: true
      },
      conditionItems: {
        type: Array,
        required: true
      }
    }
  }
</script>
<style>
  .el-input-group {
    width: 45%;
  }

  .el-form-item__label {
    line-height: 30px;
  }

  .el-form-item__content {
    border-bottom: 1px solid #e5e5e5;
  }

  .moreseting:hover {
    color: #409eff;
    background-color: #f9fafc;
  }
</style>

