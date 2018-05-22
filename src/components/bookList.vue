<template>
  <div class="book clearfix">
    <div class="top-list">
      <div class="date">
        <span class="year">{{date.year}}</span>
        <span class="month">{{date.month}}月</span>
      </div>
      <div class="menu">
        <div class="tip" v-for="(item,index) in calendarDate">
          <span class="day" :class="{today:item.isToDay}">{{item.day}}</span>
          <span class="week">周{{item.week}}</span>
        </div>
      </div>
    </div>
    <div class="lists" :style="{height: 1.281 * time + 'rem'}">
      <!--左侧时间段-->
      <div class="time">
        <div class="tip" v-for="(item,index) in time">
          <p class="tim">
            <span class="num">{{String(index).length > 1 ? String(index) : 0+String(index)}}</span>
            <span class="txt">:00</span>
          </p>
        </div>
        <p class="last-time">
          <span class="num">24</span>
          <span class="txt">:00</span>
        </p>
      </div>
      <!--右侧排课列表-->
      <div class="calendar">
        <p class="ver-line"
           v-for="(item,index) in verLine"
           :style="{left:1.281 * index + 'rem'}">
        </p>
        <p class="cross-line"
           v-for="(item,index) in crossLine"
           :style="{top:1.281 * index + 'rem'}">
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: "book-list",
    data() {
      return {
        time: 24,
        verLine: 7,
        crossLine: 24,
        date: {
          year: moment().format('YYYY'),
          month: moment().format('MM')
        },
        calendarDate: []
      }
    },
    created() {
      this.getCalendarDate()
    },
    methods: {
      getCalendarDate() {
        const that = this
        const now = new Date()
        this.calendarDate = []
        for (let i = 0; i < 7; i++) {
          this.calendarDate.push({
            day: moment().add(i, 'days').format('DD'),
            week: that.chinaWeek(moment().add(i, 'days').format('d')),
            isToDay:now.getDay() == moment().add(i, 'days').format('d')
          })
        }
      },
      chinaWeek(num) {
        let week = ''
        switch (Number(num)) {
          case 0:
            week = '日';
            break;
          case 1:
            week = '一';
            break;
          case 2:
            week = '二';
            break;
          case 3:
            week = '三';
            break;
          case 4:
            week = '四';
            break;
          case 5:
            week = '五';
            break;
          case 6:
            week = '六';
            break
        }
        return week
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
      .time {
        width: 1rem;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-flow: column nowrap;
        position: relative;
        .tip {
          width: 100%;
          height: 1.281rem;
          display: flex;
          display: -webkit-flex;
          align-items: center;
          justify-content: space-between;
          flex-flow: column nowrap;
          .tim {
            display: flex;
            display: -webkit-flex;
            flex-flow: row nowrap;
            align-items: baseline;
            justify-content: center;
          }
          .txt {
            font-size: .3rem;
          }
          &:nth-child(2) {
            margin-top: -.16rem;
          }
        }
        .last-time {
          bottom: 0;
          display: flex;
          display: -webkit-flex;
          flex-flow: row nowrap;
          align-items: baseline;
          justify-content: center;
          position: absolute;
          left: .12rem;
          .txt {
            font-size: .3rem;
          }
        }
      }
      .calendar {
        position: relative;
        left: 0;
        display: flex;
        flex: 1;
        background-color: #f7f7f7;
        z-index: 8;
        .ver-line {
          position: absolute;
          top: 0;
          border-left: 1px solid #d9d9d9;
          z-index: 10;
          height: 100%;
        }
        .cross-line {
          position: absolute;
          left: 0;
          width: 100%;
          border-top: 1px solid #d9d9d9;
          z-index: 10;
        }
      }
    }
  }
</style>
