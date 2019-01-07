<template>
    <div class="studentManaer">
        <el-row class="studentManaerwrapper">
            <el-col class="studentManaerleft" :span="4">
                <el-aside width="250px">
                    <TreePart class='screenfull' :treeData='njbjTree' :treeHeader="treeHeader" :defaultProps="defaultProps" @treeCClick="treeCClick"></TreePart>
                </el-aside>
            </el-col>
            <el-col class="studentManaerright" :span="18">
                <div class="app-container calendar-list-container studentpagestyle">
                    <div class="studentpagestyletopdiv flexa">
                        <div class="studentpagestyletopbutton">
                            <el-button class="filter-item marginleft10" @click="handleCreate" type="primary" icon="edit">添加</el-button>
                            <el-button class="filter-item marginleft10" @click="importfunction" type="primary" icon="edit">导入</el-button>
                            <el-button class="filter-item marginleft10" @click="exportfunctresetsecretion" type="primary" icon="edit">导出</el-button>
                            <el-button class="filter-item marginleft10" @click="resetsecretfunction" type="primary" icon="edit">密码重置</el-button>
                        </div>
                        <div class="studentpagestyletopsearch flexa flexaline" style="">
                            <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select" style="width: 300px;">
                                <el-select v-model="searchsel" slot="prepend" @change="searchChange" placeholder="请选择" style="width:120px; height:38px; margin:0 auto;">
                                    <el-option label="全部" value="all"></el-option>
                                    <el-option label="学号" value="xh"></el-option>
                                    <el-option label="姓名" value="xm"></el-option>
                                </el-select>
                            </el-input>
                            <el-button class="filter-item topsearchbutton" style="" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
                        </div>
                    </div>
                    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
                        <span>是否将密码重置为888888</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="resetsecretyes">确 定</el-button>
                        </span>
                    </el-dialog>
                    <el-table @selection-change="handleSelectionChange" ref="multipleTable" :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                        <el-table-column type="selection" width="40">
                        </el-table-column>
                        <el-table-column align="center" label="学号" width="170">
                            <template slot-scope="scope">
                                <span>{{scope.row.xh}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="姓名" width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.xm}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="性别" width="100">
                            <template slot-scope="scope">
                                <span>{{(scope.row.xbm=='1')?'男':'女'}}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column align="center" label="年级" width="140">
                            <template slot-scope="scope">
                                <span>{{scope.row.njmc}}</span>
                            </template>
                        </el-table-column>
                        -->
                        <el-table-column align="center" label="班级" width="140">
                            <template slot-scope="scope">
                                <span>{{scope.row.bjmc}}</span>
                            </template>
                        </el-table-column>
                      <!--
                      <el-table-column align="center" label="用户名">
                          <template slot-scope="scope">
                              <span>{{scope.row.xxdm}}{{scope.row.xh}}</span>
                          </template>
                      </el-table-column>
                      -->
                      <el-table-column align="center" label="联系方式">
                          <template slot-scope="scope">
                              <span>{{scope.row.sjhm}},{{scope.row.sjhm2}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column align="center" label="监护人">
                          <template slot-scope="scope">
                              <span>{{scope.row.jhr}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column align="center" label="操作" width="150">
                          <template slot-scope="scope">
                              <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                          </template>
                      </el-table-column>
                  </el-table>
                  <div v-show="!listLoading" class="pagination-container">
                      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
                  </div>
                  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px">
                      <el-form :model="form" ref="form" :rules="rules" label-width="100px" style="padding-right:10%;">
                          <el-tabs :tab-position="tabPosition" style="min-height: 560px;">
                              <el-tab-pane label="基本信息">
                                  <el-form-item label="姓名" size="small" prop="xm">
                                      <el-input :maxlength="20" v-model="form.xm" placeholder="请输入学生姓名"></el-input>
                                  </el-form-item>
                                  <el-form-item label="学号" size="small" prop="xh">
                                      <el-input :maxlength="20"  v-model="form.xh" placeholder="请输入学号" :disabled="(dialogStatus=='create')?false:true"></el-input>
                                  </el-form-item>
                                  <el-form-item label="学籍号" size="small">
                                      <el-input :maxlength="20" v-model="form.xjh"></el-input>
                                  </el-form-item>
                                  <el-form-item label="证件名称" size="small">
                                      <el-select v-model="form.sfzjlxm" placeholder="请选择" disabled>
                                          <el-option v-for="item in dictionary.zjmc" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="证件号码" size="small" prop="sfzjh">
                                      <el-input :maxlength="20" v-model="form.sfzjh"></el-input>
                                  </el-form-item>
                                  <el-form-item label="性别" size="small">
                                      <el-radio-group v-model="form.xbm">
                                          <el-radio label="1">男</el-radio>
                                          <el-radio label="2">女</el-radio>
                                      </el-radio-group>
                                  </el-form-item>
                                  <el-form-item label="当前年级" size="small">
                                      <el-select v-model="form.njid" placeholder="请选择">
                                          <el-option v-for="item in dictionary.grade" :key="item.njdm" :label="item.njmc" :value="item.njdm"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="当前班级" size="small" prop="bjid" :rules="[{ required: true, message: '当前班级不能为空',traggle:'change'}]">
                                      <el-select v-model="form.bjid" placeholder="请选择">
                                          <el-option v-for="item in dictionary.class" :key="item.uuid" :label="item.bj" :value="item.uuid"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="班内编号" size="small">
                                      <el-input :maxlength="20" v-model="form.bnbh"></el-input>
                                  </el-form-item>
                                  <el-form-item label="密码" size="small" required>
                                      <el-input :maxlength="20" v-model="form_mm"></el-input>
                                  </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="详细信息">
                                  <el-form-item label="姓名拼音" size="small">
                                      <el-input :maxlength="20" v-model="form.xmpy"></el-input>
                                  </el-form-item>
                                  <el-form-item label="英文姓名" size="small">
                                      <el-input :maxlength="20" v-model="form.ywxm"></el-input>
                                  </el-form-item>
                                  <el-form-item label="曾用名" size="small">
                                      <el-input :maxlength="20" v-model="form.cym" placeholder=""></el-input>
                                  </el-form-item>
                                  <el-form-item label="民族" size="small">
                                      <el-select v-model="form.mzm" placeholder="请选择">
                                          <el-option v-for="item in dictionary.mz" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="出生日期" size="small">
                                      <el-date-picker type="date" v-model="form.csrq" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="form_pickerOp"></el-date-picker>
                                  </el-form-item>
                                  <el-form-item label="出生地" size="small">
                                      <el-cascader :options="dictionary.jg" v-model="opation_csdm" :props="form_props"></el-cascader>
                                  </el-form-item>
                                  <el-form-item label="政治面貌" size="small">
                                      <el-select v-model="form.zzmmm" placeholder="请选择">
                                          <el-option v-for="item in dictionary.zzmm" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="健康状况" size="small">
                                      <el-select v-model="form.jkzkm" placeholder="请选择">
                                          <el-option v-for="item in dictionary.jkzk" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="宗教信仰" size="small">
                                      <el-select v-model="form.xyzjm" placeholder="请选择">
                                          <el-option v-for="item in dictionary.zjxy" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="血型" size="small">
                                      <el-select v-model="form.xxm" placeholder="请选择">
                                          <el-option v-for="item in dictionary.xuexing" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="学生类别" size="small">
                                      <el-select v-model="form.xslbm" placeholder="请选择">
                                          <el-option v-for="item in dictionary.xslb" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="卡号信息">
                                  <el-form-item label="义教卡号" size="small">
                                      <el-input :maxlength="20" v-model="opation_kp[0]"></el-input>
                                  </el-form-item>
                                  <el-form-item label="一卡通号1" size="small">
                                      <el-input :maxlength="20" v-model="opation_kp[1]"></el-input>
                                  </el-form-item>
                                  <el-form-item label="一卡通号2" size="small">
                                      <el-input :maxlength="20" v-model="opation_kp[2]"></el-input>
                                  </el-form-item>
                                  <el-form-item label="一卡通号3" size="small">
                                      <el-input :maxlength="20" v-model="opation_kp[3]"></el-input>
                                  </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="入学信息">
                                  <el-form-item label="入学年月" size="small">
                                      <el-date-picker type="month" v-model="form.rxny" value-format="yyyy-MM" :picker-options="form_pickerOp" placeholder="选择日期"></el-date-picker>
                                  </el-form-item>
                                  <el-form-item label="入学学年" size="small">
                                      <el-select v-model="form.rxxn" placeholder="请选择">
                                          <el-option v-for="item in dictionary.rxxn" :key="item" :label="item" :value="item"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="入学学期" size="small">
                                      <el-select v-model="form.rxxq" placeholder="请选择">
                                          <el-option v-for="item in dictionary.term" :key="item.uuid" :label="item.xqmc" :value="item.uuid"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="入学方式" size="small">
                                      <el-select v-model="form.rxfsdm" placeholder="请选择">
                                          <el-option v-for="item in dictionary.rxfs" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="毕业学校" size="small">
                                      <el-input :maxlength="50" v-model="form.byyey"></el-input>
                                  </el-form-item>
                                  <el-form-item label="入学成绩" size="small">
                                      <el-input :maxlength="10" v-model="form.rxcj"></el-input>
                                  </el-form-item>
                                  <el-form-item label="来源地（生源地）" size="small">
                                      <el-cascader :options="dictionary.jg" v-model="opation_lyd" :props="form_props"></el-cascader>
                                  </el-form-item>
                                  <el-form-item label="就读方式" size="small">
                                      <el-select v-model="form.jdfs" placeholder="请选择">
                                          <el-option label="正常入学" value="01"></el-option>
                                          <el-option label="走读" value="02"></el-option>
                                          <el-option label="住校" value="03"></el-option>
                                          <el-option label="借宿" value="04"></el-option>
                                          <el-option label="其他" value="05"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="中招序号" size="small">
                                      <el-input :maxlength="20" v-model="form.zzxh"></el-input>
                                  </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="户籍信息">
                                  <el-form-item label="籍贯" size="small">
                                      <el-cascader :options="dictionary.jg" v-model="opation_jg" :props="form_props"></el-cascader>
                                  </el-form-item>
                                  <el-form-item label="国籍" size="small">
                                      <el-select v-model="form.gjdqm" placeholder="请选择">
                                          <el-option v-for="item in dictionary.gj" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="港澳台侨外" size="small">
                                      <el-select v-model="form.gatqwm" placeholder="请选择">
                                          <el-option v-for="item in dictionary.gatqw" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="户口类别" size="small">
                                      <el-radio-group v-model="form.hkxzm">
                                          <el-radio label="2">非农户口</el-radio>
                                          <el-radio label="1">农业户口</el-radio>
                                      </el-radio-group>
                                  </el-form-item>
                                  <el-form-item label="户口外省" size="small">
                                      <el-radio-group v-model="form.hkws">
                                          <el-radio label="1">是</el-radio>
                                          <el-radio label="0">否</el-radio>
                                      </el-radio-group>
                                  </el-form-item>
                                  <el-form-item label="所在地" size="small">
                                      <el-cascader :options="dictionary.jg" v-model="opation_szd" :props="form_props"></el-cascader>
                                  </el-form-item>
                                  <el-form-item label="镇/街道" size="small">
                                      <el-input :maxlength="50" v-model="form.hkjd"></el-input>
                                  </el-form-item>
                                  <el-form-item label="社区" size="small">
                                      <el-input :maxlength="40" v-model="form.hksq"></el-input>
                                  </el-form-item>
                                  <el-form-item label="备注" size="small">
                                      <el-input :maxlength="200" type="textarea" v-model="form.hkbz" placeholder="不超过200个字"></el-input>
                                  </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="联系方式">
                                  <el-form-item label="监护人" size="small">
                                      <el-input :maxlength="10" v-model="form.jhr"></el-input>
                                  </el-form-item>
                                  <el-form-item label="监护人关系" size="small">
                                      <el-select v-model="form.jhrgxdm" placeholder="请选择">
                                          <el-option v-for="item in dictionary.jhrgx" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item label="监护人手机" size="small">
                                      <el-input :maxlength="15" v-model="form.jgrsj"></el-input>
                                  </el-form-item>
                                  <el-form-item label="手机号码" size="small">
                                      <el-input :maxlength="20" v-model="form.sjhm"></el-input>
                                  </el-form-item>
                                  <el-form-item label="家庭电话" size="small">
                                      <el-input  :maxlength="20" v-model="form.lxdh"></el-input>
                                  </el-form-item>
                                  <el-form-item label="电子邮箱" size="small">
                                      <el-input :maxlength="20" v-model="form.dzxx"></el-input>
                                  </el-form-item>
                                  <el-form-item label="家庭地址" size="small">
                                      <el-input :maxlength="50" v-model="form.xzz"></el-input>
                                  </el-form-item>
                                  <el-form-item label="邮政编号" size="small">
                                      <el-input :maxlength="10" v-model="form.yzbm"></el-input>
                                  </el-form-item>
                                  <el-form-item label="个人主页" size="small">
                                      <el-input :maxlength="20" v-model="form.zydz"></el-input>
                                  </el-form-item>
                                  <el-form-item label="QQ号码" size="small">
                                      <el-input :maxlength="20" v-model="form.qq"></el-input>
                                  </el-form-item>
                              </el-tab-pane>
                              <!-- <el-tab-pane label="家庭成员">
                      <el-table :key='tableKey' :data="familyList" border fit highlight-current-row style="width: 100%">
                          <el-table-column label="姓名">
                              <template slot-scope="scope">
                                  <span>{{scope.row.bjmc}}</span>
                              </template>
                          </el-table-column>
                          <el-table-column v-for="item in kcList" :key="item.kcid" :label="item.kcmc">
                              <template slot-scope="scope">
                                  <el-select v-model="scope.row[item.kcid].rkjsgh" clearable placeholder="" @change="handleChange(item.kcid,scope.row[item.kcid].rkjsgh,scope.$index)">
                                      <el-option v-for="item in jsList" :key="item.gh" :label="item.xm" :value="item.gh"></el-option>
                                  </el-select>
                              </template>
                          </el-table-column>
                      </el-table>
                  </el-tab-pane> -->
                                <el-tab-pane label="其他信息">
                                    <el-row :gutter="15">
                                        <el-col :span="12">
                                            <el-form-item label="是否独生子女" size="small">
                                                <el-radio-group v-model="form.dsznbz">
                                                    <el-radio label="1">是</el-radio>
                                                    <el-radio label="0">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="是否本地生源" size="small">
                                                <el-radio-group v-model="form.sfbdsy">
                                                    <el-radio label="1">是</el-radio>
                                                    <el-radio label="0">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="15">
                                        <el-col :span="12">
                                            <el-form-item label="是否留守儿童" size="small">
                                                <el-radio-group v-model="form.sflset">
                                                    <el-radio label="1">是</el-radio>
                                                    <el-radio label="0">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="是否流动人口" size="small">
                                                <el-radio-group v-model="form.sfldrk">
                                                    <el-radio label="1">是</el-radio>
                                                    <el-radio label="0">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="15">
                                        <el-col :span="12">
                                            <el-form-item label="是否民工子女" size="small">
                                                <el-radio-group v-model="form.sfmgzn">
                                                    <el-radio label="1">是</el-radio>
                                                    <el-radio label="0">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="接受学前教育" size="small">
                                                <el-radio-group v-model="form.jsxqjy">
                                                    <el-radio label="1">是</el-radio>
                                                    <el-radio label="0">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-form-item label="特长" size="small">
                                        <el-input :maxlength="200" type="textarea" v-model="form.tc" placeholder="不超过200个字"></el-input>
                                    </el-form-item>
                                    <el-form-item label="备注" size="small">
                                        <el-input :maxlength="200" type="textarea" v-model="form.bz" placeholder="不超过200个字"></el-input>
                                    </el-form-item>
                                </el-tab-pane>
                                <el-form-item>
                                    <el-button @click="cancel('form')">取 消</el-button>
                                    <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定</el-button>
                                    <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
                                </el-form-item>
                            </el-tabs>
                        </el-form>
                    </el-dialog>
                </div>
            </el-col>
        </el-row>
        <el-dialog title="导入数据" :visible.sync="importCjFormVisible" width="540px" :before-close="importCancel" class="import_box">
            <el-row>
                <el-col :span="6" style="line-height:32px;margin-bottom:50px;">
                    文件选择：
                </el-col>
                <el-col :span="18">
                    <el-upload :limit="1"
                    name="file"
                    ref="studentupload"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    :headers=headers
                    action="/api/base/jcXsjbsj/import"
                    :file-list="fileList" :data="{xxdm: xxdm}" :onError="uploadError" :onSuccess="uploadSuccess" :before-upload="beforeUpload" :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-col>
            </el-row>
                <el-row>
                    导入失败数据详情：
                    <el-table
                        :data="errData"
                        style="width: 100%;max-height: 200px;
                        overflow-y: scroll;">
                        <el-table-column
                            prop="xm"
                            label="姓名">
                        </el-table-column>
                        <el-table-column
                            prop="xb"
                            label="性别">
                        </el-table-column>
                        <el-table-column
                            prop="xh"
                            label="学号">
                        </el-table-column>
                        <el-table-column
                            prop="bj"
                            label="班级">
                        </el-table-column>
                        <el-table-column
                            prop="errMsg"
                            label="错误信息">
                        </el-table-column>
                    </el-table>
                </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="importSubmit('studentupload')" :loading="importLoading">导入</el-button>
                <el-button size="medium" @click="importCancel">取 消</el-button>
                <el-button size="medium" @click="importMb">模版生成
                    <i class="el-icon-download"></i>
                </el-button>
                <el-row class="import_desc">
                    <el-col :span="6" style="line-height:80px">
                        操作说明：
                    </el-col>
                    <el-col :span="18">
                        <p>1.请使用本页面提供的模版进行导入</p>
                        <p>2.请勿修改模版Excel的表头内容</p>
                        <p>3.模版提供的默认信息，请勿随意修改</p>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>

</template>
<script>
import Cookies from 'js-cookie';
import { getDict } from 'api/dict';
import TreePart from 'components/TreePart';
import {
  studentexport,
  studentAll,
  stuXspage,
  getObj,
  putObj,
  addObj,
  getBjTree,
  resetSecret,
  studentImportTemplate,
  delObj,
  fuzzyQuery
} from 'api/admin/student/index';
import { page, dqxnxqObj } from 'api/admin/acadyear/index';
import { termpage } from 'api/admin/term/index';
import { gradepage } from 'api/admin/grade/index';
import { classpage } from 'api/admin/class/index';
import { mapGetters } from 'vuex';

export default {
  name: 'teach',
  components: {
    TreePart
  },
  data() {
    const yzxm = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'));
      }
      if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
        callback(new Error('请输入姓名'));
      } else {
        callback();
      }
    };
    const yzxh = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('学号不能为空'));
      }
      if (value.toString().replace(/[^\d]/g, '') === '' || value.toString().length !== value.toString().replace(/[^\d]/g, '').length) {
        callback(new Error('请输入数字'));
      } else {
        callback();
      }
    };
    return {
      datapost: {},
      postparams: {}, // 传参
      temarray: [], // 数组缓存
      treeHeader: '选择班级',
      defaultProps: {
        children: 'children',
        id: 'id',
        label: 'name'
      },
      njbjTree: [], // 行政区域
      fileList: [],
      errData: [],
      dialogVisible: false, // 显示隐藏
      importCjFormVisible: false, // 显示隐藏
      xxdm: '',
      dqxn: '',
      dqxq: '',
      listLoading: true, // 加载
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      searchsel: 'all', // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）

      tableKey: 0, // 表格
      list: null,
      total: null,

      dialogFormVisible: false, // 弹层是否显示
      dialogStatus: '',
      textMap: {
        // 判断弹层是添加还是编辑
        update: '编辑',
        create: '创建'
      },
      tabPosition: 'left',
      form: {}, // 表单

      dictionary: {
        // 通用字典表
        jg: [],
        mz: [],
        zjmc: [],
        zzmm: [],
        hyzk: [],
        campusdata: [],
        gwzw: [],
        js: [],
        bm: [] // 部门----为了级联
      },
      form_pickerOp: {
        // 出生日期
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      form_props: {
        value: 'id',
        label: 'text',
        children: 'children'
      },
      opation_jg: [], // 籍贯--传参要求是字符串、所得是数组要转化
      opation_csdm: [], // 出生地
      opation_lyd: [], // 生源地
      opation_szd: [], // 所在地
      xn_listQuery: {
        // 学年
        page: 1,
        limit: 50
      },
      bjxn_listQuery: {
        // 学年
        page: 1,
        limit: 50
      },
      postdata: {},
      familyList: [], // 家庭成员
      form_mm: '',
      opation_kp: {},
      importLoading: false,
      changeSure: false, // 防止重复提交
      rules: {
        xh: [{ required: true, validator: yzxh, trigger: 'blur' }],
        xm: [
          { required: true, validator: yzxm, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['dict']),
    headers() {
      return {
        Authorization: Cookies.get('Admin-Token'),
        ReturnResultCode: true
      };
    }
  },
  created() {
    const that = this;
    this.xxdm = window.localStorage.getItem('xxdm');
    this.getBjTreedata();
    this.listQuery.xxdm = this.xxdm;
    dqxnxqObj({ xxdm: that.xxdm }).then(response => {
      this.dqxn = response.data.xn;
      this.dqxq = response.data.xq;
      this.getacdYear();
    })
    this.getDictJson();
    this.getList();
    // this.getacdYear();
  },
  watch: {
    dict() {
      this.getDictJson();
    }
  },
  methods: {
    // 导入
    importfunction() {
      this.errData = [];
      this.importCjFormVisible = true;
    },
    // 取消上传
    importCancel() {
      this.importLoading = false;
      this.importCjFormVisible = false;
      this.fileList = [];
    },
    // 下载模版
    importMb() {
      studentImportTemplate({
        xxdm: this.listQuery.xxdm
      }).then(response => {
        const blob = new Blob([response], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '模版.xlsx'; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
    },
    // 导出
    exportfunctresetsecretion() {
      studentexport({
        xxdm: 1755 || this.listQuery.xxdm
      }).then(response => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        const downloadElement = document.createElement('a');
        　　const href = window.URL.createObjectURL(blob); // 创建下载的链接
        　　downloadElement.href = href;
        　　downloadElement.download = '学生列表.xlsx'; // 下载后文件名
        　　document.body.appendChild(downloadElement);
        　　downloadElement.click(); // 点击下载
        　　document.body.removeChild(downloadElement); // 下载完成移除元素
        　　window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
    },
    // 密码重置
    resetsecretfunction() {
      if (!this.temarray.length) {
        this.$message({
          message: '至少选择一人',
          type: 'warning'
        });
      } else {
        this.dialogVisible = true;
      }
    },
    // 密码重置
    resetsecretyes() {
      resetSecret(this.postdata).then(res => {
        if (!res.code) {
          this.$message({
            message: '重置成功',
            type: 'success'
          });
          this.dialogVisible = false;
          return;
        }
        this.$message({
          message: res.message,
          type: 'error'
        });
      });
    },
    // 树点击
    treeCClick(nodeData) {
      this.listQuery.page = 1;
      const id = nodeData.njid;
      if (!nodeData.children) {
        this.getList({
          njid: id,
          bjid: nodeData.bjdm
        });
        return;
      }
      this.getList({
        njid: id
      });
    },
    // 获取树
    getBjTreedata() {
      const xxdm = this.xxdm;
      //   getBjTree(xxdm)
      getBjTree(xxdm)
        .then(response => {
          this.njbjTree = response;
          //   this.getList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getList(data) {
      if (typeof data != 'object') {
        this.listQuery.xxdm = this.xxdm;
        stuXspage(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        });
        return;
      }
      this.listLoading = true;
      this.listQuery.xxdm = this.xxdm;
      this.listQuery.bjid = data.bjid;
      this.listQuery.njid = data.njid;
      stuXspage(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    fuzzyQuery() {
      this.listQuery.xxdm = this.xxdm;
      fuzzyQuery(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    importSubmit(fileName) {
      // if (!this.fileList.length) {
      //   this.$message({
      //     message: '请选择文件',
      //     type: 'error'
      //   });
      // }
      this.$refs[fileName].submit();
      this.importCjFormVisible = true;
    },

    // 上传错误
    uploadError(response, file, fileList) {
      this.importLoading = false;
      this.$message({
        message: response.message,
        type: 'error'
      });
    },
    getDictJson() {
      this.dictionary.jg = this.$store.getters.dict_jg; // 籍贯
      this.dictionary.mz = this.$store.getters.dict_mz; // 民族
      this.dictionary.zjmc = this.$store.getters.dict_zjmc; // 证件名称
      this.dictionary.zzmm = this.$store.getters.dict_zzmm; // 政治面貌
      this.dictionary.hyzk = this.$store.getters.dict_hyzk; // 婚姻状况
      this.dictionary.gwzw = this.$store.getters.dict_gwzw; // 岗位职务
      this.dictionary.jkzk = this.$store.getters.dict_jkzk; // 健康状况
      this.dictionary.gj = this.$store.getters.dict_gj; // 国籍
      this.dictionary.gatqw = this.$store.getters.dict_gatqw; // 港澳台侨胞
      this.dictionary.zjxy = this.$store.getters.dict_zjxy; // 宗教信仰
      this.dictionary.xuexing = this.$store.getters.dict_xuexing; // 血型
      this.dictionary.xslb = this.$store.getters.dict_xslb; // 学生类别
      this.dictionary.rxfs = this.$store.getters.dict_rxfs; // 入学方式
      this.dictionary.jhrgx = this.$store.getters.dict_jhrgx; // 监护人关系
    },
    getacdYear() {
      // 学年
      this.xn_listQuery.xxdm = this.xxdm;
      page(this.xn_listQuery).then(response => {
        const year = response.data.rows;
        const rxxn = [];
        this.dictionary.term = response.data.rows;
        for (let i = 0; i < year.length; i++) {
          rxxn[i] = year[i].xn;
        }
        this.dictionary.rxxn = _.uniq(rxxn);
      });
      gradepage(this.xn_listQuery).then(response => {
        this.dictionary.grade = response.data.rows;
      });
      this.bjxn_listQuery.xxdm = this.xxdm;
      this.bjxn_listQuery.jbny = this.dqxn;
      classpage(this.bjxn_listQuery).then(response => {
        this.dictionary.class = response.data.rows;
      });
    },
    // 搜索
    handleFilter() {
      if (this.searchsel === 'all') {
        this.listQuery = { page: 1, limit: 20, xh: this.listQuery[this.searchsel], xm: this.listQuery[this.searchsel] };
        this.fuzzyQuery();
        return;
      }
      this.getList();
    },
    searchChange(val) {
      this.listQuery = {
        page: 1,
        limit: 20,
        xxdm: this.xxdm,
        name: undefined
      };
    },
    // 分页
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },

    // 添加
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    resetTemp() {
      this.form = {
        xbm: '1',
        sfzjlxm: '1', // 默认身份证件为居民身份证
        hkxzm: '2', // 户口
        hkws: '0', // 户口外省
        dsznbz: '1', // 独生子女
        sfbdsy: '1', // 本地生源
        sflset: '0', // 留守儿童
        sfldrk: '0', // 流动人口
        sfmgzn: '0', // 民工子女
        jsxqjy: '1' // 学前教育
      };
      this.opation_kp[0] = '';
      this.opation_kp[1] = '';
      this.opation_kp[2] = '';
      this.opation_kp[3] = '';
      this.form_mm = '888888';
      this.changeSure = false;
    },
    // 编辑
    handleUpdate(row) {
      this.changeSure = false;
      getObj(row.uuid).then(response => {
        this.form = response.data;
        this.form.sfzjlxm = '1';
        this.form_mm = '******';
        if (!this.form.xbm) this.form.xbm = '1';
        if (!this.form.sfzjlxm) this.form.sfzjlxm = '1';
        if (!this.form.hkxzm) this.form.hkxzm = '2';
        if (!this.form.hkws) this.form.hkws = '0';
        if (!this.form.dsznbz) this.form.dsznbz = '1';
        if (!this.form.sfbdsy) this.form.sfbdsy = '1';
        if (!this.form.sflset) this.form.sflset = '0';
        if (!this.form.sfldrk) this.form.sfldrk = '0';
        if (!this.form.sfmgzn) this.form.sfmgzn = '0';
        if (!this.form.jsxqjy) this.form.jsxqjy = '1';
        this.opation_csdm = this.form.csdm ? this.form.csdm.split(',') : []; // 出生地
        this.opation_jg = this.form.jg ? this.form.jg.split(',') : []; // 籍贯
        this.opation_lyd = this.form.lyd ? this.form.lyd.split(',') : []; // 生源地
        this.opation_szd = this.form.hkszd ? this.form.hkszd.split(',') : []; // 所在地

        // 卡号
        if (this.form.kp) {
          this.opation_kp[0] = this.form.kp[0] ? this.form.kp[0] : '';
          this.opation_kp[1] = this.form.kp[1] ? this.form.kp[1] : '';
          this.opation_kp[2] = this.form.kp[2] ? this.form.kp[2] : '';
          this.opation_kp[3] = this.form.kp[3] ? this.form.kp[3] : '';
        } else {
          this.opation_kp[0] = '';
          this.opation_kp[1] = '';
          this.opation_kp[2] = '';
          this.opation_kp[3] = '';
        }
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
    },
    // 取消按钮
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    // 编辑页面
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeSure = true;
          this.form.xxdm = this.xxdm;
          this.form.mm = this.form_mm;
          if (this.opation_csdm.length > 0) { this.form.csdm = this.opation_csdm.join(); } // 出生地
          if (this.opation_jg.length > 0) this.form.jg = this.opation_jg.join(); // 籍贯
          if (this.opation_kp[0].length > 0) { this.form.kp[0] = this.opation_kp[0]; }
          if (this.opation_kp[1].length > 0) { this.form.kp[1] = this.opation_kp[1]; }
          if (this.opation_kp[2].length > 0) { this.form.kp[2] = this.opation_kp[2]; }
          if (this.opation_kp[3].length > 0) { this.form.kp[3] = this.opation_kp[3]; }
          if (this.opation_lyd.length > 0) { this.form.lyd = this.opation_lyd.join(); } // 生源地
          if (this.opation_szd.length > 0) { this.form.hkszd = this.opation_szd.join(); } // 所在地
          if (this.form.kp.length > _.uniq(this.form.kp).length) {
            this.$message('卡号不可重复，请重新输入');
            this.changeSure = false;
            return false;
          }
          putObj(this.form.uuid, this.form).then(res => {
            if (res.status == '200') {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            } else {
              this.$notify({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              });
            }
          });

          const that = this;
          setTimeout(() => {
            that.changeSure = false;
          }, 1500);
        } else {
          this.$notify({
            title: '失败',
            message: '还有未填项',
            type: 'error',
            duration: 2000
          });
          return false;
        }
      });
    },
    // 上传前对文件的大小的判断
    beforeUpload(file) {
      this.postparams = file;
      console.log(this.postparams)
      this.importLoading = true;
      const extension = file.name.split('.')[1] === 'xlsx';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension) {
        this.$notify({
          title: '提示',
          message: '上传模版只支持xlsx格式',
          type: 'info',
          duration: 2000
        });
        this.importLoading = false;
      } else if (!isLt2M) {
        this.$notify({
          title: '提示',
          message: '上传模板大小不能超过 10MB',
          type: 'info',
          duration: 2000
        });
        this.importLoading = false;
      }
      return extension && isLt2M;
    },
    // 更新页面
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeSure = true;
          this.form.xxdm = this.xxdm;
          this.form.mm = this.form_mm;
          this.form.kp = [];
          if (this.opation_csdm && this.opation_csdm.length > 0) { this.form.csdm = this.opation_csdm.join(); } // 出生地
          if (this.opation_jg && this.opation_jg.length > 0) { this.form.jg = this.opation_jg.join(); } // 籍贯
          if (this.opation_kp[0] && this.opation_kp[0].length > 0) { this.form.kp[0] = this.opation_kp[0]; }
          if (this.opation_kp[1] && this.opation_kp[1].length > 0) { this.form.kp[1] = this.opation_kp[1]; }
          if (this.opation_kp[2] && this.opation_kp[2].length > 0) { this.form.kp[2] = this.opation_kp[2]; }
          if (this.opation_kp[3] && this.opation_kp[3].length > 0) { this.form.kp[3] = this.opation_kp[3]; }
          if (this.opation_lyd && this.opation_lyd.length > 0) { this.form.lyd = this.opation_lyd.join(); } // 生源地
          if (this.opation_szd && this.opation_szd.length > 0) { this.form.hkszd = this.opation_szd.join(); } // 所在地
          if (this.form.kp.length > _.uniq(this.form.kp).length) {
            this.$message({
              message: '卡号不可重复，请重新输入',
              type: 'warning'
            });
            this.changeSure = false;
            return false;
          }
          addObj(this.form).then(res => {
            if (res.status == '200') {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            } else {
              this.$notify({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              });
            }
          });

          const that = this;
          setTimeout(() => {
            that.changeSure = false;
          }, 1500);
        } else {
          this.$notify({
            title: '失败',
            message: '还有未填项',
            type: 'error',
            duration: 2000
          });
          return false;
        }
      });
    },
    // 上传成功后的回调
    uploadSuccess(response, file, fileList) {
      if (response.status == 200) {
        if (response.data.errMsgList && !response.data.errMsgList.length) {
          this.$message({
            message: '导入成功',
            type: 'success'
          });
          this.importLoading = false;
          this.importCjFormVisible = false;
          this.fileList = [];
          this.getList();
          return;
        }
        this.$message({
          message: '数据导入失败',
          type: 'warning'
        });
        this.errData = response.data.errMsgList;
        this.importLoading = false;
        this.importCjFormVisible = true;

        this.fileList = [];
        this.getList();
      } else {
        this.fileList = [];
        this.errData = [];
        this.importLoading = false;
        this.$message({
          message: response.message,
          type: 'error'
        });
      }
    },
    // 选择时事件
    handleSelectionChange(val) {
      this.temarray = []; // ；数组缓存
      val.map((item, index) => {
        this.temarray.push(item.xh);
      });
      this.postdata = {
        userCodes: this.temarray,
        xxdm: this.xxdm
      };
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.uuid).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
      });
    }
  }
};
</script>
<style scoped>
.marginleft10 {
  margin-left: 10px;
}
.flexa {
  display: flex;
}
.flexaline {
  flex-wrap: nowrap;
}
.studentpagestyletopbutton {
  float: left;
  mix-width: 370px;
  margin-bottom: 10px;
}
.filter-container .filter-item {
  vertical-align: inherit;
}
.el-input-group__append,
.el-input-group__prepend {
  padding: 0 10px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.el-checkbox {
  margin-right: 30px;
}
.studentpagestyle .studentpagestyletopdiv {
  width: 100%;
  margin-bottom: 20px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
}
.studentpagestyle .studentpagestyletopsearch {
  float: right;
  text-align: right;
}
.studentManaerwrapper {
  overflow: auto;
  display: flex;
  flex-wrap: nowrap;
}
.studentManaerleft {
  min-width: 250px;
  margin-top: 30px;
}
.studentManaerright {
  min-width: 900px;
}
.topsearchbutton {
  margin-left: 10px;
  height: 40px;
}
</style>
<style lang="scss" scoped>
.import_box {
  .import_body {
    overflow: hidden;
  }
  .import_desc {
    overflow: hidden;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
    text-align: left;
  }
}
</style>
