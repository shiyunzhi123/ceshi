<template>
  <div class="exercise-sidebar">
    <ul class="sidebar">
      <h3 class="tit">佣金及活动</h3>
      <li class="bar" @click="handleGoto('/exercise/commission')">佣金政策</li>
      <li class="bar" @click="handleGoto('/exercise/attract')">活动管理</li>
    <!-- <h3 class="tit">渠道管理</h3>
      <li class="bar">经济公司</li>
      <li class="bar">经纪人</li>
      <li class="bar">渠道分群</li>
    <h3 class="tit">渠道分群</h3>
      <li class="bar">短信营销</li>
      <li class="bar">楼宇官网</li>
      <li class="bar">智能小程序</li>
      <li class="bar">搜索营销</li> -->
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ExerciseSidebar',
  data() {
    return {
    }
  },
  computed: {

  },
  methods: {
    handleGoto(path) {
      this.$router.push({ path: path })
    }
  }
}
</script>

<style scoped lang="scss">
.exercise-sidebar {
  .sidebar {
    display: block; margin: 0 0 20px; padding: 0; list-style: none;
    .tit {
      font-size: 14px; list-style: none; margin: 0 0 15px; padding: 0;
    }
    .bar {
      display: block; font-size: 12px; border-radius: 2px;
      padding: 6px 6px 5px; color: #686868; margin-bottom: 5px;
      cursor: pointer;
      &.on,
      &:hover {
        background: #f0f2f5;
      }
      &+.tit {padding-top: 15px;}
    }
  }
  .btn-create {
    border: 1px solid #6d8dfc; border-radius: 2px;
    padding: 5px 0; margin: 0 5px; text-align: center;
    font-size: 12px; color: #6d8dfc;
    cursor: pointer; user-select: none;
    &:hover {opacity: .8}
  }
  .dialog-custom {
    position: relative;
    z-index: 98;
  }
  .tip {color: #868686; font-size: 12px;}
}
</style>
