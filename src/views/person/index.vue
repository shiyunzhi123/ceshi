<template>
  <div class="person-container">
    <div class="setting-title">
      <div class="path">个人信息修改</div>

      <div class="person-box">
        <el-form size="mini" label-width="80px" :model="charForm" ref="ruleForm">
          <el-form-item label="用户名" prop="realName">
            <el-input style="width:20%;" v-model="charForm.realName"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="username">
            <el-input style="width:20%;" v-model="charForm.username"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="mobile">
            <el-input style="width:20%;" v-model="charForm.mobile"></el-input>
          </el-form-item>

          <el-form-item label="原密码" prop="email">
            <el-input style="width:20%;" v-model="charForm.email"></el-input>
          </el-form-item>

          <el-form-item label="新密码" prop="email">
            <el-input style="width:20%;" v-model="charForm.email"></el-input>
          </el-form-item>

          <el-form-item label="密码确认" prop="email">
            <el-input style="width:20%;" v-model="charForm.email"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="charForm.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      charForm: {
        email: "",
        mobile: "",
        realName: "",
        sex: "",
        username: "",
        companyId: ""
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.setting-title {
  margin-left: 15px;
  margin-top: 20px;
}

.path {
  margin-left: 20px;
  font-size: 15px;
  line-height: 1em;
  margin: 0 0 10px;
  padding: 0 0 0 10px;
  position: relative;
  &::before {
    position: absolute;
    top: 2px;
    left: 0;
    width: 3px;
    height: 12px;
    background: #6d8dfc;
    border-radius: 2px;
    content: "";
  }
}

.person-box{
  margin-left: 50px;
  margin-top: 20px;
}
</style>
