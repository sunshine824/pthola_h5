<template>
  <div class="loading">
    <div class="load">
      <cube-loading :size="30"></cube-loading>
      <span class="load-tit">{{title}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "loading",
    props: {
      title: {
        type: String,
        default: '加载中'
      }
    }
  }
</script>

<style lang="less">
  .loading{
    position: fixed;
    width: 100px;
    height: 100px;
    top: 50%;
    left: 50%;
    margin-top: -50px;
    margin-left: -50px;
    background: rgba(0,0,0,.65);
    border-radius: 4px;
    z-index: 99;
    .load{
      width: 100%;
      height: 100%;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: center;
      flex-flow: column nowrap;
      .load-tit{
        margin-top: 10px;
        color: rgba(255,255,255,.9);
        font-size: 13px;
      }
    }
    .cube-loading-spinner{
      background-color: #fff;
    }
  }
</style>
