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
        </ul>-->
      </a>
      <a class="btn-list" @click="handleGoto('AttractCreate')">+ 添加活动</a>
      <a class="btn-list" @click="handleGoto('CommissionCreate')">+ 添加佣金</a>

      <h3 class="title">招商负责人</h3>
      <div class="head-block">
        <!-- <a class="head" v-for="(item) in teamLeader" :key="item.id">
          <img :src="item.avatar" />
          <span :data-id="item.userId" class="del" @click="handleDelTeamLeader(item)">x</span>
        </a> -->

         <span
          class="head"
          v-for="(item, i) in team"
          :key="item.id"
          :class="'bg'+(i+1)"
        >{{ item.username | formatFirstKey }}</span>
        <a class="head-add" @click="handleSetCompanyTeam">+</a>
      </div>

      <h3 class="title">招商团队</h3>
      <div class="head-block">
        <span
          class="head"
          v-for="(item, i) in team"
          :key="item.id"
          :class="'bg'+(i+1)"
        >{{ item.username | formatFirstKey }}</span>
        <a class="head-add" @click="handleSetCompanyTeam">+</a>
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
          <span class="icon">
            <svg-icon icon-class="house" />
          </span>
          {{ spaceInfo.buildingName }}
          <small>
            <span
              v-if="spaceInfo.company.companyName"
            >{{ spaceInfo.company.companyName }}&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <span
              v-if="spaceInfo.company.shortName"
            >{{ spaceInfo.company.shortName }}&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <a
              v-if="spaceInfo.company.neturl"
              :href="spaceInfo.company.neturl"
              target="_black"
            >{{ spaceInfo.company.neturl }}</a>
          </small>
        </h2>
        <ul class="item-block">
          <li class="item purple">
            <span class="tit">在租面积</span>
            <span class="con">{{ spaceInfo.manageArea }}m²</span>
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
            <li
              class="list"
              :class="status === '房源' ? 'on' : ''"
              @click="handleChangeStatusType('房源')"
            >房源</li>

            <li
              class="list"
              :class="status === '资料' ? 'on' : ''"
              @click="handleChangeStatusType('资料')"
            >资料</li>

            <!-- <li class="list">合同</li> -->
          </ul>

          <div class="roomResources" v-if="changeShow">
            <div class="toolbar">
              <ul class="btn">
                <!-- <li><svg-icon icon-class="funnel" /> 过滤</li>
                <li>|</li>-->
                <li @click="handleRoomResourcesDelete">
                  <svg-icon icon-class="remove" />删除
                </li>
              </ul>
              <a class="txt">核销时间：{{ spaceInfo.company.createTime }}</a>
              <el-button
                size="small"
                type="primary"
                :loading="resetSalesTimeLoading"
                @click="handleResetSalesTime"
              >更新销控</el-button>
            </div>

            <el-table
              :data="tableData"
              size="small"
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="45" />

              <el-table-column label="房源">
                <template slot-scope="scope">
                  <div style="display:flex">
                    <div class="imgBoxSpace fl" @click="handleEdit(scope.row.roomId)">
                      <img class="image-logo" :src="scope.row.roomImages" alt />
                      <span class="imgBoxSpan">{{scope.row.imagesNum}}</span>
                    </div>

                    <div style="margin-left:15px">
                      <a class="table-row" @click="handleEdit(scope.row.roomId)">
                        {{ scope.row.building.buildingName }}
                        <svg-icon icon-class="edit" />
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
                <template slot-scope="scope" >

               
                 <div v-if="scope.row.leaseType ==='现房出租' ">
                    <div>{{  scope.row.leaseType }}</div>
                  </div>

                      <div v-if="scope.row.leaseType ==='预约出租' ">
                    <div>{{  scope.row.vacantTime }}</div>
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
              <el-table-column prop="endTime" label="佣金活动" width="120">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.activityList" :key="item">{{ item }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="registrable" label="装修/注册" width="100">
             
                <template slot-scope="scope">
                  <div>{{scope.row.renovation}}</div>
                  <div>
                     {{ scope.row.registrable === '1' ? '可注册' : '不可注册' }}
                  </div>
                 
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
                :total="tableDataTotal"
              ></el-pagination>
            </div>

            <el-dialog
              title="设置招商团队"
              :visible.sync="dialogSetCompanyTeam"
              width="30%"
              :before-close="dialogSetCompanyTeamClose"
            >
              <div class="setCompanyTeamCon">
                <a
                  v-for="(item, i) in companyTeam"
                  class="list"
                  :class="'bg' + i"
                >{{ item.username | formatFirstKey }}</a>
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
                <el-select v-model="dialogStatusForm.roomState" placeholder="请选择">
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

          <div class="roomLiao" v-show="changeShow2">
            <div class="materialBox">
              <h2 class="clearfix">
                <span class="fl">简介</span>
                <div class="changeEdit">
                  <el-button type="primary" size="mini" @click="handleEditor">编辑</el-button>
                </div>
              </h2>
              <div class="briefIntroduction">
                <p id="showAll" :class="{ellpes:!showAll}"  style="text-indent:2rem; white-space: pre-wrap"> {{this.space.introduction}}</p>
               
                <a @click="fun_showAll" v-show="tetxShow" href="javascript:void(0)">[{{showAll?"收起":"展开"}}]</a>
              </div>
            </div>

            <div class="materialBox">
              <h2 class="clearfix">
                <span class="fl">文档</span>
              </h2>
              <div class="briefIntroduction">
                <el-upload
                  class="upload-demo"
                  action="http://39.107.15.114:8080/upload/spaceFile"
                  :on-preview="handlePreview"
                  :data="fileData"
                  :on-success="handleFileSuccess"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :headers="headers"
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                  :before-upload="beforeAvatarUpload"
                >
                  <div class="uploadFile">
                    <el-button type="primary" size="mini">
                      上传
                      <i class="el-icon-upload el-icon--right"></i>
                    </el-button>
                  </div>
                </el-upload>
              </div>
            </div>

            <div class="materialBox">
              <h2 class="clearfix">
                <span class="fl">视频讲盘</span>
              </h2>
              <div class="briefIntroduction">
                <el-upload
                  class="upload-demo"
                  action="http://39.107.15.114:8080/upload/spaceVideo"
                  :on-preview="handleVideoPreview"
                  :data="videoData"
                  :on-success="handleVideoFileSuccess"
                  :on-remove="handleVideoRemove"
                  :before-remove="beforeVideoRemove"
                   multiple
                  :headers="headers"
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="videoList"
                  :before-upload="beforeVideoUpload"
                >
                  <div class="uploadFile">
                    <el-button type="primary" size="mini">
                      上传
                      <i class="el-icon-upload el-icon--right"></i>
                    </el-button>
                  </div>
                </el-upload>
              </div>
            </div>

            <div class="materialBox">
              <h2 class="clearfix">
                <span class="fl">基础</span>
                <div class="changeEdit">
                  <el-button type="primary" size="mini" @click="handleChangeStatusInfo">编辑</el-button>
                </div>
              </h2>
              <div class="briefIntroduction">
                <ul class="basisInfo">
                  <li>
                    <span>项目类型：</span>
                    {{this.space.projectType}}
                  </li>
                  <li>
                    <span>占地面积：</span>
                    {{this.space.floorSpace}}
                  </li>
                  <li>
                    <span>楼栋数：</span>
                    {{this.space.buildingNumber}}
                  </li>
                  <li>
                    <span>绿化率：</span>
                    {{this.space.greeningRate}}
                  </li>
                  <li>
                    <span>得房率：</span>
                    {{this.space.roomRates}}
                  </li>

                  <li>
                    <span>车位数：</span>
                    {{this.space.parkingSpaces}}
                  </li>

                  <li>
                    <span>开发商：</span>
                    {{this.space.developers}}
                  </li>
                  <li>
                    <span>物业公司：</span>
                    {{this.space.propertyCompany}}
                  </li>
                </ul>
              </div>
            </div>

            <div class="materialBox">
              <h2 class="clearfix">
                <span class="fl">图片</span>
                <div class="changeEdit">
                  <el-button type="primary" size="mini" @click="handleChangePic">编辑</el-button>
                </div>
              </h2>
              <div class="briefIntroduction">
                  
                   
                    <el-upload
                      ref="upload"
                      action="#"
                      list-type="picture-card"
                      accept="image/*"
                      :headers="headers"
                      :data="resData "
                      :limit="imgLimit"
                      :file-list="imageslist"
                      :disabled ="true"
                    >
                      <i class="el-icon-plus " @click="handleChangePic"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                      <img width="80%" height="10%" :src="dialogImageUrl" class="avatar" alt />
                    </el-dialog>
                

              </div>
            </div>

            <div class="materialBox">
              <h2 class="clearfix">
                <span class="fl">配套</span>
                <div class="changeEdit">
                  <el-button type="primary" size="mini" @click="handleAroundSet">编辑</el-button>
                </div>
              </h2>
              <div class="briefIntroduction" style="text-indent:2rem; white-space: pre-wrap">{{this.space.aroundSet}}</div>
              <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
            </div>

            <div class="materialBox">
              <h2 class="clearfix">
                <span class="fl">地址</span>
                <div class="changeEdit">
                  <el-button type="primary" size="mini" @click="handleMapSet">编辑</el-button>
                </div>
              </h2>
              <div
                class="briefIntroduction"
                style="display: flex;justify-content: space-between;"
              >
                <div class="addressBox clearfix">
                  <div class="addressList fl">
                    <p>
                      <em class="icon em1"></em>
                      <i>[{{this.district}}-{{this.businessDistrict}}]</i>{{this.space.addressDetail}}
                    </p>
                    <p>
                      <em class="icon em2"></em>距离 {{this.subways}}
                    </p>
                  </div>
                </div>
                <div id="map-box"></div>
              </div>
            </div>

            <el-dialog title="简介编辑" :visible.sync="dialogChange" width="360px">
              <div style="text-align: center;">
                <el-form size="mini" label-width="80px">
                  <el-form-item label="项目类型">
                    <el-select style="width:200px;" v-model="space.projectType" placeholder="请选择">
                      <el-option label="写字楼" value="写字楼"></el-option>
                      <el-option label="产业园" value="产业园"></el-option>
                      <el-option label="商务中心" value="商务中心"></el-option>

                      <el-option label="联合办公" value="联合办公"></el-option>

                      <el-option label="孵化器" value="孵化器"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="占地面积">
                    <el-input style="width:200px;" v-model="space.floorSpace"></el-input>
                  </el-form-item>

                  <el-form-item label="建筑面积">
                    <el-input style="width:200px;" v-model="space.floorArea"></el-input>
                  </el-form-item>

                  <el-form-item label="楼栋数">
                    <el-input style="width:200px;" v-model="space.buildingNumber"></el-input>
                  </el-form-item>

                  <el-form-item label="绿化率">
                    <el-input style="width:200px;" v-model="space.greeningRate"></el-input>
                  </el-form-item>

                  <el-form-item label="得房率">
                    <el-input style="width:200px;" v-model="space.roomRates"></el-input>
                  </el-form-item>

                  <el-form-item label="车位数">
                    <el-input style="width:200px;" v-model="space.parkingSpaces"></el-input>
                  </el-form-item>

                  <el-form-item label="开发商">
                    <el-input style="width:200px;" v-model="space.developers"></el-input>
                  </el-form-item>

                  <el-form-item label="物业公司">
                    <el-input style="width:200px;" v-model="space.propertyCompany"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogChange = false">取 消</el-button>
                <el-button type="primary" @click="handleChangeInfoSubmit">确 定</el-button>
              </span>
            </el-dialog>

            <el-dialog title="位置编辑" :visible.sync="mapChange" width="360px">
              <div >
                <el-form size="mini" label-width="40px">
                  <el-form-item label="地址">
                    <el-input style="width:100px;" :disabled="true" v-model="district"></el-input>
                    <el-input style="width:100px;" :disabled="true" v-model="businessDistrict"></el-input>
                    
                  </el-form-item>
             

                 <el-form-item label="">
                    <el-input style="width:250px;"  v-model="space.addressDetail"></el-input>
                  </el-form-item>
                   </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="mapChange = false">取 消</el-button>
                <el-button type="primary" @click="handleChangeMapSubmit">确 定</el-button>
              </span>
            </el-dialog>

            <el-dialog
              title="房源图片"
              :visible.sync="ChangePic"
              width="700px"
              heigth="800px"
              v-dialogDrag:{dialogDrag}="dialogDrag"
            >
              <div class="tabPosition">
                <el-button type="primary" size="mini" @click="uploadImg">
                  上传图片
                  <i class="el-icon-plus el-icon-right"></i>
                </el-button>
                <p style="font-size:12px">最多可上传5张图片,图片类型jpg\png\gif\bmp, 单个文件不超过8M,图片大小1200*800px</p>
                <p style="font-weight: bold;margin-top:30px;">图片分组</p>

                <el-tabs tabPosition="left">
                  <el-tab-pane
                    :label="`全部图片(${(Object.keys(imageslist).length)})`"
                    style="font-size:white"
                  >
                    <div class="imgBox">
                      <ul>
                        <li
                          v-for="(item ,index) in imageslist"
                          :key="item.affixId"
                          class="imgList"
                          @mouseover="handleMouseover(index)"
                          @mouseout="handleMouseout(index)"
                        >
                          <img :src="item.url" alt />
                          <ul class="hoverList" v-show="hoverShow && index==current">
                            <li @click="handelSetSurfaceImages(item.affixId)">设为封面</li>
                            <li @click="handelDeleteImages(item.affixId,item.fileName)">删除</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="`区位图(${(Object.keys(locationImagesList).length)})`">
                    <div class="imgBox">
                      <ul>
                        <li
                          v-for="(item ,index) in locationImagesList"
                          :key="item.affixId"
                          class="imgList"
                          @mouseover="handleMouseover(index)"
                          @mouseout="handleMouseout(index)"
                        >
                          <img :src="item.url" alt />
                          <ul class="hoverList" v-show="hoverShow && index==current">
                            <li @click="handelSetSurfaceImages(item.affixId)">设为封面</li>
                            <li @click="handelDeleteImages(item.affixId,item.fileName)">删除</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="`室外图(${(Object.keys(outdoorImagesList).length)})`">
                    <div class="imgBox">
                      <ul>
                        <li
                          v-for="(item ,index) in outdoorImagesList"
                          :key="item.affixId"
                          class="imgList"
                          @mouseover="handleMouseover(index)"
                          @mouseout="handleMouseout(index)"
                        >
                          <img :src="item.url" alt />
                          <ul class="hoverList" v-show="hoverShow && index==current">
                            <li @click="handelSetSurfaceImages(item.affixId)">设为封面</li>
                            <li @click="handelDeleteImages(item.affixId,item.fileName)">删除</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="`室内图(${(Object.keys(indoorImagesList).length)})`">
                    <div class="imgBox">
                      <ul>
                        <li
                          v-for="(item ,index) in indoorImagesList"
                          :key="item.affixId"
                          class="imgList"
                          @mouseover="handleMouseover(index)"
                          @mouseout="handleMouseout(index)"
                        >
                          <img :src="item.url" alt />
                          <ul class="hoverList" v-show="hoverShow && index==current">
                            <li @click="handelSetSurfaceImages(item.affixId)">设为封面</li>
                            <li @click="handelDeleteImages(item.affixId,item.fileName)">删除</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="`户型图(${(Object.keys(floorImagesList).length)})`">
                    <div class="imgBox">
                      <ul>
                        <li
                          v-for="(item ,index) in floorImagesList"
                          :key="item.affixId"
                          class="imgList"
                          @mouseover="handleMouseover(index)"
                          @mouseout="handleMouseout(index)"
                        >
                          <img :src="item.url" alt />
                          <ul class="hoverList" v-show="hoverShow && index==current">
                            <li @click="handelSetSurfaceImages(item.affixId)">设为封面</li>
                            <li @click="handelDeleteImages(item.affixId,item.fileName)">删除</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="`配套图(${(Object.keys(supportingImagesList).length)})`">
                    <div class="imgBox">
                      <ul>
                        <li
                          v-for="(item ,index) in supportingImagesList"
                          :key="item.affixId"
                          class="imgList"
                          @mouseover="handleMouseover(index)"
                          @mouseout="handleMouseout(index)"
                        >
                          <img :src="item.url" alt />
                          <ul class="hoverList" v-show="hoverShow && index==current">
                            <li @click="handelSetSurfaceImages(item.affixId)">设为封面</li>
                            <li @click="handelDeleteImages(item.affixId,item.fileName)">删除</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="`效果图(${(Object.keys(effectImagesList).length)})`">
                    <div class="imgBox">
                      <ul>
                        <li
                          v-for="(item ,index) in effectImagesList"
                          :key="item.affixId"
                          class="imgList"
                          @mouseover="handleMouseover(index)"
                          @mouseout="handleMouseout(index)"
                        >
                          <img :src="item.url" alt />
                          <ul class="hoverList" v-show="hoverShow && index==current">
                            <li @click="handelSetSurfaceImages(item.affixId)">设为封面</li>
                            <li @click="handelDeleteImages(item.affixId,item.fileName)">删除</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="ChangePic = false">取 消</el-button>
                <el-button type="primary" @click="handleChangeSelectSubmit">保存</el-button>
              </span>
            </el-dialog>

            <el-dialog
              title="上传图片"
              :visible.sync="uploadImgChange"
              width="560px"
              v-dialogDrag:{dialogDrag}="dialogDrag"
              :modal="false"
              :modal-append-to-body="false"
            >
              <div>
                <el-form width="278px" size="small">
                  <el-form-item label="上传到" style="width:300px;">
                    <el-select placeholder="请选择" v-model="tabSelect" @change="changeSelect">
                      <el-option label="区位图" value="locationImages"></el-option>
                      <el-option label="室外图" value="outdoorImages"></el-option>
                      <el-option label="室内图" value="indoorImages"></el-option>
                      <el-option label="户型图" value="floorImages"></el-option>
                      <el-option label="配套图" value="supportingImages"></el-option>
                      <el-option label="效果图" value="effectImages"></el-option>
                    </el-select>
                  </el-form-item>

                  <p style="font-size:12px">最多可上传5张图片,图片类型jpg\png\gif\bmp, 单个文件不超过8M,图片大小1200*800px</p>

                  <el-form-item>
                    <el-upload
                      ref="upload"
                      class="avatar-uploader"
                      action="http://39.107.15.114:8080/upload/spaceImage"
                      list-type="picture-card"
                      accept="image/*"
                      :headers="headers"
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
                    <el-dialog :visible.sync="dialogVisible">
                      <img width="80%" height="10%" :src="dialogImageUrl" class="avatar" alt />
                    </el-dialog>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="uploadImgChange = false">取 消</el-button>
                <el-button type="primary" @click="handleChangeUploadSubmit">保存</el-button>
              </span>
            </el-dialog>

            <el-dialog title="编辑" :visible.sync="changeEditor" width="500px" :modal="false">
              <div style="text-align: center;">
                <el-input type="textarea" v-model="space.introduction"  :rows="6" ></el-input>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="changeEditor = false">取 消</el-button>
                <el-button type="primary" @click="handleChangeEditorSubmit">保存</el-button>
              </span>
            </el-dialog>

            <el-dialog title="编辑" :visible.sync="changeAround" width="500px" :modal="false">
              <div style="text-align: center;">
                <el-input type="textarea" v-model="space.aroundSet" :rows="6"></el-input>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="changeAround = false">取 消</el-button>
                <el-button type="primary" @click="handleChangeAroundSubmit">保存</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </div>
      <!-- 中间内容结束 -->
    </div>
  </div>
