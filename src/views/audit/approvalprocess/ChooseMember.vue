<!-- 部门成员选择组件 -->
<template>
  <div>
    <div v-if="!issearch">
      <div v-if="!next" class="box" v-for="(item, index) in dataSource" :key="index">
        <div class="item_box">
          <div style="position: relative;" class="item_left">
            <div class="name">{{item.label}}</div>
          </div>
          <div class="item_right" @click.stop="nextpage(item)">下级</div>
        </div>
      </div>
      <!-- 子部门 -->
      <div v-if="next" class="box" v-for="(citem, cindex) in childrendepartmentlist" :key="cindex">
        <div class="item_box">
          <div style="position: relative;" class="item_left">
            <div class="name">{{citem.label}}</div>
          </div>
          <div class="item_right" @click.stop="nextpage(citem)">下级</div>
        </div>
      </div>
      <!-- 部门成员beg -->
      <div v-if="next">
        <div class="box" v-for="(member, mindex) in departmentmemberlist" :key="mindex" v-if="departmentmemberlist.length">
          <div class="item_box" style="line-height: 20px;">
            <div style="position: relative;" class="item_left">
              <div class="checkbox">
                <check-box @click="checkclick(member, mindex, 'member')" v-model="member.IsSelect"></check-box>
              </div>
              <div class="name">{{member.name}}</div>
            </div>
          </div>
        </div>
        <div class="box" v-if="!departmentmemberlist.length" style="color: #888;">
          该部门暂无成员
        </div>
      </div>
      <!-- 部门成员end -->
      <!-- 部门领导beg -->
      <div v-if="next">
        <p style="background-color: #fff;">部门领导</p>
        <div class="box" v-for="(lead, lindex) in leaderlist" :key="lindex" v-if="leaderlist.length">
          <div class="item_box" style="line-height: 20px;">
            <div style="position: relative;" class="item_left">
              <div class="checkbox">
                <check-box  @click="checkclick(lead, lindex, 'leader')" v-model="lead.IsSelect"></check-box>
              </div>
              <div class="name">{{lead.name}}</div>
            </div>
          </div>
        </div>
        <div class="box" v-if="!leaderlist.length" style="color: #888;">
          该部门暂无领导
        </div>
      </div>
      <!-- 部门领导end -->
    </div>
    <!-- 搜索数据beg -->
    <div v-if="issearch">
      <div>
        <div class="box" v-for="(member, mindex) in searchlist" :key="mindex" v-if="searchlist.length">
          <div class="item_box" style="line-height: 20px;">
            <div style="position: relative;" class="item_left">
              <div class="checkbox">
                <check-box @click="checkclick(member, mindex, 'search')" v-model="member.IsSelect"></check-box>
              </div>
              <div class="name">{{member.name}}</div>
            </div>
          </div>
        </div>
        <div class="box" v-if="!searchlist.length" style="color: #888;">
          暂无该成员
        </div>
      </div>
    </div>
    <!-- 搜索数据end -->
  </div>
