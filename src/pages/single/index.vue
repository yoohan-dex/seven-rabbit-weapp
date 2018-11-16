<template>
  <div class="static-page">
    <navigation :name="'定制'" :index="true" :shadow="true"></navigation>
    <div class="container">
      <div class="left">
        <category v-if="categories" :categories="categories" :onSelect="handleCategorySelect"></category>
      </div>
      <div class="right">
        <scroll-view scroll-y class="page" @scrolltolower="onTouch">
          <grid :items="list" :small="true" v-on:grid-click="handleGridClick" v-on:item-add="handleFavorItem" :got="got" :loading="loading" :appending="appending"></grid>
        </scroll-view>
      </div>
    </div>
    <filter-panel v-if="ifFilterPanel" :items="filters" :show="panelShow" :trigger="triggerPanelShow"></filter-panel>
    <filterRow v-if="ifFilterPanel" :items="filters" :triggerPanelShow="triggerPanelShow"></filterRow>
    <box></box>
    <!-- <loginModal :showModal="show" :login="handleLogin" :cancel="handleLoginModalCancel"></loginModal> -->

  </div>
</template>

<script>
import card from '@/components/card'
import grid from '@/components/grid'
import navigation from '@/components/navigation'
import category from '@/components/category'
// import loginModal from '@/components/loginModal'
import box from '@/components/box'
import transfer from '@/components/transfer'
import filterRow from '@/components/filterRow'
import filterPanel from '@/components/filterPanel'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      panelShow: false,
      type: '',
      navigationTitle: ''
    }
  },
  computed: {
    ifFilterPanel() {
      return this.filters && this.filters.length > 0
    },
    ...mapState('box', ['boxes']),
    ...mapState('global', ['userInfo', 'userId']),
    ...mapState({
      categories: state => state.category.list,
      filters: state => {
        const selectedCateogry = state.category.list.filter(
          c => c.id === state.category.select
        )[0]
        if (selectedCateogry) {
          return selectedCateogry.filters
        }
        return []
      },
      likeList: state => state.box.list
    }),
    ...mapState('product', [
      'filterPanelShow',
      'category',
      'loading',
      'appending',
      'got'
    ]),
    ...mapState({
      list: state =>
        state.product.list.map(p => ({
          ...p,
          showAdd: !state.box.list.includes(p.id)
        }))
    })
  },
  components: {
    navigation,
    category,
    card,
    grid,
    filterRow,
    filterPanel,
    box,
    transfer
  },
  onShareAppMessage(options) {
    if (options.from === 'button') {
      let changed = false

      const lastBox = this.boxes.length > 0 && this.boxes[0]
      // let thisBoxId = lastBox ? lastBox.id : 1
      if (lastBox) {
        const lastList = lastBox.products.map(p => p.id)
        if (this.likeList.length !== lastList.length) {
          changed = true
        } else {
          const likeList = this.likeList.sort()
          const last = lastList.sort()
          for (let i = 0; i < likeList.length; i++) {
            if (likeList[i] !== last[i]) {
              changed = true
              break
            }
          }
        }
        if (changed) {
          // thisBoxId += 1
        }
      }

      return {
        title: `我喜欢的七兔`,
        path: `/pages/share/index?products=${JSON.stringify(this.likeList)}`,
        imageUrl: '/static/assets/cover.jpg'
        // success: () => {
        //   if (changed || thisBoxId === 1) {
        //     this.createBox(this.likeList)
        //   }
        // }
      }
    }
    return {
      title: '七兔定制',
      imageUrl: '/static/assets/cover.jpg'
    }
  },
  onReady() {
    // this.handleIfShowLogin()
  },
  methods: {
    ...mapActions('product', [
      'regetProducts',
      'appendProducts',
      'regetProductAfterCategoryChanged'
    ]),
    ...mapMutations('box', ['saveItemToBox']),
    ...mapActions('box', ['getProductsByIds', 'getBoxes', 'createBox']),
    ...mapActions('category', ['getCategory']),
    ...mapMutations('category', ['SELECT', 'INI_FEATURE']),
    ...mapMutations('product', ['SAVE_PARAMS', 'SAVE_CATEGORY']),
    handleCategorySelect(category) {
      this.SELECT(category.id)
      this.SAVE_CATEGORY(category.id)
      this.INI_FEATURE()
      this.regetProductAfterCategoryChanged({ category: category.id })
    },
    triggerPanelShow() {
      this.panelShow = !this.panelShow
    },
    onTouch() {
      this.appendProducts()
    },
    handleGridClick(id) {
      const url = `../detail/index?id=${id}`
      wx.navigateTo({
        url
      })
    },
    handleFavorItem(id) {
      this.saveItemToBox(id)
    }
  },
  onLoad() {
    console.log('onload')
    this.getCategory({ ini: true })
    this.getProductsByIds()
  }
}
</script>

<style <style lang="scss" scoped>
@import '../../styles/var';
.static-page {
  background: $primaryBackgroundColor;
  position: absolute;
  background-repeat: repeat;
  height: calc(100% - 50px);
  width: 100%;
}
.container {
  position: relative;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  height: calc(100% - 65px);
}
.right {
  position: relative;
  flex-basis: 80%;
  height: 100%;
}
.left {
  flex-basis: 20%;
}
.page {
  position: relative;
  width: 100%;
  top: 0;
  height: 100%;
}
</style>


