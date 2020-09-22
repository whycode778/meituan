<template>
	<view>
		<!-- 切换 -->
	<view class="ordering-fls">
			<!-- 左边 -->
			<view class="ordering-left">
				<block v-for="(item,index) in orderclass" :key="index">
				<text :class="{activeord:index == numing}" @click="ordermeClic(index,item)">{{item}}</text>
				</block>
			</view>
			<!-- 右边 -->
			<view class="ordering-right">
				<text class="ordering-right-title">{{ordertitle}}</text>
				<view>
					<block v-for="(item,index) in classifarr" :key="index">
						<view class="content-view">
							<view class="content-img">
								<image :src="item.objdis.image" mode="aspectFill"></image>
							</view> 
							<view class="content-title">
								<text class="conteng-take">{{item.objdis.input}}</text>
								<view class="conteng-monthly">
									<block v-for="(itemdata,index) in item.objdis.tags" :key="index">
									<text>{{itemdata}}</text>
									</block>
								</view>
								<view class="conteng-starting">
									<text>月售0</text>
								</view>
								<view class="conteng-price">
									<view class="conteng-shi">¥{{item.objdis.Discount}}</view>
									<view class="conteng-hua">¥{{item.objdis.Price}}</view>
									<view class="ordering-price">
										<image @click="reDuce(index,item._id,item.objdis.Discount,item.amount,item.objdis.image,item.objdis.input,)" src="../../../static/coen/jianhao.png" mode="widthFix"></image>
										<text class="amounting">{{item.amount}}</text>
										<image @click="pLus(index,item._id,item.objdis.Discount,item.amount,item.objdis.image,item.objdis.input,)" src="../../../static/coen/jiahao.png" mode="widthFix"></image>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		
		
			<!-- 购物车 -->
		<view class="Shopping">
			<!-- 骑手 -->
			<view class="qishou">
				<image v-if="!isActive" src="../../../static/coen/weigou.png" mode="widthFix"></image>
				<image v-if="isActive" src="../../../static/coen/yigou.png" mode="widthFix"></image>
			</view>
			<!-- 多少量 -->
			<view class="Numbering" v-if="isActive">{{Takeleng.length}}</view>
			<!-- 金额 -->
			<view class="Shopping-dis">
				<view class="Shopping-left">
					<view class="Cost-mony">
						<text class="Total-price">¥{{Takeawayprice}}</text>
						<text class="Delivery">另需配送费{{physical}}元</text>
					</view> 
				</view>
				<view class="Shopping-right" :class="{ shoppactive: isActive }" @click="flat && settLement()">
					<text v-if="!isActive">{{deliverdata}}元起送</text>
					<text v-if="isActive">{{difference}}</text>
				</view>
			</view>
		</view>
	</view>
	<!-- 引入模态框 -->
	<motal ref="mon"></motal>
	</view>
</template>

