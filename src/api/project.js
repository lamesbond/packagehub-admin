import request from '@/utils/request'

export default {
  listNextChildNode(id, userId) {
    return request({
      url: `/admin/core/project/listNextChildNode/${id}/${userId}`,
      method: 'get'
    })
  },

  listParentNode(id) {
    return request({
      url: `/admin/core/project/listParentNode/${id}`,
      method: 'get'
    })
  },

  getOne(id) {
    return request({
      url: `/admin/core/project/getOne/${id}`,
      method: 'get'
    })
  },

  save(data) {
    return request({
      url: `/admin/core/project/save`,
      method: 'post',
      data: data
    })
  },

  remove(id) {
    return request({
      url: `/admin/core/project/remove/` + id,
      method: 'delete'
    })
  },

  removeFile(url) {
    return request({
      url: `/admin/oss/file/remove?url=` + url,
      method: 'delete'
    })
  },

  update(data) {
    return request({
      url: `/admin/core/project/update`,
      method: 'put',
      data: data
    })
  }
}
