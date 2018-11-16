<template>
  <div class="order-admin">
    <navigation :name="'订单'"></navigation>
    <searchBar :labelSet="labelSet" :statusFilter="statusFilter" @search-confirm="handleQuery" @status-change="handleStatusChange"></searchBar>
    <div :class="['order-wrap', {'sp-order-wrap': isX}]">
      <orderList :items="allOrders" :msg=" msg || '没有订单'" :role="'admin'"></orderList>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import navigation from '../../components/navigation'
import orderList from '../../components/order-list'
import searchBar from '../../components/search-bar'

const labelSet = [
  {
    labelText: '手机号',
    query: 'clientPhone',
    inputType: 'number'
  },
  {
    labelText: '主号',
    query: 'seller',
    inputType: 'text'
  },
  {
    labelText: '单号',
    query: 'orderNum',
    inputType: 'number'
  },
  {
    labelText: '客户名',
    query: 'clientName',
    inputType: 'text'
  },
  {
    labelText: '机构名',
    query: 'clientCompany',
    inputType: 'text'
  }
]
const statusFilter = ['所有', '未收款', '未收全款', '已结单', '售后']
export default {
  data() {
    return {
      labelSet,
      statusFilter,
      query: {}
    }
  },
  computed: {
    ...mapState('orders', ['allOrders', 'msg']),
    ...mapState('global', ['isX'])
  },
  components: {
    navigation,
    searchBar,
    orderList
  },
  watch: {
    query() {
      this.handleSearch(this.query)
    }
  },
  methods: {
    ...mapActions('orders', ['search']),
    handleQuery(query) {
      let searchQuery = {
        clientPhone: '',
        clientName: '',
        clientCompany: '',
        orderNum: '',
        seller: ''
      }
      this.query = { ...this.query, ...searchQuery, ...query }
    },
    handleSearch(query = {}) {
      this.search(query)
    },
    handleStatusChange(status) {
      let statusQuery = {
        noCost: '',
        status: '',
        paymentStatus: ''
      }
      if (status === 0) {
        statusQuery = { ...statusQuery, status: '' }
      } else if (status === 1) {
        statusQuery = { ...statusQuery, paymentStatus: 0 }
      } else if (status === 2) {
        statusQuery = { ...statusQuery, paymentStatus: 1 }
      } else if (status === 3) {
        statusQuery = { ...statusQuery, noCost: true }
      } else if (status === 4) {
        statusQuery = { ...statusQuery, status: 3 }
      } else if (status === 5) {
        statusQuery = { ...statusQuery, status: 4 }
      }
      this.query = { ...this.query, ...statusQuery }
    }
  },
  onLoad() {
    this.handleQuery()
  }
}
</script>
<style lang="scss" scoped>
.order-admin {
  position: absolute;
  width: 100%;
  height: 100%;
}
.order-wrap {
  width: 100%;
  position: relative;
  height: calc(100% - 40px - 70px - 65px);
}
.sp-order-wrap {
  height: calc(100% - 40px - 70px - 105px);
}
</style>


