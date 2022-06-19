import request from '@/utils/request'

export default {
  listChildCategoryById(id, userId) {
    return request({
      url: `/admin/core/doc/listChildCategoryById/${id}/${userId}`,
      method: 'get'
    })
  },

  listParentCategoryById(id) {
    return request({
      url: `/admin/core/doc/listParentCategoryById/${id}`,
      method: 'get'
    })
  },

  listMenuById(id) {
    return request({
      url: `/admin/core/doc/listMenuById/${id}`,
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
