import request from '@/utils/request'

export default{
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
}
