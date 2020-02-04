<template>
  <div class="space">
    <div class="sidebar">
      <space-sidebar :funSpace="handleFunSpace" :companyId="companyId" />
    </div>
    <!-- 右侧导航 -->
    <div class="sidebar-right">
      <h3 class="title nospace">操作</h3>
      <a class="btn-list room" @click="handleCreateHome('home')">
        + 创建房源
        <!-- <ul class="room-list">
          <li @click="handleCreateHome('home')">添加房源</li>
          <li>添加带看</li>
          <li>添加咨询</li>
          <li>添加合同</li>
        </ul> -->
      </a>
      <a class="btn-list" @click="handleGoto('AttractCreate')">+ 添加活动</a>
      <a class="btn-list" @click="handleGoto('CommissionCreate')">+ 添加佣金</a>

      <h3 class="title">招商负责人</h3>
      <div class="head-block">
        <a class="head" v-for="(item, i) in teamLeader" :key="item.id" >
          <img :src="item.avatar">
          <span :data-id="item.userId" class="del" @click="handleDelTeamLeader(item)">x</span>
        </a>
        <a class="head-add">+</a>
      </div>

      <h3 class="title">招商团队</h3>
      <div class="head-block">
        <span class="head" v-for="(item, i) in team" :key="item.id" :class="'bg'+(i+1)">{{ item.username | formatFirstKey }}</span>
        <!-- <a class="head-add" @click="handleSetCompanyTeam">+</a> -->
      </div>

      <h3 class="title">日历</h3>
      <div>
        <v-calendar :attributes="calendarAttrs" />
      </div>
    </div>
    <!-- 右侧导航结束 -->
    <!-- 中间内容 -->
    <div class="container">
      <div class="block">
        <h2 class="title">
          <span class="icon"><svg-icon icon-class="house" /></span>
          {{ spaceInfo.buildingName }}
          <small>
            <span v-if="spaceInfo.company.companyName">{{ spaceInfo.company.companyName }}&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <span v-if="spaceInfo.company.shortName">{{ spaceInfo.company.shortName }}&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <a v-if="spaceInfo.company.neturl" :href="spaceInfo.company.neturl" target="_black">{{ spaceInfo.company.neturl }}</a>
          </small>
        </h2>
        <ul class="item-block">
          <li class="item purple">
            <span class="tit">在租面积</span>
            <span class="con">{{ spaceInfo.manageArea * spaceInfo.totleRentNumber }}m²</span>
          </li>
          <li class="item indigo">
            <span class="tit">管理面积</span>
            <span class="con">{{ spaceInfo.manageArea }}m²</span>
          </li>
          <li class="item orange">
            <span class="tit">在租房源数</span>
            <span class="con">{{ spaceInfo.totleRentNumber }}</span>
          </li>
          <li class="item blue">
            <span class="tit">出租率</span>
            <span class="con">{{ spaceInfo.rentRate }}%</span>
          </li>
          <li class="item green">
            <span class="tit">租金</span>
            <span class="con">{{ spaceInfo.rentDetails | fromatRent }}</span>
          </li>
          <li class="item pink">
            <span class="tit">佣金政策</span>
            <span class="con">{{ spaceInfo.commissionPolicy }}元</span>
          </li>
        </ul>
      </div>

      <div class="block">
        <div class="exercise-content">
          <ul class="tag">
            <li class="list on">房源</li>
            <li class="list">资料</li>
            <!-- <li class="list">合同</li> -->
          </ul>
          <div class="toolbar">
            <ul class="btn">
              <!-- <li><svg-icon icon-class="funnel" /> 过滤</li>
              <li>|</li> -->
              <li @click="handleRoomResourcesDelete"><svg-icon icon-class="remove" /> 删除</li>
            </ul>
            <a class="txt">核销时间：{{ spaceInfo.company.modifyTime }}</a>
            <el-button size="small" type="primary" :loading="resetSalesTimeLoading" @click="handleResetSalesTime">更新销控</el-button>
          </div>

          <el-table
            :data="tableData"
            size="small"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
            >
            <el-table-column
              type="selection"
              width="45"
            />
            <el-table-column
              label="房源"
              >
              <template slot-scope="scope">
                <img class="image-logo" :src="scope.row.company.logo | formatMap" />
                <a class="table-row" @click="handleEdit(scope.row.roomId)">{{ scope.row.buildingName }} <svg-icon icon-class="edit" /></a><br />
                {{ scope.row.roomGallery }}{{ scope.row.roomLayer }}{{ scope.row.roomNumber }}
              </template>
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="类型/面积"
              width="140"
              alert="center"
            >
              <template slot-scope="scope">
                <div  v-if="scope.row.workstationType==='办公室'">
                   <div>{{ scope.row.roomArea}}㎡</div>
                    <div>{{ scope.row.workstationType }}</div>
                </div>
               <div  v-if="scope.row.workstationType==='开放工位'">
                <div>{{ scope.row.workstationType }}</div>
               </div>

               <div  v-if="scope.row.workstationType==='移动工位'">
                <div>{{ scope.row.workstationType }}</div>
               </div>

                <div  v-if="scope.row.workstationType==='独立空间'">
                <div>{{ scope.row.personPerRoom }}人间</div>

                <div>{{ scope.row.workstationType }}</div>
               </div>
           
              </template>


            </el-table-column>
            <el-table-column
              prop="endTime"
              label="租金"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.rentValue }}
                {{ scope.row.rentUnit }}
              </template>
            </el-table-column>

            <el-table-column
              label="出租时间"
              width="110"
            >
              <template slot-scope="scope">
                {{ scope.row.salesTime | formatTime }}
              </template>
            </el-table-column>
            <el-table-column
              prop="roomState"
              label="房源状态"
              width="120"
            >
              <template slot-scope="scope">
                <el-button :type="scope.row.leftNumber * 1 ? 'success' : 'info'" plain  size="mini" round @click="handleChangeStatus(scope.row)">{{ scope.row.leftNumber * 1 ? '招商中' : '已下架' }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="佣金活动"
              width="120"
            >
              <template slot-scope="scope">
                <div v-for="item in scope.row.activityList">{{ item }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="registrable"
              label="装修/注册"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.roomState === '1' ? '可注册' : '不可注册' }}
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: center; padding: 20px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="roomSearchForm.pageNum"
              :page-sizes="[20, 50, 100, 200, 500]"
              :page-size="20"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableDataTotal">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 中间内容结束 -->

    <el-dialog
      title="设置招商团队"
      :visible.sync="dialogSetCompanyTeam"
      width="30%"
      :before-close="dialogSetCompanyTeamClose">
      <div class="setCompanyTeamCon">
        <a v-for="(item, i) in companyTeam" class="list" :class="'bg' + i">{{ item.username | formatFirstKey }}</a>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogSetCompanyTeam = false">取 消</el-button>
        <el-button size="small" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改房源状态"
      :visible.sync="dialogStatus"
      width="300px"
      :before-close="handleDialogStatusClose"
    >
      <div style="text-align: center;">
        <el-select v-model="dialogStatusForm.leftNumber" placeholder="请选择">
          <el-option value="1" label="招商中" name="招商中" />
          <el-option value="0" label="已下架" name="已下架" />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="handleChangeStatusSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import spaceSidebar from './components/spaceSidebar'
