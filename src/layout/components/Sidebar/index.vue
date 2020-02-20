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
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" :title="route.title" />
      </el-menu>
    </el-scrollbar>
    <ul class="sidebar-bottom">
      <li class="item" @click="setting"><svg-icon icon-class="setting" /></li>
      <li class="item"><svg-icon icon-class="message" /></li>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
     
          <li class="item name">{{this.charForm.realName | formatName}}</li>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          
            <el-dropdown-item >
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
            :modal='false'
            >
       <el-form size="mini" label-width="80px" :model="charForm" ref="ruleForm">
          <el-form-item label="用户名" prop="username" disabled="true">
            <el-input style="width:80%;" v-model="charForm.username">{{info}}</el-input>
          </el-form-item>

              <el-form-item label="真实姓名" prop="realName">
            <el-input style="width:80%;" v-model="charForm.realName"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input style="width:80%;" v-model="charForm.mobile"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="mobile">
            <el-input style="width:80%;" v-model="charForm.email"></el-input>
          </el-form-item>

     
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="charForm.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>



          <div class="tableTitle"><span class="midText">密码修改</span></div>



           <el-form-item label="原密码" prop="oldPassword">
            <el-input style="width:80%;" v-model="charForm.oldPassword"></el-input>
          </el-form-item>

          <el-form-item label="新密码" prop="email">
            <el-input style="width:80%;" v-model="charForm.newPassword"></el-input>
          </el-form-item>

          <el-form-item label="密码确认" >
            <el-input style="width:80%;" v-model="secondPassword"></el-input>
          </el-form-item>
        </el-form>


        

         <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogPersonShow = false">取 消</el-button>
                <el-button size="small" type="primary" @click="handeldPersonSumbit">确 定</el-button>
              </span>
</el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import {userUpdate,spaceCustomerInfo} from '@/api/space'
import{userCustomerInfo} from '@/api/user'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      dialogPersonShow:false,
     info: '',
     secondPassword:'',
     charForm: {
        email: "",
        mobile: "",
        oldPassword:'',
        newPassword:'',
        sex: "",
        username: "",
        companyId: "",
        realName:'',
        userId:'',
        // secondPassword:""
      }
    }
  },
  filters: {
    formatName: function(value) {
      return value.substr(0, 1)
    }
  },

  mounted() {
    this.bus.$on("openMenu", msg => {
 
    this.charForm.companyId =  msg
    console.log(this.charForm.companyId)
   });

  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },

    persronSet(){
      this.dialogPersonShow  = true
      
      spaceCustomerInfo().then(res=>{
        this.charForm.username = res.data.username
        this.charForm.realName = res.data.realName 
        this.charForm.sex = res.data.sex
        this.charForm.mobile = res.data.mobile
        this.charForm.userId = res.data.userId
        this.charForm.email = res.data.email
      })
      
    },

    getCustomerInfo(){
       spaceCustomerInfo().then(res=>{
           this.charForm.realName = res.data.realName 
       })
    },

   handeldPersonSumbit(){
     this.dialogPersonShow =  false
     
     userUpdate(this.charForm).then(res=>{
        if(res.code = 200){
          this.$message.success("修改成功！");
        }
     })
    


   },

  dialogPersonClose(){
       
  },
    setting(){
      this.$router.push("/setting/index")
    },

  
   
  },

   created() {
     this.getCustomerInfo()
   },



   
}
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
</style>

