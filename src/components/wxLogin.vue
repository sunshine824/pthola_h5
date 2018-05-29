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
        const url = encodeURIComponent(window.location.href + 'index')
        const result = getWeChatCode(url)
        window.location.href = result
      }
    }
  }
</script>

<style scoped>

</style>