</template>

<script>
import spaceSidebar from "./components/spaceSidebar";
import { getToken } from "@/utils/auth";
import {
  mainspace,
  spaceUpdate,
  spaceMyspace,
  spaceAffixDelete,
  spaceImagesList,
  spaceSetSurfaceImages,
  spaceDeleteImages,
  spaceSaleTime
} from "@/api/space";
import {
  roomResources,
  resetSalesTime,
  roomResourcesDelete,
  roomResourcesBatchDelete,
  roomResourcesUpdate
} from "@/api/roomResources";
import { companyTeam, companyTeamLeader } from "@/api/company";
import { update, customerList } from "@/api/user";
import { parseTime } from "@/utils/index";
export default {
  components: { spaceSidebar },
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
    },
    fromatRent: function(val) {
      const str = val.split(",");
      return str[0];
    }
  },
  data() {
    return {
      resImgList: [],
      num: "5",
      fileData: {
        recordId: ""
      },
      resData: {
        recordId: "",
        fieldName: ""
      },
      videoData: {
        recordId: ""
      },
      headers: {
        Authorization: ""
      },
      tetxShow:"",
      subways:"",
      brandName:"",
      businessDistrict:"",
      district:"",
      effectImagesList: [],
      floorImagesList: [],
      indoorImagesList: [],
      locationImagesList: [],
      outdoorImagesList: [],
      supportingImagesList: [],
      imageslist: [],
      hoverShow: false,
      fold: true,
      showAll: false,
      current: "",
      dialogVisible: false,
      dialogImageUrl: "",
      fileList: [],
      isMultiple: true,
      imgLimit: 6,
      tabPosition: "left",
      dialogDrag: true,
      introduction: "",
      dynamicTags: [],
      inputVisible: false,
      resetSalesTimeLoading: false,
      buildingId: "",
      companyId: "",
      filePicList: [],
      videoList: [],
      disabled: true,
      spaceId: "",
      roomData: [],
      tabSelect: "",
      status: "房源",
      ChangePic: false,
      changeShow: true,
      changeShow2: false,
      changeEditor: false,
      changeAround: false,
      uploadImgChange: false,
      mapChange: false,
      inputValue:"",
      space: {
        spaceId: "",
        introduction: "",
        aroundSet: "",
        aroundSetTag: "",
        propertyCompany: "",
        developers: "",
        parkingSpaces: "",
        roomRates: "",
        greeningRate: "",
        buildingNumber: "",
        floorArea: "",
        floorSpace: "",
        projectType: "",
        locationImages: "",
        outdoorImages: "",
        indoorImages: "",
        floorImages: "",
        supportingImages: "",
        effectImages: "",
        addressDetail:""
      },
      spaceInfo: {
        buildingId: "",
        buildingName: "",
        commissionPolicy: "",
        manageArea: "",
        rentDetails: "",
        spaceId: "",
        totleRentArea: "",
        totleRentNumber: "",

        company: {
          companyId: "",
          companyName: "",
          companyProfile: "",
          leader: "",
          leaderPhone: "",
          logo: "",
          modifyTime: "",
          neturl: "",
          shortName: ""
        }
      },
      form: {
        spaceId: "",
        affixId: "",
        fieldName: ""
      },
      team: [],
      teamLeader: [],
      tableData: [],
      tableDataTotal: 0,
      calendarAttrs: [
        {
          key: "today",
          dates: new Date(),
          highlight: {
            backgroundColor: "#ff8080"
          },
          // Just use a normal style
          contentStyle: {
            color: "#fafafa"
          },
          // Our new popover here
          popover: {
            label: ""
          }
        }
      ],
      dialogSetCompanyTeam: false,
      companyTeam: [],
      roomSearchForm: {
        pageSize: 10,
        pageNum: 1
      },
      dialogChange: false,
      dialogStatus: false,
      dialogStatusForm: {
        roomId: "",
        roomState: ""
      }
    };
  },
  created() {
    this.checkCookie("Authorization");
  },
  methods: {
    //编辑
    handleEditor() {
      this.changeEditor = true;
    },
    handleAroundSet() {
      this.changeAround = true;
    },
    //修改基础
    handleChangeStatusInfo() {
      this.dialogChange = true;
    },
    //弹出上传图片
    uploadImg() {
      this.uploadImgChange = true;
    },
    handleChangeUploadSubmit() {
      this.$refs.upload.clearFiles();
      this.uploadImgChange = false;
      spaceImagesList(this.form).then(res => {
        if (res.code === 200) {
        }
      });
    },
    //修改图片
    handleChangePic() {
      this.ChangePic = true;

    
      //获取图片
      spaceImagesList(this.form).then(res => {
        if (res.code === 200) {
       
          this.imageslist = res.data.imageslist;
          this.locationImagesList = res.data.locationImagesList;
          this.effectImagesList = res.data.effectImagesList;
          this.floorImagesList = res.data.floorImagesList;
          this.indoorImagesList = res.data.indoorImagesList;
          this.supportingImagesList = res.data.supportingImagesList;
        }
      });
    },

    //文件的上传

    handleFileSuccess(res, file, fileList) {

         this.getMainSpace()
    
    },
    //视频上传成功
    handleVideoFileSuccess() {
         this.getMainSpace()
    },
    //删除单个文件
    handleRemove(file, fileList) {
      const affixId = file.affixId;

      spaceAffixDelete(affixId).then(res => {
        if (res.code === 200) {
           this.$message({
						message: '删除成功',
            type: 'success',
            duration:"2000"
					});
     
        }
      });
    },
    //删除单个视频
    handleVideoRemove(file) {
      const affixId = file.affixId;
      spaceAffixDelete(affixId).then(res => {
        if (res.code === 200) {
          this.$message.success("删除成功！");
          // this.getMainSpace();
        }
      });
    },
    handlePreview(file) {
      var url = file.url;
      var a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.setAttribute("id", "camnpr");
      document.body.appendChild(a);
      a.click();
    },
    handleVideoPreview(file) {
      var url = file.url;
      var a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.setAttribute("id", "camnpr");
      document.body.appendChild(a);
      a.click();
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      if(file && file.status==="success"){
          return this.$confirm(`确定移除 ${file.name}？`);
      }
    
    },
    beforeVideoRemove(file, fileList) {
       if(file && file.status==="success"){
          return this.$confirm(`确定移除 ${file.name}？`);
      }
    },

    beforeAvatarUpload(file) {
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const extension3 = file.name.split(".")[1] === "doc";
      const extension4 = file.name.split(".")[1] === "docx";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2 && !extension3 && !extension4) {
        this.$message({
						message: '上传文件只能是 xls、xlsx格式!',
            type: 'warning',
            duration:"9000"
					});

      }
      if (!isLt2M) {
          this.$message({
						message: '上传文件大小不能超过 10MB!',
						type: 'warning'
					});

      }
      return extension || extension2 || extension3 || (extension4 && isLt2M);
    },

    beforeVideoUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过10MB哦!");
        return false;
      }
    },
    handleClose(tag) {
    
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        this.space.aroundSetTag = this.dynamicTags.join(",");
      
        this.space.spaceId = JSON.parse(
          sessionStorage.getItem("space", "spaceId")
        ).spaceId;
        spaceUpdate(this.space).then(res => {
          if (res.code === 200) {
          }
        });
     

    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
   
      if (inputValue) {
        this.dynamicTags.push(inputValue);
        this.space.aroundSetTag = this.dynamicTags.join(",");
      
        this.space.spaceId = JSON.parse(
          sessionStorage.getItem("space", "spaceId")
        ).spaceId;
        spaceUpdate(this.space).then(res => {
          if (res.code === 200) {
          }
        });
      }
      this.inputVisible = false;
        this.inputValue = '';
    },
    changeSelect() {
      
      this.resData.fieldName = this.tabSelect
     
    },
    // 日历
    handleSelectionChange(e) {

      this.roomData = e;
    },
    // 创建房源
    handleCreateHome(res) {
      if (res === "home") {
        const params = {
          buildingId: this.buildingId,
          companyId: this.companyId,
          spaceId: this.spaceId
        };
        this.$router.push({ name: "SpaceCreate", query: params });
      }
    },
    // 子组件互动值
    handleFunSpace(e) {
    
      this.spaceId = e;

      this.getMainSpace();
    },
    // 获取空间详细信息
    getMainSpace() {
      const params = {
        spaceId: this.spaceId
      };

      spaceMyspace(params).then(res => {
        if (res.code === 200) {
          console.log(res);


          if(JSON.parse( sessionStorage.getItem("space", "spaceId"))){
  this.form.spaceId = JSON.parse(
      sessionStorage.getItem("space", "spaceId")
    ).spaceId;

    this.fileData.recordId = JSON.parse(
      sessionStorage.getItem("space", "spaceId")
    ).spaceId;

    console.log(this.fileData.recordId)

    this.resData.recordId = JSON.parse(
      sessionStorage.getItem("space", "spaceId")
    ).spaceId;

    

    this.videoData.recordId = JSON.parse(
      sessionStorage.getItem("space", "spaceId")
    ).spaceId;
    }
    
    console.log(res)
          this.space.introduction = res.data.introduction;
          this.space.aroundSet = res.data.aroundSet;
          this.space.floorArea = res.data.floorArea;
          this.space.propertyCompany = res.data.propertyCompany;
          this.space.developers = res.data.developers;
          this.space.parkingSpaces = res.data.parkingSpaces;
          this.space.greeningRate = res.data.greeningRate;
          this.space.buildingNumber = res.data.buildingNumber;
          this.space.floorSpace = res.data.floorSpace;
          this.space.projectType = res.data.projectType;
          this.space.roomRates = res.data.roomRates;
          this.fileList = res.data.filesList;
          this.filePicList = res.data.imageslist;
          this.videoList = res.data.vediosList;
          this.dynamicTags = res.data.aroundSetTag.split(",");
          this.district = res.data.district
          this.businessDistrict = res.data.businessDistrict
          this.space.addressDetail = res.data.addressDetail
          this.subways = res.data.building.subways
          
       
        }
      });
      mainspace(params).then(res => {
        if (res.code === 200) {
          this.spaceInfo = res.data;
          console.log(this.spaceInfo)
          this.buildingId = res.data.buildingId;
          this.companyId = res.data.company.companyId;
          setTimeout(() => {
            this.getCompanyTeam();
            this.getCompanyTeamLeader();
            this.getRoomResources();
          }, 10);
        }
      });
    },
    // 获取房源列表
    getRoomResources() {
      const params = this.roomSearchForm;
      params.spaceId = this.spaceId;
      roomResources(params).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.rows;
          this.tableDataTotal = res.data.total;
        }
      });
    },
    handleSizeChange(num) {
      this.roomSearchForm.pageSize = num;
      this.getRoomResources();
    },
    handleCurrentChange(num) {
      this.roomSearchForm.pageNum = num;
      this.getRoomResources();
    },
    // 企业招商团队
    getCompanyTeam() {
      const params = {
        companyId: this.companyId
      };
      companyTeam(params).then(res => {
        if (res.code === 200) {
          console.log(res)
          this.team = res.data;
        }
      });
    },

    checkCookie: function(Authorization) {
      {
        var aCookie = document.cookie.split("; ");

        for (var i = 0; i < aCookie.length; i++) {
          var aCrumb = aCookie[i].split("=");

          if (Authorization == aCrumb[0]) {
            this.headers.Authorization = unescape(aCrumb[1]);
          }
        }
        return null;
      }
    },
    //设置封面
    setSurfaceImages() {
     
    },
    getCompanyTeamLeader() {
      const params = {
        companyId: this.companyId
      };
      companyTeamLeader(params).then(res => {
        if (res.code === 200) {
          // console.log(res)
          this.teamLeader = res.data;
          console.log(this.teamLeader)
        }
      });
    },
    // 删除招商团队负责人
    handleDelTeamLeader(data) {
     
      const params = {
        userId: data.userId,
        customerCharge: 0,
        sex: data.sex || 1,
        status: data.status,
        roleId: data.roleId || getToken()
      };
      update(params).then(res => {
        if (res.code === 200) {
          this.$message.success("删除成功！");
        }
      });
    },
    // 设置招商团队弹窗
    handleSetCompanyTeam() {
      this.dialogSetCompanyTeam = true;
      const params = {
        companyId: this.companyId
      };
      customerList(params).then(res => {
        if (res.code === 200) {
          this.companyTeam = res.data;
        } else {
          this.companyTeam = this.team;
        }
      });
    },
    dialogSetCompanyTeamClose() {
      this.dialogSetCompanyTeam = false;
    },
    // 更新销控
    handleResetSalesTime() {
      const params = {
        spaceId: this.spaceId
      };
      this.resetSalesTimeLoading = true;
      spaceSaleTime(params)
        .then(res => {
          this.resetSalesTimeLoading = false;
          if (res.code === 200) {
            this.spaceInfo.company.createTime = res.data
            console.log(  this.spaceInfo.company.createTime)
            this.$message.success("更新成功！");
            this.
            this.getRoomResources();
          }
        })
        .catch(() => {
          this.resetSalesTimeLoading = false;
        });
    },
    handelBox() {
 
    },
    // 删除
    handleRoomResourcesDelete() {
      const params = {
        delIds: ""
      };
      if (!this.roomData || this.roomData.length === 0) {
        this.$message.error("请选择房源！");
        return;
      }
    
      for (const item of this.roomData) {
        params.delIds += item.roomId + ",";
      }
    
      params.delIds = params.delIds.substring(0, params.delIds.length - 1);
  
      roomResourcesBatchDelete(params).then(res => {
        if (res.code === 200) {
          this.$message.success("删除成功！");
          this.getMainSpace();
        }
      });
    },
    // 修改房源状态
    handleChangeStatus(row) {
      this.dialogStatusForm.roomId = row.roomId;
      this.dialogStatus = true;
    },
    handleDialogStatusClose() {
      this.dialogStatus = false;
      this.dialogChange = false;
    },
    // 修改房源状态提交
    handleChangeStatusSubmit() {
      roomResourcesUpdate(this.dialogStatusForm).then(res => {
        if (res.code === 200) {
          this.dialogStatus = false;
          this.getRoomResources();
        }
      });
    },
    //修改资料简介
    handleChangeEditorSubmit() {
     this.tetxShow = true
     

      this.space.spaceId = JSON.parse(
        sessionStorage.getItem("space", "spaceId")
      ).spaceId;

      spaceUpdate(this.space).then(res => {
        if (res.code === 200) {
         
		           
	   	
        }
      });

      this.changeEditor = false;
    },
    handleChangeSelectSubmit() {
      this.space.spaceId = JSON.parse(
        sessionStorage.getItem("space", "spaceId")
      ).spaceId;

      spaceUpdate(this.space).then(res => {
        if (res.code === 200) {
      
        }
      });

      this.ChangePic = false;
    },
    //修改基础信息
    handleChangeInfoSubmit() {
      this.space.spaceId = JSON.parse(
        sessionStorage.getItem("space", "spaceId")
      ).spaceId;

      spaceUpdate(this.space).then(res => {
        if (res.code === 200) {
        
        }
      });

      this.dialogChange = false;
    },

    handleChangeAroundSubmit() {
      this.space.spaceId = JSON.parse(
        sessionStorage.getItem("space", "spaceId")
      ).spaceId;

      spaceUpdate(this.space).then(res => {
        if (res.code === 200) {
         
        }
      });

      this.changeAround = false;
    },
    //切换房源与资料
    handleChangeStatusType(status) {
      this.status = status;
      if (this.status === "房源") {
        this.changeShow = true;
        this.changeShow2 = false;
      } else {
        this.changeShow = false;
        this.changeShow2 = true;

     spaceImagesList(this.form).then(res => {
        if (res.code === 200) {
         
          this.imageslist = res.data.imageslist;
       
        }
      });

      }
      // this.getData()
    },

    handlePicRemove(file, fileList) {
      //移除图片
 
    },
    handlePictureCardPreview(file, res) {
      //预览图片时调用


      this.dialogImageUrl = file.response.data.src;
      this.dialogVisible = true;
    },

    beforeAvatarImgUpload(file, res) {
      //文件上传之前调用做一些拦截限制
     
      const isJPG = true;
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarImgSuccess(res, file, fileList) {
  
        
          spaceImagesList(this.form).then(res => {
        if (res.code === 200) {

           this.imageslist = res.data.imageslist;
          this.locationImagesList = res.data.locationImagesList;
          this.effectImagesList = res.data.effectImagesList;
          this.floorImagesList = res.data.floorImagesList;
          this.indoorImagesList = res.data.indoorImagesList;
          this.supportingImagesList = res.data.supportingImagesList;
         
     
       
        }
      });

      
    },
    handlePicExceed(files, fileList) {
      //图片上传超过数量限制
      this.$message.error("上传图片不能超过6张!");
   
    },
    imgUploadError(err, file, fileList) {
      //图片上传失败调用
    
      this.$message.error("上传图片失败!");
    },
    // 路由
    handleGoto(name) {
      this.$router.push({ name });
    },
    handleEdit(id) {
      if (id) {
        this.$router.push({ name: "SpaceCreate", params: { id: id } });
      }
    },

    //地图编辑
    handleMapSet() {
      this.mapChange = true;
    },

    handleChangeMapSubmit() {
this.mapChange = false;
      this.space.spaceId = JSON.parse(
        sessionStorage.getItem("space", "spaceId")
      ).spaceId;
      spaceUpdate(this.space).then(res => {
        if (res.code === 200) {
        }
      });

    },

    //显示遮罩
    handleMouseover(index) {
      this.current = index;
      this.hoverShow = true;
    },
    handleMouseout() {
      this.hoverShow = false;
      this.current = null;
      
    },
    //设置封页
    handelSetSurfaceImages(affixId) {
      this.form.affixId = affixId;

      spaceSetSurfaceImages(this.form).then(res => {
     
      });
    },
    //删除图片
    handelDeleteImages(affixId, fieldName) {
      this.form.affixId = affixId;
      this.form.fieldName = fieldName;

      spaceDeleteImages(this.form).then(res => {
        spaceImagesList(this.form).then(res => {
          if (res.code === 200) {
           
            this.imageslist = res.data.imageslist;
            this.locationImagesList = res.data.locationImagesList;
            this.effectImagesList = res.data.effectImagesList;
            this.floorImagesList = res.data.floorImagesList;
            this.indoorImagesList = res.data.indoorImagesList;
            this.supportingImagesList = res.data.supportingImagesList;
          }
        });
      });
    },
    //展开收起
    fun_showAll() {
      this.showAll = !this.showAll;
    },

    loadScript() {
      window.initMap = () => {
        this.initMap();
      };
      if (!window.BMap) {
        const script = document.createElement("script");
        script.src =
          "http://api.map.baidu.com/api?v=2.0&ak=itq41hB0USBoLG6Gai6hKE35yYCVAPiL&callback=initMap";
        document.body.appendChild(script);
      } else {
        this.initMap();
      }
    },
    initMap() {
      var map = new window.BMap.Map("map-box"); // 创建Map实例
      var localSearch = new window.BMap.LocalSearch(map);
      localSearch.setSearchCompleteCallback(searchResult => {
        var poi = searchResult.getPoi(0);
        if (poi === undefined) {
          this.noMap = false;
          return;
        }
        var point = new window.BMap.Point(poi.point.lng, poi.point.lat);
        var marker = new window.BMap.Marker(point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        map.centerAndZoom(point, 18);

        var circle = new BMap.Circle(point, 1000, {
          fillColor: "blue",
          strokeWeight: 1,
          fillOpacity: 0.00001,
          strokeOpacity: 0.1
        });
        map.addOverlay(circle);
        var that = this;
        var local = new BMap.LocalSearch(map, {
          pageCapacity: 100,
          renderOptions: { map: map, panel: "r-result" },
          onSearchComplete(e) {
            that.subwayCount = e[0].YA;
            that.fastCount = e[1].YA;
            that.bankCount = e[2].YA;
            that.hotelCount = e[3].YA;
          }
        });
        var search = ["地铁", "餐厅", "银行", "酒店"];
        local.searchNearby(search, point, 1000);
        setTimeout(() => {
          map.clearOverlays();
          var marker = new window.BMap.Marker(point);
          map.addOverlay(marker);
        }, 4000);
      });
      localSearch.search(this.mapAddress);
    }
  },
  mounted() {
    if (this.mapAddress) {
      this.loadScript();
    }

  },


  //地图
  computed: {
    mapAddress() {
      // console.log(this.space.addressDetail)
      return  this.space.addressDetail;
    },

  },
  watch: {
    mapAddress() {
      this.loadScript();
    }
  }
};
</script>

