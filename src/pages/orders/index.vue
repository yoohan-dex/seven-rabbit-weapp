<template>
  <div>
    <navigation :name="'我的订单'"></navigation>
    <div class="tip" v-if="msg">
      {{msg}}
    </div>
    <div class="order-container">
      <orderList :items="orders" v-if="orders"></orderList>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import navigation from '../../components/navigation'
import progressBar from '../../components/progressBar'
import orderList from '../../components/order-list'
export default {
  components: {
    navigation,
    progressBar,
    orderList
  },
  computed: {
    ...mapState('orders', ['orders', 'msg'])
  },
  methods: {
    ...mapActions('orders', ['getOrders']),
    async handleGetOrders() {
      try {
        await this.getOrders()
      } catch (err) {
        if (this.direct) {
          this.goto('bind-phone')
        }
      }
    },
    goto(name) {
      const url = `../${name}/index`
      wx.navigateTo({
        url
      })
    }
  },
  onShow() {
    this.handleGetOrders()
  },
  onLoad(info) {
    if (info.from === 'direct') {
      this.direct = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/var';

.order-container {
  position: absolute;
  width: 100%;
  height: calc(100% - 65px);
}
.tip {
  color: $brandColor;
  font-size: 14px;
  text-align: center;
  padding-top: 40px;
}
</style>


