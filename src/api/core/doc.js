import request from '@/utils/request'

export default{
  listChildProjectById(id) {
    return request({
      url: `/admin/core/doc/listChildProjectById/${id}`,
      method: 'get'
    })
  },

  listMenuById(id) {
    return request({
      url: `/admin/core/doc/listMenuById/${id}`,
      method: 'get'
    })
  },

  show(id) {
    return request({
      url: `/admin/core/doc/show/${id}`,
      method: 'get'
    })
  },

  updateDocInfo(data) {
    return request({
      url: `/admin/core/doc/updateDoc`,
      method: 'post',
      data: data
    })
  },

  updateDocPosition(data) {
    return request({
      url: `/admin/core/doc/updateDocPosition`,
      method: 'post',
      data: data
    })
  },

  save(data) {
    return request({
      url: `/admin/core/doc/saveDoc`,
      method: 'post',
      data: data
    })
  },

  removeById(id) {
    return request({
      url: `/admin/core/doc/removeDoc/` + id,
      method: 'delete'
    })
  },

}
