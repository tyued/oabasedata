<template>
  <div>
    <searchbar :searchTypes="searchTypes" :conditionItems="conditionItems" @searchClick="search"></searchbar>
    <teacher></teacher>
  </div>
</template>

<script>
  import searchbar from '@/views/components/searchbar'
  import teacher from '@/views/staticpages/teacherselectdemo'
  export default {
    name: 'App',
    components: {
      searchbar,
      teacher
    },
    data() {
      return {
        searchTypes: [
          { value: 'All', label: '全部' },
          { value: 'kcmc', label: '课程名称' },
          { value: 'skr', label: '开课人' }
        ],
        conditionItems: [
          {
            lable: '学年',
            key: 'xndm',
            values: [
              {
                text: '2015-2016',
                value: '2015-2016'
              },
              {
                text: '2016-2017',
                value: '2016-2017'
              },
              {
                text: '2017-2018',
                value: '2017-2018'
              }
            ]
          },
          {
            lable: '学期',
            key: 'xqdm',
            values: [
              {
                text: '上学期',
                value: '01'
              },
              {
                text: '下学期',
                value: '02'
              }
            ]
          },
          {
            lable: '课程类别',
            key: 'courseType',
            values: [
              {
                text: '艺术类',
                value: '01'
              },
              {
                text: '体育类',
                value: '02'
              },
              {
                text: '计算机类',
                value: '03'
              },
              {
                text: '音乐类',
                value: '04'
              }
            ]
          }
        ]
      }
    },
    methods: {
      search(data) {
        console.log(data);
      }
    }
  }
</script>
