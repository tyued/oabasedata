<template>
  <div id="app">

    <div class="view">

      <div class="oarow">
        <el-row>
          <el-button type="primary">保存</el-button>
          <el-button type="primary">保存并添加</el-button>
          <el-button type="primary">返回</el-button>
        </el-row>
      </div>
      <el-form ref="form" label-width="150px">

        <el-form-item label="课程名称" resetField :rules="[{ required: true, message: '姓名不能为空'}]">
          <el-input placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="课程类别" style="width:500px">
          <el-select placeholder="请选择" v-model="type_1">
            <el-option v-for="item in  itemList_1" :key="item.value" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="授课教师" :rules="[{ required: true, message: '授课教师不能为空'}]">
          <el-input placeholder="请选择老师" @focus="selTeacher"><i slot="suffix" class="el-input__icon el-icon-more"></i></el-input>
        </el-form-item>

        <el-form-item label="授课日期" :rules="[{ required: true, message: '授课教师不能为空'}]">
          <el-date-picker v-model="time_1" type="date" placeholder="选择日期"></el-date-picker>
          <span class='padding_transverse_10'>至</span>
          <el-date-picker v-model="time_2" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>

        <el-form-item label="授课时间/地点">
          <el-button icon="el-icon-setting" type="primary" @click="settime" round>设置</el-button>

          <div class="oarow">
            <div class="skTit">
              <div class="skLeft">授课时间(星期/节次)</div>
              <div class="skRight">授课地点</div>
            </div>
            <div class="skCont">

              <div class="skLine">
                <div class="skLeft">星期一第五节</div>
                <div class="skRight">
                  <el-select v-model="type_5" placeholder="请选择授课地点">
                    <el-option
                      v-for="item in itemList_5"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>

              <div class="skLine">
                <div class="skLeft">星期一第五节</div>
                <div class="skRight">
                  <el-select v-model="type_5" placeholder="请选择授课地点">
                    <el-option
                      v-for="item in itemList_5"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>


            </div>
          </div>

        </el-form-item>

        <el-form-item label="授课对象">
          <el-button icon="el-icon-setting" type="primary" round>设置</el-button>
          <div class="oarow skdxmain">
            <div class="skLine">
              <div class="skLeft skdx">一年级:</div>
              <div class="skRight skdx">1班、2班</div>
            </div>
            <div class="skLine">
              <div class="skLeft skdx">一年级:</div>
              <div class="skRight skdx">1班、2班</div>
            </div>
            <div class="skLine">
              <div class="skLeft skdx">一年级:</div>
              <div class="skRight skdx">1班、2班</div>
            </div>
            <div class="skLine">
              <div class="skLeft skdx">一年级:</div>
              <div class="skRight skdx">1班、2班</div>
            </div>
            <div class="skLine">
              <div class="skLeft skdx">一年级:</div>
              <div class="skRight skdx">1班、2班</div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="限制人数" :rules="[{ required: true, message: '授课教师不能为空'}]">
          <el-input style="width:55px;margin:0 5px;"></el-input>
          <span style="padding-right:20px;">人</span>
          <span>最低人数</span>
          <el-input style="width:55px;margin:0 5px;"></el-input>
          <span style="padding-right:20px;">人</span>
          <span>每个年级限报人数</span>
          <el-input style="width:55px;margin:0 5px;"></el-input>
          <span style="padding-right:20px;">人</span>
          <span>每个班级限报人数</span>
          <el-input style="width:55px;margin:0 5px;"></el-input>
          <span>人</span>
        </el-form-item>

        <el-form-item label="性别限制">
          <el-radio v-model="radio_1" label="1">无限制</el-radio>
          <el-radio v-model="radio_1" label="2">男</el-radio>
          <el-radio v-model="radio_1" label="3">女</el-radio>
        </el-form-item>

        <el-form-item label="课程简介">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="textarea_1">
          </el-input>
        </el-form-item>


      </el-form>


      <div class="oarow">
        <div class="searchMain">
          <div class="searchBox_1">查询条件:</div>
          <div class="searchBox_2 cxtj_sel">
            <el-select v-model="type_4" placeholder="请选择">
              <el-option
                v-for="item in itemList_4"
                :key="item.value"
                :label="item.label"
                :value="item.value" style="border:none;">
              </el-option>
            </el-select>

            <el-input class="ssnr" style="display:inline-block; width:300px;" placeholder="请输入内容"></el-input>

          </div>
          <div class="searchBox_3">
            <el-button style="height:42px; width:80px; margin-left:10px;" type="primary" icon="el-icon-search"></el-button>
            <span class="moreseting el-icon-arrow-down" v-bind:class="{active:moreset}" @click="moresetting"> 展开显示更多</span>
          </div>

          <div class="selectSearch">
            <div class="searchBox_1">已选条件:</div>
            <div class="searchBox_4 selSearchList" style="overflow:hidden;">
              <div class="tjbox">学年:<span>2016-2017</span><i class="el-icon-error"></i></div>
              <div class="tjbox">学期:<span>上学期</span><i class="el-icon-error"></i></div>
            </div>
          </div>

          <div class="detailSearch" v-show="moreset">
            <el-form ref="form1" label-width="80px">
              <div class="rowline">
                <el-form-item label="课程类别">
                  <el-radio v-model="radio_2" label="2">兴趣培养选课</el-radio>
                  <el-radio v-model="radio_2" label="3">17届初一新生选课</el-radio>
                  <el-radio v-model="radio_2" label="4">16届初二新生选课</el-radio>
                  <el-radio v-model="radio_2" label="5">15届初三新生选课</el-radio>
                  <el-radio v-model="radio_2" label="6">社会实践活动</el-radio>
                  <el-radio v-model="radio_2" label="7">短学期兴趣培养课</el-radio>
                </el-form-item>
              </div>
              <div class="rowline">
                <el-form-item label="所在学年">
                  <el-radio v-model="radio_3" label="2">2016-2017</el-radio>
                  <el-radio v-model="radio_3" label="3">2015-2016</el-radio>
                  <el-radio v-model="radio_3" label="4">2014-2015</el-radio>
                  <el-radio v-model="radio_3" label="5">2013-2014</el-radio>
                </el-form-item>
              </div>
              <div class="rowline">
                <el-form-item label="所在学期">
                  <el-radio v-model="radio_4" label="2">上学期</el-radio>
                  <el-radio v-model="radio_4" label="3">下学期</el-radio>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>

      <div class="oarow" style="float:left; margin-top:20px;width:100%;">
        <div class="rowmain">

          <div class="rowcontent">
            <div class="rowLeftBox">每名学生最多选</div>
            <div class="rowRightBox">
              <el-input style="display:inline-block; width:50px;" placeholder=""></el-input>
              门课
            </div>
          </div>

          <div class="rowcontent">
            <div class="rowLeftBox">不能同时选择的课程</div>
            <div class="rowRightBox">
              <el-button type="primary">添加</el-button>
              <div class="courseList">
                <div class="course">
                  <span>钢琴入门,蹭蹭蹭,阿尔甘</span> <i class="el-icon-edit
