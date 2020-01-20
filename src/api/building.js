import requestCustom from '@/utils/requestCustom'
import qs from 'qs'

// 楼盘列表
export function buildingList(data) {
  return requestCustom({
    url: `/building/list`,
    method: 'get',
    params: data
  })
}
