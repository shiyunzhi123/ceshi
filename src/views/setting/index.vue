<template>
  <div class="setting">
    <div class="setting-title">
      <div class="path">企业信息</div>
    </div>

    <div class="setting-container">
      <div style="margin-top:25px;padding:15px">
        <el-form label-width="140px" :model="form" ref="form" size="small">
          <el-form-item label="企业名称">
            <span class="container-text">{{company.companyName}}</span>
            <span class="container-updata" @click="companyNameUpdata">修改</span>
          </el-form-item>

          <el-form-item label="公司简称或品牌名称">
            <span class="container-text">{{company.shortName}}</span>
            <span class="container-updata" @click="companyShortUpdata">修改</span>
          </el-form-item>

          <el-form-item label="官网">
            <span class="container-text">
              <a :href="company.neturl">{{company.neturl}}</a>
            </span>
            <!-- <span class="container-updata">修改</span> -->
          </el-form-item>

          <el-form-item label="公司介绍">
            <span
              class="container-text"
            >{{company.companyProfile}}</span>
            <span class="container-updata" @click="companyIntroduce">修改</span>
          </el-form-item>

          <el-form-item label="公司logo">
            <span class="container-text">
              <div class="img-box">
              <img  :src="company.logo" alt />
              
              </div>   
            </span>
         
          </el-form-item>

          <el-form-item label="负责人">
            <span class="container-text">{{company.leader}},{{company.leaderPhone}}</span>
            <span class="container-updata" @click="companyLeade">修改</span>
          </el-form-item>
        </el-form>

        <el-dialog title="修改" :visible.sync="companyNameShow" width="360px">
          <div>
            <el-form size="mini" label-width="100px">
              <el-form-item label="公司名称">
                <el-input style="width:200px;" v-model="company.companyName"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="companyNameShow = false">取 消</el-button>
            <el-button type="primary" @click="handleCompanyNameSubmit">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="修改" :visible.sync="companyShortShow" width="400px">
          <div>
            <el-form size="mini" label-width="150px">
              <el-form-item label="公司简称或品牌名称">
                <el-input style="width:200px;" v-model="company.shortName"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="companyShortShow = false">取 消</el-button>
            <el-button type="primary" @click="handleCompanyShortSubmit">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="编辑" :visible.sync="companyIntroduceShow" width="500px">
          <div style="text-align: center;">
            <el-input type="textarea" :rows="6" v-model="company.companyProfile"></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="companyIntroduceShow = false">取 消</el-button>
            <el-button type="primary" @click="handleIntroduceSubmit">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="修改" :visible.sync="companyLeadeShow" width="350px">
          <div>
            <el-form size="mini" label-width="80px">
              <el-form-item label="负责人">
                <el-input style="width:200px;" v-model="company.leader"></el-input>
              </el-form-item>

              <el-form-item label="电话">
                <el-input style="width:200px;" v-model="company.leaderPhone"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="companyLeadeShow = false">取 消</el-button>
            <el-button type="primary" @click="handleCompanyLeadeSubmit">确 定</el-button>
          </span>
        </el-dialog>

        <!-- <el-dialog
          title="修改logo"
          :visible.sync="uploadImgShow"
          width="560px"
          :modal="false"
          :modal-append-to-body="false"
        >
          <div>
            <el-form width="278px" size="small">
              <el-form-item>
                <el-upload
                  ref="upload"
                  class="avatar-uploader"
                  action="http://39.107.15.114:8080/upload/spaceImage"
                  list-type="picture-card"
                  accept="image/*"
                  :data="resData "
                  :limit="imgLimit"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handlePicRemove"
                  :on-success="handleAvatarImgSuccess"
                  :before-upload="beforeAvatarImgUpload"
                  :on-exceed="handlePicExceed"
                  :on-error="imgUploadError"
                >
                  <i class="el-icon-plus el-icon-plus-second"></i>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="uploadImgShow = false">取 消</el-button>
            <el-button type="primary" @click="handleChangeUploadSubmit">保存</el-button>
          </span>
        </el-dialog> -->
      </div>
    </div>
  </div>
</template>

<script>
import { spaceMycompany ,spaceCompanyUpdate} from "@/api/space";

