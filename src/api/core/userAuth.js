import request from '@/utils/request'

export default{

  save(data) {
    return request({
      url: `/admin/core/userAuth/save`,
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
