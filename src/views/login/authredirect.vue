<template>
</template>
<script>
  export default {
    name: 'login',
    data() {
      return {
        title: '系统登录',
        username: '',
        password: '',
        url: ''
      };
    },
    created() {
      const url = this.$route.query.to;
      this.username = this.$route.query.username;
      this.password = this.$route.query.password;
      const userInfo = {
        username: this.username,
        password: this.password
      };
      if (this.username !== '' && this.password !== '') {
        this.$store
          .dispatch('loginByEmailadmin', userInfo)
          .then(res => {
            if (res.status === 200) {
              if (url === 'znpk') {
                this.$router.push({
                  path: '/examManager/examination'
                });
              } else if (url === 'pkxt') {
                this.$router.push({
                  path: '/arrangingManager/arrangingTask'
                });
              } else if (url === 'ydkj') {
                this.$router.push({
                  path: '/testManager/questionManager'
                });
              } else if (url === 'xkxt') {
                this.$router.push({
                  path: '/xkxtManager/kcxxManager'
                });
              } else if (url === 'aqsb') {
                this.$router.push({
                  path: '/xyafManager/aqsbManager'
                });
              } else if (url === 'pkxt') {
                this.$router.push({
                  path: '/arrangingManager/arrangingTask'
                });
              } else if (url === 'xfpj') {
                this.$router.push({
                  path: '/projectManager/mainProject'
                });
              } else if (url === 'fbxt') {
                this.$router.push({
                  path: '/newStudent/innewstudent'
                });
              }
            } else {
              this.$router.push({
                path: '/'
              });
            }
          })
          .catch(() => {
            console.log('url有误');
          });
      }
    }
  }
</script>
