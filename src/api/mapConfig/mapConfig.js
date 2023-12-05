import request from '@/utils/request'

/**
 * 获得所有地图信息
 * @author Lyc
 */
export function getAllMapInfo() {
    return request({
        url: `/sys/map-model/getAllMapInfo`,
        method: 'get'
    })
}

/**
 * 获得当前正在使用的地图信息
 * @author Lyc
 */
export function getEnabledMapInfo() {
    return request({
        url: `/sys/map-model/getEnabledMapInfo`,
        method: 'get'
    })
}

/**
 * 根据MapID修改地图配置信息（不包括启用状态）
 * @author Lyc
 * @param mapConfig:
 * {"id": 0,
  "mapName": "string",
  "positionX": 0,
  "positionY": 0,
  "positionZ": 0,
  "rotationX": 0,
  "rotationY": 0,
  "rotationZ": 0,
  "scaling": 0
  }
 */
export function updateMapConfigById(mapConfig) {
    return request({
        url: `/sys/map-model/updateMapConfigById`,
        method: 'put',
        data: {
            id: mapConfig.id,
            mapName: mapConfig.mapName,
            positionX: mapConfig.positionX,
            positionY: mapConfig.positionY,
            positionZ: mapConfig.positionZ,
            rotationX: mapConfig.rotationX,
            rotationY: mapConfig.rotationY,
            rotationZ: mapConfig.rotationZ,
            scaling: mapConfig.scaling
        }
    })
}

/**
 * 根据MapID修改地图启用状态
 * @author Lyc
 * @param mapId
 */
export function enabledMapById(mapId) {
    console.log(mapId)
    return request({
        url: `/sys/map-model/enabledMapById`,
        method: 'put',
        params: { mapId }
    })
}


export function deleteMapByName(mapName) {
    return request({
        url: `/sys/map-model/delete`,
        method: 'post',
        params: mapName
    })
}
