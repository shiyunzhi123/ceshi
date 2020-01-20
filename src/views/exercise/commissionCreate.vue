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

          <el-form-item label="生效时间"
            prop="startTime"
            :rules="{ required: true, message: '生效时间不能为空', trigger: ['blur', 'change'] }"
          >
            <el-date-picker type="date" v-model="form.startTime" value-format="yyyy-MM-d" style="width: 160px;" />
            <span>至</span>
            <el-date-picker type="date" v-model="form.endTime" value-format="yyyy-MM-d" style="width: 160px;" />
          </el-form-item>

          <el-form-item label="计算方式"
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

          <el-form-item label="佣金值"
            prop="cmsnValue"
            :rules="{ required: true, message: '请选择计算方式', trigger: ['blur', 'change'] }"
          >
            <el-input v-model="form.cmsnValue" style="width: 120px;" />
            <span v-if="form.cmsnUnit === '月租金'">个月（租金）</span>
            <span v-if="form.cmsnUnit === '成交百分比'">% 成交额</span>
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
          width="45"
        />
        <el-table-column
          label="房源"
          >
          <template slot-scope="scope">
            <img class="image-logo" :src="scope.row.company.logo | formatMap" />
            <a class="table-row">{{ scope.row.buildingName }} <svg-icon icon-class="edit" /></a><br />
            {{ scope.row.roomGallery }}号楼{{ scope.row.roomLayer }}层{{ scope.row.roomNumber }}室
          </template>
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="面积"
          width="150"
          alert="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.roomArea }}㎡</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="租金"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.rentValue }}
            {{ scope.row.rentUnit }}
          </template>
        </el-table-column>

        <el-table-column
          label="出租时间"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.salesTime | formatTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="roomState"
          label="房源状态"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.leaseType }}
          </template>
        </el-table-column>
        <el-table-column
          prop="registrable"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.roomState * 1 === 0" type="success" plain size="mini" @click="handleSetRoomState(scope.row.roomState)">使用该佣金</el-button>
            <el-button v-if="scope.row.roomState * 1 === 1" type="warning" plain size="mini" @click="handleSetRoomState(scope.row.roomState)">取消使用</el-button>
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
import { roomResourcesList, findMySpaces } from '@/api/exercise'
import { commissionAdd } from '@/api/commission'
import { parseTime } from '@/utils/index'
export default {
  name: 'CommissionCreate',
  data() {
    return {
      spacesData: [], // 我的空间列表
      form: {
        cmsnName: '',
        startTime: '',
        endTime: '',
        resource: '',
        cmsnUnit: '',
        cmsnValue: '',
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
    }
  },
  created() {
    this.getMySpaces()
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
    // 单个更新
    handleSetRoomState(state) {
      this.$refs['form'].validate((valid, error) => {
        if (valid) {
          const str = JSON.stringify(this.form)
          const params = JSON.parse(str)
          console.log(params)
          if (state * 1 === 1) {
            params.cmsnState = 0
          } else {
            params.cmsnState = 1
          }
          commissionAdd(params).then(res => {
            if (res.code === 200) {
              this.$message.success('更新成功')
              this.getRoomResourcesList()
            }
          })
        } else {
          console.log(error)
          for (const item in error) {
            for (const e of error[item]) {
              if (e.message) {
                this.$message.error(e.message)
                return
              }
            }
          }
        }
      })
    },
    // 提交
    onSubmit() {
      commissionAdd(this.form).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '创建成功！',
            message: '',
            type: 'success'
          })
          this.$router.push({ name: 'Commission' })
        }
      })
    },
    // 取消
    onCancle() {
      this.$router.push({ name: 'Commission' })
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
  .image-logo {display: block; float: left; width: 60px; height: 50px; border: none; margin-right: 8px;}

  .btngroup {
    padding: 20px 50px; background-color: #EEE; text-align: right;
    margin: 20px -15px;
  }

  /deep/ .el-form-item__label {font-size: 13px; font-weight: normal; padding-right: 20px; color: #999;}
  /deep/ .el-table__header th {background: #f2f3f4;}
}
</style>
