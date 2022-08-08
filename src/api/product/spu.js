import request from '@/utils/request'

//获取spu列表数据的接口   /admin/product/{page}/{limit}  get   参数：page、limit、category3ID
export const reqGetSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: 'get',
  params: { category3Id }
})

//获取某一个spu的信息  /admin/product/getSpuById/{spuId}    get
export const reqSpu = (spuId) =>request.get(`/admin/product/getSpuById/${spuId}`)

//品牌的数据需要发请求的   /admin/product/baseTrademark/getTrademarkList   get
export const reqTradeMarkList = () => request.get('/admin/product/baseTrademark/getTrademarkList')

// 获取spu图片  /admin/product/spuImageList/{spuId}    get
export const reqSpuImageList = (spuId) => request.get(`/admin/product/spuImageList/${spuId}`)

//获取平台中全部的销售属性（三个）  /admin/product/baseSaleAttrList   get
export const reqBaseSaleAttrList = () => request.get('/admin/product/baseSaleAttrList')

//修改 | 添加 的接口 （二合一） ：添加时参数不带id ，修改时参数带id
export const reqAddOrUpdateSpu = (spuInfo) => {
  if(spuInfo.id){
    return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
  }else{
    return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
  }
}

//删除spu    /admin/product/deleteSpu/{spuId}  delete请求
export const reqDeleteSpu = (spuId) => request({
  url:`/admin/product/deleteSpu/${spuId}`,
  method:'delete'
})


//  获取销售属性   /admin/product/spuSaleAttrList/{spuId}  get
export const reqSpuSaleAttrList = (spuId) => request.get(`/admin/product/spuSaleAttrList/${spuId}`)

//获取平台属性
export const reqAttrList = (category1Id, category2Id, category3Id) => request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)

//添加sku
export const reqAddSku = (skuInfo) => request({url:`/admin/product/saveSkuInfo`,method:'post',data:skuInfo})

//查看该spu的sku列表
export const reqSkuList = (spuId) =>request.get(`/admin/product/findBySpuId/${spuId}`)