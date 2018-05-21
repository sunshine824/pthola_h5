<template>
  <div class="book clearfix">
    <div class="top-list">
      <div class="date">
        <span class="year">2018</span>
        <span class="month">5月</span>
      </div>
      <div class="menu">
        <div class="tip">
          <span class="day today">21</span>
          <span class="week">周一</span>
        </div>
        <div class="tip">
          <span class="day">21</span>
          <span class="week">周一</span>
        </div>
        <div class="tip">
          <span class="day">21</span>
          <span class="week">周一</span>
        </div>
        <div class="tip">
          <span class="day">21</span>
          <span class="week">周一</span>
        </div>
        <div class="tip">
          <span class="day">21</span>
          <span class="week">周一</span>
        </div>
        <div class="tip">
          <span class="day">21</span>
          <span class="week">周一</span>
        </div>
        <div class="tip">
          <span class="day">21</span>
          <span class="week">周一</span>
        </div>
      </div>
    </div>
    <div class="lists" :style="{height: 1.281 * time + 'rem'}">
      <div class="time">
        <div class="tip" v-for="(item,index) in time">
          <span class="num">{{String(index).length > 1 ? String(index) : 0+String(index)}}</span>
          <span class="txt">:00</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "book-list",
    data() {
      return {
        time: 24
      }
    }
  }
</script>

<style scoped lang="less">
  .book {
    position: relative;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-flow: column nowrap;
    .top-list {
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      align-items: center;
      height: 1.6rem;
      position: fixed;
      z-index: 20;
      top: 0;
      background: #4b4b4b;
      width: 100%;
      .date {
        display: flex;
        display: -webkit-flex;
        flex-flow: column nowrap;
        color: #fff;
        font-size: .35rem;
        height: 100%;
        width: 1rem;
        justify-content: center;
        align-items: center;
        .year {
          margin-bottom: .1rem;
          padding: .1rem;
        }
      }
      .menu {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        height: 100%;
        flex: 1;
        .tip {
          display: flex;
          display: -webkit-flex;
          flex-flow: column nowrap;
          align-items: center;
          justify-content: center;
          font-size: .35rem;
          color: #fff;
          width: 1.281rem;
          height: 100%;
          .day {
            margin-bottom: .1rem;
            padding: .1rem;
            &.today {
              background: #888787;
              border-radius: 50%;
            }
          }
        }
      }
    }
    .lists {
      position: absolute;
      z-index: 15;
      background: #fff;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      top: 1.6rem;
      .time{
        width: 1rem;
        height: 100%;
        border-right: 1px solid #d9d9d9;
        .tip{
          width: 100%;
          height: 1.281rem;
          display: flex;
          display: -webkit-flex;
          align-items: baseline;
          justify-content: center;
          flex-flow: row nowrap;
          .txt{
            font-size: .3rem;
          }
        }
      }
    }
  }
</style>
