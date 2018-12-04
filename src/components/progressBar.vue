<template>
  <div class="progress-container">
    <div class="progress-status">
      <div class="progress-icon" v-for="(item, idx) in progressIcons" :key="idx">
        <image class="icon" v-if="(order.progress /2) > idx" :src="'/static/assets/icons/' + progressIcons[idx].active + '.svg'"></image>
        <image class="icon" v-else :src="'/static/assets/icons/' + progressIcons[idx].default + '.svg'"></image>
        <div class="icon-text" :style="{color: (order.progress / 2) > idx ? '#78a4fa' : '#A0A0A0'}">{{progressText[idx * 2 + 1]}}</div>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-finish-bar" :style="{width: order.progress* 10 + '%'}">
        <div class="progress-finish-bar-ball" v-if="order.progress !== 0 && order.progress !== 10"></div>
      </div>
    </div>
    <div class="progress-detail">
      {{order.progress === 10 ? '' : '当前进度为'}} {{progressText[order.progress]}}{{order.progress % 2 === 1 ? '中' : ''}}
    </div>
    <div class="controll-bar" v-if="allowControll && order.status === 2">
      <div :class="['issue-panel', {'issue-panel-show': issuePanelShow}]">
        <div class="issue-list gutter">
          <div :class="['issue-item', {'issue-item-selected': item.id === reasonId}]" v-for="(item, i) in issueReason" :key="i" @click="handleReasonSelect(item.id)">{{item.content}}</div>
        </div>
        <div class="form gutter">
          <input :value="reason" type="text" @input="handleReasonInput" class="input" placeholder="售后原因" placeholder-style="color: #C0C0C0" confirm-type="done">
        </div>
        <div class="controll-bar">
          <div class="default-btn" @click="cancelReasonIssue">取消</div>
          <div class="primary-btn" @click="confirmReasonIssue">提交</div>
        </div>
      </div>
      <div class="warn-btn" @click="toggleIssuePanelShow">出现售后问题</div>
      <div class="primary-btn" @click="handleFinish">完成这个订单</div>
    </div>
    <div class="controll-bar" v-if="allowControll && order.status === 4">
      <div class="primary-btn block" @click="handleFinish">售后问题解决，完成这个订单</div>
    </div>
    <div class="express-status" v-if="order.progress=== 10">
      <div class="express-list">
        <div class="express-state">{{expressState}}</div>
        <div class="express-item" v-if="expressData" v-for="(item, idx) in expressShowData" :key="idx">
          <div class="express-context">{{item.context}}</div>
          <div class="express-time">{{item.time}}</div>
        </div>
        <div class="showAll" v-if="expressData" @click="toggleAllExpressData">{{showAll ? '收起' : '显示所有快递信息'}}</div>
        <div class="showAll" v-if="expressError">快递信息：{{expressError}}</div>
        <spin :loading="pending"></spin>
      </div>
    </div>
    <div class="controll-bar" v-if="allowControll && order.progress !== 10">
      <div class="default-btn" @click="backStep" v-if="order.progress !== 0">撤回到{{progressText[order.progress - 1]}}</div>
      <div @click="nextStep" :class="['primary-btn', {block: order.progress === 0}]">{{order.progress % 2 === 1 ? progressText[order.progress + 1] : '开始' + progressText[order.progress + 1]}}</div>
    </div>

    <div class="controll-bar" v-if="allowControll && order.progress === 10">
      <div class="default-btn" @click="selectExpress">{{express}}快递</div>
      <div class="primary-btn" @click="scanBarCode">点击扫码录入快递单号</div>
    </div>
  </div>
