import request from '@/utils/request'
import qs from 'qs'

export function getMonitorList() {
  return request({
    url: 'sys/group/getAllGroupIdNameLocation',
    method: 'get'
  })
}

export function getAlarmList(params) {
  return request({
    url: 'sys/alarm-message/getAlarmMessage/ByCondition',
    method: 'get',
    params
  })
}

export function getRecordOrPictureById(alarmId) {
  return request({
    url: 'sys/alarm-message/pageListByAlarmMessage',
    method: 'get',
    params: {
      alarmMessageId: alarmId
    }
  })
}

export function readSomeMessages(alarmIdArray) {
  return request({
    url: 'sys/alarm-message/readSomeMessages',
    method: 'post',
    params: {alarmIds: alarmIdArray},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}
