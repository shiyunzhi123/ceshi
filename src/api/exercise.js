import requestCustom from '@/utils/requestCustom'
import qs from 'qs'
// 佣金列表
export function commissionList(data) {
  return requestCustom({
    url: `/commission/list`,
    method: 'get',
    params: data
  })
}
// 活动列表
export function activityList(data) {
  return requestCustom({
    url: `/activity/list`,
    method: 'get',
    params: data
  })
}
// 房源
export function roomResourcesList(data) {
  return requestCustom({
    url: `/roomResources/list`,
    method: 'get',
    params: data
  })
}
// 查询空间
export function findMySpaces() {
  return requestCustom({
    url: `/space/myspaces`,
    method: 'get'
  })
}
