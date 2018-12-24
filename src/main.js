import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store' //引入vuex
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import 'font-awesome/css/font-awesome.css'
import 'common/stylus/index.styl'

// 挂载api到vue的原型对象上
import api from './api/index'
Vue.prototype.http = api


/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole'
// 300ms延迟
fastclick.attach(document.body)
// 图片懒加载
Vue.use(VueLazyload, {
  // 默认图片
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
