完成品牌添加功能：
  书写新增和修改的api接口
  前台需要收集数据，给服务器提交数据。也就是发请求 

spu业务的分析
  品牌的数据需要发请求的   /admin/product/baseTrademark/getTrademarkList   get
  获取平台中全部的销售属性（三个）  /admin/product/baseSaleAttrList   get
  获取某一个spu的信息  /admin/product/getSpuById/{spuId}    get
  获取spu图片 /admin/product/spuImageList/{spuId}  get

添加spu需要带的参数：
{
  "category3Id": 0,
  "tmId": 0,
  "description": "string",
  "spuName": "string",
  "spuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "spuId": 0
    }
  ],
  "spuSaleAttrList": [
    {
      "baseSaleAttrId": 0,
      "id": 0,
      "saleAttrName": "string",
      "spuId": 0,
      "spuSaleAttrValueList": [
        {
          "baseSaleAttrId": 0,
          "id": 0,
          "isChecked": "string",
          "saleAttrName": "string",
          "saleAttrValueName": "string",
          "spuId": 0
        }
      ]
    }
  ],
}

销售属性的展示：
  整个项目中销售属性一共有三个：颜色、尺码、版本

完成添加属性的操作：
  收集哪些数据：baseSaleAttrId、saleAttrName、spuSaleAttrValueList  
  收集到哪里：spu.spuSaleAttrList
  什么时候收集：点击添加按钮的时候

完成销售属性值的展示与收集
  新增的销售属性值需要收集两个字段：
    baseSaleAttrId    saleAttrValueName

skuForm界面数据的展示与收集
{
  "category3Id": 0,
  "createTime": "2022-07-27T10:17:02.920Z",
  "id": 0,
  "isSale": 0,
  "price": 0,
  "skuAttrValueList": [
    {
      "attrId": 0,
      "attrName": "string",
      "id": 0,
      "skuId": 0,
      "valueId": 0,
      "valueName": "string"
    }
  ],
  "skuDefaultImg": "string",
  "skuDesc": "string",
  "skuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "isDefault": "string",
      "skuId": 0,
      "spuImgId": 0
    }
  ],
  "skuName": "string",
  "skuSaleAttrValueList": [
    {
      "id": 0,
      "saleAttrId": 0,
      "saleAttrName": "string",
      "saleAttrValueId": 0,
      "saleAttrValueName": "string",
      "skuId": 0,
      "spuId": 0
    }
  ],
  "spuId": 0,
  "tmId": 0,
  "weight": "string"
}



如何实现菜单的权限（不同角色登录看到的菜单不同）？
起始不同的角色，登录的时候会向服务器发请求，服务器会把该角色相应的菜单的权限信息返回给我们
我们可以根据服务器返回的数据，可以动态的设置路由，可以根据不同的角色展示不同的菜单