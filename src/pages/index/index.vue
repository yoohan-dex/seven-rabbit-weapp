<template>
  <div class="page">
    <div class="test">
      <swiper class="swiper" autoplay="true" interval="2000" duration="500" circular="true">
        <block v-for="(item, idx) in imgUrls" :key="idx">
          <swiper-item>
            <image :src="item" class="slide-image" width="355" height="150" />
          </swiper-item>
        </block>
      </swiper>
      <image mode="scaleToFill" class="footer" src="/static/assets/footer.png"></image>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgUrls: [
        'https://seven-rabbit-1257083357.cos.ap-guangzhou.myqcloud.com/index/1.jpg',
        'https://seven-rabbit-1257083357.cos.ap-guangzhou.myqcloud.com/index/2.jpg',
        'https://seven-rabbit-1257083357.cos.ap-guangzhou.myqcloud.com/index/3.jpg'
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  position: absolute;
  height: 100%;
  width: 100%;
}
.test {
  position: relative;
  width: 375px;
  height: 350px;
  background: blanchedalmond;
}

.swiper {
  height: 350px;
}

.slide-image {
  width: 375px;
  height: 350px;
}

.footer {
  width: 100%;
  height: 30px;
  position: absolute;
  bottom: -2px;
}
</style>


