<template>
	<view>
		<view class="myhome">
			<!-- 已登录 -->
			<view class="wx-name" v-if="wxlogin">
				<view>
					<image :src="usering.avatarUrl"></image>	
				</view>
				<view class="wx-text">
					<text>{{usering.nickName}}</text>
				</view>
			</view>
			<!-- </block> -->
			<!-- 未登录 -->
			<view class="wx-button" v-if="!wxlogin">
				<view class="wx-button-view">登录美团外卖，开启旅程</view>
				<view>
					<button plain="true" open-type="getUserInfo" @getuserinfo="getUserInfo">去登录</button>
				</view>
			</view>
		</view>
		
		
		
	</view>
</template>

<script>
	import {publicing} from '../../api/api.js'
	// 请求地址
	import {wxloginurl} from '../../api/request.js'
	export default{
		name:'my',
		data() {
			return {
				wxlogin: true,
				usering:{}
			}
		},
		methods:{
			// 发起登录
			getUserInfo(event){
				console.log(event)
				if(event.detail.userInfo){
					console.log(event.detail.userInfo)
					let wxing = event.detail.userInfo
					this.wxCode(wxing.nickName,wxing.avatarUrl)
				}else{
					console.log('拒绝登录')
				}
			},
			
			// 获取code
			wxCode(nickName,avatarUrl){
				wx.login({
					success: (res) => {
						console.log(res)
						let code = res.code
						this.wxLogin(nickName,avatarUrl,code)
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			
			// 向后端发起登录
			wxLogin(nickName,avatarUrl,code){
				// post请求以对象传值
				let userdata = {
					nickName:nickName,
					avatarUrl:avatarUrl,
					code:code,
					appid:'wx594da9610417cba2',
					secret:'4be4d369a717b4a1d855e1c738a72281'
				}
				publicing(wxloginurl,userdata)
				.then((res)=>{
					console.log(res)
					if(res.data.msg == 'success'){
						// 存入本地
						uni.setStorageSync('usermen', res.data.datas);
						this.ifUser()
					}
					
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			
			// 请求本地有没有用户数据
			ifUser(){
				let setdata = uni.getStorageSync('usermen')
				console.log(setdata)
				if(!setdata){
					console.log('用户没有登录')
					this.wxlogin = false
				}else{
					this.wxlogin = true
					console.log('用户已登录')
					this.usering = setdata
				}
			}
			
			
			
		},
		
		// 判断用户是否登录
		onShow() {
			// 请求本地有没有数据
			this.ifUser()
		}
		
	}
</script>

<style scoped>
	.myhome{background: linear-gradient(to top, #ffe566 10%, #ffd300 100%); height: 350upx; display: flex; align-items: center;}
	.wx-name image{width: 120upx !important; height: 120upx !important; border-radius: 50%; margin-right: 20upx;
					border: 10rpx solid #999999;}
	text{display: block; margin: 10upx 0; color: #999999;}
	.wx-name{display: flex; align-items: center; padding: 0 30upx; align-content: center;
			height: 200upx;}
	.wx-text text:nth-child(1){font-size: 35upx;}
	.wx-text text:nth-child(2){font-size: 20upx; border: 1px solid #FFFFFF;
								padding: 7upx;
								border-radius: 50upx;
								text-align: center;}
	/* 登录 */
	.wx-button button{border: none;font-size: 30upx; background: linear-gradient(to right, #28a6f1 10%, #0e8dd7 80%);
	 border-radius: 50upx;
	color: #FFFFFF;}							
	.wx-button-view{font-size: 35upx; color: #FFFFFF; margin-bottom: 25upx;}
	.wx-button{margin: 0 auto;}
	
</style>
