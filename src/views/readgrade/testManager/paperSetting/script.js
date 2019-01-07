import * as api from 'api/publicLibManager'
import paperTable from '../paperSetting/paperTable'
import echart from '../paperSetting/echart'
import { getNj, getGradeState, getSchoolCode } from 'utils/getNjBjXq.js'
export default {
  name: "paperSettingComponent",
  components: {
    paperTable,
    echart,
  },
  directives: {},
  filters: {},
  computed: {},
  async created() {
    // this.currentTabComponent = paperTable
    this.xxdm = getSchoolCode()
    this.HaveTerm = await getGradeState(this.xxdm);
    let res = await getNj(this.xxdm)
    this.classOptions = res.map((item, index) => ({
      value: ++index,
      label: item.ClassName
    }))
    // this.getQList()
  },
  data() {
    return {
      classOptions: [],
      xxdm: '',
      HaveTerm: 2,
      currentTabComponent: '',
      outQForm: {
        Class: '',
        BookId: '',
        Grade: '',
      },
      QOutList: [],
    }
  },
  methods: {
    queryQIdOut() { // 获取书本列表
      // this.QOutList = []
      this.outQForm.BookId = ''
      const {
        Class,
      } = this.outQForm
      let query = {
        SchoolCode: this.xxdm,
        Page: 1,
        PageSize: 10000,
      }
      if (this.outQForm.Class) {
        query.Class = this.outQForm.Class
      }
      if (this.outQForm.Grade) {
        query.Grade = this.outQForm.Grade
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
    changeBook(data) { // 选择书本后立即跳转
      // this.currentTabComponent = echart
      this.$router.push({
        path: '/testManager/paperSetting/echart',
        query: {
          BookId: this.outQForm.BookId,
          Class: this.outQForm.Class,
          Grade: this.outQForm.Grade,
        }
      })
    },
    putSelect(BookId, Class, Grade) { // 子组件传过来的回调

      let query = {
        SchoolCode: this.xxdm,
        Page: 1,
        PageSize: 10000,
        Class,
        Grade,
      }
      if (!Grade) {
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
        this.outQForm.BookId = BookId ? BookId : ''
        this.outQForm.Class = Class ? parseInt(Class) : ''
        this.outQForm.Grade = Grade ? parseInt(Grade) : ''
      })
      

    }
  }
}
