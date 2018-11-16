<template>
  <div>
    <div :class="['button-style', 'favor', {show: showFavor, 'fixed-button-style': fixed }]" @click="handleFavor">
      <div class="box-icon">
        <image src="/static/assets/icons/favorite-outline.svg"></image>
      </div>
    </div>
    <div v-if="!hideBox" :class="['button-style', 'box', {show, spring, 'fixed-button-style': fixed}]">
      <div class="box-content-wrapper">
        <scroll-view scroll-x scroll-with-animation :class="['box-content', {'show-box': showBox}]" :scroll-left="scrollLeft">
          <div class="product" @click="handleScroll" v-for="(item, idx) in products" :key="idx">
            <image mode="aspectFill" :src="item.cover.url" class="cover" @click="handleProduct(item.id)"></image>
            <div class="remove-btn" @click="handleRemoveItemFromBox(item.id)">
              <image class="icon" src="/static/assets/icons/remove.svg"></image>
            </div>
          </div>
        </scroll-view>
      </div>
      <div class="box-icon" @click="handleShowBox">
        <image src="/static/assets/icons/cart.svg"></image>
        <div class="icon-text">挑挑车</div>
      </div>
    </div>
    <div :class="['transfer-container', {'transfer-container-fixed': fixed}]">
      <button open-type="share" :class="['transfer', {show: show && showBox, }]">
        <image src="/static/assets/icons/share.svg"></image>
        <div class="icon-text">转发</div>
      </button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      spring: false,
      showBox: false,
      scrollLeft: 0,
      scrollView: ''
    }
  },
  props: ['favorId', 'fixed', 'hideBox'],
  computed: {
    ...mapState('box', ['list', 'products']),
    show() {
      return this.list.length > 0
    },
    showFavor() {
      return this.favorId && this.list.indexOf(this.favorId) === -1
    }
  },

  watch: {
    list(v, o) {
      const newLength = v.length
      const oldLength = o.length
      if (newLength > oldLength) {
        this.getProductsByIds().then(() => this.handleScroll(newLength))
        if (!this.showBox) {
          this.spring = true
          setTimeout(() => (this.spring = false), 150)
        }
      }
      if (oldLength > newLength) {
        this.handleScroll('')
        this.spring = true
        setTimeout(() => (this.spring = false), 150)
      }
    }
  },

  methods: {
    ...mapActions('box', ['getProductsByIds']),
    ...mapMutations('box', [
      'removeItemFromBox',
      'removeItemFromProducts',
      'saveItemToBox'
    ]),
    handleShowBox() {
      this.spring = true
      setTimeout(() => (this.spring = false), 150)
      this.showBox = !this.showBox
    },
    handleRemoveItemFromBox(id) {
      this.removeItemFromBox(id)
      this.removeItemFromProducts(id)
    },
    handleScroll(length) {
      if (typeof length === 'number') {
        this.scrollLeft = length * 100
      } else {
        this.scrollLeft = ''
      }
    },
    handleProduct(id) {
      const url = `../detail/index?id=${id}`
      wx.navigateTo({
        url
      })
    },
    handleFavor() {
      this.saveItemToBox(this.favorId)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/var';
button::before,
button::after {
  border: 0;
}
.button-style {
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  right: 15px;
  height: 50px;
  width: 50px;
  border-radius: 5px;

  background: $brandColor;
  box-shadow: 0 0 20px $brandColor;

  transform: scale(0);
  transition: 0.3s ease;
}
.fixed-button-style {
  position: fixed;
}
.favor {
  bottom: 155px;
}
.box {
  bottom: 100px;
}

.box-content-wrapper {
  position: relative;
  width: 0;
  height: 0;
}

.box-content {
  position: absolute;
  width: 290px;
  padding: 5px;
  height: 100px;
  top: -20px;
  right: 10px;
  border-radius: 5px;
  background: $primaryBackgroundColor;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  transform: scale(0);
  transition: 0.3s ease;

  .product {
    display: inline-flex;
    position: relative;
    width: 90px;
    height: 90px;
    margin-right: 5px;

    .cover {
      width: 100%;
      height: 100%;
    }
  }
  .product:last-child {
    margin-right: 0;
  }
}

.remove-btn {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  bottom: 5px;
  right: 5px;
  background: $alertColor;
  box-shadow: 0 2px 5px $alertColor;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  image {
    width: 15px;
    height: 15px;
  }
}

.box-icon {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  image {
    width: 30px;
    height: 30px;
  }
  .icon-text {
    font-size: 12px;
    color: white;
  }
}

.show {
  transform: scale(1) !important;
}
.show-box {
  transform: scale(1);
}
.spring {
  transform: scale(0.8) !important;
}

.transfer-container-fixed {
  position: fixed;
  right: 15px;
  bottom: 45px !important;
}
.transfer-container {
  position: fixed;
  bottom: 90px;
  right: 15px;
}
.transfer {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  background: $brandColor;
  box-shadow: 0 0 20px $brandColor;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5px;
  transform: scale(0);
  transition: 0.3s ease;
  image {
    width: 20px;
    height: 20px;
    margin: 1px;
  }
  .icon-text {
    font-size: 12px;
    color: white;
    line-height: 1.5;
  }
}
</style>


