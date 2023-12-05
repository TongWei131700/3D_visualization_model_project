import request from '@/utils/request'

export function uploadModelAPI(file) {
  return request({
    url: `/sys/map-model/mapUpload`,
    method: 'post',
    data: file
  })
}

export function initMapAPI() {
  return request({
    url: `/sys/map-model/getEnabledMapInfo`,
    method: 'get'
  })
}

export function putMapConfigureAPI(data) {
  return request({
    url: `/sys/map-model/updateEnabledMapConfigure`,
    method: 'put',
    data: data
  })
}

export function floorSaveParam(param) {
  return request({
    url: `/sys/map-model/savefloorparam`,
    method: 'post',
    data: param
  })
}

export function getFloorShot(param) {
  return request({
    url: `/sys/map-model/floor_shot`,
    method: 'get',
    params: param
  })
}

// 修改楼层镜头参数
export function floorShotAdd(param) {
  return request({
    url: `/sys/map-model/floor_shot_add`,
    method: 'post',
    data: param
  })
}
