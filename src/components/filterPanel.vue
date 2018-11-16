<template>
  <div>
    <div :class="['panel',  {'panel-show': show}]">
      <scroll-view class="panel__container" scroll-y>
        <div class="filter-row" v-if="nativeItems.length > 0" v-for="(row, i) in nativeItems" :key="i">
          <div class="type-row">
            <div class="type-name">{{row.name}}</div>
            <div class="type-all" v-if="showAll[i].exit" @click="triggerShowAll(i)">全部</div>
          </div>
          <div class="row">
            <div :class="['item', {'item-selected': item.selected}]" v-if="showAll[i].show ? true : j > 2 ? false : true" @click="handleClick(item, i)" v-for="(item, j) in row.features" :key="j">
              {{item.name}}
            </div>
          </div>
        </div>
      </scroll-view>
      <div class="buttons">
        <div class="secondary-btn" @click="handleReset">重置</div>
        <div class="primary-btn" @click="handleConfirm">确定</div>
      </div>
    </div>
    <div class="mask" v-show="show" @click="handleConfirm"></div>
  </div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
import equal from 'fast-deep-equal'

import { TRIGGER_PANEL, SELECT_FEATURE } from '../store/modules/product'

import { MUTATE_TYPE } from '../store/modules/category'

export default {
  props: ['items', 'trigger', 'show'],
  data() {
    return {
      nativeItems: [],
      showAll: []
      // show: false,
      // exit: false
    }
  },
  mounted() {
    this.initState()
    this.initShowAll()
  },
  watch: {
    items() {
      this.initState()
      this.initShowAll()
    }
  },

  methods: {
    ...mapMutations('product', [TRIGGER_PANEL, SELECT_FEATURE]),
    ...mapMutations('category', [MUTATE_TYPE]),
    ...mapActions('product', ['regetProducts']),
    initState(reset) {
      this.nativeItems = this.items.map(row => {
        const res = {
          ...row,
          features: row.single
            ? []
            : [
                ...row.features.map(item => ({
                  ...item,
                  selected: reset ? false : item.selected
                }))
              ]
        }
        if (res.features.length < 1) {
          delete res.features
        }
        return res
      })
    },
    initShowAll() {
      const a = Array.from({ length: this.nativeItems.length }).map((v, i) => ({
        exit: this.nativeItems[i].features.length > 3,
        show: false
      }))
      this.showAll = a
      console.log(this.showAll)
    },
    triggerShowAll(i) {
      this.showAll[i].show = !this.showAll[i].show
    },
    handleTrigger() {
      this.TRIGGER_PANEL()
    },
    handleClick(item) {
      item.selected = !item.selected
    },
    handleSubmit() {
      if (!equal(this.nativeItems, this.items)) {
        this.MUTATE_TYPE(this.nativeItems)
        this.SELECT_FEATURE(this.nativeItems)
        this.regetProducts()
      }
    },
    handleConfirm() {
      this.trigger()
      this.handleSubmit()
    },
    handleReset() {
      this.initState(true)
    }
  },
  destroyed() {
    this.handleReset()
    // this.handleSubmit()
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/var';

.panel__container {
  width: 100%;
  height: calc(100% - 70px);
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
  z-index: 9;
}
.panel {
  background: $primaryBackgroundColor;
  width: 90%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  padding-top: 40px;
  /* box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1); */
  transform: translateX(100%);
  transition: 0.3s ease;
}
.panel-show {
  transform: translateX(0);
}
.filter-row {
  width: 100%;
  margin-bottom: 10px;
}
.type-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px;
}
.type-name {
  font-size: 16px;
  padding: 10px;
  font-weight: bold;
  color: $primaryColor;
}
.type-all {
  font-size: 12px;
  color: $tagColor;
  padding: 10px;
}
.row {
  width: 100%;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  flex-basis: 31%;
  margin: 5px 1.16%;
  font-size: 14px;
  /* box-shadow: 0 0px 10px #eee; */
  background: $lighterColor;
  color: $primaryColor;
  overflow: hidden;
  border-radius: 30px;
  transition: 0.5s cubic-bezier(0.05, 0.82, 0.23, 1);
}
.item-selected {
  color: white;
  background: $brandColor;
  box-shadow: 0 0px 10px $brandColor;
}

.buttons {
  position: fixed;
  bottom: 0;
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
  box-shadow: 0 0 30px $brandColor;
}
.secondary-btn {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  color: $primaryColor;
  background: $primaryBackgroundColor;
}
</style>

