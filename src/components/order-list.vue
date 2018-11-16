<template>
  <scroll-view scroll-y class="order-container">
    <div class="order-list">
      <div class="item" v-if="items.length > 0" v-for="(item, idx) in items" :key="idx">
        <div class="left-side">
          <image lazy-load mode="aspectFill" class="cover" :src="item.images[0].url"></image>
        </div>
        <div class="right-side" @click="gotoDetail(item.id)">
          <div class="primary-text">{{item.clientCompany}}</div>
          <div class="other-text">{{status[item.status]}}</div>
          <div class="other-text">{{progress[item.progress]}}</div>
          <div class="bottom-side">
            点击查看详情
          </div>
        </div>
      </div>
      <div class="tip" v-if="items.length === 0">{{msg ? msg : '暂时没有订单'}}</div>
    </div>
  </scroll-view>
</template>
<script>
const status = ['已确认订单', '生产中', '已结单', '出现售后问题', '售后后结单']
const progress = [
  '未开工',
  '正在裁片',
  '裁片完成',
  '正在印花',
  '印花完成',
  '正在车衣',
  '车衣完成',
  '正在后整',
  '后整完成',
  '正在发货',
  '已经发货'
]
/**
 * role: 'admin' 'client' 'operator'
 */
export default {
  props: ['items', 'msg', 'role'],
  data() {
    return {
      status,
      progress
    }
  },
  methods: {
    gotoDetail(id) {
      const url = `../order-detail/index?id=${id}&role=${this.role || 'client'}`
      wx.navigateTo({
        url
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/var';

.order-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.order-list {
  width: 100%;
  padding: 0 10px 10px;
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 10px;
    margin: 10px 0;
    position: relative;
    width: 100%;
    height: 120px;
    padding-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .top-side {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100px;
  }
  .left-side {
    width: 110px;
    height: 110px;
    margin-right: 10px;
  }
  .right-side {
    width: calc(100% - 125px);
    height: 100%;
    position: relative;
  }
  .bottom-side {
    position: absolute;
    bottom: 0;
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    color: $primaryColor;
  }

  .cover {
    width: 110px;
    height: 110px;
    border-radius: 5px;
    overflow: hidden;
  }

  .primary-text {
    font-size: 14px;
    color: $brandColor;
    margin: 7px 0;
  }
  .other-text {
    font-size: 14px;
    line-height: 1.5;
    color: $secondaryFontColor;
  }
}
.tip {
  color: $brandColor;
  font-size: 14px;
  text-align: center;
  padding-top: 40px;
}
</style>


