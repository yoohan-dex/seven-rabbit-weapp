<template>
  <scroll-view scroll-y class="container" v-if="detail.length > 0">
    <div class="content-wrapper">
      <navigation :name="name" :float="true" :outline="true"></navigation>
      <image mode="widthFix" class="image" src="https://seven-rabbit-1257083357.image.myqcloud.com/framework/header.png"></image>
      <image :src="image_index" mode="aspectFill" :style="{height: squareHeight + 'px'}" class="image"></image>
      <!-- <image mode="widthFix" class="image" src="https://seven-rabbit-1257083357.image.myqcloud.com/framework/rule.png"></image> -->
      <div class="image-wrap">
        <image :src="image_front" mode="aspectFill" :style="{height: squareHeight + 'px'}" class="image"></image>
        <div class="image-corner image-left-corner">
          <image mode="widthFix" class="corner" src="https://seven-rabbit-1257083357.image.myqcloud.com/framework/front.png"></image>
        </div>
      </div>
      <div class="image-wrap">
        <image :src="image_back" mode="aspectFill" :style="{height: squareHeight + 'px'}" class="image"></image>
        <div class="image-corner image-right-corner">
          <image mode="widthFix" class="corner" src="https://seven-rabbit-1257083357.image.myqcloud.com/framework/back.png"></image>
        </div>
      </div>
      <!-- <image mode="widthFix" class="image" src="https://seven-rabbit-1257083357.image.myqcloud.com/framework/modal.png"></image>

      <image mode="aspectFill" :style="{height: squareHeight + 'px'}" class="image" v-for="(url, idx) in images_modal" :key="idx" :src="url"></image> -->

      <image mode="widthFix" class="image" src="https://seven-rabbit-1257083357.image.myqcloud.com/framework/detail.png"></image>

      <image mode="aspectFill" :style="{height: squareHeight + 'px'}" class="image" v-for="(url, idx) in images_detail" :key="idx" :src="url"></image>

      <image mode="widthFix" class="image" src="https://seven-rabbit-1257083357.image.myqcloud.com/framework/footer.png"></image>

      <box :favorId="id" :fixed="true" :hideBox="true"></box>
    </div>
  </scroll-view>
</template>
<script>
import Vue from 'vue'
import wxp from 'minapp-api-promise'
import navigation from '@/components/navigation'
import box from '@/components/box'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      id: '',
      detail: [],
      name: ''
    }
  },
  components: { navigation, box },
  mounted() {
    console.log('squareHeight', this.squareHeight)
  },
  computed: {
    ...mapState({
      squareHeight: state => {
        console.log('state', state)
        console.log('state.global', state.global)
        console.log(state.global.systemInfo.screenWidth - 20, 'square')
        return state.global.systemInfo.screenWidth - 20
      }
    }),
    image_index() {
      console.log(this.detail[0])
      return this.detail[0] && this.detail[0].url
    },
    image_front() {
      return this.detail[1] && this.detail[1].url
    },
    image_back() {
      return this.detail[2] && this.detail[2].url
    },
    images_detail() {
      const modal = this.detail.slice(3, 6)

      return modal.length > 0 ? modal.map(i => i.url) : []
    }
    // images_detail() {
    //   const modal = this.detail.slice(6, 9)
    //   return modal.length > 0 ? modal.map(i => i.url) : []
    // }
  },
  onShareAppMessage() {
    return {
      title: this.name,
      // path: `/pages/share/index?products=${JSON.stringify(this.likeList)}`,
      imageUrl: '/static/assets/cover.jpg'
    }
  },
  methods: {
    async getDetail(id) {
      const res = await Vue.iBox.http(`getProducts/${id}`)()
      this.name = res.name
      this.detail = res.detail
      console.log(this.detail)
    },
    async getImagePreview(current) {
      try {
        wxp.previewImage({
          current,
          urls: this.detail.map(d => d.url)
        })
      } catch (e) {
        // do nothing...
      }
    }
  },
  onLoad(o) {
    this.id = parseInt(o.id, 10)
    this.getDetail(o.id)
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/var';
.container {
  position: absolute;
  background: $secondaryBackgroundColor;
  width: 100%;
  height: 100%;
}
.content-wrapper {
  background: $secondaryBackgroundColor;
  width: 100%;
  padding: 20px 10px;
}
.image {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
.image-wrap {
  position: relative;
  width: 100%;
  height: auto;
  .corner {
    width: 100%;
    height: auto;
  }
  .image-corner {
    position: absolute;
    top: 0;
  }
  .image-left-corner {
    width: 35%;
    left: 0;
  }
  .image-right-corner {
    right: 0;
    width: 35%;
  }
}
</style>


