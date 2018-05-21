<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  // import './public/js/prefixfree'
  export default {
    name: 'App'
  }
</script>

<style>
  @import "./public/css/base.css";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
