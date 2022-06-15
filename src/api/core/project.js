import request from '@/utils/request'

export default{
  listChildCategoryById(id) {
    return request({
      url: `/admin/core/project/listChildCategoryById/${id}`,
      method: 'get'
    })
  },

  listParentCategoryById(id) {
    return request({
      url: `/admin/core/project/listParentCategoryById/${id}`,
      method: 'get'
    })
  },

  listMenuById(id) {
    return request({
      url: `/admin/core/project/listMenuById/${id}`,
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

  update(data) {
    return request({
      url: `/admin/core/project/update`,
      method: 'post',
      data: data
    })
  }
}
