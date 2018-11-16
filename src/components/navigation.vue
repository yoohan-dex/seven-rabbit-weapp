<template>
  <div :class="['box', {fixed: float, index, shadow, iphoneX: isX}]" @click="handleBack">
    <div class="back icon" v-if="!index">
      <image v-if="backToIndex" src="/static/assets/icons/backTo.svg"></image>
      <image v-else src="/static/assets/icons/back.svg"></image>
    </div>
    <div :class="['name', {'name-shadow': outline}]">{{name}}</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: ['name', 'index', 'float', 'backToIndex', 'shadow', 'outline'],
  computed: {
    ...mapState('global', ['isX'])
  },
  methods: {
    handleBack() {
      if (this.backToIndex) {
        wx.redirectTo({
          url: '/pages/single/index'
        })
      } else {
        wx.navigateBack()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/var';

.box {
  width: 100%;
  height: 65px;
  padding: 30px 0 10px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  top: 0;
  left: 0;
  position: relative;
  z-index: 1;
}
.iphoneX {
  height: 100px;
  padding: 35px 0 0 10px;
}
.index {
  background: $secondaryBackgroundColor;
  // margin-bottom: 5px;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.shadow {
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.fixed {
  position: fixed;
  z-index: 1000;
}
.name {
  color: $brandColor;
  font-size: 18px;
  font-weight: bold;

  // background: linear-gradient(
  //   45deg,
  //   rgba(157, 104, 238, 1) 0%,
  //   rgba(226, 53, 157, 1) 100%
  // );
  // color: rgba(0, 0, 0, 0.2);
}
.name-shadow {
  color: white;
  font-weight: 400;
  -webkit-text-fill-color: white;
  -webkit-background-clip: text;
  -webkit-text-stroke: 0.1px rgba(120, 164, 250, 1);
}
</style>


