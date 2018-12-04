<template>
  <div class="filter-row__container">
    <div class="row">
      <scroll-view scroll-x class="type-row">
        <div :class="['item', { 'item-selected': item.selected }]" v-for="(item, i) in nativeItems" :key="i" @click="handleSelect(item, i)">
          {{item.name}}
        </div>
      </scroll-view>
      <div class="filter" @click="handleTrigger">
        <div class="text">筛选</div>
        <div class="icon">
          <image src="/static/assets/icons/filter.svg"></image>
        </div>
      </div>
    </div>
    <div :class="['popup', {'popup-show': showPopup}]" :style="{height: activeHeight + 'px'}">
      <scroll-view scroll-y class="popup__content">
        <div class="subType-row">
          <div :class="['subType-item', {'subType-item-selected': item.selected}]" @click="handleClick(item, i)" v-for="(item, j) in activeRow.features" :key="j">
            {{item.name}}
          </div>
        </div>
      </scroll-view>
      <div class="buttons">
        <div class="secondary-btn" @click="handleReset">重置</div>
        <div class="primary-btn" @click="handleConfirm">确定</div>
      </div>
    </div>
    <div class="mask" v-if="showPopup" @click="handleCancel"></div>
  </div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
import { SELECT_FEATURE } from '../store/modules/product'
import { MUTATE_TYPE } from '../store/modules/category'
import equal from 'fast-deep-equal'
export default {
  props: ['items', 'triggerPanelShow'],
  computed: {
    activeRow() {
      if (this.nativeItems.length > 0) {
        return this.nativeItems[this.activeRowIdx]
      }
      return {}
    },
    activeHeight() {
      if (!this.showPopup) {
        return 0
      }
      const length = Math.ceil(
        this.items[this.activeRowIdx].features.length / 3
      )
      if (length > 3) {
        return 120 + 4 * 39
      } else {
        return 120 + length * 39
      }
    }
  },
  data() {
    return {
      showPopup: false,
      activeRowIdx: 0,
      nativeItems: []
    }
  },
  created() {
    this.initState()
  },
  watch: {
    items() {
      this.initState()
    }
  },
  methods: {
    ...mapMutations('product', [SELECT_FEATURE]),
    ...mapMutations('category', [MUTATE_TYPE]),
    ...mapActions('product', ['regetProducts']),

    initState(reset) {
      this.nativeItems = this.items.map(row => ({
        ...row,
        showAll: false,
        features: row.single
          ? []
          : [
              ...row.features.map(item => ({
                ...item,
                selected: reset ? false : item.selected
              }))
            ]
      }))
    },
    handleHint(items) {
      if (!items) {
        return ''
      }
      return items.some(i => i.selected)
    },
    handleSelect(item, i) {
      if (item.single) {
        item.selected = !item.selected
        this.handleConfirm()
      } else {
        this.showPopup = true
        this.activeRowIdx = i
      }
    },
    handleClick(item, i) {
      item.selected = !item.selected
    },
    handleTrigger() {
      this.triggerPanelShow()
    },
    handleClose() {
      this.showPopup = false
      this.activeRowIdx = 0
    },
    handleCancel() {
      this.initState()
      this.handleClose()
    },
    handleReset() {
      this.initState(true)
    },
    handleConfirm() {
      if (!equal(this.nativeItems, this.items)) {
        this.MUTATE_TYPE(this.nativeItems)
        this.SELECT_FEATURE(this.nativeItems)
        this.regetProducts()
      }
      this.handleClose()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/var';

.filter-row__container {
  width: 100%;
  height: 50px;
}
.row {
  position: fixed;
  background: $primaryBackgroundColor;
  bottom: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  z-index: 3;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
}
.type-row {
  position: relative;
  white-space: nowrap;
  width: 75%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.row-container {
  position: relative;
  width: 200%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 5px 15px;
  margin: 10px 5px;
  font-size: 14px;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  // border: 2px solid rgba(0, 0, 0, .1);
  border-radius: 20px;
  transition: 0.5s cubic-bezier(0.05, 0.82, 0.23, 1);
  overflow: hidden;
  z-index: 9;
  background: $lighterColor;
  color: $tagColor;
}
.item-selected {
  color: white;
  background: rgb(157, 104, 238);
  background: linear-gradient(
    45deg,
    rgba(157, 104, 238, 1) 0%,
    rgba(226, 53, 157, 1) 100%
  );
  box-shadow: 0 4px 10px rgba(157, 104, 238, 1);
}
.item-hint {
  box-shadow: 0 4px 10px rgba(157, 104, 238, 1);
}
.filter {
  flex-basis: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  font-size: 14px;
  color: $primaryColor;
}
.text {
}
.icon image {
  width: 15px;
  height: 15px;
}
.popup {
  position: fixed;
  width: 100%;
  height: 250px;
  background: $primaryBackgroundColor;
  bottom: 49px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transition: 0.3s cubic-bezier(1, 0.3, 0.26, 1);
  transform: translateY(130%);
}
.popup-show {
  transform: translateY(0);
}
.popup__content {
  width: 100%;
  height: calc(100% - 70px);
  padding: 20px 20px 0;
}
.buttons {
  width: 100%;
  height: 70px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.secondary-btn,
.primary-btn {
  width: calc(50% - 10px);
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  font-size: 14px;
}
.primary-btn {
  color: white;
  background: $brandColor;
  box-shadow: 0 0px 30px $brandColor;
}
.secondary-btn {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  color: $primaryColor;
  background: $primaryBackgroundColor;
}
@keyframes showing {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  animation: showing 0.3s ease;
  z-index: 1;
}
.subType-row {
  width: 100%;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.subType-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  flex-basis: 31%;
  margin: 5px 1.16%;
  font-size: 14px;
  /* box-shadow: 0 0px 10px #eee; */
  background: $lighterColor;
  color: $tagColor;
  border-radius: 30px;
  transition: 0.5s cubic-bezier(0.05, 0.82, 0.23, 1);
}
.subType-item-selected {
  color: white;
  background: $brandColor;
  box-shadow: 0 3px 10px $brandColor;
}
</style>


