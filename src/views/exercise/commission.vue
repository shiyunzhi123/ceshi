<template>
  <div class="exercise">
    <div class="path">佣金政策</div>
    <div class="exercise-content">
      <ul class="tag">
        <li class="list" :class="form.status === '进行中' ? 'on' : ''" @click="handleChangeStatus('进行中')">进行中</li>
        <li class="list" :class="form.status === '未开始' ? 'on' : ''" @click="handleChangeStatus('未开始')">未开始</li>
        <li class="list" :class="form.status === '已结束' ? 'on' : ''" @click="handleChangeStatus('已结束')">已结束</li>
        <li class="list" :class="form.status === '已作废' ? 'on' : ''" @click="handleChangeStatus('已作废')">已作废</li>
      </ul>
      <div class="toolbar">
        <ul class="btn">
          <!-- <li><svg-icon icon-class="funnel" /> 过滤</li>
          <li>|</li> -->

          <li @click="handleCommissionDelete" v-if="this.form.status === '未开始'" ><svg-icon icon-class="remove" /> 删除</li>
          <li @click="handleCommissionZf" v-if="this.form.status === '进行中'"><svg-icon icon-class="remove" /> 作废</li>
        </ul>
        <el-button size="small" type="primary" @click="handleCommissionCreate">创建佣金政策</el-button>
      </div>

      <el-table
        :data="tableData"
        border
        size="small"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
        />
        <el-table-column label="活动名称">
          <template slot-scope="scope">
            <a class="table-row">{{ scope.row.cmsnName }} <svg-icon icon-class="edit" @click="handleEdit(scope.row)"/></a>
          </template>
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间"
          width="180"
        />
        <el-table-column
          prop="endTime"
          label="结束时间"
          width="180"
        />
        <el-table-column
          prop="cmsnUnit"
          label="计算方式"
          width="180"
        />
        <el-table-column
          prop="cmsnValue"
          label="佣金值"
          width="100"
        />
        <el-table-column
          prop="roomsNum"
          label="适用房源"
          width="100"
        />
      </el-table>
      <div class="pagination">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="form.pageNum"
          :page-sizes="[20, 30, 50, 100, 200]"
          :page-size="20"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { commissionList } from '@/api/exercise'
import { commissionDelete, commissionUpdate,commissionDisable,roomCommissionAdd } from '@/api/commission'
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      form: {
        cmsnName: '',
        cmsnState: '',
        cmsnType: '',
        cmsnUnit: '',
        cmsnValue: '',
        companyId: '',
        creUser: '',
        createTime: '',
        endTime: '',
        field: '',
        order: '',
        pageNum: 1,
        pageSize: 20,
        roomStatus: '',
        roomsNum: '',
        startTime: '',
        status: '进行中',
        statusCode: ''
      },
      formDelete: {
        ids: ''
      },
      formZf: {
        cmsnId: '',
        status: '作废'
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      commissionList(this.form).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      })
    },
    // 表格多选
    handleSelectionChange(e) {
      this.formDelete.ids = ''
      this.formZf.cmsnId = ''
      for (const item of e) {
        if (item.cmsnId) {
          this.formDelete.ids += item.cmsnId + ','
          this.formZf.cmsnId += item.cmsnId + ','
        }
      }
      const len = this.formDelete.ids.length
      this.formDelete.ids = this.formDelete.ids.slice(0, len - 1)
      this.formZf.cmsnId = this.formZf.cmsnId.slice(0, this.formZf.cmsnId.length - 1)
    },
    // 改变佣金状态
    handleChangeStatus(status) {
      this.form.status = status
      this.getData()
    },
    // 分页
    handleSizeChange(num) {
      this.form.pageSize = num
      this.getData()
    },
    // 分页
    handleCurrentChange(num) {
      this.form.pageNum = num
      this.getData()
    },
    // 创建佣金
    handleCommissionCreate() {
      this.$router.push({ name: 'CommissionCreate' })
    },
    // 删除
    handleCommissionDelete() {
      this.$confirm('确定删除选中佣金吗?', '', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commissionDelete(this.formDelete).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          }
        })
      }).catch(() => {
      })
    },
    // 作废
    handleCommissionZf() {
       this.$confirm('确定删除选中佣金吗?', '', {
        confirmButtonText: '确定作废',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      commissionDisable(this.formDelete).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '作废成功!'
            })
            this.getData()
          }
        })
      }).catch(() => {
      })
      
    },

    handleEdit(e){
       const id = e.cmsnId
      this.$router.push({ name: 'CommissionCreate', params: { id }})
    }
  }
}
</script>

<style lang="scss" scoped>
.exercise {
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
    background: #FFF; border: 1px solid #DDD; border-radius: 3px; padding: 20px;
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
  }
  .table-row {
    .svg-icon {display: none; color: #fc8a87;}
    &:hover {
      .svg-icon {display: inline-block;}
    }
  }
  .pagination {text-align: center; padding: 20px 0 0;}
  /deep/ .el-table__header th {background: #f2f3f4;}
}
</style>
