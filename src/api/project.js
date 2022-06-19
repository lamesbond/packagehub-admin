import request from '@/utils/request'

export default {
  listChildCategoryById(id, userId) {
    return request({
      url: `/admin/core/project/listChildCategoryById/${id}/${userId}`,
      method: 'get'
    })
  },

  listParentCategoryById(id) {
    return request({
      url: `/admin/core/project/listParentCategoryById/${id}`,
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
      method: 'post',
      data: data
    })
  }
}
