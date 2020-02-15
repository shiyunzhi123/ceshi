<template>
  <div class="attract">
    <div class="sidebar">
      <exercise-sidebar />
    </div>
    <div class="container">
      <h3 class="tit">我的应用</h3>
      <ul class="block">
        <li class="app1" @click="handleGoto('/exercise/commission')">
          佣金政策
          <small>可根据房源设置灵活多样的佣金政策</small>
        </li>
        <li class="app2" @click="handleGoto('/exercise/attract')">
          经纪人活动
          <small>可根据房源设置灵活多样的经纪人活动</small>
        </li>
        <li class="app3">
          短信营销
          <small>可根据房源设置灵活多样的短信营销</small>
        </li>
      </ul>

      <h3 class="tit">推荐应用</h3>
      <ul class="block">
        <li class="app4">
          楼盘官网
          <small>品效合一， 夺回你的客户，展现你的优势</small>
        </li>
        <li class="app5">
          关键词包年
          <small>可根据房源设置灵活多样的佣金政策</small>
        </li>
        <li class="app6">
          百度小程序
          <small>可根据房源设置灵活多样的短信营销</small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import exerciseSidebar from './components/exerciseSidebar'
export default {
  name: 'Attract',
  components: { exerciseSidebar },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    handleGoto(path) {
      this.$router.push({ path: path })
    }
  }
}
</script>

<style lang="scss" scoped>
.attract {
  position: relative; width: 100%; min-height: calc(100vh - 68px); background: #fafafa;
  margin: 0;
  .sidebar {
    // position: fixed; left: 50px; top: 50px; bottom: 0;
    min-height: calc(100vh - 70px);
    float: left;
    width: 130px; padding: 15px 10px 15px 15px; box-sizing: border-box;
    border-right: 1px solid #EEE;
    background: #FFF;
  }
  .container {
    margin: 12px 0 0 140px; padding: 20px; box-sizing: border-box;
    // min-height: calc(100vh - 70px);
    background: #FFF; border: 1px solid #EEE; border-radius: 3px;
    .tit {font-size: 14px; margin: 0 .9% 10px;}
    .block {
      display: block; margin: 0; padding: 0; overflow: hidden;
      &>* {
        float: left; width: 31%; margin: 0 .9% 20px; padding: 35px 0 0 95px;
        background: #fafafa; border-radius: 3px; height: 118px;
        background-position: 30px center;
        background-repeat: no-repeat;
        background-size: 54px 54px;
        box-sizing: border-box; list-style: none; color: #454545;
        font-size: 16px; line-height: 1.5em; cursor: pointer;
        small {display: block; font-size: 12px; color: #868686;}
        &.app1 {background-image: url('../../assets/images/icon/attract-01.png');}
        &.app2 {background-image: url('../../assets/images/icon/attract-02.png');}
        &.app3 {background-image: url('../../assets/images/icon/attract-03.png');}
        &.app4 {background-image: url('../../assets/images/icon/attract-04.png');}
        &.app5 {background-image: url('../../assets/images/icon/attract-05.png');}
        &.app6 {background-image: url('../../assets/images/icon/attract-06.png');}
      }
    }
  }
}
</style>
