<template>
  <div class="book clearfix">
    <calendar
      ref="calendar"
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
  </div>
</template>

<script>
  import Calendar from '@/base/calendar'
  import {ERR} from '@/public/js/config'
  import {
    getWeChatCode,
    addCourse,
    getBookList,
    editCourse
  } from '@/public/js/api'

  export default {
    name: "book-list",
    components: {
      Calendar
    },
    data() {
      return {}
    },
    created() {
      this._getWeChatCode()
      this._getBookList()
    },
    methods: {
      //微信授权获取code
      _getWeChatCode() {
        const redirect_uri = encodeURIComponent(window.location.href)
        const result = getWeChatCode(redirect_uri)
        window.location.href = result
      },
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
          coach_id: 6
        })
        result.then(res => {
          this.$refs.calendar._initOffset(res)
        }).catch(err => {
          console.log(err.response)
        })
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
  }
</style>
