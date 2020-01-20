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
            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="form.startTime" style="width: 160px;" />
            <span>至</span>
            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="form.endTime" style="width: 160px;" />
          </el-form-item>
        </el-form>
      </div>

      <h4 class="tit">适用房源</h4>
      <el-form ref="formSearch" :model="formSearch" label-width="100px" size="small" style="margin-bottom: 15px;">
        <el-select v-model="formSearch.spaceId" style="margin-right: 20px; width: 140px;" size="small" @change="getRoomResourcesList">
          <el-option label="全部空间" value="" />
          <el-option v-for="item in spacesData" :label="item.buildingName" :value="item.spaceId" />
        </el-select>
        <el-select v-model="formSearch.roomState" style="width: 140px;" size="small" @change="getRoomResourcesList">
          <el-option label="全部" value="" />
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
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          label="房源">
          <template slot-scope="scope">
            <a class="table-row">{{ scope.row.buildingName }}<!--  <svg-icon icon-class="edit" /> --></a>
          </template>
        </el-table-column>
        <el-table-column
          prop="roomArea"
          label="面积㎡"
          width="180">
        </el-table-column>
        <el-table-column
          label="租金"
          width="230">
          <template slot-scope="scope">
            {{ scope.row.rentValue }}{{ scope.row.rentUnit }}
          </template>
        </el-table-column>
        <el-table-column
          prop="salesTime"
          label="出租时间"
          width="200">
        </el-table-column>
        <el-table-column
          label="房源状态"
          width="160">
          <template slot-scope="scope">
            {{ scope.row.roomState * 1 === 1 ? '出租中' : '已下架' }}
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
import { roomResourcesList, findMySpaces } from '@/api/exercise'
import { activityAdd, activityDetail } from '@/api/activity'
export default {
  name: 'AttractCreate',
  data() {
    return {
      modify: false,
      spacesData: [], // 我的空间列表
      form: {
        actyName: '',
        startTime: '',
        endTime: '',
        roomStatus: 1,
        roomIds: ''
      },
      formSearch: {
        spaceId: '',
        roomState: ''
      },
      tableData: []
    }
  },
  created() {
    const id = this.$route.params.id

    this.getMySpaces()

    if (id) {
      this.modify = true
      this.handleActivityDetail(id)
    }
  },
  methods: {
    // 空间
    getMySpaces() {
      findMySpaces().then(res => {
        if (res.code === 200) {
          this.spacesData = res.data
        }
      })
    },
    // 房源
    getRoomResourcesList() {
      roomResourcesList(this.formSearch).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.rows
        }
      })
    },
    // 表格全选
    handleSelectionChange(ids) {
      this.form.roomIds = ''
      for (const item of ids) {
        if (item.roomId) {
          this.form.roomIds += item.roomId + ','
        }
      }
      const len = this.form.roomIds.length
      this.form.roomIds = this.form.roomIds.slice(0, len - 1)
    },
    // 取消
    onCancle() {
      this.$router.push({ name: 'Attract' })
    },
    // 确定
    onSubmit() {
      console.log(this.form)
      activityAdd(this.form).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '创建成功！',
            message: '',
            type: 'success'
          })
          this.$router.push({ name: 'Attract' })
        }
      })
    },
    handleActivityDetail(id) {
      activityDetail({ id }).then(res => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.commission-create {
  min-height: 92vh;
  background: #fafafa;
  padding: 15px;
  .path {
    font-size: 15px; line-height: 1em; margin: 0 0 10px; padding: 0 0 0 10px; position: relative;
    &::before {
      position: absolute; top: 2px; left: 0; width: 3px; height: 12px;
      background: #6d8dfc; border-radius: 2px;
      content: ''
    }
  }
  .exercise-content {
    background: #FFF; border: 1px solid #DDD; border-radius: 3px; padding: 15px;
    .create-con {
      padding: 12px; background: #fafafa;

    }
  }
  .btngroup {
    padding: 20px 50px; background-color: #EEE; text-align: right;
    margin: 20px -15px;
  }

  /deep/ .el-form-item__label {font-size: 13px; font-weight: normal; padding-right: 20px; color: #999;}
  /deep/ .el-table__header th {background: #f2f3f4;}
}
</style>