</template>
<script>
  import CheckBox from '../../../components/Checkbox/CheckBox'
  import { getUsers } from 'api/admin/group/index'
  import { setlocal, getlocal, clearlocal } from '../../../utils/local'
  export default {
    name: 'ChooseMember',
    components: {
      CheckBox
    },
    data() {
      return {
        issearch: false, // 是否为搜索数据
        next: false,
        departmentlist: [], // 部门列表
        childrendepartmentlist: [],
        leaderlist: [], // 部门领导列表
        departmentmemberlist: [], // 部门成员列表
        searchlist: [], // 搜索数据暂存
        departmentmembers: [] // 以勾选部门人员暂存
      }
    },
    watch: {
      isnext: { // 数据状态是否显示部门列表监听父组件传值
        handler(newval, oldval) {
          this.next = newval
        },
        deep: true
      },
      departmentleader: { // 监听父组件传值领导数据变化
        handler(newval, oldval) {
          this.leaderlist = newval
          this.departmentmembers = getlocal('departmentmembers') ? getlocal('departmentmembers') : []
          setTimeout(() => {
            if (this.departmentmembers.length) {
              this.leaderlist.forEach(el => {
                this.departmentmembers.forEach(item => {
                  if (item.id === el.id) {
                    el.IsSelect = item.IsSelect
                  }
                })
              })
            }
            // console.log(this.departmentmemberlist)
          }, 300)
        },
        deep: true
      },
      departmentmember: { // 监听父组件传值部门成员数据变化
        handler(newval, oldval) {
          this.departmentmemberlist = newval
          this.departmentmembers = getlocal('departmentmembers') ? getlocal('departmentmembers') : []
          setTimeout(() => {
            if (this.departmentmembers.length) {
              this.departmentmemberlist.forEach(el => {
                this.departmentmembers.forEach(item => {
                  if (item.id === el.id) {
                    el.IsSelect = item.IsSelect
                  }
                })
              })
            }
            // console.log(this.departmentmemberlist)
          }, 300)
        },
        deep: true
      },
      sxbmspr: {
        handler(newval, oldval) {
          // console.log(newval)
          this.departmentmembers = getlocal('departmentmembers') ? getlocal('departmentmembers') : newval
          setTimeout(() => {
            if (this.departmentmembers.length) {
              this.departmentmemberlist.forEach(el => {
                this.departmentmembers.forEach(item => {
                  if (item.id === el.id) {
                    el.IsSelect = item.IsSelect
                  }
                })
              })
              this.leaderlist.forEach(el => {
                this.departmentmembers.forEach(item => {
                  if (item.id === el.id) {
                    el.IsSelect = item.IsSelect
                  }
                })
              })
              // this.searchlist.forEach(el => {
              //   this.departmentmembers.forEach(item => {
              //     if (item.id === el.id) {
              //       el.IsSelect = item.IsSelect
              //     }
              //   })
              // })
            }
            // console.log(this.departmentmemberlist)
          }, 300)
        },
        deep: true
      },
      childrendepartment: { // 监听父组件传值子部门数据变化
        handler(newval, oldval) {
          // console.log(oldval)
          if (newval !== oldval) {
            this.childrendepartmentlist = newval
          } else {
            this.childrendepartmentlist = oldval
          }
        },
        deep: true
      },
      search: {
        handler(newval, oldval) {
          this.issearch = newval
        },
        deep: true
      },
      searchmenmberlist: { // 监听父组件传值搜索数据变化
        handler(newval, oldval) {
          // console.log(newval)
          this.searchlist = newval
          setTimeout(() => {
            if (this.departmentmembers.length) {
              this.searchlist.forEach(el => {
                this.departmentmembers.forEach(item => {
                  if (item.id === el.id) {
                    el.IsSelect = item.IsSelect
                  }
                })
              })
            }
          }, 300)
        },
        deep: true
      },
      departmentmemberId: {
        handler(newval, oldval) {
          this.searchlist.forEach(el => {
            if (el.id === newval) {
              el.IsSelect = false
            }
          })
          this.departmentmemberlist.forEach(el => {
            if (el.id === newval) {
              el.IsSelect = false
            }
          })
          this.leaderlist.forEach(el => {
            if (el.id === newval) {
              el.IsSelect = false
            }
          })
          this.departmentmembers = getlocal('departmentmembers') ? getlocal('departmentmembers') : []
        }
      }

    },
    created() {
    },
    mounted() {
      setTimeout(() => { // 通过将已经指定成员暂存，使进入部门时已选人员保持为已选状态
        if (this.departmentmembers.length) {
          this.departmentmemberlist.forEach(el => {
            this.departmentmembers.forEach(item => {
              if (item.id === el.id) {
                el.IsSelect = item.IsSelect
              }
            })
          })
          this.leaderlist.forEach(el => {
            this.departmentmembers.forEach(item => {
              if (item.id === el.id) {
                el.IsSelect = item.IsSelect
              }
            })
          })
          this.searchlist.forEach(el => {
            this.departmentmembers.forEach(item => {
              if (item.id === el.id) {
                el.IsSelect = item.IsSelect
              }
            })
          })
        }
      // console.log(this.departmentmemberlist)
      }, 300)
    },
    props: {
      dataSource: Array,
      isnext: Boolean,
      search: Boolean,
      departmentleader: Array,
      departmentmember: Array,
      childrendepartment: Array,
      searchmenmberlist: Array,
      departmentmemberId: String,
      sxbmspr: Array
    },
    methods: {
      // 验证勾选将已经选中的添加选中状态
      valid() {
        setTimeout(() => {
          if (this.departmentmembers.length) {
            this.departmentmemberlist.forEach(el => {
              this.departmentmembers.forEach(item => {
                if (item.id === el.id) {
                  el.IsSelect = item.IsSelect
                }
              })
            })
            this.leaderlist.forEach(el => {
              this.departmentmembers.forEach(item => {
                if (item.id === el.id) {
                  el.IsSelect = item.IsSelect
                }
              })
            })
          }
          // console.log(this.departmentmemberlist)
        }, 300)
      },
      // 点击获取部门成员
      nextpage(datas) {
        this.getdapartmentmember(datas.id)
        this.departmentmembers = getlocal('departmentmembers') ? getlocal('departmentmembers') : []
        // console.log(this.departmentmembers)
        if (datas.children) {
          this.childrendepartmentlist = datas.children
        } else {
          this.childrendepartmentlist = []
        }

        this.next = true
        this.$emit('nextpage', datas)
        setTimeout(() => {
          if (this.departmentmembers.length) {
            this.departmentmemberlist.forEach(el => {
              this.departmentmembers.forEach(item => {
                if (item.id === el.id) {
                  el.IsSelect = item.IsSelect
                }
              })
            })
            this.leaderlist.forEach(el => {
              this.departmentmembers.forEach(item => {
                if (item.id === el.id) {
                  el.IsSelect = item.IsSelect
                }
              })
            })
          }
          // console.log(this.departmentmemberlist)
        }, 300)
      },
      // 获取部门成员
      getdapartmentmember(id) {
        // console.log(id)
        const that = this
        getUsers(id).then(response => {
          // console.log(response)
          response.data.members.forEach(el => {
            that.$set(el, 'IsSelect', false)
          });
          response.data.leaders.forEach(el => {
            that.$set(el, 'IsSelect', false)
          })
          if (response.status === 200) {
            that.leaderlist = response.data.leaders
            that.departmentmemberlist = response.data.members
          } else {

          }
        })
      },
      async checkclick(value, index, str) {
        // console.log(value)
        value.IsSelect = !value.IsSelect

        if (str === 'member') {
          this.departmentmemberlist.forEach(item => {
            if (value.id === item.id) {
              item.IsSelect = value.IsSelect
            }
          })
          if (!value.IsSelect) { // push 进数组暂存
            this.departmentmembers.forEach((el, indexs) => {
              if (el.id === value.id) {
                this.departmentmembers.splice(indexs, 1)
              }
            })
            this.leaderlist.forEach(el => {
              if (el.id === value.id) {
                el.IsSelect = value.IsSelect
              }
            })
          } else {
            this.leaderlist.forEach(el => {
              if (el.id === value.id) {
                el.IsSelect = true
              }
            })
            value.typeTab = 0
            this.departmentmembers.push(value)
          }
          // console.log(this.departmentmembers)
          setlocal('departmentmembers', this.departmentmembers)
        }
        if (str === 'leader') {
          this.leaderlist.forEach(item => {
            if (value.id === item.id) {
              item.IsSelect = value.IsSelect
            }
          })
          if (!value.IsSelect) { // push 进数组暂存
            this.departmentmembers.forEach((el, indexs) => {
              if (el.id === value.id) {
                this.departmentmembers.splice(indexs, 1)
              }
            })
            this.departmentmemberlist.forEach(el => {
              if (el.id === value.id) {
                el.IsSelect = value.IsSelect
              }
            })
          } else {
            this.departmentmemberlist.forEach(el => {
              if (el.id === value.id) {
                el.IsSelect = true
              }
            })
            value.typeTab = 0
            this.departmentmembers.push(value)
          }
          // console.log(this.departmentmembers)
          setlocal('departmentmembers', this.departmentmembers)
        }
        if (str === 'search') {
          if (!value.IsSelect) { // push 进数组暂存
            this.departmentmembers.forEach((el, indexs) => {
              if (el.id === value.id) {
                this.departmentmembers.splice(indexs, 1)
              }
            })
            this.searchlist.forEach(el => {
              if (el.id === value.id) {
                el.IsSelect = value.IsSelect
              }
            })
          } else {
            this.searchlist.forEach(el => {
              if (el.id === value.id) {
                el.IsSelect = true
              }
            })
            value.typeTab = 0
            this.departmentmembers.push(value)
          }
          setlocal('departmentmembers', this.departmentmembers)
        }
        await this.$emit('checkclick', this.departmentmembers)
      }
    }
  }
</script>
<style lang="scss" scoped>
.box{
  width: 100%;
  height: 45px;
  position: relative;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  .item_box{
    width: 100%;
    line-height: 45px;
    .checkbox{
      /* border-radius: 50%; */
      position: relative;
      top: 0px;
    }
    .item_left{
      .name{
        width: 150px;
        float: left;
        margin-left: 30px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .item_right{
      position: absolute;
      right: 25px;
      cursor: pointer;
      color: #6699ff;
    }
    .item_right::before{
      content: '';
      width: 2px;
      height: 25px;
      position: absolute;
      background-color: #6699ff;
      left: -15px;
      top: 10px;
    }
  }
}
</style>
