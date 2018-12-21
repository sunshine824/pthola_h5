<template>
  <div class="calendar-box">
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
    <div class="lists" ref="lists">
      <div class="list-main" :style="{height: sizeRem * time + 'rem'}">
        <!--左侧时间段-->
        <div class="time">
          <div class="tip" :ref="index===10 ? 'ten' : ''" v-for="(item,index) in time">
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
          <transition-group name="btn-scale">
            <p class="btn" v-for="(item,index) in offset.arranging" :key="item"
               :style="{left:item.left,top:item.top}">{{item.type===1 ? '我的课' : '已约'}}</p>
          </transition-group>
          <transition-group name="btn-scale">
            <p class="btn" @click="editCourse(index)" v-for="(item,index) in offset.reservation" :key="item"
               style="background: #f1824a"
               :style="{left:item.left,top:item.top}">我的<br>预约</p>
          </transition-group>
          <transition-group name="btn-scale">
            <p class="btn" v-for="(item,index) in offset.occupation" :key="item"
               :class="item.type ===1 ? 'gray' : ''"
               :style="{left:item.left,top:item.top}">{{item.type===1 ? '休息' : '已约'}}</p>
          </transition-group>
          <transition name="btn-scale">
            <p class="btn-op btn" v-if="opBtn.left" :style="{left:opBtn.left,top:opBtn.top}"></p>
          </transition>
        </div>
      </div>
    </div>
    <transition name="model-scale">
      <div class="model" v-if="isFade">
        <p class="title">确认约课</p>
        <div class="model-body">
          <cube-select v-model="params.date" :options="sevenDate"></cube-select>

          <cube-select v-model="params.time" :options="arrTime"></cube-select>
        </div>
        <div class="bottoms">
          <p class="sure" @click="handleOk">确认</p>
          <p class="cancel" @click="handleCancel('cancel')">取消</p>
        </div>
      </div>
    </transition>
    <div class="mask" @click="handleCancel('cancel')" v-if="isFade"></div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    data() {
      return {
        sizeRem: 1.281,  //每个格子rem
        sizePx: 0,  //每个格子计算后的px
        time: 24,  //24小时
        verLine: 7,  //7条竖线
        crossLine: 25,  //24条横线
        date: {
          year: moment().format('YYYY'),
          month: moment().format('MM')
        },  //当前年月
        calendarDate: [],  //未来七天日期
        sevenDate: [],
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
        offset: {},  //点击位置
        crossLines: [],
        isFade: false,
        arrTime: [],
        params: {
          date: '',
          time: '',
          id: ''
        },
        opBtn: {},  //是否显示初始点击动画
      }
    },
    created() {
      this.reservation = []
      this.occupation = []
      this.arranging = []
      this.bookList = []
      this.getCalendarDate()
    },
    mounted() {
      let [scrollTenTop, elem] = [this.$refs.ten[0].offsetTop, this.$refs.lists]
      elem.scrollTop = scrollTenTop
      //获取计算后的格子像素
      this.sizePx = this.$refs.sizeItem[0].clientWidth
      //计算每条横线距离顶部高度
      this._listCrossLinesHeight()
      //初始化时间段
      this._initTime()
    },
    methods: {
      getCalendarDate() {
        const that = this
        const now = new Date()
        this.calendarDate = []
        for (let i = 0; i < 7; i++) {
          this.calendarDate.push({
            date: moment().add(i, 'days').format('YYYY年MM月DD日') + " 周" + that._chinaWeek(moment().add(i, 'days').format('d')),
            day: moment().add(i, 'days').format('DD'),
            week: that._chinaWeek(moment().add(i, 'days').format('d')),
            isToDay: now.getDay() == moment().add(i, 'days').format('d')
          })
          this.weeks.push(moment().add(i, 'days').format('d'))
          this.sevenDate.push(moment().add(i, 'days').format('YYYY年MM月DD日') + " 周" + that._chinaWeek(moment().add(i, 'days').format('d')))
        }
        that._barStyle()
      },
      toggleFade() {
        this.isFade = !this.isFade
      },
      handleCancel(options) {
        this.isFade = false
        this.opBtn = {}
      },
      //确认排课
      handleOk() {
        let [date, time] = [this.params.date.split(' '), this.params.time.split('-')]
        const start_time = moment((date[0] + ' ' + time[0]), 'YYYY年MM月DD日 HH:mm').format('X')
        const end_time = moment((date[0] + ' ' + time[1]), 'YYYY年MM月DD日 HH:mm').format('X')
        const week = moment.unix(start_time).format('d')
        this.$emit('handleOk', {
          start_time: start_time,
          end_time: end_time,
          week: week,
          time: this.params.time,
          id: this.params.id
        })
      },
      //编辑排课
      editCourse(index) {
        this.params = {
          date: this.offset.reservation[index].date,
          time: this.offset.reservation[index].time,
          id: this.offset.reservation[index].id
        }
        this.toggleFade()
      },
      //获取点击位置
      onTap(e) {
        if (e.target.className !== 'calendar') return
        let [that, offsetX, offsetY, sizePx] = [this, e.offsetX, e.offsetY, this.sizePx]
        const centerObj = that._isClickCenter(offsetY)

        //派发点击事件
        this.$emit('clickTap')
        //未绑定手机号
        if (!sessionStorage.getItem('token')) return
        //判断是否点击中间部分
        if (centerObj.isCenter) {
          const y = centerObj.index + 0.5
          const x = Math.ceil(offsetX / sizePx)
          const start = (String(Math.floor(y - 1)).length > 1 ? String(Math.floor(y - 1)) : 0 + String(Math.floor(y - 1))) + ':30'
          const end = (String(Math.floor(y)).length > 1 ? String(Math.floor(y)) : 0 + String(Math.floor(y))) + ':30'
          const date = that.calendarDate[x - 1].date
          //是否冲突
          if (that._isClash(x, y)) return
          this.params = {
            date: date,
            time: start + '-' + end,
            id: ''
          }
          this.opBtn = {
            x: x,
            y: y,
            left: (x - 1) * that.sizeRem + 0.057 + 'rem',
            top: (y - 1) * that.sizeRem + 0.049 + 'rem',
            date: date,
            time: start + '-' + end,
            id: ''
          }
          setTimeout(() => {
            that.toggleFade()
          }, 100)
        } else {
          const y = Math.ceil(offsetY / sizePx)
          const x = Math.ceil(offsetX / sizePx)
          const start = (String(y - 1).length > 1 ? String(y - 1) : 0 + String(y - 1)) + ':00'
          const end = (String(y).length > 1 ? String(y) : 0 + String(y)) + ':00'
          const date = that.calendarDate[x - 1].date
          if (that._isClash(x, y)) return
          this.params = {
            date: date,
            time: start + '-' + end,
            id: ''
          }
          this.opBtn = {
            x: x,
            y: y,
            left: (x - 1) * that.sizeRem + 0.057 + 'rem',
            top: (y - 1) * that.sizeRem + 0.049 + 'rem',
            date: date,
            time: start + '-' + end,
            id: ''
          }
          setTimeout(() => {
            that.toggleFade()
          }, 100)
        }
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
      _listCrossLinesHeight() {
        const crossLines = this.$refs.crossLines
        for (let i = 0; i < crossLines.length; i++) {
          this.crossLines.push(crossLines[i].offsetTop)
        }
      },
      //判断是否点击中间部分
      _isClickCenter(offsetY) {
        let [that, isCenter, index] = [this, false, 0]
        for (let i = 0; i < that.crossLines.length; i++) {
          let height1 = that.crossLines[i]
          let height2 = that.crossLines[i + 1]
          if (offsetY >= height1 && offsetY < height2) {
            const direction = Math.abs(height2 - offsetY) > Math.abs(height1 - offsetY)
            const diff = direction ? Math.abs(height1 - offsetY) : Math.abs(height2 - offsetY)
            index = direction ? i : i + 1
            if (diff < 10) {
              isCenter = true
            } else {
              isCenter = false
            }
          }
        }
        return {isCenter: isCenter, index: index}
      },
      //相同X轴，点击判断是否重叠
      _isClash(x, y) {
        let isClash = false
        this.bookList.map((v, i) => {
          if (v.x == x) {
            if (Math.abs(v.y - y) < 1) {
              isClash = true
            }
          }
        })
        return isClash
      },
      //初始化时间段
      _initTime() {
        let arrTime = []
        for (let i = 0; i < 24; i++) {
          const time0 = (String(i).length > 1 ? String(i) : 0 + String(i)) + ':00' + '-' + (String(i + 1).length > 1 ? String(i + 1) : 0 + String(i + 1)) + ':00';
          const time1 = i < 23 ? (String(i).length > 1 ? String(i) : 0 + String(i)) + ':30' + '-' + (String(i + 1).length > 1 ? String(i + 1) : 0 + String(i + 1)) + ':30' : ''
          arrTime.push(time0)
          if (time1) {
            arrTime.push(time1)
          }
        }
        this.arrTime = arrTime
      },
      //星期中文转换
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
      //计算x,y坐标值
      _countOffset(obj) {
        let promise1 = new Promise((resolve, reject) => {
          this.weeks.map((v, i) => {
            if (v === obj.week) {
              resolve(i + 1)
            }
          })
        })
        let promise2 = new Promise(((resolve, reject) => {
          this.arrTime.map((v, i) => {
            if (v === obj.time) {
              resolve((i + 2) / 2)
            }
          })
        }))
        return Promise.all([promise1, promise2])
      },
      //初始化坐标值
      _initOffset(arr) {
        let [_this] = [this]
        _this.bookList = []
        let promise1 = new Promise((resolve, reject) => {
          _this._promise(arr, 'reservation')
          resolve(_this.reservation)
        })
        let promise2 = new Promise((resolve, reject) => {
          _this._promise(arr, 'occupation')
          resolve(_this.occupation)
        })
        let promise3 = new Promise((resolve, reject) => {
          _this._promise(arr, 'arranging')
          resolve(_this.arranging)
        })
        Promise.all([promise1, promise2, promise3]).then(res => {
          _this.offset = {
            reservation: res[0],
            occupation: res[1],
            arranging: res[2]
          }
          _this.bookList.push(...res[0], ...res[1], ...res[2])
        })
      },
      //promise封装
      _promise(arr, opt) {
        const _this = this
        arr[opt].map((v, i) => {
          const week = moment.unix(v.start_time).format('d')
          const time = moment.unix(v.start_time).format('HH:mm') + '-' + moment.unix(v.end_time).format('HH:mm')
          _this._countOffset({week: week, time: time}).then(res => {
            _this[opt].push({
              x: res[0],
              y: res[1],
              left: (res[0] - 1) * _this.sizeRem + 0.057 + 'rem',
              top: (res[1] - 1) * _this.sizeRem + 0.049 + 'rem',
              date: _this.calendarDate[res[0] - 1].date,
              time: time,
              type: v.type,
              id: v.id
            })
          })
        })
      },
      //重新刷新
      _refresh(week, time, id) {
        let [_this, offset] = [this, this.offset]
        //去重
        for (let [index, elem] of offset.reservation.entries()) {
          if (id === elem.id) {
            _this.offset.reservation.splice(index, 1)
          }
        }
        _this._countOffset({week: week, time: time}).then(res => {
          _this.offset.reservation.push({
            x: res[0],
            y: res[1],
            left: (res[0] - 1) * _this.sizeRem + 0.057 + 'rem',
            top: (res[1] - 1) * _this.sizeRem + 0.049 + 'rem',
            date: _this.calendarDate[res[0] - 1].date,
            time: time,
            id: id
          })
        })
      }
    }
  }
