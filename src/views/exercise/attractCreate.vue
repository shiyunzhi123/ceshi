<template>
  <div class="commission-create">
    <div class="path">经纪人活动</div>
    <div class="exercise-content">
      <div class="create-con">
        <el-form ref="form" :model="form" label-width="100px" size="small">
          <el-form-item label="活动名称">
            <el-input v-model="form.actyName" style="width: 200px;" />
          </el-form-item>

          <el-form-item label="生效时间">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              v-model="form.startTime"
              style="width: 160px;"
            />
            <span>至</span>
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              v-model="form.endTime"
              style="width: 160px;"
            />
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
            v-for="(item,index) in spacesData"
            :label="item.buildingName"
            :value="item.spaceId"
            :key="index"
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

        <el-table-column label="活动状态" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.activityFlag">已使用活动</div>

            <div v-if="!scope.row.activityFlag">未使用活动</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" v-if="this.id">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.activityFlag"
              type="success"
              plain
              size="mini"
              @click="handleSetRoomStateAdd(scope.row)"
            >使用该佣金</el-button>
            <el-button
              v-if="scope.row.activityFlag"
              type="success"
              plain
              size="mini"
              @click="handleSetRoomStateCanle(scope.row)"
            >取消使用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btngroup">
      <el-button type="default" size="middle" @click="onCancle">取消</el-button>
      <el-button type="primary" size="middle" @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { roomResourcesList, findMySpaces } from "@/api/exercise";
import {
  activityAdd,
  activityDetail,
  activityUpdata,
  activityRoomList,
  roomActivitiesAdd,
  roomActivitiesCancle
} from "@/api/activity";
import { roomCommissionAdd } from "../../api/commission";
export default {
  name: "AttractCreate",
  data() {
    return {
      modify: false,
      spacesData: [], // 我的空间列表
      id: "",
      form: {
        actyName: "",
        startTime: "",
        endTime: "",
        roomStatus: 1,
        roomIds: "",
        roomId: ""
      },
      formSearch: {
        actyId: "",
        spaceId: "",
        roomState: ""
      },
      tableData: []
    };
  },
  created() {
    const id = this.$route.params.id;
    this.id = this.$route.params.id;
    this.getMySpaces();
    this.getRoomResourcesList();

    if (id) {
      this.modify = true;
      this.handleActivityDetail(id);
    }

    if (this.id) {
      this.getEditData();
    }
  },
  methods: {
      checkSelectable(row) {
      if ( row.roomState!=='1' ) {
        return 0;
      } else {
        return 1;
      }
    },

    
    //查询数据-编辑用
    getEditData() {
      const params = {
        id: this.id
      };

      activityDetail(params).then(res => {
        if (res.code === 200) {
          this.form = { ...res.data };
          this.form.roomIds = "";
          console.log(this.form);
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

    //单个使用

    handleSetRoomStateAdd(id) {
      this.form.roomId = id.roomId;
      console.log(this.form);
      roomActivitiesAdd(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success("更新成功");
          this.formSearch.actyId = this.form.actyId;
          // activityRoomList(this.formSearch).then(res => {
          //   if (res.code === 200) {
          //     this.tableData = res.data.rows;
          //   }
          // });

          this.getRoomResourcesList();
        }
      });
    },

    //单个取消使用
    handleSetRoomStateCanle(id) {
      this.form.roomId = id.roomId;
      console.log(this.form);
      roomActivitiesCancle(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success("更新成功");
          this.formSearch.actyId = this.form.actyId;
          // activityRoomList(this.formSearch).then(res => {
          //   if (res.code === 200) {
          //     this.tableData = res.data.rows;
          //   }
          // });

          this.getRoomResourcesList();
        }
      });
    },
    // 房源
    getRoomResourcesList() {
      this.formSearch.actyId = this.form.actyId;

      activityRoomList(this.formSearch).then(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          console.log(this.tableData);
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
    // 取消
    onCancle() {
      this.$router.push({ name: "Attract" });
    },
    // 确定
    onSubmit() {
      if (this.id) {
        // 修改

        console.log(this.form);
        activityUpdata(this.form).then(res => {
          if (res.code === 200) {
            this.$message.success("修改成功！");
            this.$router.push({ name: "Attract" });
          }
        });
      } else {
        activityAdd(this.form).then(res => {
          if (res.code === 200) {
            this.$message.success("添加成功！");
            this.$router.push({ name: "Attract" });
          }
        });
      }
    },
    handleActivityDetail(id) {
      activityDetail({ id }).then(res => {});
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
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  height: 18px;
  font-size: 12px;
  color: #fff;
  padding: 0 8px 0 12px;
  border-radius: 12px 0 3px 0;
}
</style>
