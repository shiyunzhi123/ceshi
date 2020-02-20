import request from '@/utils/request'
import requestCustom from '@/utils/requestCustom'
import qs from 'qs'

export function login(data) {
  const params = qs.stringify(data)
  return requestCustom({
    // url: `/login?uuid=${data.uuid}&verifyCode=${data.verifyCode}&password=${password}&username=${data.username}`,
    url: `/login?${params}`,
    method: 'post'
  })
  // return request({
  //   url: '/user/login',
  //   method: 'post',
  //   data
  // })
}

export function getInfo(token) {
  return {
    code: 200,
    data: {
      name: 'test',
      avatar: ''
    }
  }
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 设置或删除招商负责人
export function update(data) {
  const params = qs.stringify(data)
  return requestCustom({
    url: `/user/update?${params}`,
    method: 'post',
    // data: params
  })
}
// 删除
export function userDelete(data) {
  return requestCustom({
    url: `/user/delete/${data.userId}`,
    method: 'get',
    // data: params
  })
}
// 企业账户列表
export function customerList(data) {
  return requestCustom({
    url: `/user/customerList`,
    method: 'get',
    params: data
  })
}

//人员信息

export function userCustomerInfo() {
  return requestCustom({
    url: `/user/customer/info`,
    method: 'get',
    // params: data
  })
}