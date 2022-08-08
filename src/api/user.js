//引入axios（axios进行二次封装）
import request from '@/utils/request'

//登录
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

//获取用户信息
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

//退出登录
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
