<template>
  <div>
    <navigation :name="'绑定手机'"></navigation>
    <div class="bind-phone-container">
      <div class="form">
        <input :value="phone" @input="handleInput" class="input" placeholder="请输入手机号" type="number" placeholder-class="input-placeholder" placeholder-style="color: #C0C0C0" confirm-type="done">
        </input>
      </div>
      <div class="ops">
        <!-- <button class="get-phone default-btn" open-type="getBindPhoneCode" @getphonenumber="handleGetphone">获取当前微信手机号</button> -->
        <div class="form gutter">
          <input :value="code" type="number" @input="handleCodeInput" class="input" placeholder="验证码" placeholder-style="color: #C0C0C0" confirm-type="done">
        </div>
        <button class="confirm default-btn" @click="handleGetBindPhoneCode">{{getSmsCodeText}}</button>
      </div>
      <div class="ops">
        <button class="gutter wechat-btn" open-type="getPhoneNumber" @getphonenumber="handleGetphone">直接绑定当前微信手机号</button>
        <button class="confirm primary-btn" @click="handleSavePhone">确认绑定</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import navigation from '../../components/navigation'
export default {
  data() {
    return {
      phone: '',
      code: '',
      waitTime: 0
    }
  },
  components: {
    navigation
  },
  computed: {
    getSmsCodeText() {
      if (this.waitTime === 0) return '获取验证码'
      setTimeout(() => {
        this.waitTime -= 1
      }, 1000)
      return `${this.waitTime}秒后可再次获取`
    }
  },
  methods: {
    ...mapActions('global', ['decryptPhone', 'savePhone', 'getBindPhoneCode']),
    async handleGetphone(e) {
      const { encryptedData, iv } = e.mp.detail
      const phone = await this.decryptPhone({ encryptedData, iv })
      this.handleSavePhone(phone)
    },
    checkPhone(phone) {
      console.log('phone: ', phone, phone.length, typeof phone)

      if (phone.length !== 11) {
        wx.showModal({
          title: '手机输入有误',
          content: '请检查手机号是否正确',
          showCancel: false,
          confirmColor: '#78a4fa'
        })
        return false
      }
      return true
    },
    async handleGetBindPhoneCode() {
      if (this.waitTime !== 0) return
      if (!this.checkPhone(this.phone)) return
      await this.getBindPhoneCode({ phone: this.phone })
      this.waitTime = 30
    },
    async handleSavePhone() {
      this.commitSavePhone()
    },
    async commitSavePhone(value) {
      if (!this.checkPhone(value || this.phone)) return
      await this.savePhone({
        phone: value || this.phone,
        code: this.code,
        isWechat: !!value
      })
      wx.showModal({
        title: '操作成功',
        content: '手机绑定完成，现在您可以实时跟踪到订单信息了',
        showCancel: false,
        confirmColor: '#78a4fa',
        success(res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    },
    handleInput(e) {
      const { value } = e.mp.detail
      this.phone = value
    },
    handleCodeInput(e) {
      const { value } = e.mp.detail
      this.code = value
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/var';

.bind-phone-container {
  width: 100%;
  height: 100%;
  padding: 10px;
}

.form {
  padding: 0 15px;
  width: 100%;
  border-radius: 5px;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: $inputColor;
  display: flex;
}
.input {
  width: 100%;
  height: 45px;
  color: $brandColor;
  font-size: 16px;
}
.input-placeholder {
  color: red;
}

.ops {
  padding-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gutter {
  flex-basis: 60%;
  margin-right: 10px;
}
.confirm {
  flex-basis: 40%;
}
</style>


