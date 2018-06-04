<template>
  <div class='tabs-view-container'>
    <router-link class="tabs-view" v-for="tag in Array.from(visitedViews)" :to="handlePath(tag)" :key="tag.path">
      <el-tag :closable="true" :type="isActive(tag.path)?'primary':''" @close='closeViewTabs(tag,$event)'>
        {{tag.name}}
      </el-tag>
    </router-link>
  </div>
</template>

<script>
  export default {
    computed: {
      visitedViews() {
        return this.$store.state.app.visitedViews.slice(-6)
      }
    },
    methods: {
      handlePath(item) {
        let path = item.path;
        const params = item.params;
        const list = [];
        for (const k in params) {
          const temp = {};
          temp.key = k;
          temp.val = params[k];
          list.push(temp);
        }
        if (list.length > 0) {
          path = path + '?';
          for (let i = 0; i < list.length; i++) {
            if (i !== 0) {
              path = path + '&';
            }
            path = path + list[i].key + '=' + list[i].val;
          }
        }
        return path;
      },

      closeViewTabs(view, $event) {
        this.$store.dispatch('delVisitedViews', view)
        $event.preventDefault()
      },
      generateRoute() {
        if (this.$route.matched[this.$route.matched.length - 1].name) {
          return this.$route.matched[this.$route.matched.length - 1]
        }
        this.$route.matched[0].path = '/'
        return this.$route.matched[0]
      },
      addViewTabs() {
        const view = this.generateRoute();
        const params = this.$route.query;
        view.params = params;
        this.$store.dispatch('addVisitedViews', view)
      },
      isActive(path) {
        return path === this.$route.path
      }
    },
    watch: {
      $route() {
        this.addViewTabs()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    .tabs-view {
      margin-left: 10px;
    }
  }
</style>
