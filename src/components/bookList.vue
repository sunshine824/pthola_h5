<template>
  <div class="book clearfix">
    <div class="top-list">
      <div class="date" ref="sizeDate">
        <span class="year">{{date.year}}</span>
        <span class="month">{{date.month}}月</span>
      </div>
      <div class="menu">
        <div class="tip" ref="sizeItem" :class="{active:item.week==='日' || item.week==='六'}"
             v-for="(item,index) in calendarDate">
          <span class="day" :class="{today:item.isToDay}">{{item.day}}</span>
          <span class="week">周{{item.week}}</span>
        </div>
      </div>
    </div>
    <div class="lists" :style="{height: sizeRem * time + 'rem'}">
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
      <div class="calendar" @click="onTap($event)">
        <!--<p class="six-bar" :style="barStyle.sixBar"></p>-->
        <!--<p class="zero-bar" :style="barStyle.zeroBar"></p>-->
        <p class="ver-line"
           v-for="(item,index) in verLine"
           :style="{left:sizeRem * index + 'rem'}">
        </p>
        <p class="cross-line"
           ref="crossLines"
           v-for="(item,index) in crossLine"
           :style="{top:sizeRem * index + 'rem'}">
        </p>
        <p class="btn" v-for="(item,index) in btns" :style="item">已约</p>
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
        sizeRem: 1.281,  //每个格子rem
        sizePx: 0,  //每个格子计算后的px
        time: 24,  //24小时
        verLine: 7,  //7条竖线
        crossLine: 24,  //24条横线
        date: {
          year: moment().format('YYYY'),
          month: moment().format('MM')
        },  //当前年月
        calendarDate: [],  //未来七天日期
        weeks: [],
        barStyle: {
          sixBar: {
            left: 0,
            width: 0
          },
          zeroBar: {
            left: 0,
            width: 0
          }
        }, //周末颜色条
        offset: {
          x: 0,
          y: 0
        },  //点击位置
        btns: [],
        crossLines: []
      }
    },
    created() {
      this.getCalendarDate()
    },
    mounted() {
      //获取计算后的格子像素
      this.sizePx = this.$refs.sizeItem[0].clientWidth
      //计算每条横线距离顶部高度
      this._listCrossLinesHeight()
    },
    methods: {
      getCalendarDate() {
        const that = this
        const now = new Date()
        this.calendarDate = []
        for (let i = 0; i < 7; i++) {
          this.calendarDate.push({
            day: moment().add(i, 'days').format('DD'),
            week: that._chinaWeek(moment().add(i, 'days').format('d')),
            isToDay: now.getDay() == moment().add(i, 'days').format('d')
          })
          this.weeks.push(moment().add(i, 'days').format('d'))
        }
        that._barStyle()
      },
      //获取点击位置
      onTap(e) {
        if (e.target.className !== 'calendar') {
          return
        }
        let [offsetX, offsetY, sizePx, that] = [e.offsetX, e.offsetY, this.sizePx, this]

        this.offset = {
          x: Math.ceil(offsetX / sizePx),
          y: Math.ceil(offsetY / sizePx)
        }
        this.btns.push({
          left: (that.offset.x - 1) * that.sizeRem + 0.057 + 'rem',
          top: (that.offset.y - 1) * that.sizeRem + 0.049 + 'rem'
        })
        //判断是否点击中间部分
        console.log(this._isClickCenter(offsetY))
      },
      //周末样式
      _barStyle() {
        const that = this
        this.weeks.map((v, i) => {
          if (v == 6) {
            that.barStyle.sixBar = {
              left: i * that.sizeRem + 'rem',
              width: that.sizeRem + 'rem'
            }
          } else if (v == 0) {
            that.barStyle.zeroBar = {
              left: i * that.sizeRem + 'rem',
              width: that.sizeRem + 'rem'
            }
          }
        })
      },
      //计算每条横线距离顶部高度
      _listCrossLinesHeight(){
        const crossLines = this.$refs.crossLines
        for(let i = 0; i<crossLines.length; i++){
          this.crossLines.push(crossLines[i].offsetTop)
        }
      },
      //判断是否点击中间部分
      _isClickCenter(offsetY){
        const that = this
        for(let i=0; i<that.crossLines.length - 1; i++){
          let height1 = that.crossLines[i]
          let height2 = that.crossLines[i+1]
          if(offsetY >= height1 && offsetY < height2){
            const diff = Math.abs(height2 - offsetY) > Math.abs(height1 - offsetY) ? Math.abs(height1 - offsetY) : Math.abs(height2 - offsetY)
            if(diff < 10){
              return true
            }else {
              return false
            }
          }
        }
      },
      _chinaWeek(num) {
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
      },
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
          &.active {
            color: #ec7822;
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
          .num {
            font-size: .35rem;
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
          .num {
            font-size: .35rem;
          }
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
        .six-bar, .zero-bar {
          background: #fff;
          height: 100%;
          position: absolute;
          top: 0;
          z-index: 10;
        }
        .ver-line {
          position: absolute;
          top: 0;
          border-left: 1px solid #d9d9d9;
          z-index: 15;
          height: 100%;
        }
        .cross-line {
          position: absolute;
          left: 0;
          width: 100%;
          border-top: 1px solid #d9d9d9;
          z-index: 15;
        }
        .btn {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 6px;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: linear-gradient(to bottom, #10c6ff, #0b9cd8);
          width: 1.18rem;
          height: 1.18rem;
          flex-flow: column nowrap;
          text-align: center;
          line-height: 1.18rem;
          font-size: .32rem;
        }
      }
    }
  }
</style>
