<template>
  <div class="space-create">
    <div class="path">{{ pathName }}</div>
    <div class="continer">
      <el-form label-width="95px" :model="form" :rules="rules" ref="form" size="small">
        <el-form-item label="所在楼盘" prop="buildingName">
          {{ form.building.buildingName }}
          <!-- <el-select v-model="form.building.buildingName" filterable>
            <el-option v-for="item in buildingList" :key="item.id" :label="item.buildingName" :value="item.buildingName" />
          </el-select>-->
          <!-- <div class="tip">
            <svg-icon icon-class="i" />请从已建的楼盘中选择。
          </div>-->
        </el-form-item>
        <el-row>
          <el-col :span="2.1">
            <el-form-item label="房间号" prop="roomGallery" :inline="true" style="display:block">
              <el-input
                v-model="form.roomGallery"
                style="width: 135px;"
                placeholder="楼座"
                @focus="showMessage"
              ></el-input>
              <p class="showMessage" v-if="this.show">请输入楼座(例:7栋)</p>
            </el-form-item>
          </el-col>

          <el-col :span="2.1" class="col1">
            <el-form-item prop="roomLayer" :inline="true">
              <el-input
                :inline="true"
                v-model="form.roomLayer"
                style="width: 135px;"
                placeholder="楼层"
              ></el-input>
              <p class="showMessage" v-if="this.show">请输入楼层(例:7层)</p>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="col1">
            <el-form-item prop="roomNumber" :inline="true">
              <el-input v-model="form.roomNumber" style="width: 135px;" placeholder="房间号"></el-input>
              <p class="showMessage" v-if="this.show">请输入房间号(例:701室)</p>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="7" class="col2">
            <span>{{form.roomGallery}}</span>
            <span>{{form.roomLayer}}</span>
            <span>{{form.roomNumber}}</span>
          </el-col> -->
        </el-row>

        <el-form-item label="房屋用途" prop="roomPurpose">
          <el-checkbox-group v-model="form.roomPurpose" @change="handleBusinessType">
            <el-checkbox label="办公" value="办公" />
            <el-checkbox label="商业" value="商业" />
            <!-- <el-button type="primary" size="mini" style="display: inherit-block;">添加招商业态</el-button> -->
          </el-checkbox-group>
        </el-form-item>
        <el-collapse-transition>
          <el-form-item v-if="form.roomPurpose.length > 0" label="类型">
            <el-col :span="2.1">
              <el-select
                v-if="form.roomPurpose.includes('办公')"
                v-model="form.workstationType"
                style="width: 135px;"
                @change="changeWork"
              >
                <el-option label="办公室" value="办公室" />
                <el-option label="开放工位" value="开放工位" />
                <el-option label="移动工位" value="移动工位" />
                <el-option label="独立空间" value="独立空间" />
              </el-select>
            </el-col>
            <el-col :span="2.5" class="busType">
              <el-select
                v-if="form.roomPurpose.includes('商业')"
                v-model="form.businessType"
                style="width: 135px;"
              >
                <el-option label="商业临街店铺" value="商业临街店铺" />
                <el-option label="社区底商" value="社区底商" />
                <el-option label="购物百货中心" value="购物百货中心" />
                <el-option label="写字楼配套" value="写字楼配套" />
                <el-option label="临街门面" value="临街门面" />
                <el-option label="档口摊位" value="档口摊位" />
              </el-select>
            </el-col>
            <span v-if="form.workstationType === '办公室'">
              <el-col :span="7" class="busType">
                <el-form-item prop="roomArea">
                  <el-input v-model="form.roomArea" style="width: 135px;" placeholder />平方米
                </el-form-item>
              </el-col>
            </span>
            <span v-if="form.workstationType === '独立空间'" class="jian">
              <el-input v-model="form.personPerRoom" style="width: 135px;" placeholder />人/间
            </span>
          </el-form-item>
        </el-collapse-transition>

        <el-form-item label="是否可分割">
          <el-col :span="2">
            <el-form-item>
              <el-radio-group v-model="form.separable">
                <el-radio label="1" :disabled="showChanges">可分割</el-radio>
              </el-radio-group>