<style lang="scss" scoped>
.bg1 {
  background: #7fbfff;
}
.bg2 {
  background: #ff9e86;
}
.bg3 {
  background: #ffde81;
}
.bg4 {
  background: #7fecb5;
}
.bg5 {
  background: #eb8775;
}
.bg6 {
  background: #e887f5;
}
.bg7 {
  background: #9881fa;
}
.bg8 {
  background: #20bbe6;
}
.space {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 66px);
  background: #fafafa;
  margin: -10px 0 0;
  .sidebar {
    // position: fixed; left: 50px; top: 50px; bottom: 0;
    min-height: calc(100vh - 70px);
    float: left;
    width: 130px;
    padding: 15px 10px 15px 15px;
    box-sizing: border-box;
    border-right: 1px solid #eee;
    background: #fff;
  }
  .image-logo {
    display: block;
    float: left;

    margin-right: 8px;
    width: 72px;
    height: 54px;
    border-radius: 3px;
  }
  .container {
    margin: 22px 260px 0 135px;
    min-height: calc(100vh - 70px);
    .block {
      background: #fff;
      padding: 15px;
      margin-bottom: 10px;
      border: 1px solid #eee;
      border-radius: 1px;
    }
    .title {
      font-size: 18px;
      color: #454545;
      .icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        background: #adbfff;
        color: #fff;
        border-radius: 20px;
        text-align: center;
        svg {
          font-size: 12px;
          vertical-align: 1px;
        }
      }
      small {
        display: block;
        font-size: 12px;
        font-weight: normal;
        color: #868686;
        padding: 10px;
        a {
          color: #adbfff;
        }
      }
    }
    .item-block {
      display: block;
      margin: 0 0 10px;
      padding: 0;
      overflow: hidden;
      list-style: none;
      .item {
        display: inline-block;
        overflow: hidden;
        height: 90px;
        color: #fff;
        line-height: 1.4em;
        border-radius: 3px;
        width: 15.8%;
        margin: 0 0.2%;
        padding: 15px 15px 10px;
        box-sizing: border-box;
        position: relative;
        &::after {
          position: absolute;
          left: 0;
          right: 0;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background-position: right bottom;
          background-size: auto 100%;
          opacity: 1;
          content: "";
        }
        .tit {
          font-size: 12px;
        }
        .con {
          font-size: 16px;
          display: block;
          font-weight: bold;
        }
        &.purple {
          background-color: #bf84f8;
          background-image: linear-gradient(to right, #e987f5, #9781fa);
          &::after {
            background-image: url("../../assets/images/icon/purple.png");
          }
        }
        &.indigo {
          background-color: #68a0fc;
          background-image: linear-gradient(to right, #6bbafe, #668ffb);
          &::after {
            background-image: url("../../assets/images/icon/indigo.png");
          }
        }
        &.orange {
          background-color: #fd907f;
          background-image: linear-gradient(to right, #ffa380, #fc807f);
          &::after {
            background-image: url("../../assets/images/icon/orange.png");
          }
        }
        &.blue {
          background-color: #31cbe9;
          background-image: linear-gradient(to right, #46dded, #1ebae6);
          &::after {
            background-image: url("../../assets/images/icon/blue.png");
          }
        }
        &.green {
          background-color: #26dcbe;
          background-image: linear-gradient(to right, #2ff2c2, #1bc4b8);
          &::after {
            background-image: url("../../assets/images/icon/green.png");
          }
        }
        &.pink {
          background-color: #ff88b1;
          background-image: linear-gradient(to right, #f888ce, #ff8897);
          &::after {
            background-image: url("../../assets/images/icon/pink.png");
          }
        }
      }
    }

    .exercise-content {
      background: #fff;
      .tag {
        display: block;
        width: 100%;
        list-style: none;
        border-bottom: 1px solid #ddd;
        margin: 0 0 20px;
        padding: 0;
        .list {
          display: inline-block;
          margin: 0 30px 0 0;
          padding: 10px 5px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          &.on {
            color: #6d8dfc;
            position: relative;
            &::after {
              position: absolute;
              bottom: -1px;
              left: 5px;
              right: 5px;
              height: 3px;
              background: #6d8dfc;
              content: "";
            }
          }
        }
      }
    }
    .toolbar {
      overflow: hidden;
      margin-bottom: 10px;
      .btn {
        float: right;
        display: block;
        margin: 0;
        padding: 3px 0 0;
        list-style: none;
        & > * {
          display: inline-block;
          margin: 0 3px;
          font-size: 14px;
          color: #686868;
          cursor: pointer;
          user-select: none;
          svg {
            font-size: 13px;
            margin: 0 1px;
          }
          &:active {
            color: 333;
          }
        }
      }
      .txt {
        font-size: 13px;
        color: #686868;
        margin-right: 15px;
      }
    }
    .table-row {
      .svg-icon {
        display: none;
        color: #fc8a87;
      }
      &:hover {
        .svg-icon {
          display: inline-block;
        }
      }
    }
    /deep/ .el-table__header th {
      background: #f2f3f4;
    }
  }
  .sidebar-right {
    float: right;
    width: 250px;
    min-height: calc(100vh - 70px);
    background: #fff;
    border: 1px solid #eee;
    padding: 20px;
    box-sizing: border-box;
    .title {
      font-size: 14px;
      padding-top: 12px;
      &.nospace {
        padding-top: 0;
      }
    }
    .btn-list {
      display: block;
      font-size: 13px;
      padding: 8px 10px;
      border: 1px solid #eee;
      color: #686868;
      margin-bottom: 12px;
      border-radius: 3px;
      &:hover {
        color: #111;
        border-color: #ddd;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
      }
      &.room {
        position: relative;
        .room-list {
          position: absolute;
          top: 12px;
          left: -1px;
          right: -1px;
          display: none;
          padding: 10px 30px;
          background: #fff;
          line-height: 2.6em;
          list-style: none;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }
        &:hover {
          .room-list {
            display: block;
          }
        }
      }
    }
    .head-block {
      display: block;
      overflow: hidden;
    }
    .head,
    .head-add {
      display: block;
      float: left;
      border: 1px solid #eee;
      border-radius: 50px;
      width: 42px;
      height: 42px;
      margin: 0 5px 10px;
      line-height: 42px;
      text-align: center;
      color: #fff;
      position: relative;
    }
    .head-add {
      border-radius: 5px;
      border-style: dashed;
      color: #868686;
      &:hover {
        border-color: #ddd;
        color: #686868;
      }
    }
    .head img {
      width: 42px;
      height: 42px;
      border: none;
      border-radius: 50px;
    }
    .head:hover {
      .del {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        line-height: 18px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 20px;
        color: #fff;
        font-weight: bold;
        overflow: hidden;
      }
    }
  }
}
.c-pane-container {
  transform: scale(0.8);
  margin: -20px 0 0 -25px;
}
.setCompanyTeamCon {
  overflow: hidden;
  .list {
    display: inline-block;
    margin: 0 5px 10px;
    width: 48px;
    height: 48px;
    border: 1px solid #eee;
    border-radius: 50px;
    color: #fff;
  }
}

.materialBox {
  padding-bottom: 20px;
  border-bottom: 1px #eee solid;
  margin-bottom: 20px;
}
.materialBox h2 {
  font-weight: normal;
  height: 24px;
  line-height: 24px;
  padding-bottom: 8px;
}
.materialBox h2 span {
  display: inline-block;
  font-size: 14px;
  color: #9096a9;
}
.briefIntroduction {
  line-height: 15px;
  font-size: 12px;
  color: #2b2b2b;
}
.briefIntroduction a {
  display: inline-block;
  cursor: pointer;
  color: #6d8dfc;
}
.changeEdit {
  float: right;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.upload-demo {
  margin-top: -50px;
}
.uploadFile {
  float: right;
}
.basisInfo {
  height: 131px;
}
.basisInfo li {
  display: inline-block;
  width: 33%;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
}
.basisInfo li span {
  display: inline-block;
  color: #999;
  font-size: 12px;
}

.addressList {
  display: inline-block;
}

.addressList p {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}

.addressMap {
  display: inline-block;
  width: 160px;
  height: 74px;
  border-radius: 5px;
}
.addressList p i {
  display: inline-block;
  color: #95a0cb;
  font-style: normal;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  width: 100px;
}

.avatar {
  width: 100px !important;
  height: 100px;
  display: block;
}
.el-upload el-upload--picture-card {
  width: 108px !important;
  height: 148px;
}

.el-upload-list--picture-card .el-upload-list__item {
  width: 100px !important;
}

.avatar-uploader >>> li {
  width: 102px;
  height: 84px;
  margin-top: 15px;
}

.avatar-uploader >>> .el-upload--picture-card {
  width: 102px;
  height: 84px;
  margin-top: 15px;
}
.upload-demo >>> .el-upload {
  height: 40px;
  display: block;
}
.el-icon-plus-second {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 84px;
}
.el-tabs >>> .el-tabs__item.is-active {
  color: white;
}
.imgssss {
  height: 84px;
  width: 104px;
  border: 1px solid black;
}

.imgBox {
  position: relative;

  ul {
    display: flex;
    flex-wrap: wrap;
    height: 300px;
    overflow: auto;
    padding: 0;

    .imgList {
      margin-left: 10px;
      margin-bottom: 20px;
      height: 84px;
      width: 104px;
      list-style: none;
      border-radius: 4px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }

      .hoverList {
        position: relative;
        top: -69px;
        left: 33px;
        height: 66px;
        width: 71px;
        background-color: #fff;
        border-radius: 4px;
        text-align: center;
        padding: 0;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        li {
          width: 100%;
          height: 33px;
          list-style: none;
        }

        li:hover {
          background-color: #fafafa;
        }
      }
    }
  }
}

.ellpes {
  text-overflow: ellipsis;

  overflow: hidden;

  display: -webkit-box;

  -webkit-line-clamp: 3; /*这个数字是设置要显示省略号的行数*/

  -webkit-box-orient: vertical;
}

.imgBoxSpan {
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

.imgBoxSpace {
  display: inline-block;
  width: 72px;
  height: 54px;
  position: relative;
}

#map-box {
  // margin-top: 20px;
  width: 450px;
  height: 300px;
  background: #eee;
  // float: right;
  margin-right: 100px;
}
</style>