import { getToken } from '@/utils/auth'
import { mainspace } from '@/api/space'
import { roomResources, resetSalesTime, roomResourcesDelete, roomResourcesBatchDelete,roomResourcesUpdate } from '@/api/roomResources'
import { companyTeam, companyTeamLeader } from '@/api/company'
import { update, customerList } from '@/api/user'
import { parseTime } from '@/utils/index'
export default {
  components: { spaceSidebar },
  filters: {
    formatFirstKey: function(val) {
      if (val) {
        return val.substr(0, 1)
      }
    },
    formatMap: function(val) {
      const img = val.split(',')
      const path = process.env.VUE_APP_CUSTOM_API
      return `${path}${img[0]}`
    },
    formatTime: function(val) {
      return parseTime(val, '{yyyy}-{m}-{d}')
    },
    fromatRent: function(val) {
      const str = val.split(',')
      return str[0]
    }
  },
  data() {
    return {
      resetSalesTimeLoading: false,
      buildingId: '',
      companyId: '',
      spaceId: '',
      roomData: [],
      spaceInfo: {
        buildingId: '',
        buildingName: '',
        commissionPolicy: '',
        manageArea: '',
        rentDetails: '',
        spaceId: '',
        totleRentArea: '',
        totleRentNumber: '',
        company: {
          companyId: '',
          companyName: '',
          companyProfile: '',
          leader: '',
          leaderPhone: '',
          logo: '',
          modifyTime: '',
          neturl: '',
          shortName: ''
        }
      },
      team: [],
      teamLeader: [],
      tableData: [],
      tableDataTotal: 0,
      calendarAttrs: [
        {
          key: 'today',
          dates: new Date(),
          highlight: {
            backgroundColor: '#ff8080'
          },
          // Just use a normal style
          contentStyle: {
            color: '#fafafa'
          },
          // Our new popover here
          popover: {
            label: ''
          }
        }
      ],
      dialogSetCompanyTeam: false,
      companyTeam: [],
      roomSearchForm: {
        pageSize: 10,
        pageNum: 1
      },
      dialogStatus: false,
      dialogStatusForm: {
        roomId: '',
        leftNumber: ''
      }
    }
  },
  created() {
  },
  methods: {
    // 日历
    handleSelectionChange(e) {
      this.roomData = e
    },
    // 创建房源
    handleCreateHome(res) {
      if (res === 'home') {
        const params = {
          buildingId: this.buildingId,
          companyId: this.companyId,
          spaceId: this.spaceId
        }
        this.$router.push({ name: 'SpaceCreate', query: params })
      }
    },
    // 子组件互动值
    handleFunSpace(e) {
      console.log(e)
      this.spaceId = e
      console.log(this.spaceId)
      this.getMainSpace()
    },
    // 获取空间详细信息
    getMainSpace() {
      const params = {
        spaceId: this.spaceId
      }
      mainspace(params).then(res => {
        if (res.code === 200) {
          this.spaceInfo = res.data
          this.buildingId = res.data.buildingId
          this.companyId = res.data.company.companyId
          setTimeout(() => {
            this.getCompanyTeam()
            this.getCompanyTeamLeader()
            this.getRoomResources()
          }, 10)
        }
      })
    },
    // 获取房源列表
    getRoomResources() {
      const params = this.roomSearchForm
      params.spaceId = this.spaceId
      roomResources(params).then(res => {
        if (res.code === 200) {
          console.log(res)
          this.tableData = res.data.rows
          this.tableDataTotal = res.data.total
        }
      })
    },
    handleSizeChange(num) {
      this.roomSearchForm.pageSize = num
      this.getRoomResources()
    },
    handleCurrentChange(num) {
      this.roomSearchForm.pageNum = num
      this.getRoomResources()
    },
    // 企业招商团队
    getCompanyTeam() {
      const params = {
        companyId: this.companyId
      }
      companyTeam(params).then(res => {
        if (res.code === 200) {
          this.team = res.data
        }
      })
    },
    getCompanyTeamLeader() {
      const params = {
        companyId: this.companyId
      }
      companyTeamLeader(params).then(res => {
        if (res.code === 200) {
          this.teamLeader = res.data
        }
      })
    },
    // 删除招商团队负责人
    handleDelTeamLeader(data) {
      console.log(data)
      const params = {
        userId: data.userId,
        customerCharge: 0,
        sex: data.sex || 1,
        status: data.status,
        roleId: data.roleId || getToken()
      }
      update(params).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功！')
        }
      })
    },
    // 设置招商团队弹窗
    handleSetCompanyTeam() {
      this.dialogSetCompanyTeam = true
      const params = {
        companyId: this.companyId
      }
      customerList(params).then(res => {
        if (res.code === 200) {
          this.companyTeam = res.data
        } else {
          this.companyTeam = this.team
        }
      })
    },
    dialogSetCompanyTeamClose() {
      this.dialogSetCompanyTeam = false
    },
    // 更新销控
    handleResetSalesTime() {
      const params = {
        spaceId: this.spaceId
      }
      this.resetSalesTimeLoading = true
      resetSalesTime(params).then(res => {
        this.resetSalesTimeLoading = false
        if (res === 200) {
          this.$message.success('更新成功！')
          this.getRoomResources()
        }
      }).catch(() => {
        this.resetSalesTimeLoading = false
      })
    },
    // 删除
    handleRoomResourcesDelete() {
      const params = {
        delIds: ''
      }
      if (!this.roomData || this.roomData.length === 0) {
        this.$message.error('请选择房源！')
        return
      }
      console.log(this.roomData)
      for (const item of this.roomData) {

        params.delIds += item.roomId + ','
      }
      params.delIds = params.delIds.substring(0, params.delIds.length - 1)
      console.log(params)
      roomResourcesBatchDelete(params).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功！')
          this.getMainSpace()
        }
      })
    },
    // 修改房源状态
    handleChangeStatus(row) {
      this.dialogStatusForm.roomId = row.roomId
      this.dialogStatus = true
    },
    handleDialogStatusClose() {
      this.dialogStatus = false
    },
    // 修改房源状态提交
    handleChangeStatusSubmit() {
      roomResourcesUpdate(this.dialogStatusForm).then(res => {
        if (res.code === 200) {
          this.dialogStatus = false
          this.getRoomResources()
        }
      })
    },
    // 路由
    handleGoto(name) {
      this.$router.push({ name })
    },
    handleEdit(id) {
      if (id) {
        this.$router.push({ name: 'SpaceCreate', params: { id: id }})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bg1 {background: #7fbfff}
.bg2 {background: #ff9e86}
.bg3 {background: #ffde81}
.bg4 {background: #7fecb5}
.bg5 {background: #eb8775}
.bg6 {background: #e887f5}
.bg7 {background: #9881fa}
.bg8 {background: #20bbe6}
.space {
  position: relative; width: 100%; min-height: calc(100vh - 66px); background: #fafafa;
  margin: -10px 0 0;
  .sidebar {
    // position: fixed; left: 50px; top: 50px; bottom: 0;
    min-height: calc(100vh - 70px);
    float: left;
    width: 130px; padding: 15px 10px 15px 15px; box-sizing: border-box;
    border-right: 1px solid #EEE;
    background: #FFF;
  }
  .image-logo {display: block; float: left; width: 60px; height: 50px; border: none; margin-right: 8px;}
  .container {
    margin: 22px 260px 0 135px; min-height: calc(100vh - 70px);
    .block {
      background: #FFF; padding: 15px; margin-bottom: 10px;
      border: 1px solid #EEE; border-radius: 1px;
    }
    .title {
      font-size: 18px; color: #454545;
      .icon {display: inline-block; width: 20px; height: 20px; line-height: 20px; background: #adbfff; color: #FFF; border-radius: 20px; text-align: center;
        svg { font-size: 12px; vertical-align: 1px;}
      }
      small {
        display: block; font-size: 12px; font-weight: normal; color: #868686;
        padding: 10px;
        a {color: #adbfff}
      }
    }
    .item-block {
      display: block; margin: 0 0 10px; padding: 0; overflow: hidden; list-style: none;
      .item {
        display: inline-block; overflow: hidden;
        height: 80px; color: #FFF; line-height: 1.4em; border-radius: 3px;
        width: 15.8%;  margin: 0 .2%; padding: 15px 15px 10px; box-sizing: border-box;
        position: relative;
        &::after {
          position: absolute; left: 0; right: 0; left: 0; bottom: 0; width:100%; height: 100%;
          background-position: right bottom;
          background-size: auto 100%;
          opacity: 1;
          content: ''
        }
        .tit {font-size: 12px;}
        .con {
          font-size: 16px; display: block; font-weight: bold;
        }
        &.purple {
          background-color: #bf84f8;
          background-image: linear-gradient(to right, #e987f5 , #9781fa);
          &::after {
            background-image: url('../../assets/images/icon/purple.png');
          }
        }
        &.indigo {
          background-color: #68a0fc;
          background-image: linear-gradient(to right, #6bbafe , #668ffb);
          &::after {
            background-image: url('../../assets/images/icon/indigo.png');
          }
        }
        &.orange {
          background-color: #fd907f;
          background-image: linear-gradient(to right, #ffa380 , #fc807f);
          &::after {
            background-image: url('../../assets/images/icon/orange.png');
          }
        }
        &.blue {
          background-color: #31cbe9;
          background-image: linear-gradient(to right, #46dded , #1ebae6);
          &::after {
            background-image: url('../../assets/images/icon/blue.png');
          }
        }
        &.green {
          background-color: #26dcbe;
          background-image: linear-gradient(to right, #2ff2c2 , #1bc4b8);
          &::after {
            background-image: url('../../assets/images/icon/green.png');
          }
        }
        &.pink {
          background-color: #ff88b1;
          background-image: linear-gradient(to right, #f888ce , #ff8897);
          &::after {
            background-image: url('../../assets/images/icon/pink.png');
          }
        }
      }
    }

    .exercise-content {
      background: #FFF;
      .tag {
        display: block; width: 100%; list-style: none;
        border-bottom: 1px solid #DDD;
        margin: 0 0 20px; padding: 0;
        .list {
          display: inline-block; margin: 0 30px 0 0; padding: 10px 5px; font-size: 14px; font-weight: bold; cursor: pointer;
          &.on {
            color: #6d8dfc; position: relative;
            &::after {
              position: absolute; bottom: -1px; left: 5px; right: 5px; height: 3px;
              background: #6d8dfc;
              content: ''
            }
          }
        }
      }
    }
    .toolbar {overflow: hidden; margin-bottom: 10px;
      .btn {float: right; display: block; margin: 0; padding: 3px 0 0; list-style: none;
        &>* {
          display: inline-block; margin: 0 3px; font-size: 14px; color: #686868; cursor: pointer; user-select: none;
          svg {font-size: 13px; margin: 0 1px;}
          &:active {color: 333;}
        }
      }
      .txt {font-size: 13px; color: #686868; margin-right: 15px;}
    }
    .table-row {
      .svg-icon {display: none; color: #fc8a87;}
      &:hover {
        .svg-icon {display: inline-block;}
      }
    }
    /deep/ .el-table__header th {background: #f2f3f4;}
  }
  .sidebar-right {
    float: right; width: 250px; min-height: calc(100vh - 70px);
    background: #FFF; border: 1px solid #EEE;
    padding: 20px; box-sizing: border-box;
    .title {
      font-size: 14px; padding-top: 12px;
      &.nospace {padding-top: 0;}
    }
    .btn-list {
      display: block; font-size: 13px; padding: 8px 10px; border: 1px solid #EEE;
      color: #686868;
      margin-bottom: 12px; border-radius: 3px;
      &:hover {
        color: #111; border-color: #DDD;
        box-shadow: 1px 1px 5px rgba(0,0,0,0.1);
      }
      &.room {
        position: relative;
        .room-list {
          position: absolute; top: 12px; left: -1px; right: -1px; display: none;
          padding: 10px 30px; background:#FFF; line-height: 2.6em; list-style: none;
          box-shadow: 0 1px 1px rgba(0,0,0,0.2);
        }
        &:hover {
          .room-list {display: block;}
        }
      }
    }
    .head-block {display: block; overflow: hidden;}
    .head,
    .head-add {
      display: block; float: left; border: 1px solid #EEE;
      border-radius: 50px; width: 42px; height: 42px; margin: 0 5px 10px;
      line-height: 42px; text-align: center; color: #FFF;
      position: relative;
    }
    .head-add {border-radius: 5px; border-style: dashed; color: #868686;
      &:hover {border-color: #DDD; color: #686868;}
    }
    .head img {width:42px; height: 42px; border: none; border-radius: 50px;}
    .head:hover {
      .del {
        position: absolute; top: 0; right: 0;
        width: 20px; height: 20px; line-height: 18px;
        background: rgba(0,0,0,0.6); border-radius: 20px;
        color: #FFF; font-weight: bold;
        overflow: hidden;
      }
    }
  }
}
.c-pane-container { transform: scale(.8); margin: -20px 0 0 -25px;}
.setCompanyTeamCon {
  overflow: hidden;
  .list {
    display: inline-block; margin: 0 5px 10px;
    width: 48px; height: 48px;
    border: 1px solid #EEE; border-radius: 50px;
    color: #FFF;
  }
}
</style>
