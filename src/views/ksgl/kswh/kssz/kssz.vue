<template>
  <div>
    <el-checkbox-group v-model="checkboxGroup5" size="small" >
      <el-checkbox @change="handleCheckBox" v-for="item in njList" :key="item.njdm" :label="item.njdm" border>{{item.njmc}}</el-checkbox>
    </el-checkbox-group>
    <el-card shadow="never">
      <div v-if="list.length > 0">
        <el-collapse style="padding: 3px 0px 0px 15px;" v-model="activeNames" @change="handleChange">
          <el-collapse-item v-for="(item,index) in list" :key="item.njdm" :title="item.njmc" :name="item.njdm">
            <!-- 智能排考 -->
            <template v-if="pkfs===1">
              <div>
                <el-checkbox :indeterminate="item.isIndeterminateKc" v-model="item.checkKcAll" @change="handleCheckAllChangeKc(index,$event)">全部课程</el-checkbox>
                <el-checkbox-group v-model="item.checkedKcCities" @change="handleCheckedCitiesChangeKc(index,$event)">
                  <el-checkbox v-for="city in item.kcArry" :label="city.kcdm" :key="city.kcdm">{{city.kcmc}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div>
                <el-checkbox :indeterminate="item.isIndeterminateBj" v-model="item.checkBjAll" @change="handleCheckAllChangeBj(index,$event)">全部班级</el-checkbox>
                <el-checkbox-group v-model="item.checkedBjCities" @change="handleCheckedCitiesChangeBj(index,$event)">
                  <el-checkbox v-for="city in item.bjArry" :label="city.uuid" :key="city.uuid">{{city.bj}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
            <template v-else>
              <div v-for="(kc,e) in item.kclist" :key="kc.kcdm">
                <el-checkbox :indeterminate="kc.isIndeterminateKc" v-model="kc.checkKcAll" @change="handleKcIsAll(index,e,$event)">{{kc.kcmc}}</el-checkbox>
                <el-checkbox-group v-model="kc.checkBj" @change="handleCheckedIsAll(index,e,$event)">
                  <el-checkbox v-for="bj in kc.bjList" :label="bj.uuid" :key="bj.uuid">{{bj.bj}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </el-collapse-item>
        </el-collapse>
        <br>
        <el-button size="medium" type="primary"  @click="handSubmit" >保存</el-button>
      </div>
      <div v-else>
         <span style="text-align: center;color: #bbbbb6;">请设置数据</span>
      </div>
    </el-card>
  </div>
</template>
<script>
  import * as api from '@/api/ksgl/kswh/kssz/index';
  import jcsj from '@/api/jcsj';
  const cityOptions = ['上海', '北京', '广州', '深圳'];
  export default {
    data() {
      return {
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,
        dqxn: this.$route.query.dqxn,
        pkfs: this.$route.query.pkfs,
        checkboxGroup5: [],
        activeNames: [],
        list: [],
        checkedCities1: ['上海', '北京'],
        cities: cityOptions,
        njkcgxList: [],
        value3: true,
        njList: []
      }
    },
    created() {
      this.initKsszMian();
    },
    methods: {
      initKsszMian() {
        /** 获取年级关系 **/
        api.getNjgxList({ xxdm: this.xxdm }).then(response => {
          this.njkcgxList = response;
        })
        /** 获取年级**/
        const parm = { xxdm: this.xxdm, xn: this.dqxn }
        jcsj.hqnjlb(parm).then(res => {
          this.njList = res;
          /** 获取考试科目信息数据 **/
          api.getKskmxxList({ ksdxid: this.ksid, xxdm: this.xxdm }).then(res => {
            const arry = [];
            res.data.forEach(item => {
              arry.push(item.njdm);
            })
            const njcheck = _.uniq(arry);
            this.checkboxGroup5 = njcheck; // 设置年级选中
            if (this.pkfs === 1) { /** 智能排考**/
              this.setCheckBjKm(res.data); // 处理考试设置数据
              this.handleCheckBox();// 设置科目班级选中
            } else {
              this.mrpkList(res.data) /** 默认排考**/
            }
          })
        })
      },
      handleCheckBox() {
        if (this.pkfs === 1) {
          const list = _.sortBy(this.checkboxGroup5); // 选中的年级排序
          this.zzpkList(list);
        } else {
          const arry = this.setMrKssz(); // 获取设置过的数据
          this.mrpkList(arry); // 重新初始化数据
        }
      },
      zzpkList(json) { /** 智能排考 **/
        const num_arry = [];
        this.list = json.map(item => { // 遍历处理年级下数据
          num_arry.push(item);
          const bjMap = _.find(this.list, o => o.njdm === item) // 获取当前设置的过的历史数据
          const map = { // 重新组装数据
            njdm: item,
            njmc: jcsj.hqnjmcByid(this.njList, item),
            checkBjAll: false,
            isIndeterminateBj: true,
            checkedBjCities: bjMap && bjMap.checkedBjCities.length > 0 ? bjMap.checkedBjCities : [], // 设置选中的班级数据
            bjArry: this.getBjArry(item),
            checkKcAll: false,
            isIndeterminateKc: true,
            checkedKcCities: bjMap && bjMap.checkedKcCities.length > 0 ? bjMap.checkedKcCities : [], // 设置选中年级课程数据
            kcArry: this.getKcArry(item)
          }
           /** 判断课程 是否全部选中 **/
          map.checkKcAll = map.checkedKcCities.length === map.kcArry.length;
          map.isIndeterminateKc = map.checkedKcCities.length > 0 && map.checkedKcCities.length < map.kcArry.length;
           /** 判断班级是否全部选中 **/
          map.checkBjAll = map.checkedBjCities.length === map.bjArry.length;
          map.isIndeterminateBj = map.checkedBjCities.length > 0 && map.checkedBjCities.length < map.bjArry.length;
          return map
        })
        this.activeNames = num_arry; // 默认展开
      },
      mrpkList(json) { /** 默认排考 **/
        // debugger
        const njArry = []
        const objctArry = _.sortBy(this.checkboxGroup5); // 选中的年级排序
        objctArry.forEach(njdm => {
            /** 遍历年级 **/
          const njKcMap = {
            njdm,
            njmc: jcsj.hqnjmcByid(this.njList, njdm),
            kclist: this.getKcArry(njdm).map(item => {
                  /** 遍历课程 **/
              const map = {
                njdm, // 年级代码
                kcdm: item.kcdm, // 课程代码
                isIndeterminateKc: true,
                checkKcAll: false,
                kcmc: jcsj.hqkcmcByid(this.kcList, item.kcdm), // 课程名称
                bjList: this.getBjArry(njdm), // 所有班级
                checkBj: [] // 选中的班级
              }
                  /** 添加选中的班级 **/
              const check_bj_list = _.filter(json, e => e.njdm === njdm && e.kcdm === item.kcdm) // 获取默认选中的班级
              check_bj_list.forEach(g => {
                map.checkBj.push(g.bjdm);
              })
                  /** 判断课程 是否全部选中**/
              map.checkKcAll = map.checkBj.length === map.bjList.length;
              map.isIndeterminateKc = map.checkBj.length > 0 && map.checkBj.length < map.bjList.length;
              return map;
            }) // 课程结束
          }
          njArry.push(njKcMap);
        })
        this.list = njArry;
      },
      setCheckBjKm(arry) { /** 设置查询的数据选中 **/
        const list = []
        this.checkboxGroup5.forEach(njdm => { /** 遍历年级 **/
          const map = { njdm, checkedBjCities: [], checkedKcCities: [] }
          arry.forEach(item => { /** 遍历考试设置的科目数 **/
            if (item.njdm === njdm) {
              if (!map.checkedBjCities.includes(item.bjdm)) {
                map.checkedBjCities.push(item.bjdm);
              }
              if (!map.checkedKcCities.includes(item.kcdm)) {
                map.checkedKcCities.push(item.kcdm);
              }
            }
          })
          list.push(map);
        })
        this.list = list;
      },
      setMrKssz() {
        const arry = [];
        this.list.forEach(item => { // 遍历选中的年级
          if (item.kclist.length > 0) {
            item.kclist.forEach(kc => { // 年级下的课程
              if (kc.checkBj.length > 0) {
                kc.checkBj.forEach(bjdm => { // 课程下的班级
                  arry.push({ njdm: item.njdm, kcdm: kc.kcdm, bjdm })
                })
              }
            })
          }
        })
        return arry;
      },
      getBjArry(v) { /** 获取年级的对应的班级**/
        const list = _.filter(this.bjList, item => item.njdm === v)
        return list;
      },
      getKcArry(v) { /** 获取年级对应的课程**/
        const kcarry = [];
        const list = _.filter(this.njkcgxList, item => item.njdm === v)
        list.forEach(item => {
          const e = {
            kcdm: item.kcdm,
            kcmc: jcsj.hqkcmcByid(this.kcList, item.kcdm)
          }
          kcarry.push(e);
        })
        return kcarry;
      },
      handleChange(val) {
        console.log(val);
      },
      handleCheckAllChangeKc(val, check) {
        const $this = this.list[val];
        if (check) {
          const list = [];
          $this.kcArry.forEach(item => {
            list.push(item.kcdm);
          })
          $this.checkedKcCities = list;
        } else {
          $this.checkedKcCities = [];
        }
        $this.isIndeterminateKc = false;
      },
      handleCheckAllChangeBj(val, check) {
        const $this = this.list[val];
        if (check) {
          const list = [];
          $this.bjArry.forEach(item => {
            list.push(item.uuid);
          })
          $this.checkedBjCities = list;
        } else {
          $this.checkedBjCities = [];
        }
        $this.isIndeterminateBj = false;
      },
      handleCheckedCitiesChangeKc(val, value) {
        const $this = this.list[val];
        const checkedCount = value.length;
        $this.checkKcAll = checkedCount === $this.kcArry.length;
        $this.isIndeterminateKc = checkedCount > 0 && checkedCount < $this.kcArry.length;
      },
      handleCheckedCitiesChangeBj(val, value) {
        const $this = this.list[val];
        const checkedCount = value.length;
        $this.checkBjAll = checkedCount === $this.bjArry.length;
        $this.isIndeterminateBj = checkedCount > 0 && checkedCount < $this.bjArry.length;
      },
      handleCheckedIsAll(val, e, value) { /** 默认排考班级点击选中课程状态处理方法**/
        const $this = this.list[val].kclist[e];
        const checkedCount = value.length;
        $this.checkKcAll = checkedCount === $this.bjList.length;
        $this.isIndeterminateKc = $this.checkBj.length > 0 && $this.checkBj.length < $this.bjList.length;
      },
      handleKcIsAll(val, e, check) { /** 默认排考点击课程选中班级状态处理方法**/
        const $this = this.list[val].kclist[e];
        if (check) {
          const list = [];
          $this.bjList.forEach(item => {
            list.push(item.uuid);
          })
          $this.checkBj = list;
        } else {
          $this.checkBj = [];
        }
        $this.isIndeterminateKc = false;
      },
      handSubmit() { /** 保存考试设置 **/
        if (this.pkfs === 1) {
          this.saveZnKssz()
        } else {
          this.saveMrKssz();
        }
      },
      saveZnKssz() {  /** 智能排考-考试设置保存**/
        const [data, $this] = [[], this]
        let bool = true;
        this.list.forEach(item => { // 遍历选中的年级
          if (item.checkedKcCities.length > 0) {
            item.checkedKcCities.forEach(kcdm => { // 年级下的课程
              if (item.checkedBjCities.length > 0) {
                item.checkedBjCities.forEach(bjdm => { // 课程下的班级
                  data.push({ xxdm: $this.xxdm, ksdxid: $this.ksid, njdm: item.njdm, kcdm, bjdm })
                })
              } else {
                this.$message({ message: '警告哦，' + item.njmc + '必须指定班级！', type: 'warning' });
                bool = false;
              }
            })
          } else {
            this.$message({ message: '警告哦，' + item.njmc + '必须选择一门课程！', type: 'warning' });
            bool = false;
          }
        })
        if (bool) { // 条件满足执行
          /** 保存数据 **/
          api.saveKsKmxx(data).then(res => {
            if (res.status === 200) {
              this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 });
            } else {
              this.$notify({ title: '失败', message: '操作失败', type: 'error', duration: 2000 });
            }
          })
        }
      },
      saveMrKssz() { /** 默认排考-考试设置保存**/
        // debugger
        const [data, $this] = [[], this]
        let bool = true;
        this.list.forEach(item => { // 遍历选中的年级
          if (item.kclist.length > 0) {
            item.kclist.forEach(kc => { // 年级下的课程
              if (kc.checkBj.length > 0) {
                kc.checkBj.forEach(bjdm => { // 课程下的班级
                  data.push({ xxdm: $this.xxdm, ksdxid: $this.ksid, njdm: item.njdm, kcdm: kc.kcdm, bjdm })
                })
              }
            })
          } else {
            this.$message({ message: '警告哦，' + item.njmc + '必须选择参考班级！', type: 'warning' });
            bool = false;
          }
        })
        if (bool) { // 条件满足执行
          /** 保存数据 **/
          api.saveKsKmxx(data).then(res => {
            if (res.status === 200) {
              this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 });
            } else {
              this.$notify({ title: '失败', message: '操作失败', type: 'error', duration: 2000 });
            }
          })
        }
      }
    },
    props: {
      bjList: {
        /** 班级级类型列表数据**/
        type: Array,
        required: true
      },
      kcList: {
        /** 课程级类型列表数据**/
        type: Array,
        required: true
      }
    }
  }
</script>
