<template>
  <div class="loading" v-if="loading">
    <div class="wrap">
      <image class="loading-img" src="/static/assets/logo.jpg"></image>
      <div class="loading-wring">
        <div class="loading-wring-mask"></div>
        <div class="loading-wring-mask2"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['loading'],
  mounted() {
    console.log('lod', this.loading)
  },
  destroyed() {
    console.log('des', this.loading)
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/var';

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 100px;
  overflow: hidden;
  .loading-img {
    position: absolute;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    z-index: 2;
  }
  .loading-wring {
    position: relative;
    left: -5px;
    top: -5px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    z-index: 1;
    border: 3px solid $brandColor;
    animation: rotate infinite 2s;
    .loading-wring-mask,
    .loading-wring-mask2 {
      position: absolute;
      width: 50%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 2;
      background: white;
      border: 3px solid white;
      outline: white solid 3px;
    }
    .loading-wring-mask2 {
      height: 50%;
      left: initial;
      right: 0;
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  40% {
    transform: rotate(720deg);
  }
  80% {
    transform: rotate(1080deg);
  }
  100% {
    transform: rotate(1440deg);
  }
}
</style>


