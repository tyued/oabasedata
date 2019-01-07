import * as api from 'api/publicLibManager'
import PageBar from '../PageBar/index' // 分页组件
import { getNj, getGradeState, getSchoolCode } from 'utils/getNjBjXq.js'
export default {
  name: "examCount",
  components: {
    PageBar
  },
  created() {
    this.init()
  },
  data() {
    return {
      size: 10,
      classValue: '',
      termValue: '',
      typeValue: '',
      searchName: '',

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
      tableData: [],
      dialogFormVisible: false,
      editDialogShow: false,
      ruleForm: { // 添加书目对象
        bookname: '',
        author: '',
        press: '',
        year: '',
        grade: '',
        term: '',
        require: '',
        desc: '',
        imageurl: '',
        BookType: '',
      },
      ruleFormEdit: { // 编辑书目对象
        bookname: '',
        author: '',
        press: '',
        year: '',
        grade: '',
        term: '',
        require: '',
        desc: '',
        imageurl: '',
        BookType: '',
      },
      rules: {
        bookname: [{
          required: true,
          message: '请输入书目名称',
          trigger: 'blur'
        },{
          required: true,
          message: '内容不能超过24个字',
          max: 24,
          trigger: 'blur'
        }],
        author: [{
          required: true,
          message: '请输入作者名称',
          trigger: 'blur',
        },{
          required: true,
          message: '内容不能超过24个字',
          max: 24,
          trigger: 'blur'
        }],
        press: [{
          required: true,
          message: '请输入出版社信息',
          trigger: 'blur',
        },{
          required: true,
          message: '内容不能超过24个字',
          max: 24,
          trigger: 'blur'
        }],
        year: [{
          required: true,
          message: '请输入出版日期',
          trigger: 'change'
        }],
        grade: [{
          required: true,
          message: '请选择年级',
          trigger: 'change'
        }],
        require: [{
          required: true,
          message: '请选择类型',
          trigger: 'change'
        }],
        desc: [{
          required: true,
          message: '请填写导读内容且不能超过100个字',
          trigger: 'blur',
          max: 100
        }],
        term: [{
          required: true,
          message: '请选择学期',
          trigger: 'change'
        }],
        BookType: [{
          required: true,
          message: '请选择图书类型',
          trigger: 'change'
        }],
        imageurl: [{
          required: true,
          message: '请上传书本封面',
          trigger: 'change'
        }]
      },
      TotalPage: 0,
      currentNumber: 0,
      deleteDialog: false,
      delItem: '',
      xxdm: '',
      HaveTerm: 2,
      CurrentPage: 0,
      EDITID: '',
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

      this.handleCurrentPage()
    },

    handleSearch() { // 搜索
      this.getPublicBookList(1, this.size)
    },
    showAddPublicBook() { // 显示添加书目弹出层
      this.dialogFormVisible = true
      this.ruleForm = {
        bookname: '',
        author: '',
        press: '',
        year: '',
        grade: '',
        term: '',
        require: '',
        desc: '',
        imageurl: '',
        BookType: '',
      }
    },
    submitAddPublicBook(formName) { // 提交添加书目

      this.$refs[formName].validate((valid) => { // 验证表单
        if (valid) {
          let query = {
            BookName: this.ruleForm.bookname,
            Author: this.ruleForm.author,
            Press: this.ruleForm.press,
            Year: this.ruleForm.year,
            Class: this.ruleForm.grade,
            Grade: this.ruleForm.term,
            Image: this.ruleForm.imageurl,
            Type: this.ruleForm.require, //1为必读，2为选读
            Review: this.ruleForm.desc, //导读
            BookType: this.ruleForm.BookType,
          }
  
          api.updateAddPublicBook(query).then((res) => { 
            if (res.State == 1) {
              this.$notify({
                title: '成功',
                message: '更新书目成功',
                type: 'success'
              });
              this.getPublicBookList() // 渲染列表
            } else {
              this.$notify.error({
                title: '失败',
                message: '更新书目失败'
              });
            }
          })

          this.dialogFormVisible = false

        } else {
          this.$notify.error({
            title: '警告',
            message: '请输入必填项'
          });
          return false;
        }
      });
    },
    showEditPublicBook(item) { // 显示编辑书本弹层
      this.EDITID = item.BookId
      this.editDialogShow = true
      api.getPublicBookInfo({ // 获取书本信息
        ID: item.BookId
      }).then((res) => {
        let {
          Author,
          BookId,
          BookName,
          Class,
          Grade,
          Press,
          Type,
          Image,
          Review,
          Year,
          BookType
        } = res.Value
        this.ruleFormEdit = {
          bookname: BookName,
          author: Author,
          press: Press,
          term: Grade,
          require: Type,
          grade: Class,
          year: Year,
          desc: Review,
          imageurl: Image,
          BookType
        }
      })
    },
    submitEditPublicBook(formName) { // 提交编辑信息

      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.updateAddPublicBook({
            ID: this.EDITID,
            BookName: this.ruleFormEdit.bookname,
            Author: this.ruleFormEdit.author,
            Press: this.ruleFormEdit.press,
            Year: this.ruleFormEdit.year,
            Class: this.ruleFormEdit.grade,
            Grade: this.ruleFormEdit.term,
            Image: this.ruleFormEdit.imageurl,
            Type: this.ruleFormEdit.require, //1为必读，2为选读
            Review: this.ruleFormEdit.desc, //导读
            BookType: this.ruleFormEdit.BookType
          }).then((res) => {
            if (res.State == 1) {
              this.$notify({
                title: '成功',
                message: '编辑书目成功',
                type: 'success'
              });
              this.getPublicBookList()
            } else {
              this.$notify.error({
                title: '失败',
                message: '编辑书目失败'
              });
            }
          })

          this.editDialogShow = false
        } else {
          this.$notify.error({
            title: '警告',
            message: '请输入必填项'
          });
          return false;
        }
      });

    },
    showDelDialog(item) {
      this.deleteDialog = true
      this.delItem = item
    },
    deletePublicBook() { // 删除书本
      api.delPublicBook({ 
        ID: this.delItem.BookId
      }).then((res) => {
        if (res.State == 1) {
          this.$notify({
            title: '成功',
            message: '删除书目成功',
            type: 'success'
          });
          this.getPublicBookList()
        }
      })
      this.deleteDialog = false
    },
    handleAvatarSuccess(res, file) { // 上传图片成功回调
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.ruleForm.imageurl = file.response.Value ? file.response.Value : ''
    },
    handleAvatarSuccessEdit(res, file) { // 编辑弹层的上传成功回调
      // this.ruleFormEdit.imageurl = URL.createObjectURL(file.raw);
      this.ruleFormEdit.imageurl = file.response.Value ? file.response.Value : ''
    },
    beforeAvatarUpload(file) { // 上传图片之前的验证钩子
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return (isJPG || isPNG) && isLt2M;
    },
    getPublicBookList( // 获取书本列表的公共方法
      Page = 1,
      PageSize = this.size,
      Class = this.classValue,
      Grade = this.termValue,
      BookName = this.searchName,
      Type = this.typeValue
    ) {
      let query = {
        Page, //当前页面,默认1
        PageSize, //页码数,默认15
        Class,
        Grade,
        BookName,
        Type
      }

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
      
      api.getPublicBookList(query).then((res) => {
        let {
          List,
          TotalItemCount,
          TotalPage,
          CurrentPage
        } = res.Value
        List.forEach((item) => {
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
        })
        this.tableData = List
        this.TotalPage = TotalItemCount // props down 到分页组件
        this.currentNumber = PageSize 
        this.CurrentPage = CurrentPage // 同上
      })
    },
    handleCurrentPage(number) { // 点击页码
      this.getPublicBookList(number)
      this.CurrentPage = number
    },
    handleCurrentPageSize(number) { // 选择每页条数
      this.size = number
      this.getPublicBookList(1, number)
      this.CurrentPage = 1
    },
    goToQList(row) { // 路由跳转
      const { BookId, Type, BookName, Class, Grade, BookSource } = row
      this.$router.push({ path: '/publicLibManager/questionManagement', query: { BookId, Type, BookName, Class, Grade, BookSource }})
    }
  }
};
