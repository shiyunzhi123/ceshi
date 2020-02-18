<template>
  <div class="exercise">
    <div class="path">活动管理</div>
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
        <el-button size="small" type="primary" @click="handleAddActive">添加活动</el-button>
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
            <a class="table-row">{{ scope.row.actyName }} <svg-icon icon-class="edit" @click="handleEdit(scope.row)" /></a>
          </template>
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间"
        />
        <el-table-column
          prop="endTime"
          label="结束时间"
        />
        <el-table-column
          prop="roomsNum"
          label="适用房源"
        />
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="form.pageNum"
          :page-sizes="[20, 30, 50, 100, 200]"
          :page-size="20"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { activityList } from '@/api/exercise'
import { activityDelete, activityDisable} from '@/api/activity'
export default {
  name: 'Attract',
  data() {
    return {
      tableData: [],
      total: 0,
      form: {
        actyName: '',
        actyState: '',
        actyType: '',
        actyUnit: '',
        actyValue: '',
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
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      activityList(this.form).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      })
    },
    handleSelectionChange(e) {
      this.formDelete.ids = ''
      for (const item of e) {
        if (item.actyId) {
          this.formDelete.ids += item.actyId + ','
        }
      }
      const len = this.formDelete.ids.length
      this.formDelete.ids = this.formDelete.ids.slice(0, len - 1)
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
    // 添加活动
    handleAddActive() {
      this.$router.push({ name: 'AttractCreate' })
    },
    // 删除活动
    handleCommissionDelete() {
      this.$confirm('确定删除选中活动吗?', '', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        activityDelete(this.formDelete).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '删除成功！',
              message: '',
              type: 'success'
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
      activityDisable(this.formDelete).then(res => {
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

    // 编辑
    handleEdit(e) {
      const id = e.actyId
      this.$router.push({ name: 'AttractCreate', params: { id }})
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
        display: inline-block; margin: 0 30px 0 0; padding: 10px 5px; font-size: 14px; font-weight: bold;
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