&nbsp;&nbsp;
            </el-form-item>
          </el-col>

          <el-col :span="3" class="tip1">
            <el-form-item>
              <el-select
                v-if="form.separable === '1' && form.workstationType==='办公室'"
                v-model="form.divisionType"
                style="width: 135px;"
              >
                <el-option label="定向分割" value="定向分割" />
                <el-option label="自由分割" value="自由分割" />
              </el-select>
            </el-form-item>
          </el-col>
          <span  v-if="form.separable === '1' && form.divisionType === '自由分割' ">
            <el-col :span="3" class="tip1">
              <el-form-item prop="mixCutpart">
                <el-input v-model="form.mixCutpart" style="width: 105px;" placeholder="分割面积" />
                <span class="tip">平米起分</span>
              </el-form-item>
            </el-col>
          </span>
          <span v-if="form.separable === '1' && form.divisionType === '定向分割'">
            <el-col :span="9" class="tip1">
              <el-form-item prop="divisionDetail">
                <el-input v-model="form.divisionDetail" style="width: 175px;" placeholder="分割面积" />
                <span class="tip" v-if="form.separable">
                  <svg-icon icon-class="i" />分割面积，逗号隔开，如200，300，400
                </span>
              </el-form-item>
            </el-col>
          </span>
        </el-form-item>
      
      <el-col class="separable">
        <el-form-item  prop="separable">
          <el-radio-group v-model="form.separable">
            <el-radio label="0" :disabled="showChange">不可分割</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

        <el-form-item label="出租时间">
          <el-radio-group v-model="form.leaseType">
            <el-radio label="现房出租" />
            <el-radio label="预约出租" />
          </el-radio-group>&nbsp;&nbsp;
          <el-date-picker
            v-if="form.leaseType === '预约出租'"
            v-model="form.vacantTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="装修">
          <el-select v-model="form.renovation" style="width: 135px;">
            <el-option label="毛坯" value="毛坯"></el-option>
            <el-option label="简装" value="简装"></el-option>
            <el-option label="精装" value="精装"></el-option>
            <el-option label="豪装" value="豪装"></el-option>
            <el-option label="遗留装修" value="遗留装修"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否可注册">
          <el-radio-group v-model="form.registrable">
            <el-radio label="0">不可注册</el-radio>
            <el-radio label="1">可注册</el-radio>
          </el-radio-group>
        </el-form-item>
      <el-col :span="2">
        <el-form-item label="租金">
          <el-input v-model="form.rentValue" style="width: 135px;" placeholder></el-input>
            </el-form-item>
     </el-col>
          <el-col :span="3.1" class="box">
            <el-form-item>
          <el-select v-model="form.rentUnit" style="width: 135px; margin-right: 30px;">
            <el-option label="元/平方米·天" value="元/平方米·天"></el-option>
            <el-option label="元/平方米·月" value="元/平方米·月"></el-option>
            <el-option label="元/工位·月" value="元/工位·月"></el-option>
            <el-option label="元/间·月" value="元/间·月"></el-option>
          </el-select>
            </el-form-item>
          </el-col>
      
     
        <el-form-item>
            <el-checkbox-group v-model="form.rentProperties ">
            <el-checkbox label="含税">含税</el-checkbox>
            <el-checkbox label="含物业">含物业</el-checkbox>
          </el-checkbox-group>
        </el-form-item>


        <el-form-item label="付款方式">
          <span class="tip">押</span>
          <el-input v-model="form.payPledge" style="width: 135px;" placeholder></el-input>
          <span class="tip">付</span>
          <el-input v-model="form.payValue" style="width: 135px;" placeholder></el-input>
          <span class="tip">月</span>
        </el-form-item>

        <el-form-item label="房源状态">
          <el-radio-group v-model="form.roomState">
            <el-radio label="1">招商中</el-radio>
            <el-radio label="0">下架中</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" rows="6" v-model="form.remarks" style="width: 500px;"></el-input>
        </el-form-item>

        <el-form-item class="btngroup">
          <el-button type="default" size="middle" @click="onCancle">取消</el-button>
          <el-button type="primary" size="middle" @click="onSubmit('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { buildingList } from "@/api/building";
import {
  roomResourcesAdd,
  roomResourcesDetail,
  roomResourcesUpdate
} from "@/api/roomResources";
export default {
  name: "SpaceCreate",
  data() {
    return {
      showChange: false,
      showChanges: false,
      show: false,
      roomId: "",
      pathName: "",
      buildingList: [],
      form: {
        spaceId: "",
        buildingId: "",
        businessType: "",
        companyId: "",
        roomGallery: "",
        roomLayer: "",
        roomPurpose: [],
        roomNumber: "",
        roomTitle: "",
        roomType: "",
        roomArea: "",
        separable: "",
        divisionType: "",
        personPerRoom: "",
        leftNumber: "",
        mixCutpart: "",
        divisionDetail: "",
        vacantTime: "",
        leaseType: "",
        renovation: "",
        registrable: "",
        rentValue: "",
        rentUnit: "",
        rentProperties: [],
        payPledge: "",
        payValue: "",
        roomState: "",
        remarks: "",
        workstationType: "",
        building: {
          buildingName: ""
        }
      },
      rules: {
        // roomNumber: [
        //   {
        //     required: false, //是否必填
        //     message: "请输入房间号(例:701室)", //规则
        //     trigger: "blur" //何事件触发
        //   }
        // ],
        // roomGallery: [
        //   {
        //     required: false, //是否必填
        //     message: "请输入楼座号(例:18栋)", //规则
        //     trigger: "blur" //何事件触发
        //   }
        //   //可以设置双重验证标准
        // ],
        // roomLayer: [
        //   {
        //     required: false, //是否必填
        //     message: "请输入楼层(例:7层)", //规则
        //     trigger: "blur" //何事件触发
        //   }
        //   //可以设置双重验证标准
        // ],
        roomPurpose: [
          {
            required: true, //是否必填
            message: "请选择其中一个或者两个", //规则
            trigger: "change" //何事件触发
          }
          //可以设置双重验证标准
        ],
        roomArea: [
          {
            required: true, //是否必填
            message: "大于0小于99999,保留两位小数", //规则
            trigger: "blur" //何事件触发
          }
          //可以设置双重验证标准
        ],

        separable: [
          {
            required: true, //是否必填
            message: "请选择其中一个", //规则
            trigger: "change" //何事件触发
          }
        ],
        divisionDetail: [
          {
            required: true, //是否必填
            // message: "请选择其中一个", //规则
            trigger: "blur" //何事件触发,
        
          },
          {
            validator: this.checkSum,
            trigger: "blur"
          }
        ],
              mixCutpart: [
          {
            required: true, //是否必填
            // message: "请选择其中一个", //规则
            trigger: "blur" //何事件触发,
        
          },
          {
            validator: this.checkMix,
         
          }
        ]


      }
    };
  },

  created() {
    this.roomId = this.$route.params.id;
    this.pathName = this.roomId ? "修改房源" : this.$route.meta.name;
    const params = this.$route.query;
    this.form.buildingId = params.buildingId;
    this.form.companyId = params.companyId;
    this.form.spaceId = params.spaceId;

    if (this.roomId) {
      this.getEditData();
    }
    // this.getBuildingList()
    let p = sessionStorage.getItem("space");
    if (p) {
      p = JSON.parse(p);
      this.form.building.buildingName = p.buildingName;
    }
  },
  methods: {
           checkSum(roomArea, value, callback,) {
               console.log(this.form)
              var value = value.split(",")

              function sum(value) {
               return eval(value.join("+"));
               };

               var value = sum(value)
               var sum  = this.form.roomArea
              if (
                Number.isInteger(Number(value)) &&
                Number(value) <= sum
              ) {
                callback();
              } else {
                callback(new Error(`小于等于总面积`));
              }
            },


              checkMix(roomArea,value, callback,) {
                var min = this.form.roomArea
                console.log(min ,value)
              if (
                Number.isInteger(Number(value)) &&
                Number(value) < min
              ) {
                callback();
              } else {
                callback(new Error('小于房源面积'));
              }
            },
       
     
    showMessage() {
      console.log("ddd");
      this.show = true;
      console.log(this.show);
    },
    getBuildingList() {
      buildingList().then(res => {
        if (res.code === 200) {
          this.buildingList = res.data.rows;
        }
      });
    },
    // 房源类型点击时
    handleBusinessType() {},
    // 查询数据-编辑用
    getEditData() {
      const params = {
        roomId: this.roomId
      };
      roomResourcesDetail(params).then(res => {
        if (res.code === 200) {
          this.form = { ...res.data };
          this.form.rentProperties = this.form.rentProperties.split(",");
          this.form.roomPurpose = this.form.roomPurpose.split(",");
        }
      });
    },
    changeWork(){
         if(this.form.workstationType !== '办公室'){
            this.form.separable = "0"
            this.showChanges = true
         }else if(this.form.workstationType === '办公室'){
            this.showChanges = false
         }
    },

    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.rentProperties = this.form.rentProperties.join(",");
          this.form.roomPurpose = this.form.roomPurpose.join(",");

          // delete this.form.building.buildingName
          // delete this.form.building
          if (this.roomId) {
            // 修改
            roomResourcesUpdate(this.form).then(res => {
              if (res.code === 200) {
                this.$message.success("修改成功！");
                this.$router.push({ name: "Space" });
              }
            });
          } else {
            console.log(this.form);
            roomResourcesAdd(this.form).then(res => {
              if (res.code === 200) {
                this.$message.success("添加成功！");
                this.$router.push({ name: "Space" });
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    onCancle() {
      this.$router.push({ name: "Space" });
    }
  },

};
</script>

<style lang="scss" scoped>
.space-create {
  min-height: 92vh;
  background: #fafafa;
  padding: 15px;
  .path {
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
  .continer {
    padding: 30px 15px;
    border: 1px solid #eee;
    background: #fff;
  }
  .tip {
    color: #868686;
    font-size: 12px;
    // display: inline-block;
    margin: 0 2px;
    svg {
      margin-right: 2px;
    }
  }
  .btngroup {
    padding: 20px 50px;
    background-color: #eee;
    text-align: right;
    margin: 0 -15px -30px;
  }
  /deep/ .el-form-item__label {
    font-size: 13px;
    font-weight: normal;
    padding-right: 20px;
    color: #999;
  }
  .col1 {
    margin-left: -90px;
  }

  .col2 {
    margin-left: 10px;
    margin-top: 10px;
  }

  .showMessage {
    color: #868686;
    font-size: 12px;
    margin-top: -5px;
  }
  .busType {
    margin-left: 5px;
  }
  .tip1 {
    margin-left: -20px;
  }
  .jian{
    margin-left: 5px;
  }
  .separable{
    margin-top: -30px;
  }
  .box{
    margin-left: 25px;
  }
}
</style>
