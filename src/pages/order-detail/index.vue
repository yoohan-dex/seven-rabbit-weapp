<template>
  <div scroll-y :class="['container', {'sp-container': isX}]">
    <navigation :name="'订单详情'" :float="true" :shadow="true"></navigation>
    <scroll-view scroll-y class="order-detail-container" v-if="orderDetail">
      <div class="order-status">
        {{status[orderDetail.status]}}
      </div>
      <div class="issue-status" v-if="orderDetail.status === 4">
        <div class="title">售后问题</div>
        <div class="plain-text">{{orderDetail.issueReason[0].content}}</div>
      </div>
      <div class="order-number" v-if="allowControll">
        <div class="title">订单编号</div>
        <div class="plain-text">{{orderDetail.orderNum}}</div>
      </div>
      <div class="progress-wrap">
        <div class="title">工厂进度</div>
        <progressBar v-if="orderDetail" :order="orderDetail" :allowControll="allowControll" :nextStep="handleNextStep" :backStep="handleBackStep" :commitExpress="commitExpress" :pending="expressPending" :expressData="express" :getIssueReason="getIssueReason" :setIssueReason="handleSetIssue" :handleFinish="handleFinishOrder" :expressError="expressError"></progressBar>
      </div>
      <div class="payment-status" v-if="admin">
        <div class="title">收款控制</div>
        <div class="plain-text">当前{{paymentStatus[orderDetail.paymentStatus]}}</div>
        <div class="form-wrap">
          <div class="primary-btn block-btn" v-if="orderDetail.paymentStatus === 0" @click="handlePaymentStatus(1)">已收半款</div>
          <div class="primary-btn block-btn" v-if="orderDetail.paymentStatus === 1" @click="handlePaymentStatus(2)">已收全款</div>
        </div>
      </div>
      <div class=" cost-input" v-if="admin && orderDetail.paymentStatus > 0 ">
        <div class="title">成本填写</div>
        <div class="form-wrap">
          <div class="form">
            <input :value="adultNum" @confirm="handleAdultNumConfirm" class="input" placeholder="成人件数" type="number" placeholder-class="input-placeholder" placeholder-style="color: #C0C0C0" confirm-type="next">
            </input>
          </div>
          <!-- <div :class="['confirm-btn', {'confirm-disabled': costDisable}]" @click="handleCostConfirm">确认</div> -->
          <div class="form">
            <input :value="adultCost" @confirm="handleAdultCostConfirm" :focus="adultCostFocus" class="input" placeholder="填写单件成本" type="number" placeholder-class="input-placeholder" placeholder-style="color: #C0C0C0" confirm-type="done">
            </input>
          </div>
        </div>
        <div class="form-wrap" v-if="admin">
          <div class="form">
            <input :value="childNum" @confirm="handleChildNumConfirm" class="input" placeholder="儿童件数" type="number" placeholder-class="input-placeholder" placeholder-style="color: #C0C0C0" confirm-type="next">
            </input>
          </div>
          <!-- <div :class="['confirm-btn', {'confirm-disabled': costDisable}]" @click="handleCostConfirm">确认</div> -->
          <div class="form">
            <input :value="childCost" @confirm="handleChildCostConfirm" :focus="childCostFocus" class="input" placeholder="填写单件成本" type="number" placeholder-class="input-placeholder" placeholder-style="color: #C0C0C0" confirm-type="done">
            </input>
          </div>
        </div>
      </div>
      <div class="company">
        <div class="title">订购公司</div>
        <div class="plain-text">{{orderDetail.clientCompany}}</div>
      </div>
      <div class="material">
        <div class="title">面料</div>
        <div class="plain-text">{{orderDetail.material}}</div>
      </div>
      <div class="detail">
        <div class="title">车衣</div>
        <div class="plain-text">{{orderDetail.detail}}</div>
      </div>
      <div class="size">
        <div class="title">尺码和数量</div>
        <div class="size-wrap">
          <div class="size-items" v-for="(items, idx) in orderDetail.content" :key="idx">
            <div class="size-color">{{items.color}}</div>
            <div class="block">
              <div v-for="(item, i) in items.content" class="size-item" :key="i">
                <div class="size-text">{{item.size}}</div>
                <div class="size-count">{{item.count}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="totalNum">
        <div class="title">总件数</div>
        <div class="plain-text">{{orderDetail.totalNum}}</div>
      </div>
      <div class="price">
        <div class="title">单价</div>
        <div class="plain-text">{{orderDetail.price}}</div>
      </div>
      <div class="cost" v-if="admin && orderDetail.cost">
        <div class="title">单件成本</div>
        <div class="plain-text">成人: {{orderDetail.adultCost}} | 儿童: {{orderDetail.childCost}}</div>
      </div>
      <div class="profit" v-if="admin && orderDetail.profit">
        <div class="title">整单利润</div>
        <div class="plain-text">{{orderDetail.profit}}</div>
      </div>
      <div class="total">
        <div class="title">总价</div>
        <div class="plain-text">{{orderDetail.total}}</div>
      </div>
      <div class="cover">
        <div class="title">效果图</div>
        <image mode="widthFix" class="cover-image" v-for="(image, key) in orderDetail.images" :src="image.url" :key="key"></image>
      </div>
      <div class="remark">
        <div class="title">特别备注</div>
        <div class="plain-text">{{orderDetail.remark}}</div>
      </div>
    </scroll-view>
    <spin :loading="!orderDetail"></spin>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import qs from 'qs'
import wxp from 'minapp-api-promise'
import navigation from '../../components/navigation'
import progressBar from '../../components/progressBar'
import spin from '../../components/spin'

export default {
  data() {
    return {
      id: '',
      paymentStatus: ['未确认收款', '已收半款', '已收全款'],
      status: ['生产中', '生产中', '已发货', '已完成订单', '售后中', '售后问题解决，订单已完成'],
      role: '',
      totalNum: '',
      adultNum: '',
      adultCost: '',
      childNum: '',
      childCost: '',
      costDisable: true,
      adultCostFocus: false,
      childCostFocus: false
    }
  },
  components: {
    navigation,
    spin,
    progressBar
  },
  computed: {
    ...mapState('orders', ['orderDetail', 'expressPending', 'express', 'expressError']),
    ...mapState('global', ['isX']),
    allowControll() {
      return this.role && (this.role === 'admin' || this.role === 'operator')
    },
    admin() {
      return this.role === 'admin'
    }
  },
  methods: {
    ...mapMutations('orders', ['clear']),
    ...mapActions('orders', [
      'getDetail',
      'nextStep',
      'backStep',
      'setCost',
      'commitExpress',
      'checkExpress',
      'setPaymentStatus',
      'getIssueReason',
      'setIssus',
      'finishOrder'
    ]),
    handleNextStep() {
      this.nextStep(this.id)
    },
    handleBackStep() {
      this.backStep(this.id)
    },
    handleSetIssue({ reason, reasonId }) {
      console.log('reason', reason)
      this.setIssus({
        id: parseInt(this.id, 10),
        reason,
        reasonId
      })
    },
    handleFinishOrder() {
      this.finishOrder({id: this.id})
    },
    handlePaymentStatus(status) {
      this.setPaymentStatus({
        orderId: this.id,
        status
      })
    },
    handleAdultNumConfirm(e) {
      const { value } = e.mp.detail
      const adultNum = parseInt(value, 10)
      console.log('ad', adultNum)
      if (!this.checkNumValue(adultNum)) return
      this.adultCostFocus = true
      this.adultNum = adultNum
      this.childNum = this.totalNum - this.adultNum
    },
    checkNumValue(value) {
      if (!value) {
        wxp.showModal({
          title: '件数输入有误',
          content: '不能为空',
          showCancel: false,
          confirmColor: '#78a4fa'
        })
        return false
      }

      if (this.totalNum - value < 0) {
        wxp.showModal({
          title: '件数输入有误',
          content: '不能超过总件数',
          showCancel: false,
          confirmColor: '#78a4fa'
        })
        return false
      }
      return true
    },
    handleAdultCostConfirm(e) {
      const { value } = e.mp.detail
      if (!value) return
      const adultCost = parseInt(value, 10)
      this.adultCost = adultCost
      this.handleAllCostConfirm()
    },
    handleChildNumConfirm(e) {
      const { value } = e.mp.detail
      const childNum = parseInt(value, 10)
      if (!this.checkNumValue(childNum)) return
      this.childNum = childNum
      this.adultNum = this.totalNum - this.childNum
      this.childCostFocus = true
    },
    handleChildCostConfirm(e) {
      const { value } = e.mp.detail
      if (!value) return
      const childCost = parseInt(value, 10)
      this.childCost = childCost
      this.handleAllCostConfirm()
    },

    handleData() {
      const {
        totalNum,
        adultNum,
        childNum,
        adultCost,
        childCost
      } = this.orderDetail
      this.totalNum = totalNum
      if (!adultNum && !childNum) {
        this.adultNum = totalNum
      } else {
        this.adultNum = adultNum || ''
      }
      this.childNum = childNum || ''
      this.adultCost = adultCost || ''
      this.childCost = childCost || ''
    },

    async handleCostConfirm() {
      if (!this.costDisable) {
        await this.setCost({
          id: parseInt(this.id, 10),
          num: parseInt(this.cost, 10)
        })
        this.costDisable = true
      }
    },

    async handleAllCostConfirm() {
      await this.setCost({
        id: parseInt(this.id, 10),
        adultNum: this.adultNum || 0,
        adultCost: this.adultCost || 0,
        childNum: this.childNum || 0,
        childCost: this.childCost || 0
      })
    },

    async handleGetDetail(id) {
      await this.getDetail(id)
      await this.checkExpress({ id })
      this.handleData()
    }
  },
  onShow() {
    if (this.id) {
      this.handleGetDetail(this.id)
    }
  },
  onLoad(info) {
    let { id, role, q } = info
    if (q) {
      const query = decodeURIComponent(q)
      const idx = query.indexOf('?')
      const newQ = query.slice(idx + 1)
      const newInfo = qs.parse(newQ)
      if (newInfo.id && newInfo.role) {
        id = newInfo.id
        role = newInfo.role
      }
    }
    console.log('info', info)
    this.id = id
    this.role = role
    // this.handleGetDetail(id)
  },
  onHide() {
    this.clear()
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/var';
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 65px;
}
.title {
  margin: 5px 10px;
  font-size: 14px;
  color: $brandColor;
  font-weight: bold;
}
.plain-text {
  font-size: 14px;
  color: $primaryColor;
  margin: 5px 10px;
  margin-bottom: 15px;
}
.order-status {
  font-size: 20px;
  color: $brandColor;
  font-weight: bold;
  padding: 8px;
}
.order-detail-container {
  height: 100%;
  width: 100%;
  padding: 10px;
  padding-top: 0;
  padding-bottom: 0;
}

.progress-wrap {
}

.cover-image {
  width: 100%;
}

.size-wrap {
  width: 100%;
  padding: 0 10px;
}
.size-color {
  display: block;
  font-size: 15px;
  font-weight: bold;
  color: $primaryColor;
}
.size-items {
  width: 100%;
  margin-bottom: 10px;
}
.size-item {
  color: $primaryColor;
  width: 20%;
  font-size: 14px;
  margin-top: 5px;

  .size-text {
    font-weight: bold;
    line-height: 1.3;
    // border-bottom: 1px solid $secondaryFontColor;
  }
  .size-count {
    margin-top: 5px;
    line-height: 1.3;
  }
}
.block {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.form-wrap {
  width: 100%;
  padding-left: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.form {
  margin: 2px;
  flex-basis: 50%;
  padding: 0px 15px;
  border-radius: 5px;
  background: $inputColor;
  display: flex;
}
.input {
  width: 100%;
  height: 40px;
  color: $primaryColor;
  font-size: 14px;
}
.confirm-btn {
  flex-basis: 48%;
  height: 40px;
  width: 100%;
  background: $brandColor;
  color: white;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  box-shadow: 0 0 10px $brandShadow;
}

.confirm-disabled {
  background: $primaryLightColor;
  color: $secondaryFontColor;
  // box-shadow: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.block-btn {
  width: 100%;
}
</style>

