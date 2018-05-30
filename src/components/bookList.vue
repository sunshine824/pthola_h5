<template>
  <div class="book clearfix">
    <calendar
      ref="calendar"
      @clickTap="clickTap"
      @handleOk="handleOk"/>
    <div class="user-info">
      <div class="avatar-info">
        <p class="avatar">
          <img
            src="http://wx.qlogo.cn/mmopen/PNg30VCHvXaXz3k9Xh5sYd7sn57KFHAnkSz1UVdQo2Sbn3pAFBtvt0wS7LTib7a5zGa5EWDwX8955YAX8lDNyPicNdrbFDSm05/0"/>
        </p>
        <div class="avatar-name">
          <p class="name">成都一护的课表</p>
          <p class="date">未来七日约课表</p>
        </div>
      </div>
      <p class="we-btn">教练好小程序</p>
    </div>
    <transition name="model-scale">
      <div class="model" v-if="isFade" style="border:none">
        <p class="title">账号登录</p>
        <div class="model-body">
          <div class="form-group">
            <cube-input
              class="phone"
              placeholder="请输入手机号"
              :type="phone.type"
              :maxlength="phone.maxlength"
              :autofocus="phone.autofocus"
              v-model="phone.value">
            </cube-input>
          </div>
          <div class="form-group">
            <cube-input
              class="verification"
              :type="verification.type"
              :maxlength="verification.maxlength"
              :autofocus="verification.autofocus"
              v-model="verification.value"
              placeholder="请输入验证码">
            </cube-input>
            <div class="lyz-right">
              <p v-if="!isCount" class="code" @click="sendPhoneCode">发送验证码</p>
              <p v-if="isCount" class="code disabled">{{count}} s</p>
            </div>
          </div>
        </div>
        <div class="bottoms" style="background: linear-gradient(to right, #01bafa, #00b3f9);">
          <p class="sure" @click="bindPhone" style="color: #fff; font-weight: bold">确认</p>
        </div>
      </div>
    </transition>
    <div class="mask" @click="toggleFade" v-if="isFade"></div>
  </div>
</template>

