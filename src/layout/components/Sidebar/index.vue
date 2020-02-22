<template>
  <div class="sidebar" :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :title="route.title"
        />
      </el-menu>
    </el-scrollbar>
    <ul class="sidebar-bottom">
      <li class="item" @click="setting">
        <svg-icon icon-class="setting" />
      </li>
      <li class="item">
        <svg-icon icon-class="message" />
      </li>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <li class="item name">{{this.charForm.realName | formatName}}</li>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <span @click="persronSet" style="display:block;">个人设置</span>
          </el-dropdown-item>

          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </ul>

    <el-dialog
      title="个人信息修改"
      :visible.sync="dialogPersonShow"
      width="25%"
      :before-close="dialogPersonClose"
      :modal="false"
    >
      <el-form size="mini" label-width="80px" :model="charForm" ref="charForm" :rules="rules">
        <el-form-item label="用户名" prop="username" disabled="true">{{charForm.username}}</el-form-item>

        <el-form-item label="真实姓名" prop="realName">
          <el-input style="width:80%;" v-model="charForm.realName"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input style="width:80%;" v-model="charForm.mobile"></el-input>
        </el-form-item>

        <el-form-item
          label="邮箱"
          prop="email"
          :rules="[
      {  message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]"
        >
          <el-input style="width:80%;" v-model="charForm.email"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="charForm.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="tableTitle">
          <span class="midText">密码修改</span>
        </div>

        <el-form-item label="原密码" prop="oldPassword">
          <el-input style="width:80%;" type="password" v-model="charForm.oldPassword"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            style="width:80%;"
            type="password"
            autocomplete="off"
            v-model="charForm.newPassword"
            maxlength="18"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码确认" prop="secondPassword">
          <el-input
            style="width:80%;"
            type="password"
            v-model="charForm.secondPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogPersonShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handeldPersonSumbit('charForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import { userUpdate, spaceCustomerInfo } from "@/api/space";
import { userCustomerInfo } from "@/api/user";

export default {
  components: { SidebarItem, Logo },
  data() {
    var checkphone = (rule, value, callback) => {
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value == "") {
        callback(new Error("请输入手机号"));
      } else if (!this.isCellPhone(value)) {
        //引入methods中封装的检查手机格式的方法
        callback(new Error("请输入正确的手机号!"));
      } else {
        callback();
      }
    };

    var validatePass = (rule, value, callback) => {
      var phoneTest = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!phoneTest.test(this.charForm.newPassword)) {
        callback(new Error("包含数字、字母两种，且密码位数为6-16位"));
      } else {
        if (this.charForm.secondPassword !== "") {
          this.$refs.charForm.validateField("secondPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.charForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogPersonShow: false,
      info: "",
      secondPassword: "",
      charForm: {
        email: "",
        mobile: "",
        oldPassword: "",
        newPassword: "",
        sex: "",
        username: "",
        companyId: "",
        realName: "",
        userId: "",
        secondPassword: ""
      },
      rules: {
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        secondPassword: [{ validator: validatePass2, trigger: "blur" }],
        mobile: [{ validator: checkphone, trigger: "blur" }]
      }
    };
  },
  filters: {
    formatName: function(value) {
      return value.substr(0, 1);
    }
  },

  mounted() {
    this.bus.$on("openMenu", msg => {
      this.charForm.companyId = msg;
      console.log(this.charForm.companyId);
    });
  },
  computed: {
    ...mapGetters(["sidebar", "name"]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    },

    async logout() {
      await this.$store.dispatch("user/resetToken").then(() => {
        location.reload();
      });
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },

    persronSet() {
      this.dialogPersonShow = true;

      spaceCustomerInfo().then(res => {
        this.charForm.username = res.data.username;
        this.charForm.realName = res.data.realName;
        this.charForm.sex = res.data.sex;
        this.charForm.mobile = res.data.mobile;
        this.charForm.userId = res.data.userId;
        this.charForm.email = res.data.email;
      });
    },

    getCustomerInfo() {
      spaceCustomerInfo().then(res => {
        this.charForm.realName = res.data.realName;
      });
    },

    handeldPersonSumbit(charForm) {
      //       userUpdate(this.charForm).then(res=>{
      //     if(res.code = 200){
      //       this.$message.success("修改成功！");
      //     }

      this.$refs[charForm].validate(valid => {
        if (valid) {
          this.dialogPersonShow = false;

          delete this.charForm.secondPassword;

          userUpdate(this.charForm).then(res => {
            if ((res.code = 200)) {
              this.$message.success("修改成功！");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    dialogPersonClose() {
      this.dialogPersonShow = false;
    },
    setting() {
      this.$router.push("/setting/index");
    }
  },

  created() {
    this.getCustomerInfo();
  }
};
</script>
<style lang="scss" scoped>
.tableTitle {
  margin-bottom: 20px;
  position: relative;
  margin: 30px auto;

  width: 90%;
  height: 1px;
  background-color: #d4d4d4;
  text-align: center;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
}
.midText {
  position: absolute;
  left: 50%;
  background-color: #ffffff;
  padding: 0 15px;
  transform: translateX(-50%) translateY(-50%);
}

/deep/ .el-dropdown-menu {
  overflow: visible;
}

.user-dropdown {
  overflow: visible;
}
</style>

