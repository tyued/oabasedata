import * as api from 'api/publicLibManager'
import PageBar from '../../publicLibManager/PageBar/index'
import { getNj, getGradeState, getSchoolCode } from 'utils/getNjBjXq.js'
// 注释请参考公共库中的题目管理页面
export default {
  name: "examCount",
  components: {
    PageBar
  },
  watch: {
    checkedQ (val) {
      this.ruleFormQ.Answer = val.join('|')
    },
  },
  directives: {},
  filters: {},
  computed: {},
  async created() {
    this.xxdm = getSchoolCode()
    this.HaveTerm = await getGradeState(this.xxdm);
    let res = await getNj(this.xxdm)
    this.classOptions = res.map((item, index) => ({
      value: ++index,
      label: item.ClassName
    }))
    this.getQList()
  },
  data() {
    return {
      size: 10,
      SchoolCode: '',
      classOptions: [],
      getOutQAll: false,
      BList: {},
      QList: [],
      QDialog: false,
      fileList: [],
      CurrentPage: 0,
      TotalPage: 1,
      HaveTerm: 2,
      imageUrl: false,
      judgeQ1: '是',
      judgeQ2: '否',
      QDialogEdit: false,
      delQDialog: false,
      delAllQDialog: false,
      QID: '',
      QIDARR: '',
      checkedQ: [],
      getInQ: false,
      getOutQ: false,
      inQForm: {
        Class: '',
        Grade: '',
        BookId: '',
      },
      outQForm: {
        Class: '',
        Grade: '',
        BookId: '',
        Type: ''
      },
      outQFormAll: {
        Class: '',
        Grade: '',
        BookId: '',
        name: ''
      },
      qinput: '',
      checkedAllQ: false,
      radio1: '',
      bookList: [],
      QInList: [],
      QOutList: [],
      searchName: '',
      QDialog: false,
      ruleFormQ: {
        Class: '',
        Grade: '',
        BookId: '',
        Type: '',
        Difficulty: '',
        Title: '',
        Answer: '',
        Question: '',
      },
      rules1: {
        Grade: [{
          required: true,
          message: '请选择学期',
          trigger: 'change'
        }],
        Class: [{
          required: true,
          message: '请选择年级',
          trigger: 'change'
        }],

        BookId: [{
          required: true,
          message: '请选择书目',
          trigger: 'change'
        }],
        Type: [{
          required: true,
          message: '请选择题型',
          trigger: 'change'
        }],
        Difficulty: [{
          required: true,
          message: '请选择难易度',
          trigger: 'change'
        }],
        Title: [{
          required: true,
          message: '请填写题干',
          trigger: 'blur'
        },{
          required: true,
          message: '内容不能超过40个字',
          max: 40,
          trigger: 'blur'
        }],
        Answer: [{
          required: true,
          message: '请填写答案',
          trigger: 'change'
        },{
          required: true,
          message: '内容不能超过30个字',
          max: 30,
          trigger: 'change'
        }],
      },
      rules2: {
        Grade: [{
          required: true,
          message: '请选择学期',
          trigger: 'change'
        }],
        Class: [{
          required: true,
          message: '请选择年级',
          trigger: 'change'
        }],
        BookId: [{
          required: true,
          message: '请选择书目',
          trigger: 'change'
        }]
      },
      ruleOut: {
        Class: [{
          required: true,
          message: '请选择年级',
          trigger: 'change'
        }],
        BookId: [{
          required: true,
          message: '请选择书目',
          trigger: 'change'
        }],
        Grade: [{
          required: true,
          message: '请选择学期',
          trigger: 'change'
        }],
        name: [{
          required: true,
          message: '请输入导出名称',
          trigger: 'blur',
        },{
          required: true,
          message: '内容不能超过24个字',
          max: 24,
          trigger: 'blur'
        }]
      },
      selectArr: [{
        content: ''
      }, {
        content: ''
      }],
      checkedQList: [{
        content: ''
      }, {
        content: ''
      }],
      tmpBookName: '',
      QOutListAll: [],
      emptyInput: ''
    }
  },
  methods: {
    handleSearch(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getQList(1, this.size)
        }
      })

    },
    handleCurrentPage(number) {
      this.getQList(number)
      this.CurrentPage = number
    },
    handleCurrentPageSize(number) {
      this.size = number
      this.getQList(1, number)
      this.CurrentPage = 1
    },
    showQDialog() {
      this.emptyInput = ''
      this.QDialog = true
      this.ruleFormQ = {
        Class: '',
        Grade: '',
        BookId: '',
        Type: 1,
        Difficulty: '',
        Title: '',
        Answer: '',
        Question: '',
      }

      this.selectArr = [{
        content: ''
      }, {
        content: ''
      }]
      this.judgeQ1 = '是'
      this.judgeQ2 = '否'
      this.checkedQ = []
      this.checkedQList = [{
        content: ''
      }, {
        content: ''
      }]
      this.bookList = []
    },
    handleInQ() {
      this.getInQ = true
      this.inQForm = {
        Class: '',
        Grade: '',
        BookId: '',
      }
      this.$refs.upload.clearFiles();
    },
    handleOutQ() {
      this.getOutQ = true
      this.outQFormAll = {
        Class: '',
        Grade: '',
        BookId: '',
        name: ''
      }
    },
    handleOutQAll() {
      this.getOutQAll = true
    },
    queryQIdIn() {
      this.inQForm.BookId = ''
      this.$refs.upload.clearFiles();
      const {
        Class,
        Grade
      } = this.inQForm
      let query = {
        SchoolCode: this.xxdm,
        Page: 1,
        PageSize: 10000,
        Class,
        Grade,
      }
      if (Grade.length == 0) {
        delete query.Grade
      }
      api.getBookId(query).then((res) => {
        this.QInList = res.Value.List.map((book) => {
          let {
            BookName,
            ID,
            BookId
          } = book
          return {
            BookName,
            BookId: ID
          }
        })
      })
    },
    queryQIdOut() {
      this.outQForm.BookId = ''
      const {
        Class,
        Grade
      } = this.outQForm
      let query = {
        SchoolCode: this.xxdm,
        Page: 1,
        PageSize: 10000,
        Class,
        Grade,
      }
      if (Grade.length == 0) {
        delete query.Grade
      }
      api.getBookId(query).then((res) => {
        this.QOutList = res.Value.List.map((book) => {
          let {
            BookName,
            ID,
            BookId
          } = book
          return {
            BookName,
            BookId: ID
          }
        })
      })
    },
    queryBookId() {
      this.ruleFormQ.BookId = ''
      const {
        Class,
        Grade
      } = this.ruleFormQ
      let query = {
        SchoolCode: this.xxdm,
        Page: 1,
        PageSize: 10000,
        Class,
        Grade,
      }
      if (Grade.length == 0) {
        delete query.Grade
      }

      api.getBookId(query).then((res) => {
        this.bookList = res.Value.List.map((book) => {
          let {
            BookName,
            ID,
            BookId
          } = book
          return {
            BookName,
            BookId: ID
          }
        })
      })
    },
    queryQIdOutAll() {
      const {
        Class,
        Grade
      } = this.outQFormAll
      let query = {
        SchoolCode: this.xxdm,
        Page: 1,
        PageSize: 10000,
        Class,
        Grade,
      }
      if (Grade.length == 0) {
        delete query.Grade
      }
      api.getBookId(query).then((res) => {
        this.QOutListAll = res.Value.List.map((book) => {
          let {
            BookName,
            ID,
            BookId
          } = book
          return {
            BookName,
            BookId: ID
          }
        })
      })
    },
    minusArr() {
      this.selectArr.pop()
    },
    addSelectArr() {
      this.selectArr.push({
        content: ''
      })
    },
    addCheckboxArr() {
      this.checkedQList.push({
        content: ''
      })
    },
    minusCheckboxArr() {
      this.checkedQList.pop()
    },
    emptyAnswer() {
      this.ruleFormQ.Answer = ''
    },
    submitAddQ(formName, falseState) {
      let bool
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.ruleFormQ.Type) {
            case 1:
              bool = this.selectArr.some((item) => {
                return item.content.length === 0
              })
              break;
            case 2:
              break;
            case 3:
              bool = this.judgeQ1.length === 0 || this.judgeQ2.length === 0
              break;
            case 4:
              bool = this.checkedQList.some((item) => {
                return item.content.length === 0
              })
              break;
          }
          if (bool) {
            this.$notify({
              title: '警告',
              message: '请填写选项',
              type: 'warning'
            });
            return
          }
          const {
            Class,
            Grade,
            BookId,
            Type,
            Difficulty,
            Title,
            Question,
            Answer
          } = this.ruleFormQ

          switch (Type) {
            case 1:
              // 选择题
              let arr1 = this.selectArr.map((item) => {
                return item.content
              })
              this.ruleFormQ.Question = arr1.join('|')
              break;
            case 2:
              // 填空
              this.ruleFormQ.Question = this.ruleFormQ.Answer
              // this.ruleFormQ.Question = this.emptyInput
              // this.ruleFormQ.Answer = this.emptyInput
              break;
            case 3:
              // 判断
              let arr3 = []
              if (this.judgeQ1.length != 0) {
                arr3.push(this.judgeQ1)
              }
              if (this.judgeQ2.length != 0) {
                arr3.push(this.judgeQ2)
              }
              this.ruleFormQ.Question = arr3.join('|')
              break;
            case 4:
              let arr4 = this.checkedQList.map((item) => {
                return item.content
              })
              this.ruleFormQ.Question = arr4.join('|')
              this.ruleFormQ.Answer = this.checkedQ.join('|')
              break;
          }
          let query = {
            SchoolCode: this.xxdm,
            Class,
            Grade,
            BookId,
            Type,
            Difficulty,
            Title,
            Question: this.ruleFormQ.Question,
            Answer: this.ruleFormQ.Answer,
            // ID: this.EDITID
          }
          if (falseState) {
            query.ID = this.EDITID
          }
          // console.log(query)
          // return 
          this.addOrUpdateq(query)
        }
      })
    },
    addOrUpdateq(query) {
      api.addOrUpdateq(query).then((res) => {
        if (res.State == 1) {
          this.$notify({
            title: '成功',
            message: '更新题目成功',
            type: 'success'
          });
          // 刷新
          this.getQList()

          this.QDialog= false
          this.QDialogEdit= false

        } else {
          this.$notify.error({
            title: '失败',
            message: '更新题目失败'
          });
        }
      })
    },
    delAllQ() {
      if (this.QList.length === 0) {
        this.$notify.error({
          title: '错误',
          message: '请至少选择一项'
        });
        return
      }

      const promises = []
      this.QList.forEach((item) => {
        if (item.state) {
          promises.push(api.deleteQ({
            ids: item.ID
          }))
        }
      })
      if (promises.length === 0) {
        this.delAllQDialog = false
        return 
      }
      Promise.all(promises).then((posts) => {
        this.$notify({
          title: '成功',
          message: '删除题目成功',
          type: 'success'
        });
        this.getQList()
        this.delAllQDialog = false
      })
    },
    showDelDialog(item) {
      this.QID = item.ID
      this.delQDialog = true
    },
    submitOutQAll(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          window.open(`http://newreadlevel.91sst.com.cn/home/DowBQ?schoolcode=${this.xxdm}&BookID=${this.outQFormAll.BookId}&BookName=${this.outQFormAll.name}`)
          this.getOutQAll = false
        }
      });
    },
    delQ() {
      api.deleteSchoolQ({
        ids: this.QID
      }).then((res) => {
        if (res.State == 1) {
          this.$notify({
            title: '成功',
            message: '删除题目成功',
            type: 'success'
          });
          this.getQList()
        }
      })
      this.delQDialog = false
    },
    async editQ(item) {
      this.emptyInput = ''
      this.selectArr = [{
        content: ''
      }, {
        content: ''
      }]
      this.judgeQ1 = '是'
      this.judgeQ2 = '否'
      this.checkedQ = []
      this.checkedQList = [{
        content: ''
      }, {
        content: ''
      }]
      this.EDITID = item.ID
      this.QOutList = []
      let query = {
        SchoolCode: this.xxdm,
        Page: 1,
        PageSize: 10000,
        Class: item.Class,
        Grade: item.Grade,
      }
      if (item.Grade.length == 0) {
        delete query.Grade
      }
      let res = await api.getBookId(query)
      this.QOutList = res.Value.List.map((book) => {
        let {
          BookName,
          ID,
          BookId
        } = book
        return {
          BookName,
          BookId: ID
        }
      })

      this.QDialogEdit = true
      this.ruleFormQ = {
        Class: item.Class,
        Grade: item.Grade,
        BookId: item.BookID,
        Type: item.Type,
        Difficulty: item.Difficulty,
        Title: item.Title,
        Answer: item.Answer,
        Question: item.Question,
      }
      // this.QOutList.push({
      //   BookId: this.outQForm.BookId,
      //   BookName: this.tmpBookName,
      // })
      switch (item.Type) {
        case 1:
          this.selectArr = []
          item.Question.split('|').forEach((item) => {
            this.selectArr.push({
              content: item
            })
          })
          break;
        case 2:
          this.emptyInput = item.Answer
          break;
        case 3:
          this.judgeQ1 = item.Question.split('|')[0]
          this.judgeQ2 = item.Question.split('|')[1]
          break;
        case 4:
          this.checkedQList = []
          this.checkedQ = []
          item.Question.split('|').forEach((item) => {
            this.checkedQList.push({
              content: item
            })
          })
          this.checkedQ = item.Answer.split('|')
          break;
      }
    },
    submitEditQ(formName) {
      this.submitAddQ(formName, true)
    },
    changeBook() {
      // api.getBookInfo({
      //   ID: this.outQForm.BookId
      // }).then((res) => {
      //   this.tmpBookName = res.Value.BookName
      // })
    },
    changeQType() {

    },
    getQList(Page = 1, PageSize = this.size) {
      let BookId = this.outQForm.BookId
      let BookName = this.outQForm.BookName
      let Class = this.outQForm.Class
      let Grade = this.outQForm.Grade
      let Type = this.outQForm.Type

      let query = {
        SchoolCode: this.xxdm,
        Page,
        PageSize,
        BookId,
        Type,
        Class
      }
      if (!BookId) {
        delete query.BookId
      }
      if (!Type) {
        delete query.Type
      }
      if (!Class) {
        delete query.Class
      }

      api.getQList(query).then((res) => {
        this.CurrentPage = res.Value.CurrentPage
        this.TotalPage = res.Value.TotalItemCount

        res.Value.List.forEach((item) => {
          item.ansArr = item.Answer.split('|')
          item.state = false
          item.styleIndex = 0
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

          switch (item.Class) {
            case 1:
              item.ClassName = '一年级'
              break;
            case 2:
              item.ClassName = '二年级'
              break;
            case 3:
              item.ClassName = '三年级'
              break;
            case 4:
              item.ClassName = '四年级'
              break;
            case 5:
              item.ClassName = '五年级'
              break;
            case 6:
              item.ClassName = '六年级'
              break;
          }
          switch (item.Grade) {
            case 1:
              item.GradeName = '上学期'
              break;
            case 2:
              item.GradeName = '下学期'
              break;
          }
        })
        this.QList = res.Value.List
      })
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleAvatarSuccess(res, file) {
      let re = /\d+/
      let n = re.exec(res.ResultMessage.toString())
	  
      if (res.ResultCode == 1) {
        this.getQList()
        this.$notify({
          title: '成功',
          message: `成功导入${n[0]}道题目，没有导入失败`,
          type: 'success'
        });
      } else {
        this.$notify.error({
          title: '失败',
          message: '导入失败'
        });
        this.$refs.upload.clearFiles();
      }
      // this.getInQ = false
    },
    
    slideToggle(item) {
      if (item.styleIndex === 0) {
        if (item.Type == 2) {
          item.styleIndex = 38
        } else {
          item.styleIndex = 76
        }
      } else if (item.styleIndex != 0) {
        item.styleIndex = 0
      }
    }
  }
}
