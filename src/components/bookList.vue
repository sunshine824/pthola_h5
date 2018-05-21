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
  </div>
</template>

<script>
  export default {
    name: "book-list"
  }
</script>

<style scoped lang="less">
  .book{
    position: relative;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-flow: column nowrap;
    .top-list{
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      align-items: center;
      height: 1.6rem;
      position: absolute;
      top: 0;
      background: #4b4b4b;
      width: 100%;
      .date{
        display: flex;
        display: -webkit-flex;
        flex-flow: column nowrap;
        color: #fff;
        font-size: .35rem;
        height: 100%;
        width: 12.5%;
        justify-content: center;
        align-items: center;
        .year{
          margin-bottom: .1rem;
          padding: .1rem;
        }
      }
      .menu{
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        height: 100%;
        flex: 1;
        .tip{
          display: flex;
          display: -webkit-flex;
          flex-flow: column nowrap;
          align-items: center;
          justify-content: center;
          font-size: .35rem;
          color: #fff;
          width: 14.2857143%;
          height: 100%;
          .day{
            margin-bottom: .1rem;
            padding: .1rem;
            &.today{
              background: #888787;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
</style>
