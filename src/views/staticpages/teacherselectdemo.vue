<template>
  <div id="app">
    <div class="view">
      <el-dialog title="教师名单" :visible.sync="dialog_1" width="870px">
        <el-row>
          <el-button type="primary">确定</el-button>
          <el-button type="primary">取消</el-button>
          <el-input placeholder="查询老师" style="float:right; width:200px;"><i slot="suffix" class="el-input__icon el-icon-search"></i></el-input>
        </el-row>
        <div class="teachListAZ">
          <el-collapse v-model="activeName">
            <el-collapse-item v-for="(item,index) in dataSet" :key="index" :name="index" class="collapseItem">
              <template slot="title">
                {{item.title}}({{item.checkedArr.length}}/{{item.total}})
              </template>
              <div class="teachcheckList">
                <el-checkbox-group v-model="item.checkedArr" @change="handleCheckedChange">
                  <el-checkbox v-for="(teacher,i) in item.teachers" :key="(index + i)" :label="teacher.zgh">{{teacher.xm}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        dialog_1: true,
        activeName: 0,
        dataSet: [
          {
            title: 'A',
            total: 4,
            checkedArr: [],
            teachers: [
              {
                zgh: '101',
                xm: '张老师'
              },
              {
                zgh: '102',
                xm: '王老师'
              },
              {
                zgh: '103',
                xm: '沈老师'
              },
              {
                zgh: '104',
                xm: '吴老师'
              }
            ]
          },
          {
            title: 'B',
            total: 4,
            checkedArr: [],
            teachers: [
              {
                zgh: '101',
                xm: '张老师'
              },
              {
                zgh: '102',
                xm: '王老师'
              },
              {
                zgh: '103',
                xm: '沈老师'
              },
              {
                zgh: '104',
                xm: '吴老师'
              }
            ]
          },
          {
            title: 'C',
            total: 4,
            checkedArr: [],
            teachers: [
              {
                zgh: '101',
                xm: '张老师'
              },
              {
                zgh: '102',
                xm: '王老师'
              },
              {
                zgh: '103',
                xm: '沈老师'
              },
              {
                zgh: '104',
                xm: '吴老师'
              }
            ]
          },
          {
            title: 'D',
            total: 4,
            checkedArr: [],
            teachers: [
              {
                zgh: '101',
                xm: '张老师'
              },
              {
                zgh: '102',
                xm: '王老师'
              },
              {
                zgh: '103',
                xm: '沈老师'
              },
              {
                zgh: '104',
                xm: '吴老师'
              }
            ]
          },
          {
            title: 'E',
            total: 4,
            checkedArr: [],
            teachers: [
              {
                zgh: '101',
                xm: '张老师'
              },
              {
                zgh: '102',
                xm: '王老师'
              },
              {
                zgh: '103',
                xm: '沈老师'
              },
              {
                zgh: '104',
                xm: '吴老师'
              }
            ]
          },
          {
            title: 'F',
            total: 4,
            checkedArr: [],
            teachers: [
              {
                zgh: '101',
                xm: '张老师'
              },
              {
                zgh: '102',
                xm: '王老师'
              },
              {
                zgh: '103',
                xm: '沈老师'
              },
              {
                zgh: '104',
                xm: '吴老师'
              }
            ]
          },
          {
            title: 'G',
            total: 4,
            checkedArr: [],
            teachers: [
              {
                zgh: '101',
                xm: '张老师'
              },
              {
                zgh: '102',
                xm: '王老师'
              },
              {
                zgh: '103',
                xm: '沈老师'
              },
              {
                zgh: '104',
                xm: '吴老师'
              }
            ]
          }
        ]
      }
    },
    methods: {
      handleCheckedChange(val) {
        console.log(val);
      }
    }
  }
</script>
