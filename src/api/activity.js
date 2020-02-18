import requestCustom from '@/utils/requestCustom'
import qs from 'qs'

// 新增活动
export function activityAdd(data) {
  return requestCustom({
    url: `/activity/add`,
    method: 'post',
    params: data
  })
}

//修改活动
export function activityUpdata(data) {
  return requestCustom({
    url: `/activity/update`,
    method: 'post',
    params: data
  })
}
// 删除房
export function activityDelete(data) {
  return requestCustom({
    url: `/activity/delete`,
    method: 'delete',
    params: data
  })
}
// 查询
export function activityDetail(data) {
  return requestCustom({
    url: `/activity/detail/${data.id}`,
    method: 'get',
    params: data
  })
}


// 图片
export function UploadRoomImage(data) {
  return requestCustom({
    url: `/upload/roomImage`,
    method: 'post',
    params: data
  })
}



//作废

export function activityDisable(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/activity/disable`,
    method: 'post',
    params: data
  })
}

//活动对应的数据列表
export function activityRoomList(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/activity/roomList`,
    method: 'get',
    params: data
  })
}




//使用佣金

export function roomActivitiesAdd(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/roomActivities/add`,
    method: 'post',
    params: data
  })
}


//取消使用
export function roomActivitiesCancle(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/roomActivities/cancle`,
    method: 'post',
    params: data
  })
}