<script>
	// 引入登录模态组件
	import motal from '../../../element/modal.vue'
	export default{
		components:{
			motal
		},
		props:{
			orderingdata:Array,
			busidata:Object
		},
		data() {
			return {
				// 左边分类
				orderclass:[],
				// 右边商品
				commodity:[],
				// 右边商品第一项
				classifarr:[],
				// 配送费
				physical:0,
				// 起送价
				deliverdata:0,
				// 商户标识
				MerchantID:'',
				// 商家名称
				nameshop:'',
				// 商家logo
				logo:'',
				numing:0,
				// 数量
				amount:0,
				// 右边分类
				ordertitle:'',
				isActive:false,
				arrtotalPrice:[],
				// 总价
				Takeawayprice:0,
				// 点了几份
				Takeleng:[],
				// 还差多少元
				difference:'',
				// 禁掉点击
				flat:false,
				orderme:[
					'沾水',
					'精致套房',
					'精致双拼',
					'品质卤肉',
					'精品小吃',
					'凉拌菜品',
					'夏日靓饮',
					'精致米饭'
				],
				tackout: [
					{
						"id":1,
						"img":'../../../static/you/mn1.jpg',
						"title":"原味黄焖鸡米饭",
						"character":['不辣','鸭','鹅肉','鹅腿','鸡'],
						"sales":120,
						"price":2,
						"costprice":300,
						"amount":0,
					},
					{
						"id":2,
						"img":'../../../static/you/mn2.jpg',
						"title":"香菇肉丝",
						"character":['不辣','鸭','鹅肉','鹅腿','鸡'],
						"sales":120,
						"price":2.5,
						"costprice":300,
						"amount":0,
					},
					{
						"id":3,
						"img":'../../../static/you/mn3.jpg',
						"title":"土豆肉丝盖浇饭",
						"character":['不辣','鸭','鹅肉','鹅腿','鸡'],
						"sales":120,
						"price":1,
						"costprice":300,
						"amount":0,
					}
				]	
			}
		},
		methods:{
			// 去结算
			settLement(){
				let payment = parseFloat((this.Takeawayprice + this.physical).toFixed(10))
				let setdata = uni.getStorageSync('usermen')
				// console.log(setdata)
				if(!setdata){
					console.log('用户没有登录')
					this.$nextTick(()=>{
						this.$refs.mon.init()
					})
				}else{
					console.log('用户已登录')
					let Ordering = {
						payment,
						physical:this.physical,
						allorder:this.Takeleng,
						openid:setdata.openid,
						MerchantID:this.MerchantID,
						nameshop:this.nameshop,
						logo:this.logo
					}
					console.log(Ordering)
					let strorder = JSON.stringify(Ordering)
					uni.navigateTo({
						url:'../placeorder/placeorder?ide=' + strorder
					})
				}
				
			},
			// 左边
			ordermeClic(index,itemclass){
				this.numing = index
				this.ordertitle = itemclass
				// 切换分类
				// 筛选第一项作为进入页面的展示
				let itemarr = this.commodity.filter((item)=>{
					return item.optidata == itemclass
				})
				this.classifarr = itemarr
				console.log(this.classifarr)
				// 回到顶部
				wx.pageScrollTo({
					scrollTop:0
				})
			},
			// 加价
			pLus(indexdata,indexs,price,amounts,image,input){
				// console.log(price)
				// console.log(amounts)
				this.amount = Number(amounts) + Number(1)
				// console.log(this.amount)
				this.pullData(indexdata,indexs,price,image,input)
			},
			// 减价
			reDuce(indexdata,indexs,price,amounts,image,input){
				this.amount = Number(amounts) - Number(1)
				this.pullData(indexdata,indexs,price,image,input)
			},
			
			// 加减价公用函数
			pullData(indexdata,indexs,price,image,input){
				let findarr = this.classifarr.filter((item, index)=>{
					if(item._id == indexs){
						if(this.amount <1){
							// console.log('进入' + this.amount)
							return item.amount = '0'
						}else{
							return item.amount = this.amount
						}
					}
				}) 
				// console.log(findarr)
				// 得到更改的数组再重新更新数组，数组顺序不变
				this.classifarr[indexdata] = findarr[0]
				// 计算总价,单价 * 数量
				if(Number(this.amount) <= 0){
					this.amount = 0
				}
				let Totalnum = price * Number(this.amount)
				// 去小数点
				let Totalprice = parseFloat((Totalnum).toFixed(10))
				// console.log(Totalprice)
				let fands = {
					indexs,
					Totalprice,
					image,
					input,
					"amount":this.amount,
					price
					
				}
				this.arrtotalPrice.push(fands)
				// console.log(this.arrtotalPrice)
				// 查询已点击的数组id，匹配上，替换总价
				let findarrdata = this.arrtotalPrice.map((item)=>{
						return item.indexs == indexs ? fands : item
				})
				// console.log(this.arrtotalPrice)
				// console.log(findarrdata)
				this.arrtotalPrice = findarrdata
				// console.log(this.arrtotalPrice)
			},
			
		
		},
		
		computed:{
			// 监听总价计算
			Calculation(){
				
				// 数组对象去重
				let hash = {};
				const hashdata = this.arrtotalPrice.reduce((preVal, curVal) => {
				    hash[curVal.indexs] ? '' : hash[curVal.indexs] = true && preVal.push(curVal); 
				    return preVal 
				}, [])
				// console.log(hashdata)
				// 剔除掉价格为0的
				this.Takeleng = hashdata.filter((item)=>{
					return item.Totalprice != 0;
				})
				// 最终提交到数据库的结果
				// console.log(this.Takeleng)
				// 总价计算
				let numdata = 0
				hashdata.forEach((item)=>{
					numdata += item.Totalprice
				})
				// 总价计算
				this.Takeawayprice = parseFloat((numdata).toFixed(10))
				// console.log(parseFloat((numdata).toFixed(10)))
			},
			//监听是否已选择外卖
			choiceTake(){
				// console.log(this.Takeawayprice)
				if(this.Takeawayprice === 0){
					this.isActive = false
				}else{
					this.isActive = true
				}
			},
			// 监听起送价格
			delivering(){
				if(this.Takeawayprice < this.deliverdata){
					let preceMen = parseFloat((this.deliverdata - this.Takeawayprice).toFixed(10))
					this.difference = '还差' + preceMen + '元'
					this.flat = false
				}else{
					this.difference = '去结算'
					this.flat = true
				}
			}
			
		},
		

		watch:{
			// 取出分类和分类的商品
			orderingdata(newvalue,oldvalue){
				console.log(newvalue)
				
				// 分类
				let classifdtata = newvalue.map((item)=>{
					return item.optidata
				})
				console.log(classifdtata)
				// 去重
				let setdataarr = Array.from(new Set(classifdtata))
				console.log(setdataarr)
				this.orderclass = setdataarr
				
				// 右边商品
				
				this.commodity = newvalue
				// 右边的分类
				this.ordertitle = newvalue[0].optidata
				let commoditytata = newvalue.map((item)=>{
					let key = "amount"
					let value = 0
					return item[key] = value
				})
				// 筛选第一项作为进入页面的展示
				let classifarr = this.commodity.filter((item)=>{
					return item.optidata == newvalue[0].optidata
				})
				this.classifarr = classifarr
				console.log(classifarr)
				
				
				
			},
			
			// 起送价格
			busidata(newvalue,oldvalue){
				console.log(newvalue)
				// 配送费
				this.physical = newvalue.physical
				// 起送价
				this.deliverdata = newvalue.delivering
				// 商户标识
				this.MerchantID = newvalue.openid
				// 商家名称
				this.nameshop = newvalue.shop
				// 商家logo
				this.logo = newvalue.logo
			}
		}
	}
