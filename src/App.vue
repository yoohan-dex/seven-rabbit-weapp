<script>
import { mapActions } from 'vuex'
export default {
  mpType: 'app',
  created() {
    // 调用API从本地缓存中获取数据
    console.log('app created and cache logs by setStorageSync')

    this.getSystemInfo()
  },
  methods: {
    ...mapActions('global', ['getSystemInfo', 'login'])
  },
  onLaunch() {
    this.login()
  }
}
</script>

<style lang="scss">
@import './styles/var.scss';
div,
scroll-view {
  box-sizing: border-box;
}
Page {
  background: $primaryBackgroundColor;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}

.icon {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon > image {
  width: 20px;
  height: 20px;
}
.default-btn,
.primary-btn,
.wechat-btn,
.warn-btn {
  border-radius: 5px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $primaryColor;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 0;
  line-height: 3;
  &::after {
    border: 0;
  }
}
.primary-btn {
  background: $brandColor;
  color: white;
  box-shadow: 0 2px 10px $brandColor;
}
.warn-btn {
  background: $alertColor;
  color: white;
  box-shadow: 0 2px 10px $alertColor;
}
.wechat-btn {
  background: $wechatColor;
  color: white;
  box-shadow: 0 2px 10px $wechatColor;
}
.sp-container {
  padding-top: 105px !important;
}
</style>
