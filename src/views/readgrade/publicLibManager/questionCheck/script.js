import * as api from 'api/publicLibManager'
import PageBar from '../PageBar/index'
import { getNj, getGradeState, getSchoolCode } from 'utils/getNjBjXq.js'
export default {
  name: "examCount",
  components: {
    PageBar
  },
  async created() { // 初始化
    this.xxdm = getSchoolCode()
    this.HaveTerm = await getGradeState(this.xxdm);
    let res = await getNj(this.xxdm)
    this.classOptions = res.map((item, index) => ({
      value: ++index,
      label: item.ClassName
    }))
    this.getQList() // 先获取下列表
  },
  data() {
    return {
      size: 10,
      classOptions: [],
      getInQ: false,
      getOutQ: false,
      CurrentPage: 0,
      TotalPage: 1,
      HaveTerm: 2,
      QList: [],
      BList: {},
      checkedAllQ: false,
      radio1: '',
      QInList: [],
      QOutList: [],

      QDialog: false,

      outQForm: {
        Class: '',
        Grade: '',
        BookId: '',
        name: '',
      },
      imageUrl: false,
      bookList: [],
      checkedQList: [1, 2],
      checkedQ: [],
      commitDialog: false,
      len: 0
    };
  },
  methods: {
    queryQIdOut() { // 获取书本名列表
      this.outQForm.BookId = ''
      const {
        Class,
        Grade
      } = this.outQForm
      let query = {
        Page: 1,
        PageSize: 10000,
        Class,
        Grade,
      }
      if (Grade.length == 0) {
        delete query.Grade
      }
      api.getPublicBookList(query).then((res) => {
        this.QOutList = res.Value.List.map((book) => {
          let {
            BookName,
            ID,
            BookId
          } = book
          return {
            BookName,
            BookId
          }
        })
      })
    },
    getQList(Page = 1, PageSize = this.size) { // 获取题目列表
      let {
        BookId,
        Type,
        BookName,
        Class,
        Grade,
        BookSource
      } = this.$route.query
      BookSource = BookSource == 1 ? '学校库' : '公共库'

      switch (Class.toString()) {
        case '1':
          Class = '一年级'
          break;
        case '2':
          Class = '二年级'
          break;
        case '3':
          Class = '三年级'
          break;
        case '4':
          Class = '四年级'
          break;
        case '5':
          Class = '五年级'
          break;
        case '6':
          Class = '六年级'
          break;
      }
      switch (Grade.toString()) {
        case '1':
          Grade = '上学期'
          break;
        case '2':
          Grade = '下学期'
          break;
      }
      this.BList = {
        BookId,
        Type,
        BookName,
        Class,
        Grade,
        BookSource
      }
      let query = {
        Page,
        PageSize,
        BookId
      }
      api.getQList(query).then((res) => {
        this.CurrentPage = res.Value.CurrentPage // 当前页
        this.TotalPage = res.Value.TotalItemCount // 总条数
 
        let arr = res.Value.List.map((item) => { // 处理对象
          item.ansArr = item.Answer.split('|')
          item.state = false
          item.qArr = item.Question.split('|')
          switch (item.Difficulty) {
            case 1:
              item.diff = '简单'
              break;
            case 2:
              item.diff = '一般'
              break;
            case 3:
              item.diff = '困难'
              break;
          }

          switch (item.Type) {
            case 1:
              item.qname = '选择题'
              break;
            case 2:
              item.qname = '填空题'
              break;
            case 3:
              item.qname = '判断题'
              break;
            case 4:
              item.qname = '多选题'
              break;
          }
        })
        this.QList = res.Value.List // 更新试图
      })
    },
    selectAllQ(value) { // 全选
      if (value) {
        this.QList.forEach((item) => {
          item.state = true
        })
      } else {
        this.QList.forEach((item) => {
          item.state = false
        })
      }
    },
    whySelect(value, type) {
      if (value) {
        this.QList.forEach((item) => {
          if (item.Type == type) {
            item.state = true
          }
        })
      } else {
        this.QList.forEach((item) => {
          if (item.Type == type) {
            item.state = false
          }
        })
      }
    },
    handleCurrentPage(number) { // 分页
      this.getQList(number)
      this.CurrentPage = number
    },
    handleCurrentPageSize(number) { // 分条
      this.size = number
      this.getQList(1, number)
      this.CurrentPage = 1
    },
    checkoutAdd() {
      this.len = 0
      this.QList.forEach((item) => {
        if (item.state) {
          this.len++
        }
      })
      this.commitDialog = true
    },
    handleCommit() {
      
      if (this.outQForm.BookId.length == 0) {
        this.$notify({
          title: '警告',
          message: '未选择书目',
          type: 'warning'
        });
        this.commitDialog = false
        return 
      }
      let QID = []
      this.QList.forEach((item) => {
        if (item.state) {
          QID.push(item.ID)
        }
      })
      api.commitQList({
        QID: QID.join(','),
        ID: this.outQForm.BookId
      }).then((res) => {
        if (res.State == 1) {
          this.$notify({
            title: '成功',
            message: '导入成功',
            type: 'success'
          });
          this.getQList();
        }
      })
      
      this.commitDialog = false
    },

  }
}