</script>

<style scoped>
	.ordering-fls{display: flex; justify-content: space-between;}
	.ordering-left{width: 190upx; background: #fafafa;
	overflow-y: auto;
	height: 100%;
	}
	.ordering-left text{
	color: #a8a8a8;
	display: block;
	font-size: 28upx;
	height: 80upx;
	line-height: 80upx;
	text-align: center;}
	/* 右边 */
	.ordering-right{width: 100%;
	padding: 9upx 9upx 130upx 9upx;
	overflow: hidden;
	overflow-y: auto;
	}
	.activeord{background: #FFFFFF !important; font-weight: bold !important;}
	
	.ordering-right-title{font-size: 28upx;
	height: 60upx;
	line-height: 60upx;}
	
	.content-view{
	display: flex; justify-content: space-between;
	height: 200upx !important; overflow: hidden;
	margin: 30upx 0;
	color: #898989;
	}
	.content-img{width: 180rpx !important; height: 200rpx !important;
	overflow: hidden;
	}
	.content-img image{width: 100%; height: 100%; border-radius: 10upx;
	overflow: hidden;}
	.content-title{
	/* width: 100%; */
	padding-left: 10upx;
	font-size: 24upx;
	}
	
	.conteng-take{
	color: #333333;
	height: 50upx; font-size: 33upx;
	font-weight: bold;
	line-height: 50upx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;}
	.conteng-monthly{display: flex;
	}
	.conteng-monthly text{background: #f1f1f1;
	margin-right: 9upx;
	padding: 4upx 13upx;
	border-radius: 7upx;
	display: block;
	}
	.conteng-starting{display: flex;
	align-items: center;
	height: 50upx;
	line-height: 50upx;}
	.conteng-price image{width: 60upx; height: 60upx;}
	.conteng-price{display: flex; align-items: center;}
	.ordering-price{display: flex;
	align-items: center;
	justify-content: space-around;
	width: 100%;
	}
	/* 数量 */
	.amounting{
	width: 50upx;
	text-align: center;}
	.conteng-hua{text-decoration: line-through;
	}
	.conteng-shi{color: #fb4e44; font-size: 33upx;
	width: 180upx;
	overflow: hidden;
	}
	/* 购物车 */
	.Shopping{position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	}
	.Shopping-left{
	height: 130upx;
	background: #000000; flex-grow: 2;
	border-top-left-radius: 50upx;
	border-bottom-left-radius: 50upx;
	}
	.Shopping-right{
	height: 130upx;
	line-height: 130upx;
	font-size: 30upx;
	color: #7f7f7f;
	text-align: center;
	background: #000000; flex-grow: 1;
	border-top-right-radius: 50upx;
	border-bottom-right-radius: 50upx;}
	.Shopping-dis{display: flex;
	height: 130upx;
	margin: 0 20upx;
	}
	.qishou{width: 120upx; height: 150upx;
	position: fixed;
	bottom: 0upx;
	left: 50upx;
	}
	.qishou image{width: 120upx; height: 150upx !important;}
	/* 定位 */
	.Delivery{color: #999999;
	font-size: 28upx;
	height: 65upx;}
	.Shopping-left text{display: block;}
	.Total-price{font-size: 40upx; color: #FFFFFF;
	height: 65upx;
	line-height: 65upx;
	}
	.Cost-mony{padding-left: 170upx; color: #4CD964;
	height: 130upx;
	}
	/* 数量 */
	.Numbering{
	background: red;
	width: 40upx;
	height: 40upx;
	border-radius: 50%;
	font-size: 20upx;
	color: #FFFFFF;
	text-align: center;
	line-height: 40upx;
	position: fixed;
	bottom: 50upx;
	left: 130upx;}
	/* 选中菜品 */
	.shoppactive{background: #ffd300 !important;
	color: #000000 !important;}
</style>
