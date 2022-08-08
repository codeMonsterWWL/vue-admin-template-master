//平台属性管理模块
import request from '@/utils/request'

//获取一级分类  /admin/product/getCategory1  get
export const reqGetCategory1 = () =>request.get('/admin/product/getCategory1')

//获取二级分类
export const reqGetCategory2 = (category1Id) => request.get(`/admin/product/getCategory2/${category1Id}`)

//获取三级分类 
export const reqGetCategory3 = (category2Id) => request.get(`/admin/product/getCategory3/${category2Id}`)

//获取平台属性
export const reqAttrList = (category1Id,category2Id,category3Id) => request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)

//添加属性与属性值  /admin/product/saveAttrInfo   post
/*
{
  "attrName": "",   属性：例如 颜色
  "attrValueList": [  属性值：例如 红色 黄色  蓝色  因为是多个，所以是数组
    {
      "attrId": 0,  属性的id
      "valueName": "string"   属性值 
    }
  ],
  "categoryId": 0,  category3Id
  "categoryLevel": 3,
}
 */
export const reqAddOrUpdateAttr = (data) => request({
  url:'/admin/product/saveAttrInfo',
  method:'post',
  data
})

//删除属性  /admin/product/deleteAttr/{attrId}  delete
export const reqDeleteAttr = (attrId) => request({
  url:`/admin/product/deleteAttr/${attrId}`,
  method:'delete'
})
