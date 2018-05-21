import Vue from 'vue'
import Router from 'vue-router'
import bookList from '@/components/bookList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'bookList',
      component: bookList
    }
  ]
})