"></i> <i class="el-icon-delete"></i>
                </div>
                <div class="course">
                  <span>课外阅读</span> <i class="el-icon-edit
"></i> <i class="el-icon-delete"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="rowcontent">
            <div class="rowLeftBox">必选的课程类别</div>
            <div class="rowRightBox">
              <el-button type="primary">添加</el-button>
              <div class="courseList">
                <div class="course">
                  <span>音乐类 至少选 <el-input style="display:inline-block; width:50px;" placeholder=""></el-input> 门课</span> <i class="el-icon-delete"></i>
                </div>
                <div class="course">
                  <span>体育类 至少选 <el-input style="display:inline-block; width:50px;" placeholder=""></el-input> 门课</span> <i class="el-icon-delete"></i>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>


      <el-button type="primary" @click="tc1">教师名单</el-button>
      <el-button type="primary" @click="tc2">选择时间</el-button>
      <el-button type="primary" @click="tc3">复制课程</el-button>
      <el-button type="primary" @click="tc4">分配</el-button>
      <el-button type="primary" @click="tc5">选择课程</el-button>


    </div><!--view结尾-->

    <el-dialog title="教师名单" :visible.sync="dialog_1" width="870px">

      <el-row>
        <el-button type="primary">确定</el-button>
        <el-button type="primary">取消</el-button>

        <el-input placeholder="查询老师" style="float:right; width:200px;"><i slot="suffix" class="el-input__icon el-icon-search"></i></el-input>
      </el-row>

      <div class="teachListAZ">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="A(0/10)" name="1" class="collapseItem">
            <div class="teachcheckList">
              <el-checkbox-group v-model="checkedList_1" @change="handleCheckedChange">
                <el-checkbox v-for="checkunit in checklist_1" :label="checkunit" :key="checkunit">{{checkunit}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
          <el-collapse-item title="B(0/10)" name="2" class="collapseItem">
            <div class="teachcheckList">
              <el-checkbox-group v-model="checkedList_1" @change="handleCheckedChange">
                <el-checkbox v-for="checkunit in checklist_1" :label="checkunit" :key="checkunit">{{checkunit}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
          <el-collapse-item title="C(0/10)" name="3" class="collapseItem">
            <div class="teachcheckList">
              <el-checkbox-group v-model="checkedList_1" @change="handleCheckedChange">
                <el-checkbox v-for="checkunit in checklist_1" :label="checkunit" :key="checkunit">{{checkunit}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
          <el-collapse-item title="D(0/10)" name="4" class="collapseItem">
            <div class="teachcheckList">
              <el-checkbox-group v-model="checkedList_1" @change="handleCheckedChange">
                <el-checkbox v-for="checkunit in checklist_1" :label="checkunit" :key="checkunit">{{checkunit}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
          <el-collapse-item title="E(0/10)" name="5" class="collapseItem">
            <div class="teachcheckList">
              <el-checkbox-group v-model="checkedList_1" @change="handleCheckedChange">
                <el-checkbox v-for="checkunit in checklist_1" :label="checkunit" :key="checkunit">{{checkunit}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
          <el-collapse-item title="F(0/10)" name="6" class="collapseItem">
            <div class="teachcheckList">
              <el-checkbox-group v-model="checkedList_1" @change="handleCheckedChange">
                <el-checkbox v-for="checkunit in checklist_1" :label="checkunit" :key="checkunit">{{checkunit}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
          <el-collapse-item title="G(0/10)" name="7" class="collapseItem">
            <div class="teachcheckList">
              <el-checkbox-group v-model="checkedList_1" @change="handleCheckedChange">
                <el-checkbox v-for="checkunit in checklist_1" :label="checkunit" :key="checkunit">{{checkunit}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
          <el-collapse-item title="H(0/10)" name="8" class="collapseItem">
            <div class="teachcheckList">
              <el-checkbox-group v-model="checkedList_1" @change="handleCheckedChange">
                <el-checkbox v-for="checkunit in checklist_1" :label="checkunit" :key="checkunit">{{checkunit}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

    </el-dialog>

    <el-dialog title="选择时间" :visible.sync="dialog_2" width="870px">
      <table class='selTeachTime' id='selTeachTime' cellpadding="0" cellspacing="0">
        <tr>
          <th></th>
          <th>周一</th>
          <th>周二</th>
          <th>周三</th>
          <th>周四</th>
          <th>周五</th>
          <th>周六</th>
          <th>周日</th>
        </tr>
        <tr>
          <th>
            第一节
          </th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>
            第二节
          </th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>
            第三节
          </th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>
            第四节
          </th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>
            第五节
          </th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>
            第六节
          </th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>
            第七节
          </th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>
            第八节
          </th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>
            第九节
          </th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </el-dialog>

    <el-dialog title="复制课程" :visible.sync="dialog_3" width="560px">
      <el-row>

        <el-form ref="form" label-width="100px">
          <el-form-item label="复制" :rules="[{ required: true}]">
            <el-select placeholder="请选择学年" v-model="type_2" style="display:inline-block; width:150px;">
              <el-option v-for="item in  itemList_2" :key="item.value" :label="item.label" :value="item.label"></el-option>
            </el-select>

            <el-select placeholder="请选择学期" v-model="type_3" style="display:inline-block; width:150px; margin-left:15px;">
              <el-option v-for="item in  itemList_3" :key="item.value" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="复制至">
            <span>2015-2016 上学期</span>
          </el-form-item>
          <el-form-item label="课程名称" :rules="[{ required: true}]" style="line-height:20px;">
            <el-checkbox-group v-model="checklist_2">
              <el-checkbox label="全选"></el-checkbox>
              <el-checkbox label="违纪记录"></el-checkbox>
              <el-checkbox label="学习进步"></el-checkbox>
              <el-checkbox label="迟到早退"></el-checkbox>
              <el-checkbox label="课外阅读"></el-checkbox>
              <el-checkbox label="体育运动"></el-checkbox>
              <el-checkbox label="个人荣誉"></el-checkbox>
              <el-checkbox label="日常考勤"></el-checkbox>
              <el-checkbox label="纪律"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

      </el-row>

      <el-row>
        <el-button type="primary">保存</el-button>
        <el-button type="primary">返回</el-button>
      </el-row>

    </el-dialog>

    <el-dialog title="分配" :visible.sync="dialog_4" width="870px">
      <el-row>
        <el-button type="primary">保存</el-button>
      </el-row>

      <el-row style="margin-top:20px;">
        <span style="padding-right:10px;">筛选条件:</span>
        <el-button type="primary">按班级</el-button>
        <el-button type="primary">按特长生类型</el-button>
      </el-row>

      <el-row style="margin-top:20px;">
        <span style="padding-right:10px;">已选学生:</span>
        <div class="selectStudent">
          <span class="selStu">438学校申请老师</span>
          <span class="selStu">周长新<i class="el-icon-error"></i></span>
          <span class="selStu">张佳润<i class="el-icon-error"></i></span>
          <span class="selStu">周长新<i class="el-icon-error"></i></span>
          <span class="selStu">张佳润<i class="el-icon-error"></i></span>
          <span class="selStu">周长新<i class="el-icon-error"></i></span>
          <span class="selStu">张佳润<i class="el-icon-error"></i></span>
          <span class="selStu">周长新<i class="el-icon-error"></i></span>
          <span class="selStu">张佳润<i class="el-icon-error"></i></span>
          <span class="selStu">周长新<i class="el-icon-error"></i></span>
          <span class="selStu">张佳润<i class="el-icon-error"></i></span>
          <span class="selStu">周长新<i class="el-icon-error"></i></span>
          <span class="selStu">张佳润<i class="el-icon-error"></i></span>
        </div>
      </el-row>

      <el-row>
        <div class="selNjStu">
          <div class="selLeft">

            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  一年级(9/81)
                </template>
                <div class="selBj">
                  <el-checkbox-group v-model="checklist_3">
                    <el-checkbox label="一班"></el-checkbox>
                    <el-checkbox label="二班"></el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">
                  二年级(19/81)
                </template>
                <div>2</div>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">
                  三年级(9/21)
                </template>
                <div>3</div>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">
                  四年级(9/31)
                </template>
                <div>4</div>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">
                  五年级(7/51)
                </template>
                <div>5</div>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">
                  六年级(19/41)
                </template>
                <div>6</div>
              </el-collapse-item>

            </el-collapse>

          </div>
          <div class="selRight">
            <div class="bjstuall">
              <span>陈侠志</span>
              <span class="seled">单好赞</span>
              <span class="seled">刘亦艳</span>
              <span>陈侠志</span>
              <span>陈侠志</span>
              <span>陈侠志</span>
              <span>陈侠志</span>
              <span>陈侠志</span>
              <span>陈侠志</span>
              <span>陈侠志</span>
              <span>陈侠志</span>
              <span>陈侠志</span>
              <span>陈侠志</span>
              <span>陈侠志</span>
              <span>陈侠志</span>
            </div>
          </div>
        </div>
      </el-row>


    </el-dialog>

    <el-dialog title="选择课程" :visible.sync="dialog_5" width="560px">
      <el-row>
        <div class="courseCheckList">
          <el-checkbox-group v-model="checklist_4">
            <el-checkbox label="复选框 A"></el-checkbox>
            <el-checkbox label="复选框 B"></el-checkbox>
            <el-checkbox label="复选框 C"></el-checkbox>
            <el-checkbox label="禁用" disabled></el-checkbox>
            <el-checkbox label="选中且禁用" disabled></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-row>

      <el-row>
        <el-button type="primary">保存</el-button>
        <el-button type="primary">返回</el-button>
      </el-row>

    </el-dialog>


    <div class="oaeditor">
      <quill-editor ref="myTextEditor"
                    :content="content"
                    :options="editorOption"
                    @change="onEditorChange($event)">
      </quill-editor>
    </div>

  </div>
</template>

<script>
  import $ from 'jquery'
  import { quillEditor } from 'vue-quill-editor'

  export default {
    name: 'App',
    components: {
      quillEditor
    },
    data() {
      return {
        itemList_1: [{ value: '艺术', label: '艺术' }, { value: '体育', label: '体育' }],
        itemList_2: [{ value: '2015-2016', label: '2015-2016' }, { value: '2016-2017', label: '2016-2017' }, { value: '2017-2018', label: '2017-2018' }],
        itemList_3: [{ value: '上学期', label: '上学期' }, { value: '下学期', label: '下学期' }],
        itemList_4: [{ value: '全部', label: '全部' }, { value: '课程名称', label: '课程名称' }, { value: '开课人', label: '开课人' }],
        itemList_5: [{ value: 'A201教室', label: 'A201教室' }, { value: 'A202教室', label: 'A202教室' }, { value: 'A203教室', label: 'A203教室' }],
        type_1: '',
        type_2: '',
        type_3: '',
        type_4: '',
        type_5: '',
        time_1: '',
        time_2: '',
        radio_1: '',
        radio_2: '',
        radio_3: '',
        radio_4: '',
        textarea_1: '',
        dialog_1: false,
        dialog_2: false,
        dialog_3: false,
        dialog_4: false,
        dialog_5: false,
        activeName: 1,
        checklist_1: ['张老师', '王老师', '沈老师', '吴老师'],
        checklist_2: [],
        checklist_3: [],
        checklist_4: ['选中且禁用'],
        checkedList_1: [],
        moreset: false,
        content: '<h2>I am Example</h2>',
        editorOption: {}
      }
    },
    mounted() {
      $(document).on('click', '.selTeachTime td', function() {
        if ($(this).hasClass('ck')) {
          $(this).removeClass('ck')
        } else {
          $(this).addClass('ck')
        }
      })
    },
    methods: {
      onEditorBlur(editor) {
        console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        console.log('editor ready!', editor)
      },
      onEditorChange({ editor, html, text }) {
        console.log('editor change!', editor, html, text)
        this.content = html
      },
      tc1() {
        this.dialog_1 = true;
      },
      tc2() {
        this.dialog_2 = true;
      },
      tc3() {
        this.dialog_3 = true;
      },
      tc4() {
        this.dialog_4 = true;
      },
      tc5() {
        this.dialog_5 = true;
      },
      handleCheckAllChange(val) {
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedChange() {
        // let checkedCount = value.length;
        // this.checkAll = checkedCount === this.cities.length;
        // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      selTeacher() {
        this.dialog_1 = true;
      },
      settime() {
        this.dialog_2 = true;
      },
      moresetting() {
        if (this.moreset) {
          this.moreset = false
        } else {
          this.moreset = true
        }
      }
    }
  }
</script>
