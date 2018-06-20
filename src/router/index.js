import Vue from 'vue'
import Router from 'vue-router'
import bookList from '@/components/bookList'
import wxLogin from '@/components/wxLogin'

Vue.use(Router)

export default new Router({
  //mode:'history',
  routes: [
    {
      path: '/',
      name: 'wxLogin',
      component: wxLogin
    },
    {
      path: '/home',
      name: 'bookList',
      component: bookList
    }
  ]
})
