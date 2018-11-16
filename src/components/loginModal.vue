<template>
  <div :class="['wrap', {show: showModal}]">
    <div class="modal">
      <div class="content">
        为了获得完整的使用体验，您需要登录
      </div>

      <div class="options">
        <!-- <div class="cancel" @click="cancel">取消</div> -->
        <button open-type="getUserInfo" @getuserinfo="handleGetUserInfo">好的</button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>
<script>
export default {
  props: ['showModal', 'login', 'cancel'],
  methods: {
    handleCancel() {
      this.cancel()
    },
    handleGetUserInfo(res) {
      if (res.mp.detail) {
        const { encryptedData, iv } = res.mp.detail
        if (encryptedData && iv) {
          this.login()
          console.log('login begin')
        }
      }
    }
  }
}
</script>
<style scoped>
.wrap {
  display: none;
}
.show {
  display: block;
}
.modal {
  position: fixed;
  width: 80%;
  height: 20%;
  top: 40%;
  left: 10%;
  border-radius: 10px;
  background: white;
  font-size: 16px;
  z-index: 2;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
}
.content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60%;
  padding: 10px 20px;
  font-size: 15px;
  color: #888;
}
.options {
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cancel {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  color: #ccc;
}
button {
  width: 50%;
  background: white;
  font-size: 16px;
  color: #888;
}
button::after {
  border: 0;
}
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.3);
  animation: showing 0.3s ease;
}
@keyframes showing {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>


