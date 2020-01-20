import requestCustom from '@/utils/requestCustom'
import qs from 'qs'

// 启用状态列表
export function commission(data) {
  const time = (new Date()).getTime()
  return requestCustom({
    url: `/companyTeam?v=${time}`,
    method: 'get',
    params: data
  })
}
// 佣金新增数据
export function commissionAdd(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/commission/add`,
    method: 'post',
    params: data
  })
}
// 更新
export function commissionUpdate(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/commission/update`,
    method: 'post',
    params: data
  })
}
// 删除
export function commissionDelete(data) {
  return requestCustom({
    url: `/commission/delete`,
    method: 'delete',
    params: data
  })
}
