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
