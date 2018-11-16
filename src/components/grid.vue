<template>
  <div class="grid">
    <div class="left-row">
      <div v-if="leftRow && !loading" :class="[{item: !small}, {'item-small': small}]" v-for="(item, i) in leftRow" :key="i">
        <image mode="aspectFill" :src="item.image.url" @click="handleClick(item.id)"></image>
        <div :class="['add', 'small-icon', {'add-hidden': !item.showAdd}]" v-if="item" @click="handleAdd(item.id)">
          <image src="/static/assets/icons/favorite-outline.svg"></image>
        </div>
        <div class="name">{{item.name}}</div>
        <div class="tag" v-for="(tag, idx) in item.features" :key="idx">{{tag.name}}</div>
      </div>
    </div>
    <div class="right-row">
      <div v-if="rightRow && !loading" :class="[{item: !small}, {'item-small': small}]" v-for="(item, i) in rightRow" :key="i">
        <image mode="aspectFill" :src="item.image.url" @click="handleClick(item.id)"></image>
        <div :class="['add', 'small-icon', {'add-hidden': !item.showAdd}]" v-if="item" @click="handleAdd(item.id)">
          <image src="/static/assets/icons/favorite-outline.svg"></image>
        </div>
        <div class="name">{{item.name}}</div>
        <div class="tag" v-for="(tag, idx) in item.features" :key="idx">{{tag.name}}</div>
      </div>
    </div>
    <div v-if="empty && got" class="abnor">
      <p>没有这类产品 请尝试重新选择筛选项</p>
    </div>
    <spin :loading="loading"></spin>
  </div>
</template>

<script>
import spin from './spin'
export default {
  props: ['items', 'small', 'got', 'loading', 'appending'],
  components: { spin },
  computed: {
    empty() {
      return this.items.length < 1
    },
    leftRow() {
      return this.items.reduce(
        (pre, item, i) => (i % 2 === 0 ? [...pre, item] : pre),
        []
      )
    },
    rightRow() {
      return this.items.reduce(
        (pre, item, i) => (i % 2 !== 0 ? [...pre, item] : pre),
        []
      )
    }
  },
  methods: {
    handleClick(id) {
      this.$emit('grid-click', id)
    },
    handleAdd(id) {
      this.$emit('item-add', id)
    }
  }
}
</script>
<style  lang="scss" scoped>
@import '../styles/var';
.name {
  color: $primaryColor;
  font-size: 14px;
  font-weight: bold;
}
* {
  box-sizing: border-box;
}
.grid {
  width: calc(100% - 8px);
  height: 100%;
  position: relative;
  left: 4px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.right-row,
.left-row {
  width: 50%;
  padding-top: 5px;
}

.left-row {
}

.right-row {
}

.item {
  width: 177px;
  height: 177px;
  margin: 0 0 5px 0;
}
.item,
.item-small {
  position: relative;
}

.item-small {
  width: 144px;
  // height: 144px;
  margin: 0 0 4px 0;
  padding: 5px;
  border-radius: 5px;
  // background: $primaryCardColor;
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  // background-image: url(https://seven-rabbit-1257083357.cos.ap-guangzhou.myqcloud.com/framework/grid.png);
  // float: left;
}

.item image,
.item-small image {
  width: 134px;
  height: 134px;
  border-radius: 5px;
}
.add {
  position: absolute;
  top: 100px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: $brandColor;
  box-shadow: 0 0 20px $brandColor;
  transition: transform 0.3s ease;
  transform: scale(1);
}
.add-hidden {
  transform: scale(0);
}
.small-icon {
  display: flex;
  justify-content: center;
  align-items: center;

  image {
    width: 20px;
    height: 20px;
  }
}
.abnor {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  p {
    position: relative;
    color: $tagColor;
    font-size: 16px;
  }
}

.tag {
  display: inline-block;
  color: $tagColor;
  // background: $primaryLightColor;
  font-size: 10px;
  padding: 3px 7px 3px 0;
  // margin-right: 3px;
  // margin-bottom: 2px;
  border-radius: 12px;
}
</style>

