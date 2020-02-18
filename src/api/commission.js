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


// 查询
export function commissionDetail(data) {
  return requestCustom({
    url: `/commission/detail/${data.id}`,
    method: 'get',
    params: data
  })
}

// 更新
export function commissionUpdate(data) {
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

//作废

export function commissionDisable(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/commission/disable`,
    method: 'post',
    params: data
  })
}

//使用佣金

export function roomCommissionAdd(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/roomCommission/add`,
    method: 'post',
    params: data
  })
}


//取消使用
export function roomCommissionCancle(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/roomCommission/cancle`,
    method: 'post',
    params: data
  })
}



//佣金对应的数据列表
export function commissionRoomList(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/commission/roomList`,
    method: 'get',
    params: data
  })
}
