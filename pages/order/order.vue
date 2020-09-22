<template>
	<view>
		<block v-for="(item,index) in neworder" :key="index">
		<view class="order-back" v-if="orderno">
			<view class="order-view">
				<view class="order-img">
					<image :src="item.logo" mode="aspectFill"></image>
				</view>
				<view class="goods-commodity">{{item.body}}</view>
				<view class="order-succ" v-if="item.status === 1">
					付款成功
				</view>
				<view class="order-succ" v-else>
					待付款
				</view>
			</view>
			<!-- 2 -->
			<view>
				<block v-for="(itemdata,index) in item.Paymentinfor" :key="index">
				<view class="order-dishes">
					<text>{{itemdata.input}}</text>
					<text>x{{itemdata.amount}}</text>
				</view>
				</block>
			</view>
			
			<view class="order-Total">
				<view class="order-left">
					<text v-if="item.status === 1" @click="evaLuate(item.merchantid,item.openid,item.body)">去评价</text>
				</view>
				<view class="order-right">
					<text>共{{item.Paymentinfor.length}}件商品</text>
					<text>合计：{{item.total_fee}}元</text>
				</view>
			</view>
		</view>
		</block>
		
		<!-- 没有订单的提示 -->
		<tips ref="tips"></tips>
	</view>
</template>

<script>
	// post请求
	import {publicing} from '../../api/api.js'
	// 请求地址
	import {wxpayingurl} from '../../api/request.js'
	// 引入提示组件
	import tips from '../../element/tips.vue'
	export default{
		components:{
			tips
		},
		data() {
			return {
				tips:'',
				orderno:false,
				openId:'',
				neworder:[],
				orderdata: [
					{
						'img':'../../static/coen/caia.jpg',
						'title':'东北饺子店',
						'dishes':[
							{
								'dis':'土豆',
								'price':1
							},
							{
								'dis':'酸菜',
								'price':2
							},
							{
								'dis':'咸鸭蛋',
								'price':3
							}
						],
						'common':3,
						'totalprice':20
					},
					{
						'img':'../../static/coen/caia.jpg',
						'title':'东北饺子店',
						'dishes':[
							{
								'dis':'土豆',
								'price':1
							},
							{
								'dis':'酸菜',
								'price':2
							},
							{
								'dis':'咸鸭蛋',
								'price':3
							}
						],
						'common':3,
						'totalprice':20
					},
					{
						'img':'../../static/coen/caia.jpg',
						'title':'东北饺子店',
						'dishes':[
							{
								'dis':'土豆',
								'price':1
							},
							{
								'dis':'酸菜',
								'price':2
							},
							{
								'dis':'咸鸭蛋',
								'price':3
							}
						],
						'common':3,
						'totalprice':20
					}
				]
			}
		},
		
		methods:{
			orderIng(){
				let wxData = {
					type:'myorder',
					openid: this.openId,
					}
				publicing(wxpayingurl,wxData)
				.then((res)=>{
					console.log(res)
					// 没有数据
					if(res.data.datas.length === 0){
						let bull = true
						let tips = '你还没有订单'
						this.tipsing(bull,tips)
					}else{
						let bull = false
						let tips = ''
						this.tipsing(bull,tips)
						this.orderno = true
						// 筛选
						var neworder = res.data.datas.map((item)=>{
							let merchantid = item._merchantid
							let openid = item._openid
							let status = item.status
							let body = item.wxorder.body
							let logo = item.wxorder.logo
							let total_fee = item.wxorder.total_fee
							let Paymentinfor = item.wxorder.Paymentinfor.arrinfo
							return{
								merchantid,
								openid,
								status,
								body,
								logo,
								total_fee,
								Paymentinfor
							}
						})
						this.neworder = neworder
						console.log(neworder)
					}
					
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			
			// 评价
			evaLuate(merchantid,openid,body){
				let userobj = {
					merchantid,
					openid,
					body
				}
				let userdata = JSON.stringify(userobj)
				uni.navigateTo({
					url:'../evaluate/evaluate?ids=' + userdata
				})
			},
			
			// 提示
			tipsing(bull,tips){
				this.$nextTick(()=>{
					this.$refs.tips.init(bull,tips)
				})
			},
			
		},
		
		onShow() {
			let setdata = uni.getStorageSync('usermen')
			this.openId = setdata.openid
			if(!setdata){
				console.log('用户没有登录')
				this.orderno = false
				let bull = true
				let tips = '请登录后再查看'
				this.tipsing(bull,tips)
			}else{
				console.log('用户已登录')
				this.orderIng()
				let bull = false
				let tips = ''
				this.tipsing(bull,tips)
			}
		}
	}
</script>

<style scoped>
	page{background: #f2f3f4;}
	.order-back{background: #FFFFFF;
	margin: 10upx;
	padding: 20upx 10upx;
	border-radius: 9upx;}
	.order-img{width: 100upx; height: 100upx; padding-right: 20upx;}
	.order-view image{width: 100upx; height: 100upx; border-radius: 10upx;}
	.order-view{height: 106upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	overflow: hidden;}
	.goods-commodity{flex-grow: 1; font-size: 30upx; font-weight: bold;}
	.order-succ{font-size: 28upx; color: #666666;}
	.order-dishes{
	font-size: 28upx;
	color: #666666;
	display: flex; align-items: center; justify-content: space-between;
	height: 80upx;
	}
	.order-Total text{display: block;}
	.order-right text:nth-child(1){padding-right: 10upx;}
	.order-Total{ 
	font-size: 28upx;
	color: #666666;
	display: flex; align-items: center;
	justify-content: space-between;
	height: 80upx;
	}
	.order-right{display: flex; align-items: center;}
	.order-left text{background: #f2f3f4; border-radius: 10upx;
	padding: 5upx 10upx;}
</style>
