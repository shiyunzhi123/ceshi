import requestCustom from '@/utils/requestCustom'
import qs from 'qs'

// 企业招商团队成员
export function companyTeam(data) {
  const time = (new Date()).getTime()
  return requestCustom({
    url: `/companyTeam?v=${time}`,
    method: 'get',
    params: data
  })
}
// 企业招商负责人
export function companyTeamLeader(data) {
  return requestCustom({
    url: `/companyTeamLeader`,
    method: 'get',
    params: data
  })
}