</template>
<script>
import wxp from 'minapp-api-promise'
import spin from './spin'
const expressState = [
  '在途中',
  '已揽收',
  '疑难',
  '已签收',
  '退签',
  '同城派送中',
  '退回',
  '转单'
]
export default {
  props: [
    'order',
    'allowControll',
    'nextStep',
    'backStep',
    'commitExpress',
    'expressData',
    'pending',
    'getIssueReason',
    'setIssueReason',
    'handleFinish',
    'expressError'
  ],
  name: 'progressBar',
  components: { spin },
  data() {
    return {
      reason: '',
      reasonId: '',
      showAll: false,
      issuePanelShow: false,
      issueReason: [],
      progressText: [
        '等待开工',
        '裁片',
        '裁片完成',
        '印花',
        '印花完成',
        '车衣',
        '车衣完成',
        '后整',
        '后整完成',
        '发货',
        '已发货'
      ],
      progressIcons: [
        { active: 'cutting', default: 'cutting-black' },
        { active: 'printing', default: 'printing-black' },
        { active: 'refine', default: 'refine-black' },
        { active: 'zipping', default: 'zipping-black' },
        { active: 'express', default: 'express-black' }
      ],
      express: '顺丰'
    }
  },
  computed: {
    expressState() {
      return expressState[this.expressData.state]
    },
    expressShowData() {
      return this.expressData
        ? this.showAll
          ? this.expressData.data
          : this.expressData.data.slice(0, 3)
        : []
    }
  },
  watch: {
    async issuePanelShow(panelShow) {
      if (panelShow) {
        const reasons = await this.getIssueReason()
        this.issueReason = reasons
      }
    }
  },
  methods: {
    toggleAllExpressData() {
      this.showAll = !this.showAll
    },
    toggleIssuePanelShow() {
      this.issuePanelShow = !this.issuePanelShow
    },
    handleReasonSelect(id) {
      this.reasonId = id
    },
    handleReasonInput(e) {
      const { value } = e.mp.detail
      this.reason = value
    },
    confirmReasonIssue() {
      this.setIssueReason({
        reasonId: this.reasonId ? parseInt(this.reasonId, 10) : undefined,
        reason: this.reason
      })
      this.issuePanelShow = false
    },
    cancelReasonIssue() {
      this.reasonId = ''
      this.reason = ''
      this.issuePanelShow = false
    },
    async scanBarCode() {
      try {
        const { result } = await wxp.scanCode({ scanType: ['barCode'] })
        console.log('result: ', result)
        try {
          this.commitExpress({ expressType: this.express, expressNum: result })
        } catch (e) {
          console.log('e', e)
        }
      } catch (e) {
        console.log('e', e)
      }
    },
    async selectExpress() {
      const itemList = ['德邦', '顺丰', '韵达']

      const { tapIndex } = await wxp.showActionSheet({
        itemList
      })
      this.express = itemList[tapIndex]
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/var';

.progress-status {
  padding: 5px 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.icon {
  width: 28px;
  height: 28px;
}
.icon-text {
  font-size: 12px;
  color: $brandColor;
  font-weight: bold;
}
.progress-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 5px;
  background: $primaryFontColor;
  border-radius: 2.5px;
}
.progress-finish-bar {
  width: 0;
  position: relative;
  height: 5px;
  background: lighten($brandColor, 10);
  border-radius: 2.5px;
  transition: width 0.5s ease;
}
.progress-finish-bar-ball {
  position: absolute;
  right: -8px;
  top: -1px;
  width: 20px;
  height: 7px;
  border-radius: 10px/3.5px;
  background: lighten($brandColor, 10);
  box-shadow: 0 0 20px $brandColor;
  // box-shadow: 0 0 20px $brandColor;
}
.progress-detail {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  color: $brandColor;
  text-align: center;
  font-weight: bold;
}
.controll-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  padding-left: 3px;
  .default-btn,
  .warn-btn,
  .primary-btn {
    z-index: 3;
  }
  .default-btn {
    flex-basis: 38%;
    background: $lighterColor;
  }
  .warn-btn {
    flex-basis: 38%;
  }
  .primary-btn {
    flex-basis: 58%;
  }
  .block {
    flex-basis: 100% !important;
  }
}

.express-status {
  padding: 5px 0;
  color: $secondaryFontColor;
  font-size: 14px;
}
.express-state {
  color: $brandColor;
  font-weight: bold;
  font-size: 16px;
  padding: 0 0 5px 5px;
}
.express-item {
  padding: 5px 0;
}
.showAll {
  color: $brandColor;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  padding-bottom: 15px;
  padding-top: 5px;
}
.express-time {
  margin-top: 5px;
  font-size: 14px;
  color: $tagColor;
  font-weight: lighter;
  padding: 0 0 0 5px;
}
.express-context {
  color: $tagColor;
  padding: 0 0 0 5px;
  font-weight: bold;
}

.issue-panel {
  position: absolute;
  padding: 5px;
  bottom: 60px;
  width: 300px;
  max-height: 300px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 1;
}
.issue-panel-show {
  opacity: 1;
  transform: translateY(0);
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
  font-size: 14px;
}
.gutter {
  margin-bottom: 10px;
}

.issue-item {
  color: $tagColor;
  font-size: 14px;
  padding: 4px 10px;
  background: white;
  border-radius: 3px;
  margin: 2px 0;
}
.issue-item-selected {
  background: $brandColor;
  color: white;
}
</style>