export default {
  data() {
    return {
      resData: {},

      company: {
        companyId: "",
        companyName: "",
        leaderPhone: "",
        shortName: "",
        leader: "",
        neturl: "",
        companyProfile: "",
        logo: ""
      },
      companyNameShow: false,
      companyShortShow: false,
      companyIntroduceShow: false,
      companyLeadeShow: false,
      uploadImgShow: false,

      form: {},
      imgLimit: 1
    };
  },

  methods: {
    //弹窗
    companyNameUpdata() {
      this.companyNameShow = true;
    },

    companyShortUpdata() {
      this.companyShortShow = true;
    },

    companyIntroduce() {
      this.companyIntroduceShow = true;
    },
    companyLeade() {
      this.companyLeadeShow = true;
    },
    uploadImg() {
      this.uploadImgShow = true;
    },

    handleCompanyNameSubmit() {
      this.companyNameShow = false
      spaceCompanyUpdate(this.company).then(res => {

        if(res.code = 200){
            this.$message.success("修改成功！");
        }

      });
    },
    handleCompanyShortSubmit() {
      this.companyShortShow = false;

         spaceCompanyUpdate(this.company).then(res => {

        if(res.code = 200){
            this.$message.success("修改成功！");
        }

      });
    },

    handleIntroduceSubmit() {
      this.companyIntroduceShow = false;

         spaceCompanyUpdate(this.company).then(res => {

        if(res.code = 200){
            this.$message.success("修改成功！");
        }

      });
    },
    handleCompanyLeadeSubmit() {
      this.companyLeadeShow = false;

         spaceCompanyUpdate(this.company).then(res => {

        if(res.code = 200){
            this.$message.success("修改成功！");
        }

      });
    },

    handleChangeUploadSubmit() {
      this.uploadImgShow = false;
    },

    // handlePicRemove(file, fileList) {
    //   //移除图片
    // },
    // handlePictureCardPreview(file, res) {
    //   //预览图片时调用
    // },

    // beforeAvatarImgUpload(file, res) {
    //   //文件上传之前调用做一些拦截限制

    //   const isJPG = true;
    //   // const isJPG = file.type === 'image/jpeg';
    //   const isLt2M = file.size / 1024 / 1024 < 2;

    //   // if (!isJPG) {
    //   //   this.$message.error('上传头像图片只能是 JPG 格式!');
    //   // }
    //   if (!isLt2M) {
    //     this.$message.error("上传图片大小不能超过 2MB!");
    //   }
    //   return isJPG && isLt2M;
    // },
    // handleAvatarImgSuccess(res, file, fileList) {},
    // handlePicExceed(files, fileList) {
    //   //图片上传超过数量限制
    //   this.$message.error("上传图片不能超过6张!");
    // },
    // imgUploadError(err, file, fileList) {
    //   //图片上传失败调用

    //   this.$message.error("上传图片失败!");
    // },

    spaceMycompanyInfo() {
      spaceMycompany().then(res => {
        this.bus.$emit("openMenu", res.data.companyId);
         this.company  = res.data
         delete this.company.createTime;
         delete this.company.modifyTime;
      });
    }
  },

  created() {
    this.spaceMycompanyInfo();
  }
};
</script>

<style lang="scss" scoped>
.setting-title {
  margin-left: 15px;
  margin-top: 20px;
}
h3 {
  margin-left: 20px;
}
.setting-container {
  background-color: #ffffff;
  border: solid 1px #eeeeee;
  width: 98%;
  margin-left: 15px;
}
/deep/ .el-form-item__label {
  font-size: 13px;
  font-weight: normal;
  padding-right: 20px;
  color: #999;
}

.container-text {
  font-size: 13px;
  // font-weight: 590;
  // font-stretch: 500;

  color: #333333;
  font-family: MicrosoftYaHei;
  margin-top: -10px;
}

.container-updata {
  margin-left: 10px;
  font-size: 13px;
  letter-spacing: 0px;
  color: #ff6666;
  cursor: pointer;
}
//   /deep/ .el-form-item__content{
//     //   margin-top: -10px;
//   }
a {
  color: #95aaf6;
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
.img-box{
  width: 120px;
	height: 80px;
	background-color: #ffffff;
	border: solid 1px #eaeaea;
  text-align: center;
  line-height: 120px;

  img{
    width: 51px;
	height: 51px;
  }
}
</style>
