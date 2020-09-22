var url = 'https://meituan.thexxdd.cn/api/'

// 为你优选
let getpreferurl = `${url}forshop/getprefer`

// 附近商家
let wxshopurl = `${url}forshop/wxshop`

// 综合排序 
let startingurl = `${url}forshop/starting`

// 多字段筛选
let multipleurl = `${url}forshop/multiple`

// 登录
let wxloginurl = `${url}wxuser/wxlogin`

// 我的订单-微信支付,公用请求,参数不一样而已
let wxpayingurl = `${url}wxpay/wxpaying`

// 搜索
let searchurl = `${url}forshop/search`

// 评论
let discussurl = `${url}message/discuss`

// 商家介绍
let shopurl = `${url}forshop/shop`

// 菜单商品
let getdishesurl = `${url}forshop/getdishes`

// 提交评论
let commenturl = `${url}message/comment`



export{getpreferurl,wxshopurl,startingurl,multipleurl,wxloginurl,wxpayingurl,searchurl,discussurl,shopurl,getdishesurl,commenturl}
