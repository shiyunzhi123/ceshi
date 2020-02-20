import request from '@/utils/request'
import requestCustom from '@/utils/requestCustom'
import qs from 'qs'
// 空间列表？
export function spaceList(data) {
  return requestCustom({
    url: `/space/list`,
    method: 'get',
    params: data
  })
}
// 我的空间列表
export function myspaces(data) {
  return requestCustom({
    url: `/space/myspaces`,
    method: 'get',
    params: data
  })
}
// 新增楼盘
export function spaceAdd(data) {
  return requestCustom({
    url: `/space/add`,
    method: 'post',
    params: data
  })
}
// 房源
export function roomResources() {
  return requestCustom({
    url: `/roomResources/list`,
    method: 'get'
  })
}
// 空间信息
export function mainspace(data) {
  return requestCustom({
    url: `/space/mainspace`,
    method: 'get',
    params: data
  })
}

//修改资料

export function spaceUpdate(data) {
  const params = qs.stringify(data)
  console.log(params)
  return requestCustom({
    url: `/space/update`,
    method: 'post',
    params: data
  })
}

export function spaceMyspace(data) {
  const params = qs.stringify(data)
  console.log(params)
  return requestCustom({
    url: `/space/myspace`,
    method: 'get',
    params: data
  })
}

//删除文件
export function spaceAffixDelete(data) {
  console.log(data)
  return requestCustom({
    url: `/affix/delete/${data}`,
    method: 'get',
    // params: data
  })
}

//获取图片List
export function  spaceImagesList(data) {
  const params = qs.stringify(data)
  console.log(params)
  return requestCustom({
    url: `/space/imageslist`,
    method: 'get',
    params: data
  })
}

//设置封面

export function  spaceSetSurfaceImages(data) {
  const params = qs.stringify(data)
  console.log(params)
  return requestCustom({
    url: `/space/setSurfaceImages`,
    method: 'get',
    params: data
  })
}

//删除空间图片

export function  spaceDeleteImages(data) {
  const params = qs.stringify(data)
  console.log(params)
  return requestCustom({
    url: `/space/deleteImages`,
    method: 'post',
    params: data
  })
}


//公司品牌
export function  companyMycompany() {
 
  // console.log(params)
  return requestCustom({
    url: `/company/mycompany`,
    method: 'get',
    // params: data
  })
}


//获取时间
export function  spaceSaleTime(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/space/saleTime`,
    method: 'get',
    params: data
  })
}



//更新时间
export function  resetSalesTime(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/roomResources/resetSalesTime`,
    method: 'post',
    params: data
  })
}


//设置招商负责人

export function  addChargerLeader(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/space/addCustomerCharger`,
    method: 'post',
    params: data
  })
}



//设置招商团队

export function  addCustomer(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/space/addCustomer`,
    method: 'post',
    params: data
  })
}


//修改个人信息


export function  userUpdate(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/space/userUpdate`,
    method: 'post',
    params: data
  })
}



//人员信息

export function  spaceCustomerInfo() {
  return requestCustom({
    url: `/space/customerInfo`,
    method: 'get',
   
  })
}


//企业信息



export function  spaceMycompany() {
  return requestCustom({
    url: `/company/mycompany`,
    method: 'get',
   
  })
}

//修改企业信息


export function  spaceCompanyUpdate(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/space/companyUpdate`,
    method: 'post',
    params:data
   
  })
}
