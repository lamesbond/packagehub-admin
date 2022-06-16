import request from '@/utils/request'

export default{
  getPage(current,size) {
    return request({
      url: `/admin/core/user/getPage/${current}/${size}`,
      method: 'get'
    })
  },

  getOne(id) {
    return request({
      url: `/admin/core/user/getOne/${id}`,
      method: 'get'
    })
  },

  save(data) {
    return request({
      url: `/admin/core/user/save`,
      method: 'post',
      data: data
    })
  },

  remove(id) {
    return request({
      url: `/admin/core/user/remove/` + id,
      method: 'delete'
    })
  },

  update(data) {
    return request({
      url: `/admin/core/user/update`,
      method: 'post',
      data: data
    })
  }
}
