import Vue from 'vue'
import App from '@/App'
import store from '@/store'

Vue.config.productionTip = false

import IboxPlugin from '@/plugins/ibox'
Vue.use(IboxPlugin)

const app = new Vue({
  store,
  ...App
})

app.$mount()

export default {
  config: {
    pages: ['pages/single/index', 'pages/person/index', 'pages/index/index'],
    tabBar: {
      borderStyle: 'white',
      backgroundColor: '#FFF',
      selectedColor: '#78a4fa',
      color: '#6A6A77',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: 'static/assets/icons/single.png',
          selectedIconPath: 'static/assets/icons/single-active.png'
        },
        {
          pagePath: 'pages/single/index',
          text: '定制',
          iconPath: 'static/assets/icons/custom.png',
          selectedIconPath: 'static/assets/icons/custom-active.png'
        },
        {
          pagePath: 'pages/person/index',
          text: '我',
          iconPath: 'static/assets/icons/person.png',
          selectedIconPath: 'static/assets/icons/person-active.png'
        }
      ]
    },
    window: {
      backgroundTextStyle: 'dark',
      navigationBarTextStyle: 'black',
      navigationStyle: 'custom',
      navigationBarBackgroundColor: '#000',
      navigationBarTitleText: 'WeChat',
      backgroundColorTop: '#333',
      backgroundColorBottom: '#333'
    }
  }
}
