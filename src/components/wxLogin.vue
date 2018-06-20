<template>
</template>

<script>
  import {
    getWeChatCode,
  } from '@/public/js/api'

  export default {
    name: "wx-login",
    data() {
      return {}
    },
    created() {
      this._getWeChatCode()
    },
    methods: {
      //微信授权登录获取code
      _getWeChatCode() {
        const result = getWeChatCode(this.$route.query.callback)
        console.log(result)
        window.location.href = result
      }
    }
  }
</script>

<style scoped>

</style>
