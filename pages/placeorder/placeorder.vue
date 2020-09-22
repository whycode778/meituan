<template>
	<view>
		<view class="place-view">
			<view class="place-addres" @click="addRess()" v-if="addreing">
				+ 新增收货地址
			</view>
			<!-- 已选中收货地址 -->
			<view class="goods-address" v-if="!addreing" @click="addRess()">
				<view class="goods-address-left">
					<image src="../../static/coen/address.png" mode="widthFix"></image>
				</view>
				<view class="goods-address-in">
					<view>{{addressing.detailInfo}}</view>
					<view class="goods-address-name">
						<text>{{addressing.userName}}</text>
						<text>{{addressing.telNumber}}</text>
					</view>
				</view>
				<view class="goods-address-right">
					<image src="../../static/coen/jiantou.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="place-time">
				<image src="../../static/coen/times.png" mode="widthFix"></image>
				<text>立即送出</text>
			</view>
		</view>
		<!-- 菜单 -->
		<view class="place-view">
			<view>
				<block v-for="(item,index) in fororder" :key="index">
					<view class="order-view">
						<view class="order-img">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="order-title">
							<text>{{item.input}}</text>
							<text>x{{item.amount}}</text>
						</view>
						<view class="order-price">
							单价:¥{{item.price}}
						</view>
					</view>
				</block>
			</view>
		</view>
		<!-- 配送费 -->
		<view class="place-view">
			<view class="Delivery">配送费：¥{{physical}}</view>
		</view>
		<!-- 高度 -->
		<view style="height: 140upx;"></view>
		<!-- 支付 -->
		<view class="payment">
			<view class="payment-left">
				<text>合计</text>
				<text>¥{{payment}}</text>
			</view>
			<view class="payment-right" @click="toPay()">
				去支付
			</view>
		</view>
	
		<!-- 提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	// 引入提示组件
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	// post请求
	import {publicing} from '../../api/api.js'
	// 请求地址
	import {wxpayingurl} from '../../api/request.js'
	export default{
		components:{
			HMmessages
		},
		data() {
			return {
				addreing:true,
				addressing:{},
				fororder:[],
				openid:'',
				payment:Number,
				physical:Number,
				// 商户标识
				MerchantID:'',
				// 商家名称
				nameshop:'',
				// 商家logo
				logo:'',
				tackout: [
					{
						'img':'../../static/you/pm01.png',
						'title':'五香茶叶蛋',
						'number':3,
						'price':29
					},
					{
						'img':'../../static/you/pm01.png',
						'title':'五香茶叶蛋',
						'number':3,
						'price':29
					}
				]
			}
		},
		methods:{
			addRess(){
				uni.chooseAddress({
				  success:(res)=> {
				    console.log(res)
					this.addressing = res
					this.addreing = false
				  }
				})
			},
			// 去支付
			toPay(){
				if(this.addreing == true){
					let msg = '请选择收货地址'
					let iconing = 'error'
					this.tIps(msg,iconing)
					return false
				}
				console.log('可以支付')
				this.wxPay()
			},
			
			// 微信支付
			async wxPay(){
				// 客户信息
				let peopleobj = {
					address:this.addressing.detailInfo,
					name:this.addressing.userName,
					iphone:this.addressing.telNumber
				}
				// 商家标识
				let merchantid = this.MerchantID
				// 截取
				let ide = this.MerchantID.slice(0,7)
				// 商品标题
				let commod = this.nameshop
				// 商家logo
				let logo = this.logo
				// 把客户信息和商品订单[以对象形式存储]
				let Paymentinfor = {
					type:'placeOrder',
					peopleobj,
					arrinfo:this.fororder,
					merchantid,
					ide,
					commod,
					logo,
					useropenid:this.openid,
					payment:this.payment
				}
				// 第一步统一下单
				let Placeorder = await this.placeOrder(Paymentinfor)
				console.log(Placeorder)
				let Payparame = Placeorder.data.datas
				// 调用接口发起支付
				let wxpay = await this.wxPays(Payparame)
				console.log(wxpay)
				// 查询是否支付成功
				let paysucc = await this.paySucc(Payparame)
				
			},
			
			// 统一下单
			placeOrder(Paymentinfor){
				return new Promise((resolve,reject)=>{
					publicing(wxpayingurl,Paymentinfor)
					.then((res)=>{
						resolve(res)
					})
					.catch((err)=>{
						reject(err)
					})
				})
			},
			
			// 调用接口发起支付
			wxPays(Payparame){
				return new Promise((resolve,reject)=>{
					wx.requestPayment({
						timeStamp: Payparame.time_stamp,
						nonceStr: Payparame.nonceStr,
						package: `prepay_id=${Payparame.prepayId}`,
						signType: 'MD5',
						paySign: Payparame.payauto,
						success: (res) => {
							resolve(res)
							let msg = '支付成功'
							let iconing = 'success'
							this.tIps(msg,iconing)
							
						},
						fail: (err) => {
							reject(err)
							let msg = '取消支付'
							let iconing = 'success'
							this.tIps(msg,iconing)
							
						}
					})
					
				})
			},
			
			// 查询是否支付成功
			paySucc(Payparame){
				console.log(Payparame)
				return new Promise((resolve,reject)=>{
					let wxData = {
						type:'paysucc',
						out_trade_no:Payparame.out_trade_no,
						id:Payparame._id,
						merchantid:this.MerchantID
						}
					publicing(wxpayingurl,wxData)
					.then((res)=>{
						console.log(res)
					})
					.catch((err)=>{
						console.log(err)
					})
				})
			},
			
			
			tIps(msg,iconing){
				this.HMmessages.show(msg,{icon:iconing,iconColor:"#ffffff", fontColor:"#ffffff", background:"rgba(102, 0, 51,.8)"})
			}
		},
		
		onLoad(e) {
			console.log(e)
			let ordermen = JSON.parse(e.ide)
			console.log(ordermen)
			this.fororder = ordermen.allorder
			this.openid = ordermen.openid
			this.payment = ordermen.payment
			this.physical = ordermen.physical
			this.MerchantID = ordermen.MerchantID
			this.nameshop = ordermen.nameshop
			this.logo = ordermen.logo
		},
		
		
	}