</script>

<style lang="less">
  .btn-scale-enter-active, .btn-scale-leave-active {
    transition: all .4s;
  }

  .btn-scale-enter, .btn-scale-leave-to {
    transform: scale(2);
    opacity: 0;
  }

  .gray {
    background: #c9c9c9 !important;
  }

  .calendar-box {
    display: flex;
    display: -webkit-flex;
    width: 100%;
    flex-flow: column nowrap;
    position: relative;
    flex: 1;
    .top-list {
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      align-items: center;
      height: 1.6rem;
      z-index: 2;
      background: #4b4b4b;
      width: 100%;
      .date {
        display: flex;
        display: -webkit-flex;
        flex-flow: column nowrap;
        color: #fff;
        font-size: 13px;
        height: 100%;
        width: 1rem;
        justify-content: center;
        align-items: center;
        .year {
          margin-bottom: .1rem;
          height: 20px;
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
          font-size: 13px;
          color: #fff;
          width: 1.281rem;
          height: 100%;
          .day {
            margin-bottom: .1rem;
            font-size: 13px;
            width: 20px;
            height: 20px;
            overflow: hidden;
            text-align: center;
            line-height: 20px;
            display: block;
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
      width: 100%;
      flex: 1;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .list-main {
        background: #fff;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
      }
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
          font-size: .32rem;
          z-index: 30;
          display: inline-flex;
        }
        .btn-op {
          background: rgba(72, 187, 208, .5) !important;
        }
      }
    }
    .model {
      width: 7.6rem;
      height: 6.4rem;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      border: 1px solid #d9d9d9;
      position: fixed;
      z-index: 99;
      background: #fff;
      left: 50%;
      margin-left: -3.8rem;
      top: 50%;
      margin-top: -3.2rem;
      .title {
        font-size: .45rem;
        color: #666;
        margin-top: .4rem;
        margin-bottom: .4rem;
        text-align: center;
      }
      .model-body {
        padding: .3rem;
        .cube-select {
          margin-bottom: .3rem;
        }
      }
      .bottoms {
        position: absolute;
        bottom: 0;
        height: 1.2rem;
        display: flex;
        display: -webkit-flex;
        width: 100%;
        flex-flow: row nowrap;
        border-top: 1px solid #d9d9d9;
        p {
          width: 100%;
          height: 100%;
          font-size: .44rem;
          border-right: 1px solid #d9d9d9;
          text-align: center;
          line-height: 1.2rem;
          color: #fc9153;
          &:last-child {
            border-right: none;
            color: #999;
            &:active {
              background-color: rgba(0, 0, 0, .04);
            }
          }
          &:first-child {
            &:active {
              background-color: rgba(252, 145, 83, .04);
            }
          }
        }
      }
    }
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .3);
      z-index: 90;
    }
  }
</style>
