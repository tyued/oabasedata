import * as api from 'api/publicLibManager'
import PageBar from '../PageBar/index'
import { getNj, getGradeState, getSchoolCode } from 'utils/getNjBjXq.js'
export default {
  name: "examCount",
  components: {
    PageBar
  },
  watch: {
    checkedQ (val) { // 多选时，动态拼接答案，确保表单验证能实时更新
      this.ruleFormQ.Answer = val.join('|')
    }
  },
  directives: {},
  filters: {},
  computed: {
    checkedAll: {
      get: function () { // 所有题型都为真
        return this.checkedSelect && this.checkedEmpty && this.checkedRadio && this.checkedCheckbox
      },
      set: function (newValue) {
        return newValue
      }
    },
  },
  async created() { // 初始化，拿到学校代码
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
      classOptions: [],
      fileList: [],
      getInQ: false,
      getOutQ: false,
      CurrentPage: 1,
      TotalPage: 0,
      HaveTerm: 2,
      QList: [], // 题目列表
      BList: {}, // 公共信息对象
      // checkedAll: false,
      checkedSelect: false,
      checkedEmpty: false,
      checkedRadio: false,
      checkedCheckbox: false,
      qinput: '',
      checkedAllQ: false,
      radio1: '',
      QInList: [],
      QOutList: [],


      QDialog: false,
      ruleFormQ: { // 题目对象
        Class: '',
        Grade: '',
        BookId: '',
        Type: '',
        Difficulty: '',
        Title: '',
        Answer: '',
        Question: '',
      },
      inQForm: { // 导入题库对象
        Class: '',
        Grade: '',
        BookId: '',
      },
      outQForm: { // 导出题库对象
        Class: '',
        Grade: '',
        BookId: '',
        name: '',
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
          message: '请填写导出名称',
          trigger: 'blur',
        },{
          required: true,
          message: '内容不能超过24个字',
          max: 24,
          trigger: 'blur'
        }]
      },
      rules: {
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
          message: '请选择答案',
          trigger: 'change'
        },{
          required: true,
          message: '内容不能超过30个字',
          max: 30,
          trigger: 'change'
        }],
        Grade: [{
          required: true,
          message: '请选择学期',
          trigger: 'change'
        }]
      },
      rules1: {
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
        Grade: [{
          required: true,
          message: '请选择学期',
          trigger: 'change'
        }]
      },
      bookList: [],
      checkedQList: [{
        content: ''
      }, {
        content: ''
      }],
      checkedQ: [],
      judgeQ1: '是',
      judgeQ2: '否',
      selectS1: true,
      selectS2: true,
      selectS3: true,
      selectS4: true,
      QDialogEdit: false,
      delQDialog: false,
      delAllQDialog: false,
      QID: '',
      QIDARR: '',
      selectArr: [{
        content: ''
      }, {
        content: ''
      }],
      EDITID: '',
      emptyInput: '',
      cla: 'hide',
    };
  },
  methods: {

    handleSearch() { // 点击搜索
      this.getQList(1, this.size)
    },
    handleSearchQ(Page = 1, PageSize = this.size) { // 选择题型
        if (this.checkedAll) {
          this.getQList(1, PageSize)
          return 
        }
        if (this.checkedSelect) {
          this.getQList(Page, PageSize, 1)
          return 
        }
        if (this.checkedEmpty) {
          this.getQList(Page, PageSize, 2)
          return 
        }
        if (this.checkedRadio) {
          this.getQList(Page, PageSize, 3)
          return 
        }
        if (this.checkedCheckbox) {
          this.getQList(Page, PageSize, 4)
          return 
        }
    },
    queryBookId() { // 获取书本名列表
      // this.bookList = []
      this.ruleFormQ.BookId = ''
      const {
        Class,
        Grade
      } = this.ruleFormQ
      let query = {
        // SchoolCode: JSON.parse(window.localStorage.getItem('xxdm')),//学校代码。必传
        Page: 1,
        PageSize: 10000,
        Class,
        Grade,
      }
      if (Grade.length == 0) {
        delete query.Grade
      }
      api.getPublicBookList(query).then((res) => {
        this.bookList = res.Value.List.map((book) => {
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
    showQDialog() { // 清空表单 和 其他信息
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
      this.bookList = []
    },
    emptyAnswer() {
      this.ruleFormQ.Answer = ''
    },
    submitAddQ(formName, falseState) { // 提交添加题目表单
      let bool
      this.$refs[formName].validate((valid) => { // 验证表单
        if (valid) {
          switch (this.ruleFormQ.Type) { // 题型
            case 1: // 选择
              bool = this.selectArr.some((item) => {
                return item.content.length === 0
              })
              // console.log(this.selectArr)
              break;
            case 2: // 填空
              break;
            case 3: // 判断
              bool = this.judgeQ1.length === 0 || this.judgeQ2.length === 0
              break;
            case 4: // 多选
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
          this.updateAddPublicQ(query)
          
          // this.QDialogEdit = false
        }
      })

    },
    updateAddPublicQ(query) { // ajax
      api.updateAddPublicQ(query).then((res) => {
        // console.log(res)
        if (res.State == 1) {
          this.$notify({
            title: '成功',
            message: '更新题目成功',
            type: 'success'
          });

          // 刷新
          this.getQList()
          this.QDialogEdit= false
          this.QDialog = false
        } else {
          this.$notify.error({
            title: '失败',
            message: '更新题目失败'
          });
        }
      })
    },
    async editQ(item) { // 编辑题目 先清空一些附加值
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
      this.bookList = []
      this.EDITID = item.ID
      this.QDialogEdit = true

      let query = {
        // SchoolCode: this.SchoolCode,
        Page: 1,
        PageSize: 10000,
        Class: this.$route.query.Class,
        Grade: this.$route.query.Grade,
      }
      let res = await api.getPublicBookList(query)
      this.bookList = res.Value.List.map((book) => {
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

      this.ruleFormQ = {
        Class: parseInt(this.$route.query.Class),
        Grade: parseInt(this.$route.query.Grade),
        BookId: this.$route.query.BookId,
        Type: item.Type,
        Difficulty: item.Difficulty,
        Title: item.Title,
        Answer: item.Answer,
        Question: item.Question,
      }
      // this.bookList.push({
      //   BookId: this.$route.query.BookId,
      //   BookName: this.$route.query.BookName,
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
      this.submitAddQ(formName, true) // 编辑时传第二个参数来控制
    },
    getQList(Page = 1, PageSize = this.size, QType) { // 获取列表
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
        BookId,
        Type: QType
      }
      if (!QType) {
        delete query.Type
      }
      api.getPublicQList(query).then((res) => {
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
        })
        this.QList = res.Value.List
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
    selectChange(value) { // 选择
      this.whySelect(value, 1)
      if (value) {
        this.checkedSelect = true
        this.checkedEmpty = false
        this.checkedRadio = false
        this.checkedCheckbox = false
      }
    },
    emptyChange(value) {
      this.whySelect(value, 2)
      if (value) {
        this.checkedSelect = false
        this.checkedEmpty = true
        this.checkedRadio = false
        this.checkedCheckbox = false
      }
    },
    judgeChange(value) {
      this.whySelect(value, 3)
      if (value) {
        this.checkedSelect = false
        this.checkedEmpty = false
        this.checkedRadio = true
        this.checkedCheckbox = false
      }
    },
    checkedChange(value) { // 多选
      this.whySelect(value, 4)
      if (value) {
        this.checkedSelect = false
        this.checkedEmpty = false
        this.checkedRadio = false
        this.checkedCheckbox = true
      }
    },
    whySelect(value, type) {
      if (value) {
        this.QList.forEach((item) => {
          if (item.Type == type) {
            item.state = true
          } else {
            item.state = false
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
    selectAllType(data) { // 全选题型
      if (data) {
        this.checkedSelect = true
        this.checkedEmpty = true
        this.checkedRadio = true
        this.checkedCheckbox = true
      } else {
        this.checkedSelect = false
        this.checkedEmpty = false
        this.checkedRadio = false
        this.checkedCheckbox = false
      }
    },
    handleCurrentPage(number) { // 分页
      this.getQList(number)
      this.CurrentPage = number
    },
    handleCurrentPageSize(number) {
      this.size = number
      this.getQList(1, number)
      this.CurrentPage = 1
    },
    handleInQ() { // 导入题目，清空数据
      this.getInQ = true
      this.inQForm = {
        Class: '',
        Grade: '',
        BookId: '',
      }
      this.$refs.upload.clearFiles();
    },
    handleOutQ() { // 导出
      this.getOutQ = true
      this.outQForm = {
        Class: '',
        Grade: '',
        BookId: '',
        name: '',
      }
    },
    queryQIdIn() { // 获取书本列表
      this.inQForm.BookId = ''
      this.$refs.upload.clearFiles();
      const {
        Class,
        Grade
      } = this.inQForm
      let query = {
        // SchoolCode: JSON.parse(window.localStorage.getItem('xxdm')),//学校代码。必传
        Page: 1,
        PageSize: 10000,
        Class,
        Grade,
      }
      if (Grade.length == 0) {
        delete query.Grade
      }
      api.getPublicBookList(query).then((res) => {
        this.QInList = res.Value.List.map((book) => {
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
    queryQIdOut() { // 获取书本列表 for 导出题目
      const {
        Class,
        Grade
      } = this.outQForm
      let query = {
        // SchoolCode: JSON.parse(window.localStorage.getItem('xxdm')),//学校代码。必传
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
    submitOutQ(formName) { // 模板下载
      this.$refs[formName].validate((valid) => {
        if (valid) {
          window.open(`http://newreadlevel.91sst.com.cn/home/DowPBQ?BookID=${this.outQForm.BookId}&BookName=${this.outQForm.name}`)
          this.getOutQ = false
        }
      });

    },
    delQ() { // 删除题目
      api.deletePQ({
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
    delAllQ() { // 删除所有题目
 
      const promises = []
      this.QList.forEach((item) => {
        if (item.state) {
          promises.push(api.deletePQ({
            IDs: item.ID
          }))
        }
      })
      if (promises.length === 0) {
        this.delAllQDialog = false
        return 
      }
      Promise.all(promises).then((posts) => { // 等待所有题目都删完
        this.$notify({
          title: '成功',
          message: '删除题目成功',
          type: 'success'
        });
        this.getQList() // 更新列表
        this.delAllQDialog = false
      })
    },
    showDelDialog(item) {
      this.QID = item.ID
      this.delQDialog = true
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
      
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleAvatarSuccess(res, file) { // 导入题库成功的钩子
      let re = /\d+/
      let n = re.exec(res.ResultMessage.toString())
      if (res.ResultCode == 1) {
        this.getQList()
        this.$notify({
          title: '成功',
          message: `成功导入${n}道题目，没有导入失败`,
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
    minusArr() { // -选择
      this.selectArr.pop()
    },
    addSelectArr() { // ＋选择
      this.selectArr.push({
        content: ''
      })
    },
    addCheckboxArr() { // 加多选
      this.checkedQList.push({
        content: ''
      })
    },
    minusCheckboxArr() {
      this.checkedQList.pop()
    },
    slideToggle(item) { // 点击详情，显示隐藏滑动特效
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
