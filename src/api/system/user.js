import request from '@/utils/request'
import qs from "qs";

// 分页查询用户信息
export function queryUser(pageNo, pageSize) {
  return request({
    url: '/user/queryUser',
    method: 'get',
    params: {
      pageNo,
      pageSize,
    }
  })
}

export function editUser(formData) {
  return request({
    url: '/user/editUser',
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      ...formData,
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function addUser(formData) {
  return request({
    url: '/user/addUser',
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      ...formData,
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function queryRole(pageNo, pageSize) {
  return request({
    url: '/role/queryRole',
    method: 'GET',
    params: {
      pageNo,
      pageSize,
    },
  })
}

export function addRole(formData) {
  return request({
    url: '/role/addRole',
    method: 'POST',
    params: {
      ...formData,
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function editRole(formData) {
  return request({
    url: '/role/editRole',
    method: 'POST',
    params: {
      ...formData,
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function resetPassword(userId) {
  return request({
    url: '/user/resetPwd',
    method: 'POST',
    params: {
      userId,
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function modifyPassword(oldPwd, newPwd) {
  return request({
    url: '/user/modifyPwd',
    method: 'POST',
    params: {
      oldPwd,
      newPwd,
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function getPermCascade() {
  return request({
    url: '/role/getPerms',
    method: 'GET',
  })
}
