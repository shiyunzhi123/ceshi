import request from '@/utils/request'
import requestCustom from '@/utils/requestCustom'
import qs from 'qs'

// 添加房源
export function roomResourcesAdd(data) {
  // const params = qs.stringify(data)
  return requestCustom({
    url: `/roomResources/add`,
    method: 'post',
    params: data
  })
}
// 获取房源列表
export function roomResources(data) {
  return requestCustom({
    url: `/roomResources/list`,
    method: 'get',
    params: data
  })
}
// 更新销控
export function resetSalesTime(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/roomResources/resetSalesTime?${params}`,
    method: 'post'
  })
}
// 删除房源
export function roomResourcesDelete(data) {
  console.log("Ssss")
  console.log(data)
  return requestCustom({
    url: `/roomResources/delete`,
    method: 'get',
    params: data
  })
}
//删除多条
export function roomResourcesBatchDelete(data) {
  console.log(data)
  return requestCustom({
    url: `/roomResources/batchDelete`,
    method: 'get',
    params: data
  })
}
// 修改
export function roomResourcesUpdate(data) {

  const params = qs.stringify(data)
  // console.log(params)
  return requestCustom({
    // url: `/roomResources/update?${params}`,
    url: `/roomResources/update`,
    method: 'post',
    params: data
  })
}
// 查询详情
export function roomResourcesDetail(data) {
  const params = qs.stringify(data)
  return requestCustom({
    // url: `/roomResources/update?${params}`,
    url: `/roomResources/detail`,
    method: 'get',
    params: data
  })
}


// export function UploadRoomImage(data) {
//   return requestCustom({
//     url: `/upload/roomImage`,
//     method: 'post',
//     params: data
//   })
// }


//删除文件
export function spaceAffixDelete(data) {
  console.log(data)
  return requestCustom({
    url: `/affix/delete/${data}`,
    method: 'get',
    // params: data
  })
}