import request from '@/utils/request'

export default {
  listNextChildNode(id, userId) {
    return request({
      url: `/admin/core/doc/listNextChildNode/${id}/${userId}`,
      method: 'get'
    })
  },

  listParentNode(id) {
    return request({
      url: `/admin/core/doc/listParentNode/${id}`,
      method: 'get'
    })
  },

  listAllChildNode(id) {
    return request({
      url: `/admin/core/doc/listAllChildNode/${id}`,
      method: 'get'
    })
  },

  getOne(id) {
    return request({
      url: `/admin/core/doc/getOne/${id}`,
      method: 'get'
    })
  },

  save(data) {
    return request({
      url: `/admin/core/doc/save`,
      method: 'post',
      data: data
    })
  },

  remove(id) {
    return request({
      url: `/admin/core/doc/remove/` + id,
      method: 'delete'
    })
  },

  update(data) {
    return request({
      url: `/admin/core/doc/update`,
      method: 'post',
      data: data
    })
  }
}
