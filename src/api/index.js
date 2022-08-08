//将四个模块的接口函数统一暴露
import * as tradeMark from './product/tradeMark'
import * as sku from './product/sku'
import * as spu from './product/spu'
import * as attr from './product/attr'
//引入权限相关的接口
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'
export default {
  tradeMark,
  attr,
  sku,
  spu,
  user,
  role,
  permission
}