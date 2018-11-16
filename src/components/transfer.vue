<template>
  <div class="transfer-container">
    <button class="transfer">
      <image src="/static/assets/icons/transfer.svg"></image>
    </button>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
@import '../styles/var';
.transfer-container {
  position: absolute;
  right: 15px;
  bottom: 45px;
}
.transfer {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  background: $primaryGradientColor;
  box-shadow: 0 0 20px rgba(157, 104, 238, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  image {
    width: 30px;
    height: 30px;
  }
}
</style>


