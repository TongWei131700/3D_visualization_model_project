import request from '@/utils/request'
/**
 * 获取所有哨兵组以及规则的信息
 * @author wj
 */
export function getAllMonitorGroupInfo() {
    return request({
        url: 'sys/group/getGATInfo',
        method: 'get'
    })
}

/**
 * 搜索所有哨兵组以及规则的信息
 * @author wj
 */
export function getAllMonitorGroupId() {
    return request({
        url: 'sys/group/getGATInfo',
        method: 'get'
    })
}

/**
 * 获取所有哨兵组的信息
 * @author wj
 */
export function getAllMonitorGroupIdName() {
    return request({
        url: 'sys/group/getGroup',
        method: 'get'
    })
}

/**
 * 更改哨兵组整体配置
 * @author wj
 * @param
 */
export function updateMonitorRule(param) {
    return request({
        url: 'sys/group/updateGATInfo',
        method: 'post',
        data: param
    })
}

/**
 * 增加哨兵组整体配置
 * @author wj
 * @param
 */
export function addMonitorRule(param, groupIdList) {
    return request({
        url: 'sys/group/addGATInfo?groupIdList=' + groupIdList,
        method: 'post',
        data: param
    })
}


/**
 * 删除规则
 */
export function deleteAlarmTimeBytimeId(data) {
    return request({
        url: 'sys/alarmTime/deleteAlarmTimeByGroupId/' + data,
        method: 'post'
    })
}

/**
 * 批量删除规则
 */
export function deleteAlarmTimeBytimeIds(data) {
    return request({
        url: 'sys/alarmTime/deleteAlarmTimeByIds?ids=' + data,
        method: 'post'
    })
}

/**
 * 删除规则
 */
export function deleteAlarmTimeById(id) {
    return request({
        url: 'sys/alarm_rule/delete?id=' + id,
        method: 'post',

    })
}

/**
 * 批量删除规则
 */
export function deleteAlarmTimeByIds(ids) {
    return request({
        url: 'sys/alarm_rule/deleteList',
        method: 'post',
        data: ids
    })
}
// 获取规则列表

export function getRuleList(type) {
    return request({
        url: 'sys/alarm_rule/list/' + type,
        method: 'get'

    })
}
/**
 * 增加交集规则
 * @author mj
 * @param
 */
export function addIntersectRule(param) {
    return request({
        url: 'sys/alarm_rule/add/andRule/',
        method: 'post',
        data: param
    })
}
/**
 * 增加并集规则
 * @author mj
 * @param
 */
export function addMergeRule(param) {
    return request({
        url: 'sys/alarm_rule/add/orRule/',
        method: 'post',
        data: param
    })
}

// 获取交集规则列表

export function andRulesName() {
    return request({
        url: 'sys/alarm_rule/andRulesName',
        method: 'get'

    })
}
// 获取并集规则列表

export function orRulesName() {
    return request({
        url: 'sys/alarm_rule/orRulesName',
        method: 'get'

    })
}
// 获取规则列表

export function getRulesName() {
    return request({
        url: 'sys/alarm_rule/allRulesName',
        method: 'get'

    })
}
// 根据id获取规则名称
export function getRulesByIds(param) {
    return request({
        url: '/sys/alarm_rule/ruleNameList',
        method: 'get',
        data: param
    })
}
// 编辑规则

export function updateRule(param) {
    return request({
        url: 'sys/alarm_rule/updateRule',
        method: 'post',
        data: param

    })
}
export function updateAndRule(param) {
    return request({
        url: 'sys/alarm_rule/updateAndRule',
        method: 'post',
        data: param

    })
}
export function AddRuleBind(param) {
    return request({
        url: 'sys/alarm_rule/addRuleBind',
        method: 'post',
        params: param
    })
}

// 添加警报联系人
export function AddContact(param) {
    return request({
        url: '/sys/alarm-receiver/add',
        method: 'post',
        data: param
    })
}

// 获取所有语音
export function allVoices() {
    return request({
        url: '/sys/sensorVoice/allvoices',
        method: 'get'
    })
}
// 获取所有警报联系人
export function allContactor() {
    return request({
        url: '/sys/alarm-receiver/all',
        method: 'post'
    })
}

// // 获取所有报警语音
// export function allVoice() {
//     return request({
//         url: '/sys/alarm-receiver/all',
//         method: 'get'
//     })
// }

// 删除选中的警报联系人方式
export function deleteContact(param) {
    return request({
        url: '/sys/alarm-receiver/delete',
        method: 'post',
        data: param
    })
}


// 批量删除多个联系人
export function deleteFewContact(param) {
    return request({
        url: '/sys/alarm-receiver/delete/batch',
        method: 'post',
        data: param
    })
}

//获取报警天数
export function GetAlarmFrequency(param) {
    return request({
        url: '/sys/info/all',
        method: 'get',
        data: param
    })
}
//获取雷达对应规则以及状态
export function getRulesByRadarSn(param) {
    return request({
        url: '/sys/alarm_rule/getRadarRuleBind',
        method: 'get',
        params: param
    })
}