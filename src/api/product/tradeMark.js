//该模块获取品牌管理的数据 
import request from '@/utils/request'

//获取品牌列表的      /admin/product/baseTrademark/{page}/{limit}  get
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })


//新增品牌     /admin/product/baseTrademark/save  post   参数：品牌名称、品牌logo（不需要传递id，id由数据库自动生成）
//修改品牌     /admin/product/baseTrademark/update   put请求   参数：品牌id、修改后的品牌的名称及logo
//这俩带的参数就差个id，可以封装为一个api函数
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 参数中有id  代表是修改
  if (tradeMark.id) {
    return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
  } else {
    //进入else，代表是新增
    return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
  }
}

//删除品牌  /admin/product/baseTrademark/remove/{id}   delete请求
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })