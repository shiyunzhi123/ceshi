<template>
  <div class="commission-create">
    <div class="path">佣金政策</div>
    <div class="exercise-content">
      <div class="create-con">
        <el-form ref="form" :model="form" label-width="100px" size="small">
          <el-form-item
            label="佣金名称"
            prop="cmsnName"
            :rules="{ required: true, message: '佣金名称不能为空', trigger: ['blur', 'change'] }"
          >
            <el-input v-model="form.cmsnName" style="width: 200px;" />
          </el-form-item>

          <el-form-item
            label="生效时间"
            prop="startTime"
            :rules="{ required: true, message: '生效时间不能为空', trigger: ['blur', 'change'] }"
          >
            <el-date-picker
              type="date"
              v-model="form.startTime"
              value-format="yyyy-MM-d"
              style="width: 160px;"
            />
            <span>至</span>
            <el-date-picker
              type="date"
              v-model="form.endTime"
              value-format="yyyy-MM-d"
              style="width: 160px;"
            />
          </el-form-item>

          <el-form-item
            label="计算方式"
            prop="cmsnUnit"
            :rules="{ required: true, message: '请选择计算方式', trigger: ['blur', 'change'] }"
          >
            <el-select v-model="form.cmsnUnit" style="margin-right: 30px;">
              <el-option label="月租金" value="月租金" />
              <el-option label="成交百分比" value="成交百分比" />
            </el-select>
            <el-radio-group v-model="form.resource" size="small">
              <el-radio label="全佣" />
              <el-radio label="净佣" />
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="佣金值"
            prop="cmsnValue"
            :rules="{ required: true, trigger: ['blur', 'change'],validator:vaidatarentValue  }"
          >
            <el-input v-model="form.cmsnValue" style="width: 120px;" />
            <span v-if="form.cmsnUnit === '月租金'">个月（租金）</span>
            <span v-if="form.cmsnUnit === '成交百分比'">% 成交额</span>
          </el-form-item>
        </el-form>
      </div>

      <h4 class="tit">适用房源</h4>
      <el-form
        ref="formSearch"
        :model="formSearch"
        label-width="100px"
        size="small"
        style="margin-bottom: 15px;"
      >
        <el-select
          v-model="formSearch.spaceId"
          style="margin-right: 20px; width: 140px;"
          size="small"
          @change="getRoomResourcesList"
        >
          <el-option label="全部空间" value />
          <el-option
            v-for="item in spacesData"
            :label="item.buildingName"
            :value="item.spaceId"
            :key="item.id"
          />
        </el-select>
        <el-select
          v-model="formSearch.roomState"
          style="width: 140px;"
          size="small"
          @change="getRoomResourcesList"
        >
          <el-option label="全部" value />
          <el-option label="招租中" value="1" />
          <el-option label="已下架" value="0" />
        </el-select>
      </el-form>

      <el-table
        :data="tableData"
        border
        size="small"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" :selectable="checkSelectable" />
        <el-table-column label="房源">
          <template slot-scope="scope">
            <div style="display:flex">
              <div class="imgBoxSpace fl" @click="handleEdit(scope.row.roomId)">
                <img class="image-logo" :src="scope.row.roomImages" alt />
                <span class="imgBoxBorder">{{scope.row.imagesNum}}</span>
              </div>

              <div style="margin-left:15px">
                <a class="imgBoxSpan" @click="handleEdit(scope.row.roomId)">
                  {{ scope.row.building.buildingName }}
              
                </a>
                <div>{{ scope.row.roomGallery }}{{ scope.row.roomLayer }}{{ scope.row.roomNumber }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="类型/面积" width="140" alert="center">
          <template slot-scope="scope">
            <div v-if="scope.row.workstationType==='办公室'">
              <div>{{ scope.row.roomArea}}㎡</div>
              <div>{{ scope.row.workstationType }}</div>
            </div>
            <div v-if="scope.row.workstationType==='开放工位'">
              <div>{{ scope.row.workstationType }}</div>
              <div>{{ scope.row.workstation_number }}</div>
            </div>

            <div v-if="scope.row.workstationType==='移动工位'">
              <div>{{ scope.row.workstationType }}</div>
            </div>

            <div v-if="scope.row.workstationType==='独立空间'">
              <div>{{ scope.row.personPerRoom }}人间</div>

              <div>{{ scope.row.workstationType }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="租金" width="120">
          <template slot-scope="scope">
            {{ scope.row.rentValue }}
            {{ scope.row.rentUnit }}
          </template>
        </el-table-column>

        <el-table-column label="出租时间" width="110">
          <template slot-scope="scope">
            <div v-if="scope.row.leaseType ==='现房出租' ">
              <div>{{ scope.row.leaseType }}</div>
            </div>

            <div v-if="scope.row.leaseType ==='预约出租' ">
              <div>{{ scope.row.vacantTime }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="roomState" label="房源状态" width="120">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.roomState * 1 ? 'success' : 'info'"
              plain
              size="mini"
              round
              @click="handleChangeStatus(scope.row)"
            >{{ scope.row.roomState * 1 ? '招商中' : '已下架' }}</el-button>
          </template>
        </el-table-column>

        <el-table-column label="佣金状态" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.commissionFlag">{{scope.row.commissionName}}</div>

            <div v-if="!scope.row.commissionFlag">{{scope.row.commissionName}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="registrable" label="操作" width="150" v-if="this.id">
          <template slot-scope="scope">
            <el-button
              v-show="!scope.row.commissionFlag"
              type="success"
              plain
              size="mini"
              @click="handleSetRoomStateAdd(scope.row)"
              :disabled="checkDisabled(scope.row)"
            >使用该佣金</el-button>
            <el-button
              v-show="scope.row.commissionFlag"
              type="success"
              plain
              size="mini"
              @click="handleSetRoomStateCanle(scope.row)"
              :disabled="checkDisabled2(scope.row)"
            >取消使用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="btngroup">
        <el-button type="default" size="middle" @click="onCancle">取消</el-button>
        <el-button type="primary" size="middle" @click="onSubmit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { roomResourcesList, findMySpaces } from "@/api/exercise";
import {
  commissionAdd,
  commissionUpdate,
  commissionDetail,
  commissionRoomList,
  roomCommissionAdd,
  roomCommissionCancle
} from "@/api/commission";
import { parseTime } from "@/utils/index";
export default {
  name: "CommissionCreate",
  data() {
    return {
      spacesData: [], // 我的空间列表
      id: "",
      form: {
        cmsnName: "",
        startTime: "",
        endTime: "",
        resource: "",
        cmsnUnit: "",
        cmsnValue: "",
        roomStatus: 1,
        roomIds: "",
        roomId: ""
      },
      formSearch: {
        spaceId: "",
        roomState: "",
        cmsnId:''
      },
      tableData: []
    };
  },
  filters: {
    formatFirstKey: function(val) {
      if (val) {
        return val.substr(0, 1);
      }
    },
    formatMap: function(val) {
      const img = val.split(",");
      const path = process.env.VUE_APP_CUSTOM_API;
      return `${path}${img[0]}`;
    },
    formatTime: function(val) {
      return parseTime(val, "{yyyy}-{m}-{d}");
    }
  },
  created() {
    this.getMySpaces();
    this.getRoomResourcesList()
    

    this.id = this.$route.params.id;

    if (this.id) {
      this.getEditData();
    }
  },
  methods: {

    checkDisabled(row){

       if (row.commissionFlag || row.roomState!=='1' || row.commissionName ) {
        return true;
      } else {
        return false;
      }

    },

    checkDisabled2(row){

       if (row.commissionName ) {
        return false;
      } else {
        return true;
      }

    },
    //禁用状态
    checkSelectable(row) {
      if (row.commissionFlag || row.roomState!=='1' || row.commissionName ) {
        return 0;
      } else {
        return 1;
      }
    },

     vaidatarentValue(rule, value, callback){
       var ret= /^(([1-9]{1}\d*)|([0]{1}))(\.\d{1})$/
       if(value ==="" ){
         callback(new Error("请输入租金"))
       }else if(!ret.test(this.form.cmsnValue)){
          callback(new Error("输入到小数点一位!"));
       }else{
        callback();
       }
     },


    //查询数据-编辑用
    getEditData() {
      const params = {
        id: this.id
      };

      commissionDetail(params).then(res => {
        if (res.code === 200) {
          this.form = { ...res.data };
          this.form.roomIds = "";
          this.formSearch.cmsnId =    this.form.cmsnId
          // console.log( this.formSearch.cmsnId)
          this.getRoomResourcesList()
        }
      });
    },

    // 空间
    getMySpaces() {
      findMySpaces().then(res => {
        if (res.code === 200) {
          this.spacesData = res.data;
        }
      });
    },
    // 房源
    getRoomResourcesList() {
      this.formSearch.cmsnId = this.form.cmsnId;
      // console.log(this.formSearch.cmsnId)
      commissionRoomList(this.formSearch).then(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          
        }
      });
    },
    // 表格全选
    handleSelectionChange(ids) {
      this.form.roomIds = "";
      for (const item of ids) {
        if (item.roomId) {
          this.form.roomIds += item.roomId + ",";
        }
      }
      const len = this.form.roomIds.length;
      this.form.roomIds = this.form.roomIds.slice(0, len - 1);
    },
    // 单个更新
    handleSetRoomStateAdd(id, ids) {
      console.log(id, ids);

      this.form.roomId = id.roomId;
      // console.log(this.form);
      roomCommissionAdd(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success("更新成功");
          this.getRoomResourcesList();
        }
      });
    },
    //单个取消
    handleSetRoomStateCanle(id) {
      this.form.roomId = id.roomId;
      console.log(this.form);
      roomCommissionCancle(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success("更新成功");
          this.getRoomResourcesList();
        }
      });
    },
    // 提交
    onSubmit() {
      if (this.id) {
        console.log(this.form);
        commissionUpdate(this.form).then(res => {
          if (res.code === 200) {
            this.$message.success("修改成功！");
            this.$router.push({ name: "Commission" });
          }
        });
      } else {
        commissionAdd(this.form).then(res => {
          if (res.code === 200) {
            this.$message.success("添加成功！");
            this.$router.push({ name: "Commission" });
          }
        });
      }
    },
    // 取消
    onCancle() {
      this.$router.push({ name: "Commission" });
    }
  }
};
</script>

<style lang="scss" scoped>
.commission-create {
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
  .exercise-content {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 15px;
    .create-con {
      padding: 12px;
      background: #fafafa;
    }
  }
  .image-logo {
    display: block;
    float: left;
    width: 60px;
    height: 50px;
    border: none;
    margin-right: 8px;
  }

  .btngroup {
    padding: 20px 50px;
    background-color: #eee;
    text-align: right;
    margin: 20px -15px;
  }

  /deep/ .el-form-item__label {
    font-size: 13px;
    font-weight: normal;
    padding-right: 20px;
    color: #999;
  }
  /deep/ .el-table__header th {
    background: #f2f3f4;
  }
}

.imgBoxSpace {
  display: inline-block;
  width: 72px;
  height: 54px;
  position: relative;
}

.image-logo {
  width: 72px;
  height: 54px;
}

.imgBoxBorder {
  position: absolute;
  right: 13px;
  bottom: 5px;
  background: rgba(0, 0, 0, 0.6);
  height: 18px;
  font-size: 12px;
  color: #fff;
  padding: 0 8px 0 12px;
  border-radius: 12px 0 3px 0;
}
</style>