</script>

<style>
	page{background: #F4f4f4;}
	.place-view{background: #FFFFFF;
	margin: 20upx;
	border-radius: 9upx;
	padding: 35upx 15upx;}
	.place-addres{
	border: 1rpx solid #ffb000;
	width: 400upx;
	height: 80upx;
	line-height: 80upx;
	border-radius: 50upx;
	text-align: center;
	color: #ffb000;
	margin: 0 auto;
	font-size: 30upx;
	}
	.place-time image{width: 40upx; height: 40upx; padding-right: 20upx;}
	.place-time{display: flex; align-items: center; font-size: 30upx;
	border-top: 1rpx solid #F4f4f4;
	padding-top: 35upx;
	margin-top: 35upx;
	}
	/* 菜单 */
	.order-view{display: flex;
	height: 150upx !important; overflow: hidden;
	margin-bottom: 15upx;
	font-size: 30upx;
	}
	.order-view text{display: block;}
	.order-img{width: 200upx !important; height: 150upx !important;
	padding-right: 15upx;
	}
	.order-img image{width: 100%; height: 100%;
	}
	.order-title{flex-grow: 1;}
	.order-title text:nth-child(2){color: #999999; font-size: 25upx;}
	.Delivery{
	display: flex;
	justify-content: flex-end;
	font-size: 30upx;}
	/* 支付 */
	.payment{background: #FFFFFF;
	height: 120upx;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30upx;}
	.payment-left{display: flex; align-items: center;
	font-size: 30upx;}
	.payment-left text:nth-child(2){font-weight: bold; font-size: 32upx;}
	.payment-right{background: #07c160; color: #FFFFFF;
	padding: 20upx 60upx;
	font-size: 30upx;
	border-radius: 7upx;}
	/* 收货地址 */
	.goods-address-left{width: 40upx; height: 40upx; padding-right: 20upx;}
	.goods-address-left image{width: 40upx; height: 40upx;}
	.goods-address-name{display: flex; align-items: center; font-size: 28upx;
	padding-top: 10upx;
	}
	.goods-address-right{width: 40upx; height: 40upx;}
	.goods-address-right image{width: 40upx; height: 40upx;}
	.goods-address{display: flex; align-items: center;}
	.goods-address-in{flex-grow: 1; font-size: 30upx;}
	.goods-address-name text:nth-child(1){padding-right: 10upx;}
</style>
