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

}
