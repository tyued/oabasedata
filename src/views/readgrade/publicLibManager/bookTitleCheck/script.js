import * as api from 'api/publicLibManager'
import PageBar from '../PageBar/index'
import { getNj, getGradeState, getSchoolCode } from 'utils/getNjBjXq.js'
export default {
  name: "examCount",
  components: {
    PageBar
  },
  created() {
    this.init()
  },
  mounted() {
  },
  data() {
    return {
      size: 10,
      queryDialogInto: false,
      queryDialogNotInto: false,
      imageVisible: false,
      classValue: '',
      termValue: '',
      typeValue: '',
      searchName: '',
      checkValue: '',
      classOptions: [],
      termOptions: [{
        value: 1,
        label: "上学期"
      }, {
        value: 2,
        label: "下学期"
      }],
      typeOptions: [{
          value: 1,
          label: "必读"
        },
        {
          value: 2,
          label: "选读"
        }
      ],
      checkOptions: [{
        value: 0,
        label: "未审核"
      }, {
        value: 3,
        label: "已审核"
      }],
      tableData: [], // 表格对象
      HaveTerm: 2, // 控制学期的变量
      CurrentPage: 1, // 当前页
      TotalPage: 1, // 总页数
      imgsrc: '', // 图片路径
      queryDialog: false,
      ROWIN: '',
      ROWOUT: '',
    };
  },
  methods: {
    async init() { // 初始化
      this.xxdm = getSchoolCode()
      this.HaveTerm = await getGradeState(this.xxdm);
      let res = await getNj(this.xxdm)
      this.classOptions = res.map((item, index) => ({
        value: ++index,
        label: item.ClassName
      }))
      this.checkValue = 0 // 产品要求默认为未审核
      this.getPublicBookList() // 渲染列表
    },
    handleSearch() { // 搜索方法
      this.getPublicBookList(1, this.size) 
    },
    async getPublicBookListByCheckOptions(Page = 1, PageSize = this.size) { // 自己分页
      let TotalItemCount1 = 0, TotalItemCount2 = 0, LL = [], List1 = [], List2 = [];
      let query1 = {
        SchoolCode: this.xxdm,
        Page: 1,
        PageSize: 10000,
        Class: this.classValue,
        Grade: this.termValue,
        BookName: this.searchName,
        Type: this.typeValue,
        PulicVerify: 1,
        BookSource: 1
      }
      let query2 = {
        SchoolCode: this.xxdm,
        Page: 1,
        PageSize: 10000,
        Class: this.classValue,
        Grade: this.termValue,
        BookName: this.searchName,
        Type: this.typeValue,
        PulicVerify: 2,
        BookSource: 1
      }
      query1 = this.deleteQuery(query1) // 模糊搜索
      query2 = this.deleteQuery(query2) // 同上

      let res1 = await api.getSchoolBookList(query1)
      if (res1.Value) {
        List1 = res1.Value.List
        List1.forEach((item) => {
          item.check = item.PulicVerify !== 0 ? true : false
          item.position = item.BookSource == 1 ? '学校库' : '公共库'
          this.formatItem(item)
        })
      }
      
      let res2 = await api.getSchoolBookList(query2)
      if (res2.Value) {
        List2 = res2.Value.List
        List2.forEach((item) => {
          item.check = item.PulicVerify !== 0 ? true : false
          item.position = item.BookSource == 1 ? '学校库' : '公共库'
          this.formatItem(item)
        })
      }
      
      LL = List1.concat(List2)
      LL.sort(((BookName) => { // 排序 按书本名
        return (a, b) => {
          let value1 = a[BookName]
          let value2 = b[BookName]
          if (value1 < value2) {
            return -1
          } else if (value1 > value2) {
            return 1
          } else {
            return 0
          }
        }
      })('BookName'))
      this.tableData = LL.slice((Page - 1) * PageSize, (Page) * PageSize) // 自己算分页
      this.TotalPage = LL.length
    },
    deleteQuery(query) { // 处理请求对象
      if (query.Class.length == 0) {
        delete query.Class
      }
      if (query.Grade.length == 0) {
        delete query.Grade
      }
      if (query.BookName.length == 0) {
        delete query.BookName
      }
      if (query.Type.length == 0) {
        delete query.Type
      }
      if (query.PulicVerify.length == 0) {
        delete query.PulicVerify
      }
      return query
    },
    async getPublicBookList( // 获取列表的公共方法
      Page = 1,
      PageSize = this.size,
      Class = this.classValue,
      Grade = this.termValue,
      BookName = this.searchName,
      Type = this.typeValue,
      SchoolCode = this.xxdm,
      PulicVerify = this.checkValue
    ) {
      if (PulicVerify == 3) { // 未审核要获取两个列表然后合并
        this.getPublicBookListByCheckOptions(Page, PageSize)
        return 
      }

      let List1, TotalItemCount1, TotalPage1, CurrentPage1
      let List2, TotalItemCount2, TotalPage2, CurrentPage2
      let query = {
        SchoolCode,
        Page: 1,
        PageSize: 10000,
        Class,
        Grade,
        BookName,
        Type,
        PulicVerify,
        BookSource: 1
      }

      query = this.deleteQuery(query)
      let res = await api.getSchoolBookList(query) // 获取学校书本
      if (!res.Value) {
        return
      }
      List1 = res.Value.List
      TotalItemCount1 = res.Value.List.length
      List1.forEach((item) => {
        item.check = item.PulicVerify !== 0 ? true : false
        item.position = item.BookSource == 1 ? '学校库' : '公共库'
        this.formatItem(item)
      })
      if (typeof query.PulicVerify === 'number') {
        List1.sort(((BookName) => {
          return (a, b) => {
            let value1 = a[BookName]
            let value2 = b[BookName]
            if (value1 < value2) {
              return -1
            } else if (value1 > value2) {
              return 1
            } else {
              return 0
            }
          }
        })('BookName'))
        this.tableData = List1.slice((Page - 1) * PageSize, (Page) * PageSize)
        this.TotalPage = TotalItemCount1
        return
      }
      let pQuery = {
        Page: 1,
        PageSize: 10000,
        Class,
        Grade,
        BookName,
        Type,
        PulicVerify
      }
      pQuery = this.deleteQuery(pQuery)
      api.getPublicBookList(pQuery).then((res) => { // 获取公共书本
        // console.log(res)
        if (!res.Value) {
          return
        }
        List2 = res.Value.List
        TotalItemCount2 = res.Value.List.length
        List2.forEach((item) => {
          item.position = item.BookSource == 1 ? '学校库' : '公共库'
          this.formatItem(item)
        })
        let LL = List1.concat(List2)

        LL.sort(((BookName) => {
          return (a, b) => {
            let value1 = a[BookName]
            let value2 = b[BookName]
            if (value1 < value2) {
              return -1
            } else if (value1 > value2) {
              return 1
            } else {
              return 0
            }
          }
        })('BookName'))
        this.tableData = LL.slice((Page - 1) * PageSize, (Page) * PageSize)
        this.TotalPage = TotalItemCount1 + TotalItemCount2
        // this.CurrentPage = CurrentPage1 + CurrentPage2
      })
    },
    handleCurrentPage(number) { // 点击页数
      this.getPublicBookList(number)
      this.CurrentPage = number
    },
    handleCurrentPageSize(number) { // 选择每页的条数
      this.size = number
      this.getPublicBookList(1, number)
      this.CurrentPage = 1
    },
    goToQList(row) { // 路由跳转
      const {
        BookId,
        Type,
        BookName,
        Class,
        Grade,
        BookSource
      } = row
      this.$router.push({
        path: '/publicLibManager/questionCheck',
        query: {
          BookId,
          Type,
          BookName,
          Class,
          Grade,
          BookSource
        }
      })
    },
    handleImg(src) {
      this.imgsrc = src
      this.imageVisible = true
    },
    toPublic(row) {
      this.ROWIN = row
      this.queryDialogInto = true
    },
    notToPublic(row) {
      this.ROWOUT = row
      this.queryDialogNotInto = true
    },
    askInto() { // 审核
      const {
        BookId,
        BookName
      } = this.ROWIN
      api.passCheck({
        BookId,
        Type: 1
      }).then((res) => {
        if (res.State == 1) {
          api.addBookToPublic({
            BookName,
            BookId
          }).then((res) => {
            if (res.State == 1) {
              this.$notify({
                title: '成功',
                message: '审核通过',
                type: 'success'
              });
              this.getPublicBookList()
            }
          })
        }
      })
      this.queryDialogInto = false
    },
    askNotInto() { // 审核不通过
      const {
        BookId
      } = this.ROWOUT
      api.passCheck({
        BookId,
        Type: 2
      }).then((res) => {
        if (res.State == 1) {
          this.$notify({
            title: '成功',
            message: '审核不通过',
            type: 'success'
          });
          this.getPublicBookList()
        }
      })
      this.queryDialogNotInto = false
    },
    formatItem(item) { // 格式化对象
      switch (item.Class) {
        case 1:
          item.className = '一年级'
          break;
        case 2:
          item.className = '二年级'
          break;
        case 3:
          item.className = '三年级'
          break;
        case 4:
          item.className = '四年级'
          break;
        case 5:
          item.className = '五年级'
          break;
        case 6:
          item.className = '六年级'
          break;

      }
      switch (item.Grade) {
        case 1:
          item.gradeName = '上学期'
          break;
        case 2:
          item.gradeName = '下学期'
          break;
      }
      switch (item.Type) {
        case 1:
          item.typeName = '必读'
          break;
        case 2:
          item.typeName = '选读'
          break;
      }
    }
  }
};
