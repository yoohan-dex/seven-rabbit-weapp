<template>
  <div class="category-container">
    <div :class="['item', 'category', {'item-selected': idx === selected}]" v-for="(category, idx) in categories" @click="handleClick(category, idx)" :key="idx">
      {{category.name}}</div>

  </div>
</template>
<script>
export default {
  props: ['categories', 'onSelect'],
  data() {
    return {
      selected: 0
    }
  },
  methods: {
    handleClick(category, idx) {
      this.onSelect(category)
      this.selected = idx
    }
  },
  created() {
    console.log(this.categories)
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/var';
// .indicator {
//   position: absolute;
//   width: 100%;
//   top: 0;
//   height: 35px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   -webkit-transition: all 1s;
//   transition: transform 1s;
//   transform: translateY(0px);
//   .indicator-line {
//     width: 80%;
//     height: 3px;
//     background: linear-gradient(
//       45deg,
//       rgba(157, 104, 238, 1) 0%,
//       rgba(226, 53, 157, 1) 100%
//     );
//   }
// }
.category-container {
  position: relative;
  padding: 10px 3px 0;
}
.item {
  position: relative;
  z-index: 1;
  margin: 0 0 6px;
}
.category {
  background: $primaryLightColor;
  width: 100%;
  padding: 5px 3px;
  color: $primaryColor;
  font-size: 12px;
  text-align: center;
  border: 1px solid rgba(157, 104, 238, 0);
  transition: 0.5s ease;
  // box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
}
.item-selected {
  // border: 1px solid rgba(157, 104, 238, 1) !important;
  // background: $brandColor;
  // box-shadow: 0 4px 10px $brandColor;
  color: $brandColor;
}
</style>

