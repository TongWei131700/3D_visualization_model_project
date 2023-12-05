import request from '@/utils/request'

/**
 * 获取楼层信息
 * @param param
 * @returns {AxiosPromise}
 */
export function getMonitorList(param) {
  return request({
    url: `sys/group/getGroupByFloor?strFloor=${param}`,
    method: 'get'
  })
}

/**
 * 获取哨兵组信息
 * @returns {AxiosPromise}
 */
export function getGroupMonitorList() {
  return request({
    url: `sys/group/getAllGroupIdNameLocation`,
    method: 'get'
  })
}

export function getTrailOneWeek(param) {
  return request({
    url: 'sys/trail-point/getTrailOneWeek',
    method: 'get',
    params: {
      floor: param
    }
  })
}

export function getTrailPoints(queryParams) {
  return request({
    url: 'sys/trail-point/getTrailPoints',
    method: 'get',
    params: {
      curPage: queryParams.currentPage,
      pageSize: queryParams.pageSize,
      groupId: queryParams.groupId,
      startTime: queryParams.startTime,
      endTime: queryParams.endTime
    }
  })
}

/**
 * 获取时间段所有雷达数据点的新接口函数： 2023/2/22
 */
export function getTrailPointsNew(param) {
  return request({
    url: '/sys/trail-point/getTrailPointsnew',
    method: 'get',
    params: param
  })
}
