<template>
  <div class="search-bar">
    <div class="form-box">
      <div class="form">
        <div class="filter">
          <div class="filter-label" @click="handleFilterClick">
            {{labelSet[label].labelText}}
          </div>
          <div :class="['filter-list', {'filter-show': showFilter}]">
            <div class="filter-item" v-for="(item, idx) in labelSet" :key="idx" @click="handleFilterSelect(idx)">
              {{item.labelText}}
            </div>
          </div>
        </div>
        <input @input="handleInput" @confirm="handleConfirm" class="input" :placeholder="placeholder" :type="labelSet[label].inputType" placeholder-class="input-placeholder" placeholder-style="color: #C0C0C0" confirm-type="search">
        </input>
      </div>
    </div>
    <div class="status-filter" v-if="statusFilter">
      <div :class="['status-filter-item', {'status-filter-item-selected': idx === status}]" v-for="(item, idx) in statusFilter" :key="idx" @click="handleStatusSelect(idx)">
        {{item}}
      </div>
    </div>
  </div>
</template>
<script>
/**
 * label: {
 *  labelText: string;
 *  inputType: string;
 * }[]
 *
 * statusFilter: {
 *  text: string;
 * }
 */
export default {
  props: ['labelSet', 'statusFilter'],
  data() {
    return {
      label: 0,
      status: 0,
      showFilter: false,
      value: ''
    }
  },
  computed: {
    placeholder() {
      return `请输入${this.labelSet[this.label].labelText}进行搜索`
    }
  },
  watch: {
    label() {
      this.handleEmit(this.value)
    }
  },
  methods: {
    handleFilterClick() {
      this.showFilter = true
    },
    handleFilterSelect(label) {
      this.showFilter = false
      this.label = label
    },
    handleStatusSelect(status) {
      this.status = status
      this.$emit('status-change', this.status)
    },
    handleConfirm(e) {
      const { value } = e.mp.detail
      this.handleEmit(value)
    },
    handleEmit(value) {
      this.value = value
      this.$emit('search-confirm', { [this.labelSet[this.label].query]: value })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/var';
.search-bar {
  position: relative;
  z-index: 100;
}
.form-box {
  padding: 5px 0;
}
.form {
  padding: 0 15px;
  width: calc(100% - 20px);
  margin: 0 10px;
  border-radius: 5px;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  background: $inputColor;
  justify-content: space-between;
  align-items: center;
}
.input {
  width: 100%;
  height: 45px;
  color: $primaryColor;
  font-size: 16px;
  flex-basis: 78%;
}

.filter {
  position: relative;
  flex-basis: 20%;
  color: $secondaryFontColor;
  font-size: 15px;
}

.filter-label {
  position: relative;
  color: $brandColor;
  height: 100%;
  font-weight: bold;
}
.filter-list {
  position: absolute;
  top: -17.5px;
  left: -14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 14px;
  background: white;
  transition: all 0.3s ease;
  transform: scale(0);
  transform-origin: 30px 30px;
}
.filter-show {
  transform: scale(1);
}
.filter-item {
  padding: 5px 0px;
  // background: white;
}

.status-filter {
  padding: 0 10px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}
.status-filter-item {
  font-weight: bold;
  font-size: 14px;
  height: 30px;
  border-radius: 5px;
  padding: 0 10px;
  color: $primaryColor;
  display: flex;
  align-items: center;
}
.status-filter-item-selected {
  background: $brandColor;
  color: white;
}
</style>


