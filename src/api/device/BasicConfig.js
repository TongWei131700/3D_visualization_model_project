import request from '@/utils/request'

/**
 * 获取所有哨兵组信息（至少包括id，名字）
 * @author YJ
 */
export function getAllMonitorGroupIdName() {
    return request({
        url: 'sys/group/getGroup',
        method: 'get'
    })
}

/**
 * 增加哨兵组 通过名字
 *  @author YJ
 */
export function addMonitorGroupByName(data) {
    return request({
        url: 'sys/group/addGroupName',
        method: 'post',
        data
    })
}

/**
 * 编辑哨兵组
 *  @author YJ
 */
export function updateGroup(data) {
    return request({
        url: 'sys/group/updateGroup',
        method: 'post',
        data
    })
}

/**
 * 删除哨兵组
 *  @author YJ
 */
export function deleteGroup(data) {
    return request({
        url: 'sys/group/deleteGroup?groupIdList=' + data,
        method: 'post'
    })
}

/**
 * 获取雷达所有信息
 *  @author YJ
 */
export function getAllRadar() {
    return request({
        url: 'sys/radarDevice/getAllRadar',
        method: 'get'
    })
}

/**
 * 删除雷达
 *  @author WJ
 */
export function deleteRadar(data) {
    return request({
        url: '/sys/radarDevice/deleteRadar?radarSn=' + data,
        method: 'delete'
    })
}

/**
 * 获取摄像头所有信息
 *  @author YJ
 */
export function getAllCamera() {
    return request({
        url: 'device/camera/getAllCarema',
        method: 'get'
    })
}

/**
 * 修改摄像头信息
 *  @author YJ updateCaremaInfo
 */
export function updateCaremaInfo(data) {
    return request({
        url: 'device/camera/updateCarema',
        method: 'post',
        data
    })
}

/**
 * 删除摄像头
 *  @author WJ
 */
export function deleteCamera(data) {
    return request({
        url: '/camera/deleteCamera?cameraSn=' + data,
        method: 'delete'
    })
}

/**
 * 修改雷达信息
 *  @author YJ
 */
export function updateRadarInfo(data) {
    return request({
        url: 'sys/radarDevice/updateRadar',
        method: 'post',
        data
    })
}

/**
 * 添加防区
 * @param {防区点的坐标信息，以及对应的雷达和楼层信息} data
 * @returns
 */
export function saveDefenceInfo(data) {
    return request({
        url: '/sys/radar-defence-info/save/defenceInfo',
        method: 'post',
        data
    })
}

/**
 *
 * @returns 获取到所有的防区信息
 */
export function getDefenceInfo(data) {
    return request({
        url: '/sys/radar-defence-info/get/defenceInfo',
        method: 'get',
        data
    })
}

/**
 *
 * 根据Sn删除防区信息
 */
export function deleteDefenceInfo(data) {
    return request({
        url: '/sys/radar-defence-info/delete/defenceInfo/BySn?radarSns=' + data,
        method: 'delete',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export function getVideoStream(cameraSn) {
    // console.log('cameraSn++++++++++++++++++', cameraSn)
    const data = { 'cameraSn': cameraSn }
    return request({
        url: '/sys/video-stream/getVideoStream',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data
    })
}

/**
 * 注册人脸识别
 * @param data
 * @returns {AxiosPromise}
 */
export function registerFaceRecognise(data) {
    return request({
        url: '/sys/user_face_info/faceAdd',
        method: 'post',
        data
    })
}

/**
 * 获取人脸库信息
 * @returns {AxiosPromise}
 */
export function getAllFaceUser() {
    return request({
        url: '/sys/user_face_info/getAllFaceUser',
        method: 'get'
    })
}

/**
 * 通过ID删除人脸库信息
 * @returns {AxiosPromise}
 */
export function deleteUserFaceInfo(data) {
    return request({
        url: '/sys/user_face_info/deleteUserFaceInfo?id=' + data,
        method: 'delete'
    })
}

/**
 * 获取传感器所有信息
 *  @author MJ
 */
export function getAllSensor() {
    return request({
        url: '/sys/sensorDevice/allSensorDevices',
        method: 'get'
    })
}

/**
 * 修改传感器信息
 *  @author MJ
 */
export function updateSensorInfo(data) {
    return request({
        url: '/sys/sensorDevice/updateSensor',
        method: 'post',
        data
    })
}
/**
 * 删除传感器
 *  @author MJ
 */
export function deleteSensor(data) {
    return request({
        url: '/sys/sensorDevice/deleteSensor?sensorSn=' + data,
        method: 'delete'
    })
}
/**
 * 添加传感器绑定到雷达
 *  @author MJ
 */
export function setSensorBind(data) {
    return request({
        url: '/sys/radarDevice/setRadarBind',
        method: 'post',
        params: data
    })
}
/**
 * 添加传感器绑定到雷达
 *  @author MJ
 */
export function deleteSensorBind(data) {
    return request({
        url: '/sys/radarDevice/deleteRadarBind',
        method: 'delete',
        params: data
    })
}

//获取雷达对应规则以及状态
export function getSensorsListByRadarSn(param) {
    return request({
        url: '/sys/radarDevice/getSensorListByRadarSn',
        method: 'get',
        params: param
    })
}
/**
 * 重启雷达
 *  @author MJ
 */
export function restartRadar(params) {
    return request({
        url: '/sys/radarControl/reboot/' + params,
        method: 'get',
        // params
    })
}
/**
 * 修改雷达参数
 *  @author MJ
 */
export function updateRadarParamsInfo(data) {
    return request({
        url: '/sys/radarControl/config',
        method: 'put',
        data
    })
}
/**
 * 修改雷达参OTA
 *  @author MJ
 */
export function updateRadarOTAInfo(data) {
    return request({
        url: '/sys/radarControl/ota',
        method: 'put',
        data
    })
}

//获取雷达参数
export function getConfigByRadarSn(param) {
    return request({
        url: '/sys/radarControl/config/' + param,
        method: 'get',
        // params: param
    })
}
//获取雷达OTA参数
export function getOTAByRadarSn(param) {
    return request({
        url: '/sys/radarControl/ota/' + param,
        method: 'get',
        // params: param
    })
}