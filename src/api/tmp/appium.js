import request from '@/utils/request'


export function showMenu (id) {
  return request({
    url: `/admin/core/doc/showMenu/${id}`,
    method: 'get',
  })
}

export function updateApiGroup (projid, data) {
  return request({
    url: 'http://127.0.0.1:8000/updateApiGroup/' + projid + '/',
    method: 'post',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'  //如果写成contentType会报错
    },
    data: JSON.stringify(data)
  })
}

export function getApi (projid, apiGroupId) {
  return request({
    url: 'http://127.0.0.1:8000/getApi/' + projid + '/' + apiGroupId + '/',
    method: 'get',
  })
}

export function updateApis (data) {
  return request({
    url: 'http://127.0.0.1:8000/updateApi/',
    method: 'post',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'  //如果写成contentType会报错
    },
    data: JSON.stringify(data)
  })
}

export function addApi (data) {
  return request({
    url: 'http://127.0.0.1:8000/addApi/',
    method: 'post',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'  //如果写成contentType会报错
    },
    data: JSON.stringify(data)
  })
}

// ==================新接口===================

// 获取某个项目下的接口分组
export function getApiGroup2 (projid) {
  return request({
    url: 'http://127.0.0.1:8000/apiGroup2/' + projid + '/',
    method: 'get',
  })
}

// 修改某个项目下的接口分组
export function updateApiGroup2 (projid, data) {
  return request({
    url: 'http://127.0.0.1:8000/apiGroup2/' + projid + '/',
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'  //如果写成contentType会报错
    },
    data: data
  })
}

// 获取某个接口分组下的所有接口
export function getApiList (projId, apiGroupId, ordering) {
  return request({
    url: 'http://127.0.0.1:8000/api2/',
    params: { 'projId': projId, 'apiGroupId': apiGroupId, 'ordering': ordering },
    method: 'get',
  })
}

// 获取接口，按id
export function getApi2 (id) {
  return request({
    url: 'http://127.0.0.1:8000/api2/' + id + '/',
    method: 'get',
  })
}

// 新增接口
export function addApi2 (data) {
  return request({
    url: 'http://127.0.0.1:8000/api2/',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'  //如果写成contentType会报错
    },
    data: data
  })
}

// 更新接口
export function updateApi2 (id, data) {
  return request({
    url: 'http://127.0.0.1:8000/api2/' + id + '/',
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'  //如果写成contentType会报错
    },
    data: data
  })
}

// 删除接口
export function deleleApi2 (id) {
  return request({
    url: 'http://127.0.0.1:8000/api2/' + id + '/',
    method: 'delete'
  })
}
