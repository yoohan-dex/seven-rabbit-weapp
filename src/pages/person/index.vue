<template>
  <div>
    <navigation :name="'我'" :index="true"></navigation>
    <div class="person-container">
      <div class="user">
        <div class="left-side">
          <div class="avatar">
            <div v-if="userInfo" class="avatar-wrap">
              <image class="avatar-image" :src="userInfo.avatarUrl"></image>
              <div class="avatar-image blur" :style="{backgroundImage: 'url(' + userInfo.avatarUrl + ');'}"></div>
            </div>
            <div v-else class="default-image"></div>
          </div>
        </div>
        <div class="right-side">
          <div v-if="userInfo" class="name">{{userInfo.nickName}}</div>
          <div v-else class="info-getter">
            <button class="getInfo-btn" lang="zh_CN" open-type="getUserInfo" @getuserinfo="getInfo">点击登录</button>
          </div>
        </div>
      </div>
      <div class="list">
        <div class="list-item" @click="goto('bind-phone')">
          <div class="line-1">
            <div class="small-icon">
              <image src="/static/assets/icons/bind-phone.svg"></image>
            </div>
            <p>绑定手机</p>
          </div>
          <div class="line-2">绑定手机之后您可以实时跟踪到订单的加工进度</div>
        </div>
        <div class="list-item" @click="goto('orders')">
          <div class="line-1">
            <div class="small-icon">
              <image src="/static/assets/icons/my-order.svg"></image>
            </div>
            <p>我的订单</p>
          </div>
          <div class="line-2">点击这里查看您的所有订单和进度</div>
        </div>
        <div class="list-item" @click="goto('order-admin')" v-if="isAdmin">
          <div class="line-1">
            <div class="small-icon">
              <image src="/static/assets/icons/my-order.svg"></image>
            </div>
            <p>所有订单</p>
          </div>
          <div class="line-2">点击这里查看所有订单</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navigation from '../../components/navigation'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    navigation
  },
  computed: {
    ...mapState('global', ['userInfo', 'isAdmin'])
  },
  methods: {
    ...mapMutations('global', ['saveInfo']),
    ...mapActions('global', ['saveUserInfo']),
    getInfo(e) {
      const info = JSON.parse(e.mp.detail.rawData)
      this.saveInfo(info)
      this.saveUserInfo(info)
    },
    goto(name) {
      const url = `../${name}/index`
      wx.navigateTo({
        url
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/var';

.person-container {
  width: 100%;
  padding: 10px;
}
.user,
.list {
  padding: 10px;
  width: 100%;
  height: 120px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
}
.list {
  flex-direction: column;
  height: auto;
  position: relative;
  top: 15px;
}
.left-side {
  position: relative;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.right-side {
  width: 70%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: end;
}
.name {
  font-weight: 400;
  font-size: 18px;
  color: $primaryColor;
  text-indent: 10px;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 10px;

  image,
  .default-image {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    z-index: 2;
  }
  .default-image {
    background: $secondaryFontColor;
  }
  .avatar-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
  }
  .blur {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 10px;
    z-index: 0;
    filter: blur(7px);
    opacity: 0.8;
  }
}
.info-getter {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.getInfo-btn {
  width: 90px;
  height: 34px;
  padding: 0;
  border-radius: 5px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $primaryColor;
  border-radius: 17px;
  border: 1px solid $secondaryFontColor;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
  margin: 0;
  &::after {
    border: 0;
  }
}
.list-item {
  color: $primaryColor;
  font-size: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  .line-1 {
    display: flex;
    align-items: center;
  }
  .line-2 {
    color: $secondaryFontColor;
    font-size: 12px;
  }
}
.small-icon {
  width: 22px;
  height: 22px;
  image {
    width: 18px;
    height: 18px;
    margin: 2px 0;
  }
}
</style>