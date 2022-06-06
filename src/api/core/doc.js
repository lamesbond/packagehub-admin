import request from '@/utils/request'

export default{
  listByParentId(parentId) {
    return request({
      url: `/admin/core/doc/listByParentId/${parentId}`,
      method: 'get'
    })
  },

  show(id) {
    return request({
      url: `/admin/core/doc/show/${id}`,
      method: 'get'
    })
  },

  showMenu(id) {
    return request({
      url: `/admin/core/doc/showMenu/${id}`,
      method: 'get'
    })
  },

  update(data) {
    return request({
      url: `/admin/core/doc/updateDoc`,
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
