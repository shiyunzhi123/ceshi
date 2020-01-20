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
