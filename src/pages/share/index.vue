<template>
  <div class="page">
    <navigation :name="'返回首页'" :backToIndex="true"></navigation>

    <scroll-view scroll-y class="product-list">
      <div class="product" v-for="(item, idx) in products" :key="idx" @click="handleProductClick(item.id)">
        <!-- <div class="shadow" :style="{backgroundImage: 'url('+item.cover.url + ')'}"></div> -->
        <!-- <div class="cover" :style="{backgroundImage: 'url('+item.cover.url + ')'}"></div> -->
        <image :src="item.cover.url" mode="aspectFill"></image>
        <div class="name">{{item.name}}</div>
        <div class="tag-row">
          <div class="tag" v-for="(tag, i) in item.features">{{tag.name}}</div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import navigation from '@/components/navigation'

export default {
  components: {
    navigation
  },
  computed: {
    ...mapState({
      products: state => state.box.shareProducts
    })
  },
  methods: {
    ...mapActions('box', ['getShareProducts']),
    handleProductClick(id) {
      const url = `../detail/index?id=${id}`
      wx.navigateTo({
        url
      })
    }
  },
  onLoad(o) {
    this.getShareProducts(
      (o.products && JSON.parse(o.products)) || [89, 90, 92, 100, 102]
    )
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/var';

.page {
  position: absolute;
  width: 100%;
}
.product-list {
  width: 100%;
  height: 100%;
  position: relative;
}
.product {
  // position: relative;

  // width: 340px;
  margin: 20px auto 30px;
  // height: 340px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.cover {
  position: relative;
  width: 70%;
  height: 70%;
  left: 15%;
  top: 15%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 2;
}
.shadow {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(9px);
  opacity: 0.8;
  z-index: 0;
}
.name {
  text-align: center;
  color: $primaryColor;
  font-size: 14px;
  font-weight: bold;
}
.tag-row {
  text-align: center;
}
.tag {
  color: $tagColor;
  display: inline-block;
  // background: $primaryLightColor;
  font-size: 10px;
  padding: 3px 7px 3px 0;
  // margin-right: 3px;
  // margin-bottom: 2px;
  border-radius: 12px;
}
</style>


