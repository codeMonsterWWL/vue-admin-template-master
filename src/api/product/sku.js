import request from '@/utils/request'

//sku的数据
export const reqSkuList = (page,limit) => request.get(`/admin/product/list/${page}/${limit}`)

//上架  /admin/product/onSale/{skuId}  get
export const reqOnSale = (skuId) => request.get(`/admin/product/onSale/${skuId}`)

//下架  /admin/product/cancelSale/{skuId}  get 
export const reqCancelSale = (skuId) => request.get(`/admin/product/cancelSale/${skuId}`)

//详情 /admin/product/getSkuById/{skuId}  get
export const reqSkuDetail = (skuId) => request.get(`/admin/product/getSkuById/${skuId}`)

//删除sku
export const reqDeleteSku = (skuId) => request({
  url:`/admin/product/deleteSku/${skuId}`,
  method:'delete'
})