<script>
  import Calendar from '@/base/calendar'
  import {ERR} from '@/public/js/config'
  import {
    addCourse,
    getBookList,
    editCourse,
    wxStudentLogin,
    sendVerifyCode,
    getYetBookList
  } from '@/public/js/api'

  export default {
    name: "book-list",
    components: {
      Calendar
    },
    data() {
      return {
        isFade: false,
        phone: {
          isVerify: false,
          value: '',
          type: 'number',
          maxlength: 11,
          autofocus: true
        },
        verification: {
          isVerify: false,
          value: '',
          maxlength: 4,
          type: 'number',
          autofocus: false
        },
        wechatopenid: sessionStorage.getItem('openid'),
        isCount: false,
        count: 120,
      }
    },
    created() {
      let coach_id = this.$route.query.from_key
      if(coach_id){
        sessionStorage.setItem('coach_id', this.$route.query.from_key)
      }else {
        this.coach_id = sessionStorage.getItem('coach_id')
      }

      this.wxLoginVerify()
    },
    methods: {
      clickTap() {
        if (!sessionStorage.getItem('token')) {
          this.toggleFade()
        }
      },
      toggleFade() {
        this.isFade = !this.isFade
      },
      wxLoginVerify() {
        let code = this.$route.query.code
        if (!code) {
          this.$router.push({
            path: '/'
          })
        }
        //获取token判断是否绑定手机号
        this._wxStudentLogin({wechatcode: code})
      },
      //发送验证码
      sendPhoneCode() {
        if (!this._verifyPhone()) return
        const result = sendVerifyCode({
          phone: this.phone.value
        })
        result.then(res => {
          this.isCount = true
          this.countDown()
        }).catch(err => {
          console.log(err.response)
        })
      },
      //绑定手机号
      bindPhone() {
        if (!this._verifyPhone()) return
        if (!this._verifyCode()) return

        this._wxStudentLogin({
          phone: this.phone.value,
          verification: this.verification.value,
          wechatopenid: this.wechatopenid
        })
      },
      //获取token判断是否绑定手机号
      _wxStudentLogin(params) {
        const result = wxStudentLogin(params)
        result.then(res => {
          console.log(res)
          this._getBookList()
        }).catch(err => {
          let errInfo = err.response.data
          if (errInfo.code === 10118) {
            this.$router.push({
              path: '/'
            })
          } else if (errInfo.code === 10106) {
            sessionStorage.setItem('openid', errInfo.datum.wechat_openid)
            this._getYetBookList()
          }
        })
      },
      //点击确认
      handleOk(data) {
        if (data.id) {
          this._editCourse(data)
        } else {
          this._addCourse(data)
        }
      },
      //添加学员约课
      _addCourse(data) {
        const that = this
        const result = addCourse({
          coach_id: 6,
          start_time: data.start_time,
          end_time: data.end_time,
        })
        result.then(res => {
          that.$refs.calendar.handleCancel()
          that.$refs.calendar._refresh(data.week, data.time, res.id)
        }).catch(err => {
          let code = err.response.data.code
          that.$createDialog({
            type: 'alert',
            title: err.response.data.message,
            content: ERR[code].content,
            icon: 'cubeic-alert',
            onConfirm() {
              that.$refs.calendar.handleCancel('cancel')
            }
          }).show()
        })
      },
      //编辑约课
      _editCourse(data) {
        const that = this
        const result = editCourse({
          id: data.id,
          coach_id: 6,
          start_time: data.start_time,
          end_time: data.end_time,
        })
        result.then(res => {
          that.$refs.calendar.handleCancel()
          that.$refs.calendar._refresh(data.week, data.time, data.id)
        }).catch(err => {
          let code = err.response.data.code
          that.$createDialog({
            type: 'alert',
            title: err.response.data.message,
            content: ERR[code].content,
            icon: 'cubeic-alert',
            onConfirm() {
              that.$refs.calendar.handleCancel('cancel')
            }
          }).show()
        })
      },
      //预约列表
      _getBookList() {
        const result = getBookList({
          coach_id: this.coach_id
        })
        result.then(res => {
          this.$refs.calendar._initOffset(res)
        }).catch(err => {
          console.log(err.response)
        })
      },
      //获取已同意约课（包括休息占位）
      _getYetBookList() {
        const result = getYetBookList({
          coach_id: this.coach_id
        })
        result.then(res => {
          this.$refs.calendar._initOffset(res)
        }).catch(err => {
          console.log(err.response)
        })
      },
      //倒数
      countDown() {
        if (this.isCount) {
          this.timer = setInterval(() => {
            var countNum = this.count
            countNum -= 1;
            if (countNum < 1) {
              this.isCount = false
              countNum = 120
              clearInterval(this.timer)
            }
            this.count = countNum
          }, 1000)
        }
      },
      //验证验证码
      _verifyCode() {
        let [verification] = [this.verification.value]
        if (!verification) {
          this.$createDialog({
            type: 'alert',
            title: '温馨提示',
            content: '请输入验证码',
            icon: 'cubeic-alert'
          }).show()
          return false
        } else if (verification.length !== 4) {
          this.$createDialog({
            type: 'alert',
            title: '温馨提示',
            content: '请输入有效验证码',
            icon: 'cubeic-alert'
          }).show()
          return false
        } else {
          return true
        }
      },
      //验证手机号
      _verifyPhone() {
        let phone = this.phone.value
        if (!phone) {
          this.$createDialog({
            type: 'alert',
            title: '温馨提示',
            content: '请输入手机号',
            icon: 'cubeic-alert'
          }).show()
          return false
        } else if (phone.length < 11 || phone.length > 11) {
          this.$createDialog({
            type: 'alert',
            title: '温馨提示',
            content: '请输入11位手机号',
            icon: 'cubeic-alert'
          }).show()
          return false
        } else {
          return true
        }
      }
    }
  }
</script>

<style lang="less">

  .model-scale-enter-active, .model-scale-leave-active {
    transition: all .4s;
  }

  .model-scale-enter, .model-scale-leave-to {
    transform: scale(2);
    opacity: 0;
  }

  .book {
    position: relative;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-flow: column nowrap;
    .user-info {
      height: 2rem;
      width: 100%;
      position: fixed;
      background: #4b4b4b;
      z-index: 100;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      padding: .3rem;
      box-sizing: border-box;
      align-items: center;
      bottom: 0;
      .avatar-info {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        align-items: center;
        .avatar {
          width: 1.3rem;
          height: 1.3rem;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
          }
        }
        .avatar-name {
          display: flex;
          display: -webkit-flex;
          flex-flow: column nowrap;
          margin-left: .35rem;
          .name {
            font-size: .43rem;
            color: #fff;
            margin-bottom: .1rem;
          }
          .date {
            font-size: .33rem;
            color: rgba(255, 255, 255, .6);
          }
        }
      }
      .we-btn {
        padding: .2rem .5rem;
        background: linear-gradient(to right, #01bafa, #00b3f9);
        color: #fff;
        font-size: .35rem;
        border-radius: 4px;
      }
    }
    .model {
      width: 7.6rem;
      height: 6rem;
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
      margin-top: -3rem;
      overflow: hidden;
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
        .form-group {
          position: relative;
          width: 100%;
          margin-bottom: .3rem;
          display: flex;
          display: -webkit-flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          .phone {
            width: 100%;
          }
          .verification {
            flex: 1;
            margin-right: 10px;
          }
          .lyz-right {

          }
          .code {
            width: 2rem;
            display: flex;
            display: -webkit-flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            background: linear-gradient(to right, #01bafa, #00b3f9);
            color: #fff;
            font-size: 12px;
            border-radius: 2px;
          }
          .disabled {
            background: gray;
          }
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
