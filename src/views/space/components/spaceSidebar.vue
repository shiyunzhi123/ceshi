<template>
  <div class="space-sidebar">
    <ul class="sidebar">
      <h3 class="tit">我的空间</h3>
      <li v-for="item in spaceList" :key="item.id" :data-id="item.spaceId" class="bar" :class="item.spaceId === spaceSelect ? 'on' : ''" @click="handleClick(item)">{{ item.buildingName }}</li>
    </ul>
    <div class="btn-create" @click="dialogCreateSpaceShow">+创建空间</div>

    <el-dialog
      title="创建空间"
      custom-class="dialog-custom"
      :visible.sync="dialogCreateSpace"
      width="400px"
      :before-close="dialogCreateSpaceClose">
      <div>
        <el-form ref="form" :model="form" label-width="80px" size="mini">
          <el-form-item
            label="选择楼盘"
            prop="buildingSelected"
            >
            <el-select
              v-model="buildingSelected"
              filterable
              placeholder="请选择活动区域"
              remote
              reserve-keyword
              :remote-method="handleBuildingMethod"
              @change="handleBuildingChange"
            >
              <el-option v-for="item in buildingList" :key="item.id" :label="item.buildingName" :value="item.buildingId" />
            </el-select>
            <div class="tip">
              <svg-icon icon-class="i" />请从已有楼盘中选择，如果没有请联系管理员。
            </div>
          </el-form-item>

          <el-form-item
            label="品牌"
            prop="shortName"
            :rules="{ required: true, message: '品牌不能为空', trigger: ['blur', 'change'] }"
          >
            <el-input v-model="form.shortName" style="width: 175px;" />
          </el-form-item>
          <el-form-item
            label="管理面积"
            prop="manageArea"
            :rules="{ required: true, message: '管理面积不能为空', trigger: ['blur', 'change'] }"
          >
            <el-input v-model="form.manageArea" style="width: 175px;" />
            平方米
          </el-form-item>
          <el-form-item
            label="项目类型"
            prop="projectType"
            :rules="{ required: true, message: '请选择活动区域', trigger: ['blur', 'change'] }"
          >
            <el-select
              v-model="form.projectType"
              placeholder="请选择活动区域"
              :rules="{ required: true, message: '请选择活动区域', trigger: ['blur', 'change'] }"
            >
              <el-option label="写字楼" value="写字楼" />
              <el-option label="产业园" value="产业园" />
              <el-option label="商务中心" value="商务中心" />
              <el-option label="联合办公" value="联合办公" />
              <el-option label="孵化器" value="孵化器" />
              <el-option label="产业园" value="产业园" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button size="mini" @click="dialogCreateSpace = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findMySpaces } from '@/api/exercise'
import { buildingList } from '@/api/building'
import { spaceAdd } from '@/api/space'
export default {
  name: 'SpaceSidebar',
  props: {
    funSpace: Function,
    companyId: String
  },
  data() {
    return {
      dialogCreateSpace: false,
      spaceList: [],
      spaceSelect: '',
      buildingList: [],
      buildingSelected: '',
      form: {
        buildingId: '',
        manageArea: '',
        shortName: '',
        projectType: '写字楼',
        addressDetail: ''
      }
    }
  },
  created() {
    this.getMySpaces()
    // this.getBuildingList()
  },
  methods: {
    dialogCreateSpaceClose() {
      this.dialogCreateSpace = false
    },
    // 选择楼盘时
    handleClick(row) {
      this.spaceSelect = row.spaceId
      this.funSpace(row.spaceId)
      sessionStorage.setItem('space', JSON.stringify(row))
    },
    // 查找我的空间
    getMySpaces() {
      findMySpaces().then(res => {
        if (res.code === 200) {
          console.log(res)
          this.spaceList = res.data
          this.spaceSelect = res.data[0].spaceId
          this.funSpace(res.data[0].spaceId)
          sessionStorage.setItem('space', JSON.stringify(res.data[0]))
        }
      })
    },
    // 新增空间弹窗
    dialogCreateSpaceShow() {
      this.dialogCreateSpace = true
      this.getBuildingList()
    },
    // 远程搜索
    handleBuildingMethod(e) {
      const params = {
        buildingName: e
      }
      this.getBuildingList(params)
    },
    // 查找楼盘
    getBuildingList(data) {
      buildingList(data).then(res => {
        if (res.code === 200) {
          console.log("Sss")
          console.log(res)
          this.buildingList = res.data.rows
        }
      })
    },
    // 楼盘变化时
    handleBuildingChange() {
      for (const item of this.buildingList) {
        if (item.buildingId === this.buildingSelected) {
          this.form.shortName = item.buildingName
          this.form.buildingId = item.buildingId
          this.form.projectType = item.buildingtype
          this.form.addressDetail = item.detail
        }
      }
    },
    // 新增楼盘
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formStr = JSON.stringify(this.form)
          const params = JSON.parse(formStr)
          params.companyId = this.companyId
          spaceAdd(params).then(res => {
            if (res.code === 200) {
              this.$message.success('添加成功！')
              this.dialogCreateSpace = false
              this.form.buildingId = ''
              this.form.manageArea = ''
              this.form.shortName = ''
              this.form.projectType = '写字楼'
              this.form.addressDetail = ''
              this.getMySpaces()
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.space-sidebar {
  .sidebar {
    display: block; margin: 0 0 20px; padding: 0; list-style: none;
    .tit {
      font-size: 14px; list-style: none; margin: 0 0 15px; padding: 0;
    }
    .bar {
      display: block; font-size: 12px; border-radius: 2px;
      padding: 6px 6px 5px; color: #686868; margin-bottom: 5px;
      cursor: pointer;
      &.on {
        background: #f0f2f5;
      }
    }
  }
  .btn-create {
    border: 1px solid #6d8dfc; border-radius: 2px;
    padding: 5px 0; margin: 0 5px; text-align: center;
    font-size: 12px; color: #6d8dfc;
    cursor: pointer; user-select: none;
    &:hover {opacity: .8}
  }
  .dialog-custom {
    position: relative;
    z-index: 98;
  }
  .tip {color: #868686; font-size: 12px;}
}
</style>
